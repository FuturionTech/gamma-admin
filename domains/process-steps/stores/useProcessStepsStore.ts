import { defineStore } from 'pinia'
import type {
  ProcessStep,
  ProcessStepItem,
  CreateProcessStepInput,
  UpdateProcessStepInput,
  CreateProcessStepItemInput,
  UpdateProcessStepItemInput,
  ProcessStepFilterInput,
  ProcessStepStatistics,
  ProcessStepsResponse,
  ProcessStepResponse,
  CreateProcessStepResponse,
  UpdateProcessStepResponse,
  DeleteProcessStepResponse,
  CreateProcessStepItemResponse,
  UpdateProcessStepItemResponse,
  DeleteProcessStepItemResponse
} from '../types'
import { GET_PROCESS_STEPS, GET_PROCESS_STEP } from '../graphql/queries'
import {
  CREATE_PROCESS_STEP,
  UPDATE_PROCESS_STEP,
  DELETE_PROCESS_STEP,
  CREATE_PROCESS_STEP_ITEM,
  UPDATE_PROCESS_STEP_ITEM,
  DELETE_PROCESS_STEP_ITEM
} from '../graphql/mutations'

interface ProcessStepsState {
  processSteps: ProcessStep[]
  currentProcessStep: ProcessStep | null
  loading: boolean
  error: string | null
  filters: ProcessStepFilterInput
  statistics: ProcessStepStatistics
}

