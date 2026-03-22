import { defineStore } from 'pinia'
import type {
  Industry,
  CreateIndustryInput,
  UpdateIndustryInput,
  IndustryFilterInput,
  IndustryStatistics,
  IndustriesResponse,
  IndustryResponse,
  CreateIndustryResponse,
  UpdateIndustryResponse,
  DeleteIndustryResponse
} from '../types'
import { IndustryCategory } from '../types'
import { GET_INDUSTRIES, GET_INDUSTRY } from '../graphql/queries'
import { CREATE_INDUSTRY, UPDATE_INDUSTRY, DELETE_INDUSTRY } from '../graphql/mutations'

interface IndustriesState {
  industries: Industry[]
  currentIndustry: Industry | null
  loading: boolean
  error: string | null
  filters: IndustryFilterInput
  statistics: IndustryStatistics
}

export const useIndustriesStore = defineStore('industries', {
  state: (): IndustriesState => ({
    industries: [],
    currentIndustry: null,
    loading: false,
    error: null,
    filters: {
      search: null,
      is_active: null,
      category: null
    },
    statistics: {
      total: 0,
      active: 0,
      inactive: 0,
      byCategory: {}
    }
  }),

  getters: {
    getIndustryById: (state) => (id: string) => {
      return state.industries.find(i => i.id === id)
    },

    hasIndustries: (state) => state.industries.length > 0,

    isLoading: (state) => state.loading,

    hasError: (state) => !!state.error,

    activeIndustries: (state) => {
      return state.industries.filter(i => i.is_active)
    },

    inactiveIndustries: (state) => {
      return state.industries.filter(i => !i.is_active)
    },

    industriesByCategory: (state) => {
      return state.industries.reduce((acc, industry) => {
        const category = industry.category || 'Uncategorized'
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push(industry)
        return acc
      }, {} as Record<string, Industry[]>)
    },

    filteredIndustries: (state) => {
      let filtered = [...state.industries]

      // Apply search filter
      if (state.filters.search) {
        const searchLower = state.filters.search.toLowerCase()
        filtered = filtered.filter(i =>
          i.title.toLowerCase().includes(searchLower) ||
          i.description?.toLowerCase().includes(searchLower) ||
          i.short_description?.toLowerCase().includes(searchLower) ||
          i.category?.toLowerCase().includes(searchLower) ||
          i.slug.toLowerCase().includes(searchLower)
        )
      }

      // Apply active filter
      if (state.filters.is_active !== null && state.filters.is_active !== undefined) {
        filtered = filtered.filter(i => i.is_active === state.filters.is_active)
      }

      // Apply category filter
      if (state.filters.category) {
        filtered = filtered.filter(i => i.category === state.filters.category)
      }

      return filtered
    },

    categories: (state) => {
      const cats = new Set(state.industries.map(i => i.category).filter(Boolean))
      return Array.from(cats) as IndustryCategory[]
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

    setIndustries(industries: Industry[]) {
      this.industries = industries
      this.updateStatistics()
    },

    setCurrentIndustry(industry: Industry | null) {
      this.currentIndustry = industry
    },

    setFilters(filters: Partial<IndustryFilterInput>) {
      this.filters = { ...this.filters, ...filters }
    },

    resetFilters() {
      this.filters = {
        search: null,
        is_active: null,
        category: null
      }
    },

    updateStatistics() {
      this.statistics = {
        total: this.industries.length,
        active: this.industries.filter(i => i.is_active).length,
        inactive: this.industries.filter(i => !i.is_active).length,
        byCategory: this.industries.reduce((acc, industry) => {
          const category = industry.category || 'Uncategorized'
          acc[category] = (acc[category] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      }
    },

    // API Actions
    async fetchIndustries() {
      this.setLoading(true)
      this.setError(null)

      try {
        const variables: any = {}

        // Only add optional filters if they have values
        if (this.filters.is_active !== null && this.filters.is_active !== undefined) {
          variables.is_active = this.filters.is_active
        }

        if (this.filters.category) {
          variables.category = this.filters.category
        }

        const { data, error } = await useAsyncQuery<IndustriesResponse>(
          GET_INDUSTRIES,
          variables
        )

        if (error.value) {
          throw new Error(error.value.message || 'Failed to fetch industries')
        }

        if (data.value) {
          this.setIndustries(data.value.industries)
        }
      } catch (err: any) {
        this.setError(err.message || 'Failed to load industries')
        // Set empty array on error
        this.setIndustries([])
      } finally {
        this.setLoading(false)
      }
    },

    async fetchIndustry(id: string) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { data, error } = await useAsyncQuery<IndustryResponse>(
          GET_INDUSTRY,
          { id }
        )

        if (error.value) {
          throw new Error(error.value.message || 'Failed to fetch industry')
        }

        if (data.value) {
          this.setCurrentIndustry(data.value.industry)
          return data.value.industry
        }
      } catch (err: any) {
        this.setError(err.message || 'Failed to load industry')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async createIndustry(input: CreateIndustryInput) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        const response = await apolloClient.mutate<CreateIndustryResponse>({
          mutation: CREATE_INDUSTRY,
          variables: { input }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.createIndustry) {
          // Refresh the industries list
          await this.fetchIndustries()
          return response.data.createIndustry
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        this.setError(err.message || 'Failed to create industry')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async updateIndustry(id: string, input: UpdateIndustryInput) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        const response = await apolloClient.mutate<UpdateIndustryResponse>({
          mutation: UPDATE_INDUSTRY,
          variables: { id, input }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.updateIndustry) {
          // Update in local state
          const index = this.industries.findIndex(i => i.id === id)
          if (index !== -1) {
            this.industries[index] = response.data.updateIndustry
          }

          // Update current industry if it's the one being edited
          if (this.currentIndustry?.id === id) {
            this.setCurrentIndustry(response.data.updateIndustry)
          }

          this.updateStatistics()
          return response.data.updateIndustry
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        this.setError(err.message || 'Failed to update industry')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async deleteIndustry(id: string) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        const response = await apolloClient.mutate<DeleteIndustryResponse>({
          mutation: DELETE_INDUSTRY,
          variables: { id }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.deleteIndustry) {
          // Remove from local state
          this.industries = this.industries.filter(i => i.id !== id)

          // Clear current industry if it was deleted
          if (this.currentIndustry?.id === id) {
            this.setCurrentIndustry(null)
          }

          this.updateStatistics()
          return response.data.deleteIndustry
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        this.setError(err.message || 'Failed to delete industry')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async toggleIndustryStatus(id: string) {
      const industry = this.getIndustryById(id)
      if (!industry) {
        throw new Error('Industry not found')
      }

      return await this.updateIndustry(id, {
        is_active: !industry.is_active
      })
    },

    async bulkDelete(ids: string[]) {
      const errors: string[] = []

      for (const id of ids) {
        try {
          await this.deleteIndustry(id)
        } catch (err: any) {
          errors.push(`Failed to delete industry ${id}: ${err.message}`)
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
    },

    async applyCategoryFilter(category: IndustryCategory | null) {
      this.setFilters({ category })
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
      await this.fetchIndustries()
    }
  }
})
