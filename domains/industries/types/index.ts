export enum IndustryCategory {
  FINANCIAL_SERVICES = 'FINANCIAL_SERVICES',
  HEALTHCARE = 'HEALTHCARE',
  GOVERNMENT = 'GOVERNMENT',
  EDUCATION = 'EDUCATION',
  MANUFACTURING = 'MANUFACTURING',
  RETAIL = 'RETAIL',
  NGO = 'NGO'
}

export const INDUSTRY_CATEGORY_CONFIG: Record<IndustryCategory, { label: string; badgeClass: string; icon: string }> = {
  [IndustryCategory.FINANCIAL_SERVICES]: { label: 'Financial Services', badgeClass: 'badge-light-primary', icon: 'bi-bank' },
  [IndustryCategory.HEALTHCARE]: { label: 'Healthcare', badgeClass: 'badge-light-danger', icon: 'bi-heart-pulse' },
  [IndustryCategory.GOVERNMENT]: { label: 'Government', badgeClass: 'badge-light-dark', icon: 'bi-building' },
  [IndustryCategory.EDUCATION]: { label: 'Education', badgeClass: 'badge-light-info', icon: 'bi-mortarboard' },
  [IndustryCategory.MANUFACTURING]: { label: 'Manufacturing', badgeClass: 'badge-light-warning', icon: 'bi-gear' },
  [IndustryCategory.RETAIL]: { label: 'Retail', badgeClass: 'badge-light-success', icon: 'bi-cart' },
  [IndustryCategory.NGO]: { label: 'NGO', badgeClass: 'badge-light-secondary', icon: 'bi-globe' }
}

export interface Industry {
  id: string
  title: string
  description?: string | null
  short_description?: string | null
  icon?: string | null
  icon_color?: string | null
  category?: IndustryCategory | null
  slug: string
  order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateIndustryInput {
  title: string
  description?: string | null
  short_description?: string | null
  icon?: string | null
  icon_color?: string | null
  category?: IndustryCategory | null
  slug?: string | null
  order?: number | null
  is_active?: boolean | null
}

export interface UpdateIndustryInput {
  title?: string | null
  description?: string | null
  short_description?: string | null
  icon?: string | null
  icon_color?: string | null
  category?: IndustryCategory | null
  slug?: string | null
  order?: number | null
  is_active?: boolean | null
}

export interface IndustryFilterInput {
  search?: string | null
  is_active?: boolean | null
  category?: IndustryCategory | null
}

export interface IndustryStatistics {
  total: number
  active: number
  inactive: number
  byCategory: Record<string, number>
}

// GraphQL Response Types
export interface IndustriesResponse {
  industries: Industry[]
}

export interface IndustryResponse {
  industry: Industry
}

export interface CreateIndustryResponse {
  createIndustry: Industry
}

export interface UpdateIndustryResponse {
  updateIndustry: Industry
}

export interface DeleteIndustryResponse {
  deleteIndustry: {
    id: string
    success: boolean
    message: string
  }
}

// UI State Types
export interface IndustryFormData extends CreateIndustryInput {
  iconFile?: File | null
}
