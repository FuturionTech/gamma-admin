import type { Application } from '~/domains/shared/types/application'

export enum ContactRequestStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED'
}

export interface ContactRequest {
  id: string
  application_id: string
  first_name: string
  last_name: string
  email: string
  phone?: string | null
  subject?: string | null
  message: string
  status: ContactRequestStatus
  created_at: string
  updated_at: string
  application?: Application
}

export interface CreateContactRequestInput {
  application_id: string
  first_name: string
  last_name: string
  email: string
  phone?: string | null
  subject?: string | null
  message: string
}

export interface UpdateContactRequestInput {
  status?: ContactRequestStatus | null
}

export interface ContactRequestFilterInput {
  search?: string | null
  status?: ContactRequestStatus | null
  application_id?: string
  date_from?: string | null
  date_to?: string | null
}

export interface ContactRequestStatistics {
  total: number
  new: number
  inProgress: number
  resolved: number
  today: number
  thisWeek: number
}

// GraphQL Response Types
export interface ContactRequestsResponse {
  contactRequests: ContactRequest[]
}

export interface ContactRequestResponse {
  contactRequest: ContactRequest
}

export interface CreateContactRequestResponse {
  createContactRequest: ContactRequest
}

export interface UpdateContactRequestResponse {
  updateContactRequest: ContactRequest
}

export interface DeleteContactRequestResponse {
  deleteContactRequest: {
    id: string
    success: boolean
    message: string
  }
}

// UI State Types
export interface ContactRequestFormData extends CreateContactRequestInput {
  // Additional UI-specific fields if needed
}

// Status Badge Configuration
export const CONTACT_REQUEST_STATUS_CONFIG = {
  [ContactRequestStatus.NEW]: {
    label: 'New',
    badgeClass: 'badge-danger',
    icon: 'bi-exclamation-circle'
  },
  [ContactRequestStatus.IN_PROGRESS]: {
    label: 'In Progress',
    badgeClass: 'badge-warning',
    icon: 'bi-clock-history'
  },
  [ContactRequestStatus.RESOLVED]: {
    label: 'Resolved',
    badgeClass: 'badge-success',
    icon: 'bi-check-circle'
  }
} as const

// Status workflow transitions
export const STATUS_TRANSITIONS = {
  [ContactRequestStatus.NEW]: [ContactRequestStatus.IN_PROGRESS, ContactRequestStatus.RESOLVED],
  [ContactRequestStatus.IN_PROGRESS]: [ContactRequestStatus.RESOLVED],
  [ContactRequestStatus.RESOLVED]: []
} as const
