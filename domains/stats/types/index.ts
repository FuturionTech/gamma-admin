import type { Application } from '~/domains/shared/types/application'

export interface Stat {
  id: string
  application_id: string
  label: string
  value: string
  unit?: string | null
  icon?: string | null
  order: number
  is_active: boolean
  created_at: string
  updated_at: string
  application?: Application
}

export interface CreateStatInput {
  application_id: string
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
  application_id?: string
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
  { value: '', label: 'Aucun' },
  { value: '+', label: '+' },
  { value: '%', label: '%' },
  { value: 'K', label: 'K (milliers)' },
  { value: 'M', label: 'M (millions)' },
  { value: 'B', label: 'B (milliards)' }
] as const

// Common icon options (FontAwesome classes)
export const STAT_ICON_OPTIONS = [
  { value: 'fa-users', label: 'Utilisateurs', class: 'fa-users' },
  { value: 'fa-smile', label: 'Satisfaction', class: 'fa-smile' },
  { value: 'fa-chart-line', label: 'Graphique', class: 'fa-chart-line' },
  { value: 'fa-trophy', label: 'Trophée', class: 'fa-trophy' },
  { value: 'fa-calendar', label: 'Calendrier', class: 'fa-calendar' },
  { value: 'fa-check-circle', label: 'Validation', class: 'fa-check-circle' },
  { value: 'fa-star', label: 'Étoile', class: 'fa-star' },
  { value: 'fa-thumbs-up', label: 'Pouce levé', class: 'fa-thumbs-up' },
  { value: 'fa-rocket', label: 'Fusée', class: 'fa-rocket' },
  { value: 'fa-award', label: 'Récompense', class: 'fa-award' },
  { value: 'fa-heart', label: 'Coeur', class: 'fa-heart' },
  { value: 'fa-briefcase', label: 'Porte-documents', class: 'fa-briefcase' },
  { value: 'fa-globe', label: 'Globe', class: 'fa-globe' },
  { value: 'fa-lightbulb', label: 'Ampoule', class: 'fa-lightbulb' },
  { value: 'fa-handshake', label: 'Poignée de main', class: 'fa-handshake' }
] as const
