export interface Service {
  id: string
  title: string
  description?: string | null
  icon?: string | null
  category?: string | null
  slug: string
  order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateServiceInput {
  title: string
  description?: string | null
  icon?: string | null
  category?: string | null
  slug?: string | null
  order?: number | null
  is_active?: boolean | null
}

export interface UpdateServiceInput {
  title?: string | null
  description?: string | null
  icon?: string | null
  category?: string | null
  slug?: string | null
  order?: number | null
  is_active?: boolean | null
}

export interface ServiceFilterInput {
  search?: string | null
  is_active?: boolean | null
  category?: string | null
}

export interface ServiceStatistics {
  total: number
  active: number
  inactive: number
  byCategory: Record<string, number>
}

// GraphQL Response Types
export interface ServicesResponse {
  services: Service[]
}

export interface ServiceResponse {
  service: Service
}

export interface CreateServiceResponse {
  createService: Service
}

export interface UpdateServiceResponse {
  updateService: Service
}

export interface DeleteServiceResponse {
  deleteService: {
    id: string
    success: boolean
    message: string
  }
}

// UI State Types
export interface ServiceFormData extends CreateServiceInput {
  iconFile?: File | null
}
