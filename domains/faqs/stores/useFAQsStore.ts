import { defineStore } from 'pinia'
import type {
  FAQ,
  CreateFAQInput,
  UpdateFAQInput,
  FAQFilterInput,
  FAQStatistics,
  FAQsResponse,
  FAQResponse,
  CreateFAQResponse,
  UpdateFAQResponse,
  DeleteFAQResponse
} from '../types'
import { GET_FAQS, GET_FAQ } from '../graphql/queries'
import { CREATE_FAQ, UPDATE_FAQ, DELETE_FAQ } from '../graphql/mutations'

interface FAQsState {
  faqs: FAQ[]
  currentFAQ: FAQ | null
  loading: boolean
  error: string | null
  filters: FAQFilterInput
  statistics: FAQStatistics
}

export const useFAQsStore = defineStore('faqs', {
  state: (): FAQsState => ({
    faqs: [],
    currentFAQ: null,
    loading: false,
    error: null,
    filters: {
      search: null,
      is_active: null,
      category: null,
      application_id: '1' // Default application ID - should be set from config
    },
    statistics: {
      total: 0,
      active: 0,
      inactive: 0,
      byCategory: {},
      withoutCategory: 0
    }
  }),

  getters: {
    getFAQById: (state) => (id: string) => {
      return state.faqs.find(f => f.id === id)
    },

    hasFAQs: (state) => state.faqs.length > 0,

    isLoading: (state) => state.loading,

    hasError: (state) => !!state.error,

    activeFAQs: (state) => {
      return state.faqs.filter(f => f.is_active)
    },

    inactiveFAQs: (state) => {
      return state.faqs.filter(f => !f.is_active)
    },

    faqsByCategory: (state) => {
      return state.faqs.reduce((acc, faq) => {
        const category = faq.category || 'Uncategorized'
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push(faq)
        return acc
      }, {} as Record<string, FAQ[]>)
    },

    filteredFAQs: (state) => {
      let filtered = [...state.faqs]

      // Apply search filter
      if (state.filters.search) {
        const searchLower = state.filters.search.toLowerCase()
        filtered = filtered.filter(f =>
          f.question.toLowerCase().includes(searchLower) ||
          f.answer.toLowerCase().includes(searchLower) ||
          f.category?.toLowerCase().includes(searchLower)
        )
      }

      // Apply active filter
      if (state.filters.is_active !== null && state.filters.is_active !== undefined) {
        filtered = filtered.filter(f => f.is_active === state.filters.is_active)
      }

      // Apply category filter
      if (state.filters.category) {
        filtered = filtered.filter(f => f.category === state.filters.category)
      }

      // Sort by order
      return filtered.sort((a, b) => a.order - b.order)
    },

    categories: (state) => {
      const cats = new Set(state.faqs.map(f => f.category).filter(Boolean))
      return Array.from(cats)
    },

    sortedFAQsByCategory: (state) => {
      const grouped = state.faqs.reduce((acc, faq) => {
        const category = faq.category || 'Uncategorized'
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push(faq)
        return acc
      }, {} as Record<string, FAQ[]>)

      // Sort FAQs within each category by order
      Object.keys(grouped).forEach(category => {
        grouped[category].sort((a, b) => a.order - b.order)
      })

      return grouped
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

    setFAQs(faqs: FAQ[]) {
      this.faqs = faqs
      this.updateStatistics()
    },

    setCurrentFAQ(faq: FAQ | null) {
      this.currentFAQ = faq
    },

    setFilters(filters: Partial<FAQFilterInput>) {
      this.filters = { ...this.filters, ...filters }
    },

    resetFilters() {
      this.filters = {
        search: null,
        is_active: null,
        category: null,
        application_id: this.filters.application_id
      }
    },

    updateStatistics() {
      const withoutCategory = this.faqs.filter(f => !f.category).length

      this.statistics = {
        total: this.faqs.length,
        active: this.faqs.filter(f => f.is_active).length,
        inactive: this.faqs.filter(f => !f.is_active).length,
        byCategory: this.faqs.reduce((acc, faq) => {
          const category = faq.category || 'Uncategorized'
          acc[category] = (acc[category] || 0) + 1
          return acc
        }, {} as Record<string, number>),
        withoutCategory
      }
    },

    // API Actions
    async fetchFAQs() {
      this.setLoading(true)
      this.setError(null)

      try {
        const variables: any = {
          application_id: this.filters.application_id
        }

        // Only add optional filters if they have values
        if (this.filters.is_active !== null && this.filters.is_active !== undefined) {
          variables.is_active = this.filters.is_active
        }

        if (this.filters.category) {
          variables.category = this.filters.category
        }

        const { data, error } = await useAsyncQuery<FAQsResponse>(
          GET_FAQS,
          variables
        )

        if (error.value) {
          throw new Error(error.value.message || 'Failed to fetch FAQs')
        }

        if (data.value) {
          this.setFAQs(data.value.faqs)
        }
      } catch (err: any) {
        console.error('Error fetching FAQs:', err)
        this.setError(err.message || 'Failed to load FAQs')
        // Set empty array on error
        this.setFAQs([])
      } finally {
        this.setLoading(false)
      }
    },

    async fetchFAQ(id: string) {
      this.setLoading(true)
      this.setError(null)

      try {
        // Backend doesn't have a single FAQ query, so we fetch all and filter
        const { data, error } = await useAsyncQuery<FAQsResponse>(
          GET_FAQ,
          { application_id: this.filters.application_id }
        )

        if (error.value) {
          throw new Error(error.value.message || 'Failed to fetch FAQ')
        }

        if (data.value) {
          const faq = data.value.faqs.find(f => f.id === id)
          if (!faq) {
            throw new Error('FAQ not found')
          }
          this.setCurrentFAQ(faq)
          return faq
        }
      } catch (err: any) {
        console.error('Error fetching FAQ:', err)
        this.setError(err.message || 'Failed to load FAQ')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async createFAQ(input: CreateFAQInput) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        const response = await apolloClient.mutate<CreateFAQResponse>({
          mutation: CREATE_FAQ,
          variables: { input }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.createFAQ) {
          // Refresh the FAQs list
          await this.fetchFAQs()
          return response.data.createFAQ
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        console.error('Error creating FAQ:', err)
        this.setError(err.message || 'Failed to create FAQ')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async updateFAQ(id: string, input: UpdateFAQInput) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        const response = await apolloClient.mutate<UpdateFAQResponse>({
          mutation: UPDATE_FAQ,
          variables: { id, input }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.updateFAQ) {
          // Update in local state
          const index = this.faqs.findIndex(f => f.id === id)
          if (index !== -1) {
            this.faqs[index] = response.data.updateFAQ
          }

          // Update current FAQ if it's the one being edited
          if (this.currentFAQ?.id === id) {
            this.setCurrentFAQ(response.data.updateFAQ)
          }

          this.updateStatistics()
          return response.data.updateFAQ
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        console.error('Error updating FAQ:', err)
        this.setError(err.message || 'Failed to update FAQ')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async deleteFAQ(id: string) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        const response = await apolloClient.mutate<DeleteFAQResponse>({
          mutation: DELETE_FAQ,
          variables: { id }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.deleteFAQ) {
          // Remove from local state
          this.faqs = this.faqs.filter(f => f.id !== id)

          // Clear current FAQ if it was deleted
          if (this.currentFAQ?.id === id) {
            this.setCurrentFAQ(null)
          }

          this.updateStatistics()
          return response.data.deleteFAQ
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        console.error('Error deleting FAQ:', err)
        this.setError(err.message || 'Failed to delete FAQ')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async toggleFAQStatus(id: string) {
      const faq = this.getFAQById(id)
      if (!faq) {
        throw new Error('FAQ not found')
      }

      return await this.updateFAQ(id, {
        is_active: !faq.is_active
      })
    },

    async bulkDelete(ids: string[]) {
      const errors: string[] = []

      for (const id of ids) {
        try {
          await this.deleteFAQ(id)
        } catch (err: any) {
          errors.push(`Failed to delete FAQ ${id}: ${err.message}`)
        }
      }

      if (errors.length > 0) {
        throw new Error(errors.join('\n'))
      }
    },

    async updateFAQOrder(id: string, newOrder: number) {
      return await this.updateFAQ(id, { order: newOrder })
    },

    // Filter actions
    async applySearchFilter(searchValue: string) {
      this.setFilters({ search: searchValue })
      // Client-side filtering via getter
    },

    async applyStatusFilter(is_active: boolean | null) {
      this.setFilters({ is_active })
      // Optionally refetch from server with filter
      // await this.fetchFAQs()
    },

    async applyCategoryFilter(category: string | null) {
      this.setFilters({ category })
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
      await this.fetchFAQs()
    }
  }
})
