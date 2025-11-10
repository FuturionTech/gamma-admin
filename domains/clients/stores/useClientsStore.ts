import { defineStore } from 'pinia'
import type {
  Client,
  CreateClientInput,
  UpdateClientInput,
  ClientFilterInput,
  ClientStatistics,
  ClientsResponse,
  ClientResponse,
  CreateClientResponse,
  UpdateClientResponse,
  DeleteClientResponse
} from '../types'
import { GET_CLIENTS, GET_CLIENT } from '../graphql/queries'
import { CREATE_CLIENT, UPDATE_CLIENT, DELETE_CLIENT } from '../graphql/mutations'

interface ClientsState {
  clients: Client[]
  currentClient: Client | null
  loading: boolean
  error: string | null
  filters: ClientFilterInput
  statistics: ClientStatistics
}

export const useClientsStore = defineStore('clients', {
  state: (): ClientsState => ({
    clients: [],
    currentClient: null,
    loading: false,
    error: null,
    filters: {
      search: null,
      is_active: null,
      industry: null
    },
    statistics: {
      total: 0,
      active: 0,
      inactive: 0,
      byIndustry: {}
    }
  }),

  getters: {
    getClientById: (state) => (id: string) => {
      return state.clients.find(c => c.id === id)
    },

    hasClients: (state) => state.clients.length > 0,

    isLoading: (state) => state.loading,

    hasError: (state) => !!state.error,

    activeClients: (state) => {
      return state.clients.filter(c => c.is_active)
    },

    inactiveClients: (state) => {
      return state.clients.filter(c => !c.is_active)
    },

    clientsByIndustry: (state) => {
      return state.clients.reduce((acc, client) => {
        const industry = client.industry || 'Other'
        if (!acc[industry]) {
          acc[industry] = []
        }
        acc[industry].push(client)
        return acc
      }, {} as Record<string, Client[]>)
    },

    filteredClients: (state) => {
      let filtered = [...state.clients]

      // Apply search filter
      if (state.filters.search) {
        const searchLower = state.filters.search.toLowerCase()
        filtered = filtered.filter(c =>
          c.name.toLowerCase().includes(searchLower) ||
          c.industry?.toLowerCase().includes(searchLower) ||
          c.website_url?.toLowerCase().includes(searchLower)
        )
      }

      // Apply active filter
      if (state.filters.is_active !== null && state.filters.is_active !== undefined) {
        filtered = filtered.filter(c => c.is_active === state.filters.is_active)
      }

      // Apply industry filter
      if (state.filters.industry) {
        filtered = filtered.filter(c => c.industry === state.filters.industry)
      }

      return filtered
    },

    industries: (state) => {
      const inds = new Set(state.clients.map(c => c.industry).filter(Boolean))
      return Array.from(inds)
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

    setClients(clients: Client[]) {
      this.clients = clients
      this.updateStatistics()
    },

    setCurrentClient(client: Client | null) {
      this.currentClient = client
    },

    setFilters(filters: Partial<ClientFilterInput>) {
      this.filters = { ...this.filters, ...filters }
    },

    resetFilters() {
      this.filters = {
        search: null,
        is_active: null,
        industry: null
      }
    },

    updateStatistics() {
      this.statistics = {
        total: this.clients.length,
        active: this.clients.filter(c => c.is_active).length,
        inactive: this.clients.filter(c => !c.is_active).length,
        byIndustry: this.clients.reduce((acc, client) => {
          const industry = client.industry || 'Other'
          acc[industry] = (acc[industry] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      }
    },

    // API Actions
    async fetchClients() {
      this.setLoading(true)
      this.setError(null)

      try {
        const variables: any = {}

        // Only add optional filters if they have values
        if (this.filters.is_active !== null && this.filters.is_active !== undefined) {
          variables.is_active = this.filters.is_active
        }

        const { data, error } = await useAsyncQuery<ClientsResponse>(
          GET_CLIENTS,
          variables
        )

        if (error.value) {
          throw new Error(error.value.message || 'Failed to fetch clients')
        }

        if (data.value) {
          this.setClients(data.value.clients)
        }
      } catch (err: any) {
        console.error('Error fetching clients:', err)
        this.setError(err.message || 'Failed to load clients')
        // Set empty array on error
        this.setClients([])
      } finally {
        this.setLoading(false)
      }
    },

    async fetchClient(id: string) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { data, error } = await useAsyncQuery<ClientResponse>(
          GET_CLIENT,
          { id }
        )

        if (error.value) {
          throw new Error(error.value.message || 'Failed to fetch client')
        }

        if (data.value) {
          this.setCurrentClient(data.value.client)
          return data.value.client
        }
      } catch (err: any) {
        console.error('Error fetching client:', err)
        this.setError(err.message || 'Failed to load client')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async createClient(input: CreateClientInput) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        const response = await apolloClient.mutate<CreateClientResponse>({
          mutation: CREATE_CLIENT,
          variables: { input }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.createClient) {
          // Refresh the clients list
          await this.fetchClients()
          return response.data.createClient
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        console.error('Error creating client:', err)
        this.setError(err.message || 'Failed to create client')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async updateClient(id: string, input: UpdateClientInput) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        const response = await apolloClient.mutate<UpdateClientResponse>({
          mutation: UPDATE_CLIENT,
          variables: { id, input }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.updateClient) {
          // Update in local state
          const index = this.clients.findIndex(c => c.id === id)
          if (index !== -1) {
            this.clients[index] = response.data.updateClient
          }

          // Update current client if it's the one being edited
          if (this.currentClient?.id === id) {
            this.setCurrentClient(response.data.updateClient)
          }

          this.updateStatistics()
          return response.data.updateClient
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        console.error('Error updating client:', err)
        this.setError(err.message || 'Failed to update client')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async deleteClient(id: string) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        const response = await apolloClient.mutate<DeleteClientResponse>({
          mutation: DELETE_CLIENT,
          variables: { id }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.deleteClient) {
          // Remove from local state
          this.clients = this.clients.filter(c => c.id !== id)

          // Clear current client if it was deleted
          if (this.currentClient?.id === id) {
            this.setCurrentClient(null)
          }

          this.updateStatistics()
          return response.data.deleteClient
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        console.error('Error deleting client:', err)
        this.setError(err.message || 'Failed to delete client')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async toggleClientStatus(id: string) {
      const client = this.getClientById(id)
      if (!client) {
        throw new Error('Client not found')
      }

      return await this.updateClient(id, {
        is_active: !client.is_active
      })
    },

    async bulkDelete(ids: string[]) {
      const errors: string[] = []

      for (const id of ids) {
        try {
          await this.deleteClient(id)
        } catch (err: any) {
          errors.push(`Failed to delete client ${id}: ${err.message}`)
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
      // await this.fetchClients()
    },

    async applyIndustryFilter(industry: string | null) {
      this.setFilters({ industry })
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
      await this.fetchClients()
    }
  }
})
