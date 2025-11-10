export interface Client {
  id: string
  name: string
  logo_url?: string | null
  industry?: string | null
  website_url?: string | null
  order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateClientInput {
  name: string
  logo_url?: string | null
  industry?: string | null
  website_url?: string | null
  order?: number | null
  is_active?: boolean | null
}

export interface UpdateClientInput {
  name?: string | null
  logo_url?: string | null
  industry?: string | null
  website_url?: string | null
  order?: number | null
  is_active?: boolean | null
}

export interface ClientFilterInput {
  search?: string | null
  is_active?: boolean | null
  industry?: string | null
}

export interface ClientStatistics {
  total: number
  active: number
  inactive: number
  byIndustry: Record<string, number>
}

// GraphQL Response Types
export interface ClientsResponse {
  clients: Client[]
}

export interface ClientResponse {
  client: Client
}

export interface CreateClientResponse {
  createClient: Client
}

export interface UpdateClientResponse {
  updateClient: Client
}

export interface DeleteClientResponse {
  deleteClient: {
    id: string
    success: boolean
    message: string
  }
}

// UI State Types
export interface ClientFormData extends CreateClientInput {
  logoFile?: File | null
}

// Industry options
export const INDUSTRIES = [
  'Finance',
  'Healthcare',
  'Education',
  'Retail',
  'Manufacturing',
  'Technology',
  'Energy',
  'Telecommunications',
  'Transportation',
  'Real Estate',
  'Government',
  'Other'
] as const

export type Industry = typeof INDUSTRIES[number]
