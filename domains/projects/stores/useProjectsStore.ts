import { defineStore } from 'pinia'
import type {
  Project,
  CreateProjectInput,
  UpdateProjectInput,
  ProjectFilterInput,
  ProjectStatistics,
  ProjectsResponse,
  ProjectResponse,
  CreateProjectResponse,
  UpdateProjectResponse,
  DeleteProjectResponse,
  ProjectStatus
} from '../types'
import { GET_PROJECTS, GET_PROJECT } from '../graphql/queries'
import { CREATE_PROJECT, UPDATE_PROJECT, DELETE_PROJECT } from '../graphql/mutations'

interface ProjectsState {
  projects: Project[]
  currentProject: Project | null
  loading: boolean
  error: string | null
  filters: ProjectFilterInput
  statistics: ProjectStatistics
}

export const useProjectsStore = defineStore('projects', {
  state: (): ProjectsState => ({
    projects: [],
    currentProject: null,
    loading: false,
    error: null,
    filters: {
      search: null,
      status: null,
      industry: null,
      completion_year: null,
      application_id: '1' // Default application ID - should be set from config
    },
    statistics: {
      total: 0,
      published: 0,
      drafts: 0,
      byIndustry: {},
      recent: 0
    }
  }),

  getters: {
    getProjectById: (state) => (id: string) => {
      return state.projects.find(p => p.id === id)
    },

    getProjectBySlug: (state) => (slug: string) => {
      return state.projects.find(p => p.slug === slug)
    },

    hasProjects: (state) => state.projects.length > 0,

    isLoading: (state) => state.loading,

    hasError: (state) => !!state.error,

    publishedProjects: (state) => {
      return state.projects.filter(p => p.status === 'PUBLISHED')
    },

    draftProjects: (state) => {
      return state.projects.filter(p => p.status === 'DRAFT')
    },

    projectsByIndustry: (state) => {
      return state.projects.reduce((acc, project) => {
        const industry = project.industry || 'Uncategorized'
        if (!acc[industry]) {
          acc[industry] = []
        }
        acc[industry].push(project)
        return acc
      }, {} as Record<string, Project[]>)
    },

    recentProjects: (state) => {
      const oneYearAgo = new Date()
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

      return state.projects.filter(p => {
        if (!p.completion_date) return false
        const completionDate = new Date(p.completion_date)
        return completionDate >= oneYearAgo
      })
    },

    filteredProjects: (state) => {
      let filtered = [...state.projects]

      // Apply search filter
      if (state.filters.search) {
        const searchLower = state.filters.search.toLowerCase()
        filtered = filtered.filter(p =>
          p.title.toLowerCase().includes(searchLower) ||
          p.description?.toLowerCase().includes(searchLower) ||
          p.client_name?.toLowerCase().includes(searchLower) ||
          p.industry?.toLowerCase().includes(searchLower) ||
          p.challenge.toLowerCase().includes(searchLower) ||
          p.solution.toLowerCase().includes(searchLower) ||
          p.slug.toLowerCase().includes(searchLower)
        )
      }

      // Apply status filter
      if (state.filters.status) {
        filtered = filtered.filter(p => p.status === state.filters.status)
      }

      // Apply industry filter
      if (state.filters.industry) {
        filtered = filtered.filter(p => p.industry === state.filters.industry)
      }

      // Apply completion year filter
      if (state.filters.completion_year) {
        filtered = filtered.filter(p => {
          if (!p.completion_date) return false
          const year = new Date(p.completion_date).getFullYear()
          return year === state.filters.completion_year
        })
      }

      return filtered
    },

    industries: (state) => {
      const inds = new Set(state.projects.map(p => p.industry).filter(Boolean))
      return Array.from(inds)
    },

    completionYears: (state) => {
      const years = new Set(
        state.projects
          .map(p => p.completion_date ? new Date(p.completion_date).getFullYear() : null)
          .filter(Boolean)
      )
      return Array.from(years).sort((a, b) => (b as number) - (a as number))
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

    setProjects(projects: Project[]) {
      this.projects = projects
      this.updateStatistics()
    },

    setCurrentProject(project: Project | null) {
      this.currentProject = project
    },

    setFilters(filters: Partial<ProjectFilterInput>) {
      this.filters = { ...this.filters, ...filters }
    },

    resetFilters() {
      this.filters = {
        search: null,
        status: null,
        industry: null,
        completion_year: null,
        application_id: this.filters.application_id
      }
    },

    updateStatistics() {
      const oneYearAgo = new Date()
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

      this.statistics = {
        total: this.projects.length,
        published: this.projects.filter(p => p.status === 'PUBLISHED').length,
        drafts: this.projects.filter(p => p.status === 'DRAFT').length,
        byIndustry: this.projects.reduce((acc, project) => {
          const industry = project.industry || 'Uncategorized'
          acc[industry] = (acc[industry] || 0) + 1
          return acc
        }, {} as Record<string, number>),
        recent: this.projects.filter(p => {
          if (!p.completion_date) return false
          const completionDate = new Date(p.completion_date)
          return completionDate >= oneYearAgo
        }).length
      }
    },

    // API Actions
    async fetchProjects() {
      this.setLoading(true)
      this.setError(null)

      try {
        const variables: any = {
          application_id: this.filters.application_id
        }

        // Only add optional filters if they have values
        if (this.filters.status) {
          variables.status = this.filters.status
        }

        if (this.filters.industry) {
          variables.industry = this.filters.industry
        }

        const { data, error } = await useAsyncQuery<ProjectsResponse>(
          GET_PROJECTS,
          variables
        )

        if (error.value) {
          throw new Error(error.value.message || 'Failed to fetch projects')
        }

        if (data.value) {
          this.setProjects(data.value.projects)
        }
      } catch (err: any) {
        console.error('Error fetching projects:', err)
        this.setError(err.message || 'Failed to load projects')
        // Set empty array on error
        this.setProjects([])
      } finally {
        this.setLoading(false)
      }
    },

    async fetchProject(id: string) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { data, error } = await useAsyncQuery<ProjectResponse>(
          GET_PROJECT,
          { id }
        )

        if (error.value) {
          throw new Error(error.value.message || 'Failed to fetch project')
        }

        if (data.value) {
          this.setCurrentProject(data.value.project)
          return data.value.project
        }
      } catch (err: any) {
        console.error('Error fetching project:', err)
        this.setError(err.message || 'Failed to load project')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async createProject(input: CreateProjectInput) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        const response = await apolloClient.mutate<CreateProjectResponse>({
          mutation: CREATE_PROJECT,
          variables: { input }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.createProject) {
          // Refresh the projects list
          await this.fetchProjects()
          return response.data.createProject
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        console.error('Error creating project:', err)
        this.setError(err.message || 'Failed to create project')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async updateProject(id: string, input: UpdateProjectInput) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        const response = await apolloClient.mutate<UpdateProjectResponse>({
          mutation: UPDATE_PROJECT,
          variables: { id, input }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.updateProject) {
          // Update in local state
          const index = this.projects.findIndex(p => p.id === id)
          if (index !== -1) {
            this.projects[index] = response.data.updateProject
          }

          // Update current project if it's the one being edited
          if (this.currentProject?.id === id) {
            this.setCurrentProject(response.data.updateProject)
          }

          this.updateStatistics()
          return response.data.updateProject
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        console.error('Error updating project:', err)
        this.setError(err.message || 'Failed to update project')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async deleteProject(id: string) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        const response = await apolloClient.mutate<DeleteProjectResponse>({
          mutation: DELETE_PROJECT,
          variables: { id }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.deleteProject) {
          // Remove from local state
          this.projects = this.projects.filter(p => p.id !== id)

          // Clear current project if it was deleted
          if (this.currentProject?.id === id) {
            this.setCurrentProject(null)
          }

          this.updateStatistics()
          return response.data.deleteProject
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        console.error('Error deleting project:', err)
        this.setError(err.message || 'Failed to delete project')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async bulkDelete(ids: string[]) {
      const errors: string[] = []

      for (const id of ids) {
        try {
          await this.deleteProject(id)
        } catch (err: any) {
          errors.push(`Failed to delete project ${id}: ${err.message}`)
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

    async applyStatusFilter(status: ProjectStatus | null) {
      this.setFilters({ status })
      // Optionally refetch from server with filter
      // await this.fetchProjects()
    },

    async applyIndustryFilter(industry: string | null) {
      this.setFilters({ industry })
      // Client-side filtering via getter
    },

    async applyCompletionYearFilter(year: number | null) {
      this.setFilters({ completion_year: year })
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
      await this.fetchProjects()
    }
  }
})
