export interface Partner {
  id: string
  name: string
  logo_url?: string | null
  website_url?: string | null
  order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreatePartnerInput {
  name: string
  logo_url?: string | null
  website_url?: string | null
  order?: number | null
  is_active?: boolean | null
}

export interface UpdatePartnerInput {
  name?: string | null
  logo_url?: string | null
  website_url?: string | null
  order?: number | null
  is_active?: boolean | null
}

export interface PartnerFilterInput {
  search?: string | null
  is_active?: boolean | null
}

export interface PartnerStatistics {
  total: number
  active: number
  inactive: number
}

// GraphQL Response Types
export interface PartnersResponse {
  partners: Partner[]
}

export interface PartnerResponse {
  partner: Partner
}

export interface CreatePartnerResponse {
  createPartner: Partner
}

export interface UpdatePartnerResponse {
  updatePartner: Partner
}

export interface DeletePartnerResponse {
  deletePartner: {
    id: string
    success: boolean
    message: string
  }
}

// UI State Types
export interface PartnerFormData extends CreatePartnerInput {
  logoFile?: File | null
}
