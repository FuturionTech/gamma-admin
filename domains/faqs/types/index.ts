import type { Application } from '~/domains/shared/types/application'

export interface FAQ {
  id: string
  application_id: string
  question: string
  answer: string
  category?: string | null
  order: number
  is_active: boolean
  created_at: string
  updated_at: string
  application?: Application
}

export interface CreateFAQInput {
  application_id: string
  question: string
  answer: string
  category?: string | null
  order?: number | null
  is_active?: boolean | null
}

export interface UpdateFAQInput {
  question?: string | null
  answer?: string | null
  category?: string | null
  order?: number | null
  is_active?: boolean | null
}

export interface FAQFilterInput {
  search?: string | null
  is_active?: boolean | null
  category?: string | null
  application_id?: string
}

export interface FAQStatistics {
  total: number
  active: number
  inactive: number
  byCategory: Record<string, number>
  withoutCategory: number
}

// GraphQL Response Types
export interface FAQsResponse {
  faqs: FAQ[]
}

export interface FAQResponse {
  faq: FAQ
}

export interface CreateFAQResponse {
  createFAQ: FAQ
}

export interface UpdateFAQResponse {
  updateFAQ: FAQ
}

export interface DeleteFAQResponse {
  deleteFAQ: {
    id: string
    success: boolean
    message: string
  }
}

// UI State Types
export interface FAQFormData extends CreateFAQInput {
  // Additional UI-specific fields if needed
}

// Common FAQ Categories
export const FAQ_CATEGORIES = [
  'General',
  'Pricing',
  'Technical',
  'Support',
  'Services',
  'Security'
] as const

export type FAQCategory = typeof FAQ_CATEGORIES[number]
