import { defineStore } from 'pinia'
import type {
  JobPosition,
  CreateJobPositionInput,
  UpdateJobPositionInput,
  JobPositionFilterInput,
  JobPositionStatistics,
  JobPositionsResponse,
  JobPositionResponse,
  CreateJobPositionResponse,
  UpdateJobPositionResponse,
  DeleteJobPositionResponse,
  JobType,
  JobStatus
} from '../types'
import { GET_JOB_POSITIONS, GET_JOB_POSITION } from '../graphql/queries'
import { CREATE_JOB_POSITION, UPDATE_JOB_POSITION, DELETE_JOB_POSITION } from '../graphql/mutations'

interface CareersState {
  jobPositions: JobPosition[]
  currentJobPosition: JobPosition | null
  loading: boolean
  error: string | null
  filters: JobPositionFilterInput
  statistics: JobPositionStatistics
}

export const useCareersStore = defineStore('careers', {
  state: (): CareersState => ({
    jobPositions: [],
    currentJobPosition: null,
    loading: false,
    error: null,
    filters: {
      search: null,
      status: null,
      job_type: null,
      department: null,
      is_remote: null,
      application_id: '1' // Default application ID - should be set from config
    },
    statistics: {
      total: 0,
      active: 0,
      closed: 0,
      remote: 0,
      byJobType: {} as Record<JobType, number>,
      byDepartment: {}
    }
  }),

  getters: {
    getJobPositionById: (state) => (id: string) => {
      return state.jobPositions.find(jp => jp.id === id)
    },

    hasJobPositions: (state) => state.jobPositions.length > 0,

    isLoading: (state) => state.loading,

    hasError: (state) => !!state.error,

    activeJobPositions: (state) => {
      return state.jobPositions.filter(jp => jp.status === 'ACTIVE')
    },

    closedJobPositions: (state) => {
      return state.jobPositions.filter(jp => jp.status === 'CLOSED')
    },

    remoteJobPositions: (state) => {
      return state.jobPositions.filter(jp => jp.is_remote)
    },

    jobPositionsByType: (state) => {
      return state.jobPositions.reduce((acc, jp) => {
        if (!acc[jp.job_type]) {
          acc[jp.job_type] = []
        }
        acc[jp.job_type].push(jp)
        return acc
      }, {} as Record<JobType, JobPosition[]>)
    },

    jobPositionsByDepartment: (state) => {
      return state.jobPositions.reduce((acc, jp) => {
        const dept = jp.department || 'Other'
        if (!acc[dept]) {
          acc[dept] = []
        }
        acc[dept].push(jp)
        return acc
      }, {} as Record<string, JobPosition[]>)
    },

    filteredJobPositions: (state) => {
      let filtered = [...state.jobPositions]

      // Apply search filter
      if (state.filters.search) {
        const searchLower = state.filters.search.toLowerCase()
        filtered = filtered.filter(jp =>
          jp.title.toLowerCase().includes(searchLower) ||
          jp.department?.toLowerCase().includes(searchLower) ||
          jp.location?.toLowerCase().includes(searchLower) ||
          jp.description.toLowerCase().includes(searchLower)
        )
      }

      // Apply status filter
      if (state.filters.status !== null && state.filters.status !== undefined) {
        filtered = filtered.filter(jp => jp.status === state.filters.status)
      }

      // Apply job type filter
      if (state.filters.job_type) {
        filtered = filtered.filter(jp => jp.job_type === state.filters.job_type)
      }

      // Apply department filter
      if (state.filters.department) {
        filtered = filtered.filter(jp => jp.department === state.filters.department)
      }

      // Apply remote filter
      if (state.filters.is_remote !== null && state.filters.is_remote !== undefined) {
        filtered = filtered.filter(jp => jp.is_remote === state.filters.is_remote)
      }

      return filtered
    },

    departments: (state) => {
      const depts = new Set(state.jobPositions.map(jp => jp.department).filter(Boolean))
      return Array.from(depts)
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

    setJobPositions(jobPositions: JobPosition[]) {
      this.jobPositions = jobPositions
      this.updateStatistics()
    },

    setCurrentJobPosition(jobPosition: JobPosition | null) {
      this.currentJobPosition = jobPosition
    },

    setFilters(filters: Partial<JobPositionFilterInput>) {
      this.filters = { ...this.filters, ...filters }
    },

    resetFilters() {
      this.filters = {
        search: null,
        status: null,
        job_type: null,
        department: null,
        is_remote: null,
        application_id: this.filters.application_id
      }
    },

    updateStatistics() {
      const byJobType = this.jobPositions.reduce((acc, jp) => {
        acc[jp.job_type] = (acc[jp.job_type] || 0) + 1
        return acc
      }, {} as Record<JobType, number>)

      const byDepartment = this.jobPositions.reduce((acc, jp) => {
        const dept = jp.department || 'Other'
        acc[dept] = (acc[dept] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      this.statistics = {
        total: this.jobPositions.length,
        active: this.jobPositions.filter(jp => jp.status === 'ACTIVE').length,
        closed: this.jobPositions.filter(jp => jp.status === 'CLOSED').length,
        remote: this.jobPositions.filter(jp => jp.is_remote).length,
        byJobType,
        byDepartment
      }
    },

    // API Actions
    async fetchJobPositions() {
      this.setLoading(true)
      this.setError(null)

      try {
        const variables: any = {
          application_id: this.filters.application_id
        }

        // Only add optional filters if they have values
        if (this.filters.status !== null && this.filters.status !== undefined) {
          variables.status = this.filters.status
        }

        if (this.filters.job_type) {
          variables.job_type = this.filters.job_type
        }

        if (this.filters.is_remote !== null && this.filters.is_remote !== undefined) {
          variables.is_remote = this.filters.is_remote
        }

        const { data, error } = await useAsyncQuery<JobPositionsResponse>(
          GET_JOB_POSITIONS,
          variables
        )

        if (error.value) {
          throw new Error(error.value.message || 'Failed to fetch job positions')
        }

        if (data.value) {
          this.setJobPositions(data.value.jobPositions)
        }
      } catch (err: any) {
        console.error('Error fetching job positions:', err)
        this.setError(err.message || 'Failed to load job positions')
        this.setJobPositions([])
      } finally {
        this.setLoading(false)
      }
    },

    async fetchJobPosition(id: string) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { data, error } = await useAsyncQuery<JobPositionResponse>(
          GET_JOB_POSITION,
          { id }
        )

        if (error.value) {
          throw new Error(error.value.message || 'Failed to fetch job position')
        }

        if (data.value) {
          this.setCurrentJobPosition(data.value.jobPosition)
          return data.value.jobPosition
        }
      } catch (err: any) {
        console.error('Error fetching job position:', err)
        this.setError(err.message || 'Failed to load job position')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async createJobPosition(input: CreateJobPositionInput) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        const response = await apolloClient.mutate<CreateJobPositionResponse>({
          mutation: CREATE_JOB_POSITION,
          variables: { input }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.createJobPosition) {
          await this.fetchJobPositions()
          return response.data.createJobPosition
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        console.error('Error creating job position:', err)
        this.setError(err.message || 'Failed to create job position')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async updateJobPosition(id: string, input: UpdateJobPositionInput) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        const response = await apolloClient.mutate<UpdateJobPositionResponse>({
          mutation: UPDATE_JOB_POSITION,
          variables: { id, input }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.updateJobPosition) {
          // Update in local state
          const index = this.jobPositions.findIndex(jp => jp.id === id)
          if (index !== -1) {
            this.jobPositions[index] = response.data.updateJobPosition
          }

          // Update current job position if it's the one being edited
          if (this.currentJobPosition?.id === id) {
            this.setCurrentJobPosition(response.data.updateJobPosition)
          }

          this.updateStatistics()
          return response.data.updateJobPosition
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        console.error('Error updating job position:', err)
        this.setError(err.message || 'Failed to update job position')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async deleteJobPosition(id: string) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        const response = await apolloClient.mutate<DeleteJobPositionResponse>({
          mutation: DELETE_JOB_POSITION,
          variables: { id }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.deleteJobPosition) {
          // Remove from local state
          this.jobPositions = this.jobPositions.filter(jp => jp.id !== id)

          // Clear current job position if it was deleted
          if (this.currentJobPosition?.id === id) {
            this.setCurrentJobPosition(null)
          }

          this.updateStatistics()
          return response.data.deleteJobPosition
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        console.error('Error deleting job position:', err)
        this.setError(err.message || 'Failed to delete job position')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async toggleJobPositionStatus(id: string) {
      const jobPosition = this.getJobPositionById(id)
      if (!jobPosition) {
        throw new Error('Job position not found')
      }

      const newStatus: JobStatus = jobPosition.status === 'ACTIVE' ? 'CLOSED' : 'ACTIVE'

      return await this.updateJobPosition(id, {
        status: newStatus
      })
    },

    async bulkDelete(ids: string[]) {
      const errors: string[] = []

      for (const id of ids) {
        try {
          await this.deleteJobPosition(id)
        } catch (err: any) {
          errors.push(`Failed to delete job position ${id}: ${err.message}`)
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

    async applyStatusFilter(status: JobStatus | null) {
      this.setFilters({ status })
    },

    async applyJobTypeFilter(job_type: JobType | null) {
      this.setFilters({ job_type })
    },

    async applyDepartmentFilter(department: string | null) {
      this.setFilters({ department })
    },

    async applyRemoteFilter(is_remote: boolean | null) {
      this.setFilters({ is_remote })
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
      await this.fetchJobPositions()
    }
  }
})
