import { defineStore } from 'pinia'
import dayjs from 'dayjs'
import type {
  ContactRequest,
  UpdateContactRequestInput,
  ContactRequestFilterInput,
  ContactRequestStatistics,
  ContactRequestsResponse,
  ContactRequestResponse,
  UpdateContactRequestResponse,
  DeleteContactRequestResponse,
  ContactRequestStatus
} from '../types'
import { GET_CONTACT_REQUESTS, GET_CONTACT_REQUEST } from '../graphql/queries'
import { UPDATE_CONTACT_REQUEST, DELETE_CONTACT_REQUEST } from '../graphql/mutations'

interface ContactRequestsState {
  contactRequests: ContactRequest[]
  currentContactRequest: ContactRequest | null
  loading: boolean
  error: string | null
  filters: ContactRequestFilterInput
  statistics: ContactRequestStatistics
}

export const useContactRequestsStore = defineStore('contactRequests', {
  state: (): ContactRequestsState => ({
    contactRequests: [],
    currentContactRequest: null,
    loading: false,
    error: null,
    filters: {
      search: null,
      status: null,
      application_id: '1', // Default application ID - should be set from config
      date_from: null,
      date_to: null
    },
    statistics: {
      total: 0,
      new: 0,
      inProgress: 0,
      resolved: 0,
      today: 0,
      thisWeek: 0
    }
  }),

  getters: {
    getContactRequestById: (state) => (id: string) => {
      return state.contactRequests.find(cr => cr.id === id)
    },

    hasContactRequests: (state) => state.contactRequests.length > 0,

    isLoading: (state) => state.loading,

    hasError: (state) => !!state.error,

    newContactRequests: (state) => {
      return state.contactRequests.filter(cr => cr.status === 'NEW')
    },

    inProgressContactRequests: (state) => {
      return state.contactRequests.filter(cr => cr.status === 'IN_PROGRESS')
    },

    resolvedContactRequests: (state) => {
      return state.contactRequests.filter(cr => cr.status === 'RESOLVED')
    },

    todayContactRequests: (state) => {
      const today = dayjs().startOf('day')
      return state.contactRequests.filter(cr =>
        dayjs(cr.created_at).isAfter(today)
      )
    },

    thisWeekContactRequests: (state) => {
      const weekStart = dayjs().startOf('week')
      return state.contactRequests.filter(cr =>
        dayjs(cr.created_at).isAfter(weekStart)
      )
    },

    filteredContactRequests: (state) => {
      let filtered = [...state.contactRequests]

      // Apply search filter
      if (state.filters.search) {
        const searchLower = state.filters.search.toLowerCase()
        filtered = filtered.filter(cr =>
          cr.first_name.toLowerCase().includes(searchLower) ||
          cr.last_name.toLowerCase().includes(searchLower) ||
          cr.email.toLowerCase().includes(searchLower) ||
          cr.subject?.toLowerCase().includes(searchLower) ||
          cr.message.toLowerCase().includes(searchLower)
        )
      }

      // Apply status filter
      if (state.filters.status) {
        filtered = filtered.filter(cr => cr.status === state.filters.status)
      }

      // Apply date range filter
      if (state.filters.date_from) {
        filtered = filtered.filter(cr =>
          dayjs(cr.created_at).isAfter(dayjs(state.filters.date_from))
        )
      }

      if (state.filters.date_to) {
        filtered = filtered.filter(cr =>
          dayjs(cr.created_at).isBefore(dayjs(state.filters.date_to).endOf('day'))
        )
      }

      // Sort by created_at DESC (newest first)
      return filtered.sort((a, b) =>
        dayjs(b.created_at).unix() - dayjs(a.created_at).unix()
      )
    },

    newCount: (state) => {
      return state.statistics.new
    },

    pendingCount: (state) => {
      return state.statistics.new + state.statistics.inProgress
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

    setContactRequests(contactRequests: ContactRequest[]) {
      this.contactRequests = contactRequests
      this.updateStatistics()
    },

    setCurrentContactRequest(contactRequest: ContactRequest | null) {
      this.currentContactRequest = contactRequest
    },

    setFilters(filters: Partial<ContactRequestFilterInput>) {
      this.filters = { ...this.filters, ...filters }
    },

    resetFilters() {
      this.filters = {
        search: null,
        status: null,
        application_id: this.filters.application_id,
        date_from: null,
        date_to: null
      }
    },

    updateStatistics() {
      const today = dayjs().startOf('day')
      const weekStart = dayjs().startOf('week')

      this.statistics = {
        total: this.contactRequests.length,
        new: this.contactRequests.filter(cr => cr.status === 'NEW').length,
        inProgress: this.contactRequests.filter(cr => cr.status === 'IN_PROGRESS').length,
        resolved: this.contactRequests.filter(cr => cr.status === 'RESOLVED').length,
        today: this.contactRequests.filter(cr => dayjs(cr.created_at).isAfter(today)).length,
        thisWeek: this.contactRequests.filter(cr => dayjs(cr.created_at).isAfter(weekStart)).length
      }
    },

    // API Actions
    async fetchContactRequests() {
      this.setLoading(true)
      this.setError(null)

      try {
        const variables: any = {
          application_id: this.filters.application_id
        }

        // Only add status filter if it has a value
        if (this.filters.status) {
          variables.status = this.filters.status
        }

        const { data, error } = await useAsyncQuery<ContactRequestsResponse>(
          GET_CONTACT_REQUESTS,
          variables
        )

        if (error.value) {
          throw new Error(error.value.message || 'Failed to fetch contact requests')
        }

        if (data.value) {
          this.setContactRequests(data.value.contactRequests)
        }
      } catch (err: any) {
        console.error('Error fetching contact requests:', err)
        this.setError(err.message || 'Failed to load contact requests')
        // Set empty array on error
        this.setContactRequests([])
      } finally {
        this.setLoading(false)
      }
    },

    async fetchContactRequest(id: string) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { data, error } = await useAsyncQuery<ContactRequestResponse>(
          GET_CONTACT_REQUEST,
          { id }
        )

        if (error.value) {
          throw new Error(error.value.message || 'Failed to fetch contact request')
        }

        if (data.value?.contactRequest) {
          this.setCurrentContactRequest(data.value.contactRequest)
          return data.value.contactRequest
        }

        throw new Error('Contact request not found')
      } catch (err: any) {
        console.error('Error fetching contact request:', err)
        this.setError(err.message || 'Failed to load contact request')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async updateContactRequest(id: string, input: UpdateContactRequestInput) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        const response = await apolloClient.mutate<UpdateContactRequestResponse>({
          mutation: UPDATE_CONTACT_REQUEST,
          variables: { id, input }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.updateContactRequest) {
          // Update in local state
          const index = this.contactRequests.findIndex(cr => cr.id === id)
          if (index !== -1) {
            this.contactRequests[index] = response.data.updateContactRequest
          }

          // Update current contact request if it's the one being edited
          if (this.currentContactRequest?.id === id) {
            this.setCurrentContactRequest(response.data.updateContactRequest)
          }

          this.updateStatistics()
          return response.data.updateContactRequest
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        console.error('Error updating contact request:', err)
        this.setError(err.message || 'Failed to update contact request')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async deleteContactRequest(id: string) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        const response = await apolloClient.mutate<DeleteContactRequestResponse>({
          mutation: DELETE_CONTACT_REQUEST,
          variables: { id }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.deleteContactRequest) {
          // Remove from local state
          this.contactRequests = this.contactRequests.filter(cr => cr.id !== id)

          // Clear current contact request if it was deleted
          if (this.currentContactRequest?.id === id) {
            this.setCurrentContactRequest(null)
          }

          this.updateStatistics()
          return response.data.deleteContactRequest
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        console.error('Error deleting contact request:', err)
        this.setError(err.message || 'Failed to delete contact request')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async updateContactRequestStatus(id: string, status: ContactRequestStatus) {
      return await this.updateContactRequest(id, { status })
    },

    async bulkUpdateStatus(ids: string[], status: ContactRequestStatus) {
      const errors: string[] = []

      for (const id of ids) {
        try {
          await this.updateContactRequestStatus(id, status)
        } catch (err: any) {
          errors.push(`Failed to update contact request ${id}: ${err.message}`)
        }
      }

      if (errors.length > 0) {
        throw new Error(errors.join('\n'))
      }
    },

    async bulkDelete(ids: string[]) {
      const errors: string[] = []

      for (const id of ids) {
        try {
          await this.deleteContactRequest(id)
        } catch (err: any) {
          errors.push(`Failed to delete contact request ${id}: ${err.message}`)
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

    async applyStatusFilter(status: ContactRequestStatus | null) {
      this.setFilters({ status })
      // Optionally refetch from server with filter
      // await this.fetchContactRequests()
    },

    async applyDateRangeFilter(date_from: string | null, date_to: string | null) {
      this.setFilters({ date_from, date_to })
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
      await this.fetchContactRequests()
    }
  }
})