export const useProcessStepsStore = defineStore('processSteps', {
  state: (): ProcessStepsState => ({
    processSteps: [],
    currentProcessStep: null,
    loading: false,
    error: null,
    filters: {
      search: null,
      is_active: null
    },
    statistics: {
      total: 0,
      active: 0,
      inactive: 0,
      totalItems: 0
    }
  }),

  getters: {
    getProcessStepById: (state) => (id: string) => {
      return state.processSteps.find(s => s.id === id)
    },

    hasProcessSteps: (state) => state.processSteps.length > 0,

    isLoading: (state) => state.loading,

    hasError: (state) => !!state.error,

    activeProcessSteps: (state) => {
      return state.processSteps.filter(s => s.is_active)
    },

    inactiveProcessSteps: (state) => {
      return state.processSteps.filter(s => !s.is_active)
    },

    filteredProcessSteps: (state) => {
      let filtered = [...state.processSteps]

      // Apply search filter
      if (state.filters.search) {
        const searchLower = state.filters.search.toLowerCase()
        filtered = filtered.filter(s =>
          s.title.toLowerCase().includes(searchLower) ||
          s.description?.toLowerCase().includes(searchLower) ||
          s.short_description?.toLowerCase().includes(searchLower) ||
          s.slug.toLowerCase().includes(searchLower)
        )
      }

      // Apply active filter
      if (state.filters.is_active !== null && state.filters.is_active !== undefined) {
        filtered = filtered.filter(s => s.is_active === state.filters.is_active)
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

    setProcessSteps(processSteps: ProcessStep[]) {
      this.processSteps = processSteps
      this.updateStatistics()
    },

    setCurrentProcessStep(processStep: ProcessStep | null) {
      this.currentProcessStep = processStep
    },

    setFilters(filters: Partial<ProcessStepFilterInput>) {
      this.filters = { ...this.filters, ...filters }
    },

    resetFilters() {
      this.filters = {
        search: null,
        is_active: null
      }
    },

    updateStatistics() {
      this.statistics = {
        total: this.processSteps.length,
        active: this.processSteps.filter(s => s.is_active).length,
        inactive: this.processSteps.filter(s => !s.is_active).length,
        totalItems: this.processSteps.reduce((sum, s) => sum + (s.items?.length || 0), 0)
      }
    },

    // API Actions
    async fetchProcessSteps() {
      this.setLoading(true)
      this.setError(null)

      try {
        const variables: any = {}

        if (this.filters.is_active !== null && this.filters.is_active !== undefined) {
          variables.is_active = this.filters.is_active
        }

        const { data, error } = await useAsyncQuery<ProcessStepsResponse>(
          GET_PROCESS_STEPS,
          variables
        )

        if (error.value) {
          throw new Error(error.value.message || 'Failed to fetch process steps')
        }

        if (data.value) {
          this.setProcessSteps(data.value.processSteps)
        }
      } catch (err: any) {
        this.setError(err.message || 'Failed to load process steps')
        this.setProcessSteps([])
      } finally {
        this.setLoading(false)
      }
    },

    async fetchProcessStep(id: string) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { data, error } = await useAsyncQuery<ProcessStepResponse>(
          GET_PROCESS_STEP,
          { id }
        )

        if (error.value) {
          throw new Error(error.value.message || 'Failed to fetch process step')
        }

        if (data.value) {
          this.setCurrentProcessStep(data.value.processStep)
          return data.value.processStep
        }
      } catch (err: any) {
        this.setError(err.message || 'Failed to load process step')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async createProcessStep(input: CreateProcessStepInput) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        const response = await apolloClient.mutate<CreateProcessStepResponse>({
          mutation: CREATE_PROCESS_STEP,
          variables: { input }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.createProcessStep) {
          await this.fetchProcessSteps()
          return response.data.createProcessStep
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        this.setError(err.message || 'Failed to create process step')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async updateProcessStep(id: string, input: UpdateProcessStepInput) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        const response = await apolloClient.mutate<UpdateProcessStepResponse>({
          mutation: UPDATE_PROCESS_STEP,
          variables: { id, input }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.updateProcessStep) {
          const index = this.processSteps.findIndex(s => s.id === id)
          if (index !== -1) {
            this.processSteps[index] = response.data.updateProcessStep
          }

          if (this.currentProcessStep?.id === id) {
            this.setCurrentProcessStep(response.data.updateProcessStep)
          }

          this.updateStatistics()
          return response.data.updateProcessStep
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        this.setError(err.message || 'Failed to update process step')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async deleteProcessStep(id: string) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        const response = await apolloClient.mutate<DeleteProcessStepResponse>({
          mutation: DELETE_PROCESS_STEP,
          variables: { id }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.deleteProcessStep) {
          this.processSteps = this.processSteps.filter(s => s.id !== id)

          if (this.currentProcessStep?.id === id) {
            this.setCurrentProcessStep(null)
          }

          this.updateStatistics()
          return response.data.deleteProcessStep
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        this.setError(err.message || 'Failed to delete process step')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async toggleProcessStepStatus(id: string) {
      const processStep = this.getProcessStepById(id)
      if (!processStep) {
        throw new Error('Process step not found')
      }

      return await this.updateProcessStep(id, {
        is_active: !processStep.is_active
      })
    },

    async bulkDelete(ids: string[]) {
      const errors: string[] = []

      for (const id of ids) {
        try {
          await this.deleteProcessStep(id)
        } catch (err: any) {
          errors.push(`Failed to delete process step ${id}: ${err.message}`)
        }
      }

      if (errors.length > 0) {
        throw new Error(errors.join('\n'))
      }
    },

    // Sub-item actions
    async createItem(input: CreateProcessStepItemInput) {
      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        const response = await apolloClient.mutate<CreateProcessStepItemResponse>({
          mutation: CREATE_PROCESS_STEP_ITEM,
          variables: { input }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.createProcessStepItem) {
          // Refresh current process step to get updated items
          if (this.currentProcessStep?.id === input.process_step_id) {
            await this.fetchProcessStep(input.process_step_id)
          }
          return response.data.createProcessStepItem
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        throw err
      }
    },

    async updateItem(id: string, input: UpdateProcessStepItemInput) {
      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        const response = await apolloClient.mutate<UpdateProcessStepItemResponse>({
          mutation: UPDATE_PROCESS_STEP_ITEM,
          variables: { id, input }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.updateProcessStepItem) {
          // Refresh current process step to get updated items
          if (this.currentProcessStep) {
            await this.fetchProcessStep(this.currentProcessStep.id)
          }
          return response.data.updateProcessStepItem
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        throw err
      }
    },

    async deleteItem(id: string) {
      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        const response = await apolloClient.mutate<DeleteProcessStepItemResponse>({
          mutation: DELETE_PROCESS_STEP_ITEM,
          variables: { id }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.deleteProcessStepItem) {
          // Refresh current process step to get updated items
          if (this.currentProcessStep) {
            await this.fetchProcessStep(this.currentProcessStep.id)
          }
          return response.data.deleteProcessStepItem
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        throw err
      }
    },

    // Filter actions
    async applySearchFilter(searchValue: string) {
      this.setFilters({ search: searchValue })
    },

    async applyStatusFilter(is_active: boolean | null) {
      this.setFilters({ is_active })
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
      await this.fetchProcessSteps()
    }
  }
})
