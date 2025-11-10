import { defineStore } from 'pinia'
import type {
  Partner,
  CreatePartnerInput,
  UpdatePartnerInput,
  PartnerFilterInput,
  PartnerStatistics,
  PartnersResponse,
  PartnerResponse,
  CreatePartnerResponse,
  UpdatePartnerResponse,
  DeletePartnerResponse
} from '../types'
import { GET_PARTNERS, GET_PARTNER } from '../graphql/queries'
import { CREATE_PARTNER, UPDATE_PARTNER, DELETE_PARTNER } from '../graphql/mutations'

interface PartnersState {
  partners: Partner[]
  currentPartner: Partner | null
  loading: boolean
  error: string | null
  filters: PartnerFilterInput
  statistics: PartnerStatistics
}

export const usePartnersStore = defineStore('partners', {
  state: (): PartnersState => ({
    partners: [],
    currentPartner: null,
    loading: false,
    error: null,
    filters: {
      search: null,
      is_active: null
    },
    statistics: {
      total: 0,
      active: 0,
      inactive: 0
    }
  }),

  getters: {
    getPartnerById: (state) => (id: string) => {
      return state.partners.find(p => p.id === id)
    },

    hasPartners: (state) => state.partners.length > 0,

    isLoading: (state) => state.loading,

    hasError: (state) => !!state.error,

    activePartners: (state) => {
      return state.partners.filter(p => p.is_active)
    },

    inactivePartners: (state) => {
      return state.partners.filter(p => !p.is_active)
    },

    filteredPartners: (state) => {
      let filtered = [...state.partners]

      // Apply search filter
      if (state.filters.search) {
        const searchLower = state.filters.search.toLowerCase()
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(searchLower) ||
          p.website_url?.toLowerCase().includes(searchLower)
        )
      }

      // Apply active filter
      if (state.filters.is_active !== null && state.filters.is_active !== undefined) {
        filtered = filtered.filter(p => p.is_active === state.filters.is_active)
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

    setPartners(partners: Partner[]) {
      this.partners = partners
      this.updateStatistics()
    },

    setCurrentPartner(partner: Partner | null) {
      this.currentPartner = partner
    },

    setFilters(filters: Partial<PartnerFilterInput>) {
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
        total: this.partners.length,
        active: this.partners.filter(p => p.is_active).length,
        inactive: this.partners.filter(p => !p.is_active).length
      }
    },

    // API Actions
    async fetchPartners() {
      this.setLoading(true)
      this.setError(null)

      try {
        const variables: any = {}

        // Only add optional filters if they have values
        if (this.filters.is_active !== null && this.filters.is_active !== undefined) {
          variables.is_active = this.filters.is_active
        }

        const { data, error } = await useAsyncQuery<PartnersResponse>(
          GET_PARTNERS,
          variables
        )

        if (error.value) {
          throw new Error(error.value.message || 'Failed to fetch partners')
        }

        if (data.value) {
          this.setPartners(data.value.partners)
        }
      } catch (err: any) {
        console.error('Error fetching partners:', err)
        this.setError(err.message || 'Failed to load partners')
        // Set empty array on error
        this.setPartners([])
      } finally {
        this.setLoading(false)
      }
    },

    async fetchPartner(id: string) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { data, error } = await useAsyncQuery<PartnerResponse>(
          GET_PARTNER,
          { id }
        )

        if (error.value) {
          throw new Error(error.value.message || 'Failed to fetch partner')
        }

        if (data.value) {
          this.setCurrentPartner(data.value.partner)
          return data.value.partner
        }
      } catch (err: any) {
        console.error('Error fetching partner:', err)
        this.setError(err.message || 'Failed to load partner')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async createPartner(input: CreatePartnerInput) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        const response = await apolloClient.mutate<CreatePartnerResponse>({
          mutation: CREATE_PARTNER,
          variables: { input }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.createPartner) {
          // Refresh the partners list
          await this.fetchPartners()
          return response.data.createPartner
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        console.error('Error creating partner:', err)
        this.setError(err.message || 'Failed to create partner')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async updatePartner(id: string, input: UpdatePartnerInput) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        const response = await apolloClient.mutate<UpdatePartnerResponse>({
          mutation: UPDATE_PARTNER,
          variables: { id, input }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.updatePartner) {
          // Update in local state
          const index = this.partners.findIndex(p => p.id === id)
          if (index !== -1) {
            this.partners[index] = response.data.updatePartner
          }

          // Update current partner if it's the one being edited
          if (this.currentPartner?.id === id) {
            this.setCurrentPartner(response.data.updatePartner)
          }

          this.updateStatistics()
          return response.data.updatePartner
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        console.error('Error updating partner:', err)
        this.setError(err.message || 'Failed to update partner')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async deletePartner(id: string) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        const response = await apolloClient.mutate<DeletePartnerResponse>({
          mutation: DELETE_PARTNER,
          variables: { id }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.deletePartner) {
          // Remove from local state
          this.partners = this.partners.filter(p => p.id !== id)

          // Clear current partner if it was deleted
          if (this.currentPartner?.id === id) {
            this.setCurrentPartner(null)
          }

          this.updateStatistics()
          return response.data.deletePartner
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        console.error('Error deleting partner:', err)
        this.setError(err.message || 'Failed to delete partner')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async togglePartnerStatus(id: string) {
      const partner = this.getPartnerById(id)
      if (!partner) {
        throw new Error('Partner not found')
      }

      return await this.updatePartner(id, {
        is_active: !partner.is_active
      })
    },

    async bulkDelete(ids: string[]) {
      const errors: string[] = []

      for (const id of ids) {
        try {
          await this.deletePartner(id)
        } catch (err: any) {
          errors.push(`Failed to delete partner ${id}: ${err.message}`)
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
      // await this.fetchPartners()
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
      await this.fetchPartners()
    }
  }
})
