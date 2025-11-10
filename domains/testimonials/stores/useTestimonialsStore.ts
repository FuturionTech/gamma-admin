import { defineStore } from 'pinia'
import type {
  Testimonial,
  CreateTestimonialInput,
  UpdateTestimonialInput,
  TestimonialFilterInput,
  TestimonialStatistics,
  TestimonialsResponse,
  TestimonialResponse,
  CreateTestimonialResponse,
  UpdateTestimonialResponse,
  DeleteTestimonialResponse
} from '../types'
import { GET_TESTIMONIALS, GET_TESTIMONIAL } from '../graphql/queries'
import { CREATE_TESTIMONIAL, UPDATE_TESTIMONIAL, DELETE_TESTIMONIAL } from '../graphql/mutations'

interface TestimonialsState {
  testimonials: Testimonial[]
  currentTestimonial: Testimonial | null
  loading: boolean
  error: string | null
  filters: TestimonialFilterInput
  statistics: TestimonialStatistics
}

export const useTestimonialsStore = defineStore('testimonials', {
  state: (): TestimonialsState => ({
    testimonials: [],
    currentTestimonial: null,
    loading: false,
    error: null,
    filters: {
      search: null,
      is_active: null,
      rating: null,
      application_id: '1' // Default application ID - should be set from config
    },
    statistics: {
      total: 0,
      active: 0,
      inactive: 0,
      averageRating: 0,
      byRating: {}
    }
  }),

  getters: {
    getTestimonialById: (state) => (id: string) => {
      return state.testimonials.find(t => t.id === id)
    },

    hasTestimonials: (state) => state.testimonials.length > 0,

    isLoading: (state) => state.loading,

    hasError: (state) => !!state.error,

    activeTestimonials: (state) => {
      return state.testimonials.filter(t => t.is_active)
    },

    inactiveTestimonials: (state) => {
      return state.testimonials.filter(t => !t.is_active)
    },

    testimonialsByRating: (state) => {
      return state.testimonials.reduce((acc, testimonial) => {
        const rating = testimonial.rating || 0
        if (!acc[rating]) {
          acc[rating] = []
        }
        acc[rating].push(testimonial)
        return acc
      }, {} as Record<number, Testimonial[]>)
    },

    filteredTestimonials: (state) => {
      let filtered = [...state.testimonials]

      // Apply search filter
      if (state.filters.search) {
        const searchLower = state.filters.search.toLowerCase()
        filtered = filtered.filter(t =>
          t.name.toLowerCase().includes(searchLower) ||
          t.content.toLowerCase().includes(searchLower) ||
          t.company?.toLowerCase().includes(searchLower) ||
          t.position?.toLowerCase().includes(searchLower)
        )
      }

      // Apply active filter
      if (state.filters.is_active !== null && state.filters.is_active !== undefined) {
        filtered = filtered.filter(t => t.is_active === state.filters.is_active)
      }

      // Apply rating filter
      if (state.filters.rating !== null && state.filters.rating !== undefined) {
        filtered = filtered.filter(t => t.rating === state.filters.rating)
      }

      return filtered
    }
  },

  actions: {
    // State mutations
    setLoading(loading: boolean) {
      this.loading = loading
    },

    setError(error: string | null) {
      this.error = error
    },

    setTestimonials(testimonials: Testimonial[]) {
      this.testimonials = testimonials
      this.updateStatistics()
    },

    setCurrentTestimonial(testimonial: Testimonial | null) {
      this.currentTestimonial = testimonial
    },

    setFilters(filters: Partial<TestimonialFilterInput>) {
      this.filters = { ...this.filters, ...filters }
    },

    resetFilters() {
      this.filters = {
        search: null,
        is_active: null,
        rating: null,
        application_id: this.filters.application_id
      }
    },

    updateStatistics() {
      const total = this.testimonials.length
      const active = this.testimonials.filter(t => t.is_active).length
      const inactive = total - active

      // Calculate average rating
      const totalRating = this.testimonials.reduce((sum, t) => sum + (t.rating || 0), 0)
      const averageRating = total > 0 ? totalRating / total : 0

      // Count by rating
      const byRating = this.testimonials.reduce((acc, testimonial) => {
        const rating = testimonial.rating || 0
        acc[rating] = (acc[rating] || 0) + 1
        return acc
      }, {} as Record<number, number>)

      this.statistics = {
        total,
        active,
        inactive,
        averageRating,
        byRating
      }
    },

    // API Actions
    async fetchTestimonials() {
      this.setLoading(true)
      this.setError(null)

      try {
        const variables: any = {
          application_id: this.filters.application_id,
          first: 100
        }

        // Only add optional filters if they have values
        if (this.filters.is_active !== null && this.filters.is_active !== undefined) {
          variables.is_active = this.filters.is_active
        }

        const { data, error } = await useAsyncQuery<TestimonialsResponse>(
          GET_TESTIMONIALS,
          variables
        )

        if (error.value) {
          throw new Error(error.value.message || 'Failed to fetch testimonials')
        }

        if (data.value) {
          this.setTestimonials(data.value.testimonials)
        }
      } catch (err: any) {
        console.error('Error fetching testimonials:', err)
        this.setError(err.message || 'Failed to load testimonials')
        // Set empty array on error
        this.setTestimonials([])
      } finally {
        this.setLoading(false)
      }
    },

    async fetchTestimonial(id: string) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { data, error } = await useAsyncQuery<TestimonialResponse>(
          GET_TESTIMONIAL,
          { id }
        )

        if (error.value) {
          throw new Error(error.value.message || 'Failed to fetch testimonial')
        }

        if (data.value) {
          this.setCurrentTestimonial(data.value.testimonial)
          return data.value.testimonial
        }
      } catch (err: any) {
        console.error('Error fetching testimonial:', err)
        this.setError(err.message || 'Failed to load testimonial')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async createTestimonial(input: CreateTestimonialInput) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        const response = await apolloClient.mutate<CreateTestimonialResponse>({
          mutation: CREATE_TESTIMONIAL,
          variables: { input }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.createTestimonial) {
          // Refresh the testimonials list
          await this.fetchTestimonials()
          return response.data.createTestimonial
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        console.error('Error creating testimonial:', err)
        this.setError(err.message || 'Failed to create testimonial')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async updateTestimonial(id: string, input: UpdateTestimonialInput) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        const response = await apolloClient.mutate<UpdateTestimonialResponse>({
          mutation: UPDATE_TESTIMONIAL,
          variables: { id, input }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.updateTestimonial) {
          // Update in local state
          const index = this.testimonials.findIndex(t => t.id === id)
          if (index !== -1) {
            this.testimonials[index] = response.data.updateTestimonial
          }

          // Update current testimonial if it's the one being edited
          if (this.currentTestimonial?.id === id) {
            this.setCurrentTestimonial(response.data.updateTestimonial)
          }

          this.updateStatistics()
          return response.data.updateTestimonial
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        console.error('Error updating testimonial:', err)
        this.setError(err.message || 'Failed to update testimonial')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async deleteTestimonial(id: string) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        const response = await apolloClient.mutate<DeleteTestimonialResponse>({
          mutation: DELETE_TESTIMONIAL,
          variables: { id }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.deleteTestimonial) {
          // Remove from local state
          this.testimonials = this.testimonials.filter(t => t.id !== id)

          // Clear current testimonial if it was deleted
          if (this.currentTestimonial?.id === id) {
            this.setCurrentTestimonial(null)
          }

          this.updateStatistics()
          return response.data.deleteTestimonial
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        console.error('Error deleting testimonial:', err)
        this.setError(err.message || 'Failed to delete testimonial')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async toggleTestimonialStatus(id: string) {
      const testimonial = this.getTestimonialById(id)
      if (!testimonial) {
        throw new Error('Testimonial not found')
      }

      return await this.updateTestimonial(id, {
        is_active: !testimonial.is_active
      })
    },

    async bulkDelete(ids: string[]) {
      const errors: string[] = []

      for (const id of ids) {
        try {
          await this.deleteTestimonial(id)
        } catch (err: any) {
          errors.push(`Failed to delete testimonial ${id}: ${err.message}`)
        }
      }

      if (errors.length > 0) {
        throw new Error(errors.join('\n'))
      }
    },

    // Filter actions
    async applySearchFilter(searchValue: string) {
      this.setFilters({ search: searchValue })
      // Client-side filtering via getter
    },

    async applyStatusFilter(is_active: boolean | null) {
      this.setFilters({ is_active })
      // Optionally refetch from server with filter
      // await this.fetchTestimonials()
    },

    async applyRatingFilter(rating: number | null) {
      this.setFilters({ rating })
      // Client-side filtering via getter
    },

    // Debounced search
    debouncedSearch(searchValue: string) {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          this.applySearchFilter(searchValue)
          resolve()
        }, 300)
      })
    },

    // Initialize
    async initialize() {
      await this.fetchTestimonials()
    }
  }
})
