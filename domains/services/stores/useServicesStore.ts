import { defineStore } from 'pinia'
import type {
  Service,
  CreateServiceInput,
  UpdateServiceInput,
  ServiceFilterInput,
  ServiceStatistics,
  ServicesResponse,
  ServiceResponse,
  CreateServiceResponse,
  UpdateServiceResponse,
  DeleteServiceResponse
} from '../types'
import { GET_SERVICES, GET_SERVICE } from '../graphql/queries'
import { CREATE_SERVICE, UPDATE_SERVICE, DELETE_SERVICE } from '../graphql/mutations'

interface ServicesState {
  services: Service[]
  currentService: Service | null
  loading: boolean
  error: string | null
  filters: ServiceFilterInput
  statistics: ServiceStatistics
}

export const useServicesStore = defineStore('services', {
  state: (): ServicesState => ({
    services: [],
    currentService: null,
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
    getServiceById: (state) => (id: string) => {
      return state.services.find(s => s.id === id)
    },

    hasServices: (state) => state.services.length > 0,

    isLoading: (state) => state.loading,

    hasError: (state) => !!state.error,

    activeServices: (state) => {
      return state.services.filter(s => s.is_active)
    },

    inactiveServices: (state) => {
      return state.services.filter(s => !s.is_active)
    },

    servicesByCategory: (state) => {
      return state.services.reduce((acc, service) => {
        const category = service.category || 'Uncategorized'
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push(service)
        return acc
      }, {} as Record<string, Service[]>)
    },

    filteredServices: (state) => {
      let filtered = [...state.services]

      // Apply search filter
      if (state.filters.search) {
        const searchLower = state.filters.search.toLowerCase()
        filtered = filtered.filter(s =>
          s.title.toLowerCase().includes(searchLower) ||
          s.description?.toLowerCase().includes(searchLower) ||
          s.category?.toLowerCase().includes(searchLower) ||
          s.slug.toLowerCase().includes(searchLower)
        )
      }

      // Apply active filter
      if (state.filters.is_active !== null && state.filters.is_active !== undefined) {
        filtered = filtered.filter(s => s.is_active === state.filters.is_active)
      }

      // Apply category filter
      if (state.filters.category) {
        filtered = filtered.filter(s => s.category === state.filters.category)
      }

      return filtered
    },

    categories: (state) => {
      const cats = new Set(state.services.map(s => s.category).filter(Boolean))
      return Array.from(cats)
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

    setServices(services: Service[]) {
      this.services = services
      this.updateStatistics()
    },

    setCurrentService(service: Service | null) {
      this.currentService = service
    },

    setFilters(filters: Partial<ServiceFilterInput>) {
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
        total: this.services.length,
        active: this.services.filter(s => s.is_active).length,
        inactive: this.services.filter(s => !s.is_active).length,
        byCategory: this.services.reduce((acc, service) => {
          const category = service.category || 'Uncategorized'
          acc[category] = (acc[category] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      }
    },

    // API Actions
    async fetchServices() {
      this.setLoading(true)
      this.setError(null)

      try {
        const variables: any = {}

        // Only add optional filters if they have values
        if (this.filters.is_active !== null && this.filters.is_active !== undefined) {
          variables.is_active = this.filters.is_active
        }

        const { data, error } = await useAsyncQuery<ServicesResponse>(
          GET_SERVICES,
          variables
        )

        if (error.value) {
          throw new Error(error.value.message || 'Failed to fetch services')
        }

        if (data.value) {
          this.setServices(data.value.services)
        }
      } catch (err: any) {
        console.error('Error fetching services:', err)
        this.setError(err.message || 'Failed to load services')
        // Set empty array on error
        this.setServices([])
      } finally {
        this.setLoading(false)
      }
    },

    async fetchService(id: string) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { data, error } = await useAsyncQuery<ServiceResponse>(
          GET_SERVICE,
          { id }
        )

        if (error.value) {
          throw new Error(error.value.message || 'Failed to fetch service')
        }

        if (data.value) {
          this.setCurrentService(data.value.service)
          return data.value.service
        }
      } catch (err: any) {
        console.error('Error fetching service:', err)
        this.setError(err.message || 'Failed to load service')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async createService(input: CreateServiceInput) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        const response = await apolloClient.mutate<CreateServiceResponse>({
          mutation: CREATE_SERVICE,
          variables: { input }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.createService) {
          // Refresh the services list
          await this.fetchServices()
          return response.data.createService
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        console.error('Error creating service:', err)
        this.setError(err.message || 'Failed to create service')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async updateService(id: string, input: UpdateServiceInput) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        const response = await apolloClient.mutate<UpdateServiceResponse>({
          mutation: UPDATE_SERVICE,
          variables: { id, input }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.updateService) {
          // Update in local state
          const index = this.services.findIndex(s => s.id === id)
          if (index !== -1) {
            this.services[index] = response.data.updateService
          }

          // Update current service if it's the one being edited
          if (this.currentService?.id === id) {
            this.setCurrentService(response.data.updateService)
          }

          this.updateStatistics()
          return response.data.updateService
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        console.error('Error updating service:', err)
        this.setError(err.message || 'Failed to update service')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async deleteService(id: string) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        const response = await apolloClient.mutate<DeleteServiceResponse>({
          mutation: DELETE_SERVICE,
          variables: { id }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.deleteService) {
          // Remove from local state
          this.services = this.services.filter(s => s.id !== id)

          // Clear current service if it was deleted
          if (this.currentService?.id === id) {
            this.setCurrentService(null)
          }

          this.updateStatistics()
          return response.data.deleteService
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        console.error('Error deleting service:', err)
        this.setError(err.message || 'Failed to delete service')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async toggleServiceStatus(id: string) {
      const service = this.getServiceById(id)
      if (!service) {
        throw new Error('Service not found')
      }

      return await this.updateService(id, {
        is_active: !service.is_active
      })
    },

    async bulkDelete(ids: string[]) {
      const errors: string[] = []

      for (const id of ids) {
        try {
          await this.deleteService(id)
        } catch (err: any) {
          errors.push(`Failed to delete service ${id}: ${err.message}`)
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
      // await this.fetchServices()
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
      await this.fetchServices()
    }
  }
})
