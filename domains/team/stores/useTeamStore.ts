import { defineStore } from 'pinia'
import type {
  Team,
  CreateTeamInput,
  UpdateTeamInput,
  TeamFilterInput,
  TeamStatistics,
  TeamsResponse,
  TeamResponse,
  CreateTeamResponse,
  UpdateTeamResponse,
  DeleteTeamResponse,
  SocialMediaPlatform,
  SocialMediaPlatformsResponse
} from '../types'
import { GET_TEAMS, GET_TEAM, GET_SOCIAL_MEDIA_PLATFORMS } from '../graphql/queries'
import { CREATE_TEAM, UPDATE_TEAM, DELETE_TEAM } from '../graphql/mutations'

interface TeamState {
  teams: Team[]
  currentTeam: Team | null
  socialMediaPlatforms: SocialMediaPlatform[]
  loading: boolean
  error: string | null
  filters: TeamFilterInput
  statistics: TeamStatistics
}

export const useTeamStore = defineStore('team', {
  state: (): TeamState => ({
    teams: [],
    currentTeam: null,
    socialMediaPlatforms: [],
    loading: false,
    error: null,
    filters: {
      search: null,
      is_active: null,
      role: null
    },
    statistics: {
      total: 0,
      active: 0,
      inactive: 0,
      byRole: {}
    }
  }),

  getters: {
    getTeamById: (state) => (id: string) => {
      return state.teams.find(t => t.id === id)
    },

    hasTeams: (state) => state.teams.length > 0,

    isLoading: (state) => state.loading,

    hasError: (state) => !!state.error,

    activeTeams: (state) => {
      return state.teams.filter(t => t.is_active)
    },

    inactiveTeams: (state) => {
      return state.teams.filter(t => !t.is_active)
    },

    teamsByRole: (state) => {
      return state.teams.reduce((acc, team) => {
        const role = team.role || 'Unassigned'
        if (!acc[role]) {
          acc[role] = []
        }
        acc[role].push(team)
        return acc
      }, {} as Record<string, Team[]>)
    },

    filteredTeams: (state) => {
      let filtered = [...state.teams]

      // Apply search filter
      if (state.filters.search) {
        const searchLower = state.filters.search.toLowerCase()
        filtered = filtered.filter(t =>
          t.name.toLowerCase().includes(searchLower) ||
          t.role?.toLowerCase().includes(searchLower) ||
          t.email?.toLowerCase().includes(searchLower) ||
          t.biography?.toLowerCase().includes(searchLower)
        )
      }

      // Apply active filter
      if (state.filters.is_active !== null && state.filters.is_active !== undefined) {
        filtered = filtered.filter(t => t.is_active === state.filters.is_active)
      }

      // Apply role filter
      if (state.filters.role) {
        filtered = filtered.filter(t => t.role === state.filters.role)
      }

      return filtered
    },

    roles: (state) => {
      const roleSet = new Set(state.teams.map(t => t.role).filter(Boolean))
      return Array.from(roleSet)
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

    setTeams(teams: Team[]) {
      this.teams = teams
      this.updateStatistics()
    },

    setCurrentTeam(team: Team | null) {
      this.currentTeam = team
    },

    setSocialMediaPlatforms(platforms: SocialMediaPlatform[]) {
      this.socialMediaPlatforms = platforms
    },

    setFilters(filters: Partial<TeamFilterInput>) {
      this.filters = { ...this.filters, ...filters }
    },

    resetFilters() {
      this.filters = {
        search: null,
        is_active: null,
        role: null
      }
    },

    updateStatistics() {
      this.statistics = {
        total: this.teams.length,
        active: this.teams.filter(t => t.is_active).length,
        inactive: this.teams.filter(t => !t.is_active).length,
        byRole: this.teams.reduce((acc, team) => {
          const role = team.role || 'Unassigned'
          acc[role] = (acc[role] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      }
    },

    // API Actions
    async fetchTeams() {
      this.setLoading(true)
      this.setError(null)

      try {
        const variables: any = {}

        // Only add optional filters if they have values
        if (this.filters.is_active !== null && this.filters.is_active !== undefined) {
          variables.is_active = this.filters.is_active
        }

        const { data, error } = await useAsyncQuery<TeamsResponse>(
          GET_TEAMS,
          variables
        )

        if (error.value) {
          throw new Error(error.value.message || 'Failed to fetch teams')
        }

        if (data.value) {
          this.setTeams(data.value.teams)
        }
      } catch (err: any) {
        this.setError(err.message || 'Failed to load teams')
        // Set empty array on error
        this.setTeams([])
      } finally {
        this.setLoading(false)
      }
    },

    async fetchTeam(id: string) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { data, error } = await useAsyncQuery<TeamResponse>(
          GET_TEAM,
          { id }
        )

        if (error.value) {
          throw new Error(error.value.message || 'Failed to fetch team')
        }

        if (data.value) {
          this.setCurrentTeam(data.value.team)
          return data.value.team
        }
      } catch (err: any) {
        this.setError(err.message || 'Failed to load team')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async fetchSocialMediaPlatforms() {
      // Default client-side catalog used until the backend exposes
      // a `socialMediaPlatforms` query. The `id` values double as icon
      // names and are stable strings that can be persisted alongside
      // the URL in the team social links table.
      const defaultPlatforms: SocialMediaPlatform[] = [
        { id: 'linkedin', name: 'LinkedIn', icon: 'linkedin', base_url: 'https://linkedin.com/in/', created_at: '', updated_at: '' },
        { id: 'twitter', name: 'X (Twitter)', icon: 'twitter', base_url: 'https://x.com/', created_at: '', updated_at: '' },
        { id: 'instagram', name: 'Instagram', icon: 'instagram', base_url: 'https://instagram.com/', created_at: '', updated_at: '' },
        { id: 'facebook', name: 'Facebook', icon: 'facebook', base_url: 'https://facebook.com/', created_at: '', updated_at: '' },
        { id: 'youtube', name: 'YouTube', icon: 'youtube', base_url: 'https://youtube.com/@', created_at: '', updated_at: '' },
        { id: 'github', name: 'GitHub', icon: 'github', base_url: 'https://github.com/', created_at: '', updated_at: '' },
        { id: 'dribbble', name: 'Dribbble', icon: 'dribbble', base_url: 'https://dribbble.com/', created_at: '', updated_at: '' },
        { id: 'figma', name: 'Figma', icon: 'figma', base_url: 'https://figma.com/@', created_at: '', updated_at: '' },
        { id: 'website', name: 'Website', icon: 'globe', base_url: 'https://', created_at: '', updated_at: '' },
      ]

      try {
        const { $apollo } = useNuxtApp() as unknown as {
          $apollo: { defaultClient: { query: (opts: { query: unknown; fetchPolicy?: string }) => Promise<{ data: SocialMediaPlatformsResponse | null; errors?: unknown[] }> } }
        }
        const response = await $apollo.defaultClient.query({
          query: GET_SOCIAL_MEDIA_PLATFORMS,
          fetchPolicy: 'network-only',
        })

        if (response.errors && response.errors.length > 0) {
          throw new Error('Failed to fetch social media platforms')
        }

        if (response.data?.socialMediaPlatforms && response.data.socialMediaPlatforms.length > 0) {
          this.setSocialMediaPlatforms(response.data.socialMediaPlatforms)
          return
        }

        // Empty backend response → fall through to defaults
        this.setSocialMediaPlatforms(defaultPlatforms)
      } catch {
        // Backend schema doesn't expose the query yet — use the client-side defaults
        this.setSocialMediaPlatforms(defaultPlatforms)
      }
    },

    async createTeam(input: CreateTeamInput) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.defaultClient

        const response = await apolloClient.mutate<CreateTeamResponse>({
          mutation: CREATE_TEAM,
          variables: { input }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.createTeam) {
          // Refresh the teams list
          await this.fetchTeams()
          return response.data.createTeam
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        this.setError(err.message || 'Failed to create team member')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async updateTeam(id: string, input: UpdateTeamInput) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.defaultClient

        const response = await apolloClient.mutate<UpdateTeamResponse>({
          mutation: UPDATE_TEAM,
          variables: { id, input }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.updateTeam) {
          // Update in local state
          const index = this.teams.findIndex(t => t.id === id)
          if (index !== -1) {
            this.teams[index] = response.data.updateTeam
          }

          // Update current team if it's the one being edited
          if (this.currentTeam?.id === id) {
            this.setCurrentTeam(response.data.updateTeam)
          }

          this.updateStatistics()
          return response.data.updateTeam
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        this.setError(err.message || 'Failed to update team member')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async deleteTeam(id: string) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.defaultClient

        const response = await apolloClient.mutate<DeleteTeamResponse>({
          mutation: DELETE_TEAM,
          variables: { id }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.deleteTeam) {
          // Remove from local state
          this.teams = this.teams.filter(t => t.id !== id)

          // Clear current team if it was deleted
          if (this.currentTeam?.id === id) {
            this.setCurrentTeam(null)
          }

          this.updateStatistics()
          return response.data.deleteTeam
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        this.setError(err.message || 'Failed to delete team member')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async toggleTeamStatus(id: string) {
      const team = this.getTeamById(id)
      if (!team) {
        throw new Error('Team member not found')
      }

      return await this.updateTeam(id, {
        is_active: !team.is_active
      })
    },

    async bulkDelete(ids: string[]) {
      const errors: string[] = []

      for (const id of ids) {
        try {
          await this.deleteTeam(id)
        } catch (err: any) {
          errors.push(`Failed to delete team member ${id}: ${err.message}`)
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
      // await this.fetchTeams()
    },

    async applyRoleFilter(role: string | null) {
      this.setFilters({ role })
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
      await Promise.all([
        this.fetchTeams(),
        this.fetchSocialMediaPlatforms()
      ])
    }
  }
})
