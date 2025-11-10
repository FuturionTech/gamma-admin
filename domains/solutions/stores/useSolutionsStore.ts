import { defineStore } from 'pinia'
import type {
  Solution,
  CreateSolutionInput,
  UpdateSolutionInput,
  SolutionFilterInput,
  SolutionStatistics,
  SolutionsResponse,
  SolutionResponse,
  CreateSolutionResponse,
  UpdateSolutionResponse,
  DeleteSolutionResponse
} from '../types'
import { GET_SOLUTIONS, GET_SOLUTION } from '../graphql/queries'
import { CREATE_SOLUTION, UPDATE_SOLUTION, DELETE_SOLUTION } from '../graphql/mutations'

interface SolutionsState {
  solutions: Solution[]
  currentSolution: Solution | null
  loading: boolean
  error: string | null
  filters: SolutionFilterInput
  statistics: SolutionStatistics
}

export const useSolutionsStore = defineStore('solutions', {
  state: (): SolutionsState => ({
    solutions: [],
    currentSolution: null,
    loading: false,
    error: null,
    filters: {
      search: null,
      is_active: null,
      application_id: '1'
    },
    statistics: {
      total: 0,
      active: 0,
      inactive: 0,
      totalFeatures: 0,
      totalBenefits: 0
    }
  }),

  getters: {
    getSolutionById: (state) => (id: string) => {
      return state.solutions.find(s => s.id === id)
    },

    getSolutionBySlug: (state) => (slug: string) => {
      return state.solutions.find(s => s.slug === slug)
    },

    hasSolutions: (state) => state.solutions.length > 0,

    isLoading: (state) => state.loading,

    hasError: (state) => !!state.error,

    activeSolutions: (state) => {
      return state.solutions.filter(s => s.is_active)
    },

    inactiveSolutions: (state) => {
      return state.solutions.filter(s => !s.is_active)
    },

    filteredSolutions: (state) => {
      let filtered = [...state.solutions]

      if (state.filters.search) {
        const searchLower = state.filters.search.toLowerCase()
        filtered = filtered.filter(s =>
          s.title.toLowerCase().includes(searchLower) ||
          s.subtitle?.toLowerCase().includes(searchLower) ||
          s.description?.toLowerCase().includes(searchLower) ||
          s.slug.toLowerCase().includes(searchLower)
        )
      }

      if (state.filters.is_active !== null && state.filters.is_active !== undefined) {
        filtered = filtered.filter(s => s.is_active === state.filters.is_active)
      }

      return filtered
    }
  },

  actions: {
    setLoading(loading: boolean) {
      this.loading = loading
    },

    setError(error: string | null) {
      this.error = error
    },

    setSolutions(solutions: Solution[]) {
      this.solutions = solutions
      this.updateStatistics()
    },

    setCurrentSolution(solution: Solution | null) {
      this.currentSolution = solution
    },

    setFilters(filters: Partial<SolutionFilterInput>) {
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
        total: this.solutions.length,
        active: this.solutions.filter(s => s.is_active).length,
        inactive: this.solutions.filter(s => !s.is_active).length,
        totalFeatures: this.solutions.reduce((sum, s) => sum + (s.features?.length || 0), 0),
        totalBenefits: this.solutions.reduce((sum, s) => sum + (s.benefits?.length || 0), 0)
      }
    },

    async fetchSolutions() {
      this.setLoading(true)
      this.setError(null)

      try {
        const variables: any = {
          application_id: this.filters.application_id
        }

        if (this.filters.is_active !== null && this.filters.is_active !== undefined) {
          variables.is_active = this.filters.is_active
        }

        const { data, error } = await useAsyncQuery<SolutionsResponse>(
          GET_SOLUTIONS,
          variables
        )

        if (error.value) {
          throw new Error(error.value.message || 'Failed to fetch solutions')
        }

        if (data.value) {
          this.setSolutions(data.value.solutions)
        }
      } catch (err: any) {
        console.error('Error fetching solutions:', err)
        this.setError(err.message || 'Failed to load solutions')
        this.setSolutions([])
      } finally {
        this.setLoading(false)
      }
    },

    async fetchSolution(slug: string) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { data, error } = await useAsyncQuery<SolutionResponse>(
          GET_SOLUTION,
          { slug }
        )

        if (error.value) {
          throw new Error(error.value.message || 'Failed to fetch solution')
        }

        if (data.value) {
          this.setCurrentSolution(data.value.solution)
          return data.value.solution
        }
      } catch (err: any) {
        console.error('Error fetching solution:', err)
        this.setError(err.message || 'Failed to load solution')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async fetchSolutionById(id: string) {
      // Since backend only supports query by slug, we'll fetch from cache or all solutions
      const cached = this.getSolutionById(id)
      if (cached) {
        this.setCurrentSolution(cached)
        return cached
      }

      // Fetch all solutions to find the one with this ID
      if (this.solutions.length === 0) {
        await this.fetchSolutions()
      }

      const solution = this.getSolutionById(id)
      if (solution) {
        this.setCurrentSolution(solution)
        return solution
      }

      throw new Error('Solution not found')
    },

    async createSolution(input: CreateSolutionInput) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        const response = await apolloClient.mutate<CreateSolutionResponse>({
          mutation: CREATE_SOLUTION,
          variables: { input }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.createSolution) {
          await this.fetchSolutions()
          return response.data.createSolution
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        console.error('Error creating solution:', err)
        this.setError(err.message || 'Failed to create solution')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async updateSolution(id: string, input: UpdateSolutionInput) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        const response = await apolloClient.mutate<UpdateSolutionResponse>({
          mutation: UPDATE_SOLUTION,
          variables: { id, input }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.updateSolution) {
          const index = this.solutions.findIndex(s => s.id === id)
          if (index !== -1) {
            this.solutions[index] = response.data.updateSolution
          }

          if (this.currentSolution?.id === id) {
            this.setCurrentSolution(response.data.updateSolution)
          }

          this.updateStatistics()
          return response.data.updateSolution
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        console.error('Error updating solution:', err)
        this.setError(err.message || 'Failed to update solution')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async deleteSolution(id: string) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        const response = await apolloClient.mutate<DeleteSolutionResponse>({
          mutation: DELETE_SOLUTION,
          variables: { id }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.deleteSolution) {
          this.solutions = this.solutions.filter(s => s.id !== id)

          if (this.currentSolution?.id === id) {
            this.setCurrentSolution(null)
          }

          this.updateStatistics()
          return response.data.deleteSolution
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        console.error('Error deleting solution:', err)
        this.setError(err.message || 'Failed to delete solution')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async toggleSolutionStatus(id: string) {
      const solution = this.getSolutionById(id)
      if (!solution) {
        throw new Error('Solution not found')
      }

      return await this.updateSolution(id, {
        is_active: !solution.is_active
      })
    },

    async bulkDelete(ids: string[]) {
      const errors: string[] = []

      for (const id of ids) {
        try {
          await this.deleteSolution(id)
        } catch (err: any) {
          errors.push(`Failed to delete solution ${id}: ${err.message}`)
        }
      }

      if (errors.length > 0) {
        throw new Error(errors.join('\n'))
      }
    },

    async applySearchFilter(searchValue: string) {
      this.setFilters({ search: searchValue })
    },

    async applyStatusFilter(is_active: boolean | null) {
      this.setFilters({ is_active })
    },

    debouncedSearch(searchValue: string) {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          this.applySearchFilter(searchValue)
          resolve()
        }, 300)
      })
    },

    async initialize() {
      await this.fetchSolutions()
    }
  }
})
