export interface Stat {
  id: string

  label: string
  value: string
  unit?: string | null
  icon?: string | null
  order: number
  is_active: boolean
  created_at: string
  updated_at: string

}

export interface CreateStatInput {

  label: string
  value: string
  unit?: string | null
  icon?: string | null
  order?: number | null
  is_active?: boolean | null
}

export interface UpdateStatInput {
  label?: string | null
  value?: string | null
  unit?: string | null
  icon?: string | null
  order?: number | null
  is_active?: boolean | null
}

export interface StatFilterInput {
  search?: string | null
  is_active?: boolean | null

}

export interface StatStatistics {
  total: number
  active: number
  inactive: number
}

// GraphQL Response Types
export interface StatsResponse {
  stats: Stat[]
}

export interface StatResponse {
  stat: Stat
}

export interface CreateStatResponse {
  createStat: Stat
}

export interface UpdateStatResponse {
  updateStat: Stat
}

export interface DeleteStatResponse {
  deleteStat: {
    id: string
    success: boolean
    message: string
  }
}

// UI State Types
export interface StatFormData extends CreateStatInput {
  // Add any UI-specific fields here
}

// Common unit options
export const STAT_UNIT_OPTIONS = [
  { value: '', label: 'None' },
  { value: '+', label: '+' },
  { value: '%', label: '%' },
  { value: 'K', label: 'K (thousands)' },
  { value: 'M', label: 'M (millions)' },
  { value: 'B', label: 'B (billions)' }
] as const

// Common icon options (FontAwesome classes)
export const STAT_ICON_OPTIONS = [
  { value: 'fa-users', label: 'Users', class: 'fa-users' },
  { value: 'fa-smile', label: 'Satisfaction', class: 'fa-smile' },
  { value: 'fa-chart-line', label: 'Chart', class: 'fa-chart-line' },
  { value: 'fa-trophy', label: 'Trophy', class: 'fa-trophy' },
  { value: 'fa-calendar', label: 'Calendar', class: 'fa-calendar' },
  { value: 'fa-check-circle', label: 'Check', class: 'fa-check-circle' },
  { value: 'fa-star', label: 'Star', class: 'fa-star' },
  { value: 'fa-thumbs-up', label: 'Thumbs up', class: 'fa-thumbs-up' },
  { value: 'fa-rocket', label: 'Rocket', class: 'fa-rocket' },
  { value: 'fa-award', label: 'Award', class: 'fa-award' },
  { value: 'fa-heart', label: 'Heart', class: 'fa-heart' },
  { value: 'fa-briefcase', label: 'Briefcase', class: 'fa-briefcase' },
  { value: 'fa-globe', label: 'Globe', class: 'fa-globe' },
  { value: 'fa-lightbulb', label: 'Lightbulb', class: 'fa-lightbulb' },
  { value: 'fa-handshake', label: 'Handshake', class: 'fa-handshake' }
] as const
