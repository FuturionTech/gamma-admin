import { defineStore } from 'pinia'
import type {
  Certification,
  CreateCertificationInput,
  UpdateCertificationInput,
  CertificationFilterInput,
  CertificationStatistics,
  CertificationsResponse,
  CertificationResponse,
  CreateCertificationResponse,
  UpdateCertificationResponse,
  DeleteCertificationResponse
} from '../types'
import { GET_CERTIFICATIONS, GET_CERTIFICATION } from '../graphql/queries'
import { CREATE_CERTIFICATION, UPDATE_CERTIFICATION, DELETE_CERTIFICATION } from '../graphql/mutations'

interface CertificationsState {
  certifications: Certification[]
  currentCertification: Certification | null
  loading: boolean
  error: string | null
  filters: CertificationFilterInput
  statistics: CertificationStatistics
}

export const useCertificationsStore = defineStore('certifications', {
  state: (): CertificationsState => ({
    certifications: [],
    currentCertification: null,
    loading: false,
    error: null,
    filters: {
      search: null,
      is_active: null,
      certification_category_id: null,
      application_id: '1' // Default application ID - should be set from config
    },
    statistics: {
      total: 0,
      active: 0,
      inactive: 0,
      byCategory: {},
      recent: 0
    }
  }),

  getters: {
    getCertificationById: (state) => (id: string) => {
      return state.certifications.find(c => c.id === id)
    },

    hasCertifications: (state) => state.certifications.length > 0,

    isLoading: (state) => state.loading,

    hasError: (state) => !!state.error,

    activeCertifications: (state) => {
      return state.certifications.filter(c => c.is_active)
    },

    inactiveCertifications: (state) => {
      return state.certifications.filter(c => !c.is_active)
    },

    certificationsByCategory: (state) => {
      return state.certifications.reduce((acc, cert) => {
        const categoryName = cert.category?.name || 'Uncategorized'
        if (!acc[categoryName]) {
          acc[categoryName] = []
        }
        acc[categoryName].push(cert)
        return acc
      }, {} as Record<string, Certification[]>)
    },

    recentCertifications: (state) => {
      const oneYearAgo = new Date()
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

      return state.certifications.filter(cert => {
        if (!cert.issued_date) return false
        const issuedDate = new Date(cert.issued_date)
        return issuedDate >= oneYearAgo
      })
    },

    filteredCertifications: (state) => {
      let filtered = [...state.certifications]

      // Apply search filter
      if (state.filters.search) {
        const searchLower = state.filters.search.toLowerCase()
        filtered = filtered.filter(c =>
          c.title.toLowerCase().includes(searchLower) ||
          c.category?.name.toLowerCase().includes(searchLower)
        )
      }

      // Apply active filter
      if (state.filters.is_active !== null && state.filters.is_active !== undefined) {
        filtered = filtered.filter(c => c.is_active === state.filters.is_active)
      }

      // Apply category filter
      if (state.filters.certification_category_id) {
        filtered = filtered.filter(c => c.certification_category_id === state.filters.certification_category_id)
      }

      return filtered
    },

    categories: (state) => {
      const cats = state.certifications
        .map(c => c.category)
        .filter(Boolean)
        .filter((cat, index, self) =>
          index === self.findIndex(c => c?.id === cat?.id)
        )
      return cats
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

    setCertifications(certifications: Certification[]) {
      this.certifications = certifications
      this.updateStatistics()
    },

    setCurrentCertification(certification: Certification | null) {
      this.currentCertification = certification
    },

    setFilters(filters: Partial<CertificationFilterInput>) {
      this.filters = { ...this.filters, ...filters }
    },

    resetFilters() {
      this.filters = {
        search: null,
        is_active: null,
        certification_category_id: null,
        application_id: this.filters.application_id
      }
    },

    updateStatistics() {
      const oneYearAgo = new Date()
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

      this.statistics = {
        total: this.certifications.length,
        active: this.certifications.filter(c => c.is_active).length,
        inactive: this.certifications.filter(c => !c.is_active).length,
        byCategory: this.certifications.reduce((acc, cert) => {
          const categoryName = cert.category?.name || 'Uncategorized'
          acc[categoryName] = (acc[categoryName] || 0) + 1
          return acc
        }, {} as Record<string, number>),
        recent: this.certifications.filter(cert => {
          if (!cert.issued_date) return false
          const issuedDate = new Date(cert.issued_date)
          return issuedDate >= oneYearAgo
        }).length
      }
    },

    // API Actions
    async fetchCertifications() {
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

        if (this.filters.certification_category_id) {
          variables.certification_category_id = this.filters.certification_category_id
        }

        const { data, error } = await useAsyncQuery<CertificationsResponse>(
          GET_CERTIFICATIONS,
          variables
        )

        if (error.value) {
          throw new Error(error.value.message || 'Failed to fetch certifications')
        }

        if (data.value) {
          this.setCertifications(data.value.certifications)
        }
      } catch (err: any) {
        console.error('Error fetching certifications:', err)
        this.setError(err.message || 'Failed to load certifications')
        this.setCertifications([])
      } finally {
        this.setLoading(false)
      }
    },

    async fetchCertification(id: string) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { data, error } = await useAsyncQuery<CertificationResponse>(
          GET_CERTIFICATION,
          { id }
        )

        if (error.value) {
          throw new Error(error.value.message || 'Failed to fetch certification')
        }

        if (data.value) {
          this.setCurrentCertification(data.value.certification)
          return data.value.certification
        }
      } catch (err: any) {
        console.error('Error fetching certification:', err)
        this.setError(err.message || 'Failed to load certification')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async createCertification(input: CreateCertificationInput) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        const response = await apolloClient.mutate<CreateCertificationResponse>({
          mutation: CREATE_CERTIFICATION,
          variables: { input }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.createCertification) {
          await this.fetchCertifications()
          return response.data.createCertification
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        console.error('Error creating certification:', err)
        this.setError(err.message || 'Failed to create certification')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async updateCertification(id: string, input: UpdateCertificationInput) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        const response = await apolloClient.mutate<UpdateCertificationResponse>({
          mutation: UPDATE_CERTIFICATION,
          variables: { id, input }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.updateCertification) {
          const index = this.certifications.findIndex(c => c.id === id)
          if (index !== -1) {
            this.certifications[index] = response.data.updateCertification
          }

          if (this.currentCertification?.id === id) {
            this.setCurrentCertification(response.data.updateCertification)
          }

          this.updateStatistics()
          return response.data.updateCertification
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        console.error('Error updating certification:', err)
        this.setError(err.message || 'Failed to update certification')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async deleteCertification(id: string) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        const response = await apolloClient.mutate<DeleteCertificationResponse>({
          mutation: DELETE_CERTIFICATION,
          variables: { id }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.deleteCertification) {
          this.certifications = this.certifications.filter(c => c.id !== id)

          if (this.currentCertification?.id === id) {
            this.setCurrentCertification(null)
          }

          this.updateStatistics()
          return response.data.deleteCertification
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        console.error('Error deleting certification:', err)
        this.setError(err.message || 'Failed to delete certification')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async toggleCertificationStatus(id: string) {
      const certification = this.getCertificationById(id)
      if (!certification) {
        throw new Error('Certification not found')
      }

      return await this.updateCertification(id, {
        is_active: !certification.is_active
      })
    },

    async bulkDelete(ids: string[]) {
      const errors: string[] = []

      for (const id of ids) {
        try {
          await this.deleteCertification(id)
        } catch (err: any) {
          errors.push(`Failed to delete certification ${id}: ${err.message}`)
        }
      }

      if (errors.length > 0) {
        throw new Error(errors.join('\n'))
      }
    },

    // Filter actions
    async applySearchFilter(searchValue: string) {
      this.setFilters({ search: searchValue })
    },

    async applyStatusFilter(is_active: boolean | null) {
      this.setFilters({ is_active })
    },

    async applyCategoryFilter(certification_category_id: string | null) {
      this.setFilters({ certification_category_id })
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
      await this.fetchCertifications()
    }
  }
})
