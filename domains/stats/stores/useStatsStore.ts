import { defineStore } from 'pinia'
import type {
  Stat,
  CreateStatInput,
  UpdateStatInput,
  StatFilterInput,
  StatStatistics,
  StatsResponse,
  StatResponse,
  CreateStatResponse,
  UpdateStatResponse,
  DeleteStatResponse
} from '../types'
import { GET_STATS } from '../graphql/queries'
import { CREATE_STAT, UPDATE_STAT, DELETE_STAT } from '../graphql/mutations'

interface StatsState {
  stats: Stat[]
  currentStat: Stat | null
  loading: boolean
  error: string | null
  filters: StatFilterInput
  statistics: StatStatistics
}

export const useStatsStore = defineStore('stats', {
  state: (): StatsState => ({
    stats: [],
    currentStat: null,
    loading: false,
    error: null,
    filters: {
      search: null,
      is_active: null,
      application_id: '1' // Default application ID - should be set from config
    },
    statistics: {
      total: 0,
      active: 0,
      inactive: 0
    }
  }),

  getters: {
    getStatById: (state) => (id: string) => {
      return state.stats.find(s => s.id === id)
    },

    hasStats: (state) => state.stats.length > 0,

    isLoading: (state) => state.loading,

    hasError: (state) => !!state.error,

    activeStats: (state) => {
      return state.stats.filter(s => s.is_active)
    },

    inactiveStats: (state) => {
      return state.stats.filter(s => !s.is_active)
    },

    sortedStats: (state) => {
      return [...state.stats].sort((a, b) => a.order - b.order)
    },

    filteredStats: (state) => {
      let filtered = [...state.stats]

      // Apply search filter
      if (state.filters.search) {
        const searchLower = state.filters.search.toLowerCase()
        filtered = filtered.filter(s =>
          s.label.toLowerCase().includes(searchLower) ||
          s.value.toLowerCase().includes(searchLower) ||
          s.unit?.toLowerCase().includes(searchLower)
        )
      }

      // Apply active filter
      if (state.filters.is_active !== null && state.filters.is_active !== undefined) {
        filtered = filtered.filter(s => s.is_active === state.filters.is_active)
      }

      // Sort by order
      return filtered.sort((a, b) => a.order - b.order)
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

    setStats(stats: Stat[]) {
      this.stats = stats
      this.updateStatistics()
    },

    setCurrentStat(stat: Stat | null) {
      this.currentStat = stat
    },

    setFilters(filters: Partial<StatFilterInput>) {
      this.filters = { ...this.filters, ...filters }
    },

    resetFilters() {
      this.filters = {
        search: null,
        is_active: null,
        application_id: this.filters.application_id
      }
    },

    updateStatistics() {
      this.statistics = {
        total: this.stats.length,
        active: this.stats.filter(s => s.is_active).length,
        inactive: this.stats.filter(s => !s.is_active).length
      }
    },

    // API Actions
    async fetchStats() {
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

        const { data, error } = await useAsyncQuery<StatsResponse>(
          GET_STATS,
          variables
        )

        if (error.value) {
          throw new Error(error.value.message || 'Failed to fetch stats')
        }

        if (data.value) {
          this.setStats(data.value.stats)
        }
      } catch (err: any) {
        console.error('Error fetching stats:', err)
        this.setError(err.message || 'Failed to load stats')
        // Set empty array on error
        this.setStats([])
      } finally {
        this.setLoading(false)
      }
    },

    async fetchStat(id: string) {
      this.setLoading(true)
      this.setError(null)

      try {
        // Fetch all stats and find the one with matching id
        // Since there's no single stat query in the backend
        const variables: any = {
          application_id: this.filters.application_id
        }

        const { data, error } = await useAsyncQuery<StatsResponse>(
          GET_STATS,
          variables
        )

        if (error.value) {
          throw new Error(error.value.message || 'Failed to fetch stat')
        }

        if (data.value) {
          const stat = data.value.stats.find(s => s.id === id)
          if (stat) {
            this.setCurrentStat(stat)
            return stat
          } else {
            throw new Error('Stat not found')
          }
        }
      } catch (err: any) {
        console.error('Error fetching stat:', err)
        this.setError(err.message || 'Failed to load stat')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async createStat(input: CreateStatInput) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        // If order is not provided, set it to max order + 1
        if (!input.order) {
          const maxOrder = this.stats.length > 0
            ? Math.max(...this.stats.map(s => s.order))
            : 0
          input.order = maxOrder + 1
        }

        const response = await apolloClient.mutate<CreateStatResponse>({
          mutation: CREATE_STAT,
          variables: { input }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.createStat) {
          // Refresh the stats list
          await this.fetchStats()
          return response.data.createStat
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        console.error('Error creating stat:', err)
        this.setError(err.message || 'Failed to create stat')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async updateStat(id: string, input: UpdateStatInput) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        const response = await apolloClient.mutate<UpdateStatResponse>({
          mutation: UPDATE_STAT,
          variables: { id, input }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.updateStat) {
          // Update in local state
          const index = this.stats.findIndex(s => s.id === id)
          if (index !== -1) {
            this.stats[index] = response.data.updateStat
          }

          // Update current stat if it's the one being edited
          if (this.currentStat?.id === id) {
            this.setCurrentStat(response.data.updateStat)
          }

          this.updateStatistics()
          return response.data.updateStat
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        console.error('Error updating stat:', err)
        this.setError(err.message || 'Failed to update stat')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async deleteStat(id: string) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        const response = await apolloClient.mutate<DeleteStatResponse>({
          mutation: DELETE_STAT,
          variables: { id }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.deleteStat) {
          // Remove from local state
          this.stats = this.stats.filter(s => s.id !== id)

          // Clear current stat if it was deleted
          if (this.currentStat?.id === id) {
            this.setCurrentStat(null)
          }

          this.updateStatistics()
          return response.data.deleteStat
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        console.error('Error deleting stat:', err)
        this.setError(err.message || 'Failed to delete stat')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async toggleStatStatus(id: string) {
      const stat = this.getStatById(id)
      if (!stat) {
        throw new Error('Stat not found')
      }

      return await this.updateStat(id, {
        is_active: !stat.is_active
      })
    },

    async bulkDelete(ids: string[]) {
      const errors: string[] = []

      for (const id of ids) {
        try {
          await this.deleteStat(id)
        } catch (err: any) {
          errors.push(`Failed to delete stat ${id}: ${err.message}`)
        }
      }

      if (errors.length > 0) {
        throw new Error(errors.join('\n'))
      }
    },

    async reorderStats(reorderedStats: Stat[]) {
      // Update orders for all stats
      const updates = reorderedStats.map((stat, index) => ({
        id: stat.id,
        order: index + 1
      }))

      const errors: string[] = []

      for (const { id, order } of updates) {
        try {
          await this.updateStat(id, { order })
        } catch (err: any) {
          errors.push(`Failed to reorder stat ${id}: ${err.message}`)
        }
      }

      if (errors.length > 0) {
        throw new Error(errors.join('\n'))
      }

      // Refresh the stats list
      await this.fetchStats()
    },

    // Filter actions
    async applySearchFilter(searchValue: string) {
      this.setFilters({ search: searchValue })
      // Client-side filtering via getter
    },

    async applyStatusFilter(is_active: boolean | null) {
      this.setFilters({ is_active })
      // Optionally refetch from server with filter
      // await this.fetchStats()
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
      await this.fetchStats()
    }
  }
})
