import { defineStore } from 'pinia'
import type {
  Banner,
  CreateBannerInput,
  UpdateBannerInput,
  BannerFilterInput,
  BannerStatistics,
  BannersResponse,
  CreateBannerResponse,
  UpdateBannerResponse,
  DeleteBannerResponse
} from '../types'
import { GET_BANNERS } from '../graphql/queries'
import { CREATE_BANNER, UPDATE_BANNER, DELETE_BANNER } from '../graphql/mutations'

interface BannersState {
  banners: Banner[]
  currentBanner: Banner | null
  loading: boolean
  error: string | null
  filters: BannerFilterInput
  statistics: BannerStatistics
}

export const useBannersStore = defineStore('banners', {
  state: (): BannersState => ({
    banners: [],
    currentBanner: null,
    loading: false,
    error: null,
    filters: {
      search: null,
      is_active: null,
      application_id: '1', // Default application ID
      hasCtaOnly: null
    },
    statistics: {
      total: 0,
      active: 0,
      inactive: 0,
      withCta: 0,
      withoutCta: 0
    }
  }),

  getters: {
    getBannerById: (state) => (id: string) => {
      return state.banners.find(b => b.id === id)
    },

    hasBanners: (state) => state.banners.length > 0,

    isLoading: (state) => state.loading,

    hasError: (state) => !!state.error,

    activeBanners: (state) => {
      return state.banners.filter(b => b.is_active)
    },

    inactiveBanners: (state) => {
      return state.banners.filter(b => !b.is_active)
    },

    bannersWithCta: (state) => {
      return state.banners.filter(b => b.cta_text && b.cta_url)
    },

    bannersWithoutCta: (state) => {
      return state.banners.filter(b => !b.cta_text || !b.cta_url)
    },

    sortedBanners: (state) => {
      return [...state.banners].sort((a, b) => a.order - b.order)
    },

    filteredBanners: (state) => {
      let filtered = [...state.banners]

      // Apply search filter
      if (state.filters.search) {
        const searchLower = state.filters.search.toLowerCase()
        filtered = filtered.filter(b =>
          b.title.toLowerCase().includes(searchLower) ||
          b.subtitle?.toLowerCase().includes(searchLower) ||
          b.cta_text?.toLowerCase().includes(searchLower)
        )
      }

      // Apply active status filter
      if (state.filters.is_active !== null) {
        filtered = filtered.filter(b => b.is_active === state.filters.is_active)
      }

      // Apply CTA filter
      if (state.filters.hasCtaOnly) {
        filtered = filtered.filter(b => b.cta_text && b.cta_url)
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

    setBanners(banners: Banner[]) {
      this.banners = banners
      this.updateStatistics()
    },

    setCurrentBanner(banner: Banner | null) {
      this.currentBanner = banner
    },

    setFilters(filters: Partial<BannerFilterInput>) {
      this.filters = { ...this.filters, ...filters }
    },

    resetFilters() {
      this.filters = {
        search: null,
        is_active: null,
        application_id: this.filters.application_id,
        hasCtaOnly: null
      }
    },

    updateStatistics() {
      const activeBanners = this.banners.filter(b => b.is_active)
      const inactiveBanners = this.banners.filter(b => !b.is_active)
      const withCta = this.banners.filter(b => b.cta_text && b.cta_url)
      const withoutCta = this.banners.filter(b => !b.cta_text || !b.cta_url)

      this.statistics = {
        total: this.banners.length,
        active: activeBanners.length,
        inactive: inactiveBanners.length,
        withCta: withCta.length,
        withoutCta: withoutCta.length
      }
    },

    // API Actions
    async fetchBanners() {
      this.setLoading(true)
      this.setError(null)

      try {
        const variables: any = {
          application_id: this.filters.application_id,
          first: 100
        }

        // Only add is_active filter if set
        if (this.filters.is_active !== null) {
          variables.is_active = this.filters.is_active
        }

        const { data, error } = await useAsyncQuery<BannersResponse>(
          GET_BANNERS,
          variables
        )

        if (error.value) {
          throw new Error(error.value.message || 'Failed to fetch banners')
        }

        if (data.value) {
          this.setBanners(data.value.banners)
        }
      } catch (err: any) {
        console.error('Error fetching banners:', err)
        this.setError(err.message || 'Failed to load banners')
        this.setBanners([])
      } finally {
        this.setLoading(false)
      }
    },

    async fetchBanner(id: string) {
      this.setLoading(true)
      this.setError(null)

      try {
        // First, try to find in local state
        const localBanner = this.getBannerById(id)
        if (localBanner) {
          this.setCurrentBanner(localBanner)
          this.setLoading(false)
          return localBanner
        }

        // If not in local state, fetch all banners and find it
        if (this.banners.length === 0) {
          await this.fetchBanners()
        }

        const banner = this.getBannerById(id)
        if (banner) {
          this.setCurrentBanner(banner)
          return banner
        }

        throw new Error('Banner not found')
      } catch (err: any) {
        console.error('Error fetching banner:', err)
        this.setError(err.message || 'Failed to load banner')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async createBanner(input: CreateBannerInput) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        // Set default order if not provided
        if (input.order === null || input.order === undefined) {
          input.order = this.banners.length
        }

        // Set default is_active if not provided
        if (input.is_active === null || input.is_active === undefined) {
          input.is_active = true
        }

        const response = await apolloClient.mutate<CreateBannerResponse>({
          mutation: CREATE_BANNER,
          variables: { input }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.createBanner) {
          await this.fetchBanners()
          return response.data.createBanner
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        console.error('Error creating banner:', err)
        this.setError(err.message || 'Failed to create banner')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async updateBanner(id: string, input: UpdateBannerInput) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        const response = await apolloClient.mutate<UpdateBannerResponse>({
          mutation: UPDATE_BANNER,
          variables: { id, input }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.updateBanner) {
          const index = this.banners.findIndex(b => b.id === id)
          if (index !== -1) {
            this.banners[index] = response.data.updateBanner
          }

          if (this.currentBanner?.id === id) {
            this.setCurrentBanner(response.data.updateBanner)
          }

          this.updateStatistics()
          return response.data.updateBanner
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        console.error('Error updating banner:', err)
        this.setError(err.message || 'Failed to update banner')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async deleteBanner(id: string) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        const response = await apolloClient.mutate<DeleteBannerResponse>({
          mutation: DELETE_BANNER,
          variables: { id }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.deleteBanner) {
          this.banners = this.banners.filter(b => b.id !== id)

          if (this.currentBanner?.id === id) {
            this.setCurrentBanner(null)
          }

          this.updateStatistics()
          return response.data.deleteBanner
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        console.error('Error deleting banner:', err)
        this.setError(err.message || 'Failed to delete banner')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async toggleBannerStatus(id: string) {
      const banner = this.getBannerById(id)
      if (!banner) {
        throw new Error('Banner not found')
      }

      return await this.updateBanner(id, {
        is_active: !banner.is_active
      })
    },

    async bulkDelete(ids: string[]) {
      const errors: string[] = []

      for (const id of ids) {
        try {
          await this.deleteBanner(id)
        } catch (err: any) {
          errors.push(`Failed to delete banner ${id}: ${err.message}`)
        }
      }

      if (errors.length > 0) {
        throw new Error(errors.join('\n'))
      }
    },

    async reorderBanners(newOrder: Banner[]) {
      const errors: string[] = []

      for (let i = 0; i < newOrder.length; i++) {
        try {
          await this.updateBanner(newOrder[i].id, { order: i })
        } catch (err: any) {
          errors.push(`Failed to update order for banner ${newOrder[i].id}: ${err.message}`)
        }
      }

      if (errors.length > 0) {
        throw new Error(errors.join('\n'))
      }

      await this.fetchBanners()
    },

    // Filter actions
    async applySearchFilter(searchValue: string) {
      this.setFilters({ search: searchValue })
    },

    async applyActiveFilter(is_active: boolean | null) {
      this.setFilters({ is_active })
    },

    async applyCtaFilter(hasCtaOnly: boolean | null) {
      this.setFilters({ hasCtaOnly })
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
      await this.fetchBanners()
    }
  }
})
