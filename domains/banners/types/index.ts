import type { Application } from '~/domains/shared/types/application'

export interface Banner {
  id: string
  application_id: string
  title: string
  subtitle?: string | null
  image_url?: string | null
  cta_text?: string | null
  cta_url?: string | null
  order: number
  is_active: boolean
  created_at: string
  updated_at: string
  application?: Application
}

export interface CreateBannerInput {
  application_id: string
  title: string
  subtitle?: string | null
  image_url?: string | null
  cta_text?: string | null
  cta_url?: string | null
  order?: number | null
  is_active?: boolean | null
}

export interface UpdateBannerInput {
  title?: string | null
  subtitle?: string | null
  image_url?: string | null
  cta_text?: string | null
  cta_url?: string | null
  order?: number | null
  is_active?: boolean | null
}

export interface BannerFilterInput {
  search?: string | null
  is_active?: boolean | null
  application_id?: string
  hasCtaOnly?: boolean | null
}

export interface BannerStatistics {
  total: number
  active: number
  inactive: number
  withCta: number
  withoutCta: number
}

// GraphQL Response Types
export interface BannersResponse {
  banners: Banner[]
}

export interface BannerResponse {
  banner: Banner
}

export interface CreateBannerResponse {
  createBanner: Banner
}

export interface UpdateBannerResponse {
  updateBanner: Banner
}

export interface DeleteBannerResponse {
  deleteBanner: {
    success: boolean
    message: string
  }
}

// UI State Types
export interface BannerFormData extends CreateBannerInput {
  imageFile?: File | null
}
