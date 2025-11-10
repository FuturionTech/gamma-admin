import type { Application } from '~/domains/shared/types/application'

export interface CertificationCategory {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export interface Certification {
  id: string
  application_id: string
  title: string
  file_url: string
  certification_category_id: string
  issued_date?: string | null
  is_active: boolean
  created_at: string
  updated_at: string
  application?: Application
  category?: CertificationCategory
}

export interface CreateCertificationInput {
  application_id: string
  title: string
  file_url: string
  certification_category_id: string
  issued_date?: string | null
  is_active?: boolean | null
}

export interface UpdateCertificationInput {
  title?: string | null
  file_url?: string | null
  certification_category_id?: string | null
  issued_date?: string | null
  is_active?: boolean | null
}

export interface CertificationFilterInput {
  search?: string | null
  is_active?: boolean | null
  certification_category_id?: string | null
  application_id?: string
}

export interface CertificationStatistics {
  total: number
  active: number
  inactive: number
  byCategory: Record<string, number>
  recent: number // Certifications issued in the last year
}

export interface CreateCertificationCategoryInput {
  name: string
}

export interface UpdateCertificationCategoryInput {
  name?: string | null
}

// GraphQL Response Types
export interface CertificationsResponse {
  certifications: Certification[]
}

export interface CertificationResponse {
  certification: Certification
}

export interface CreateCertificationResponse {
  createCertification: Certification
}

export interface UpdateCertificationResponse {
  updateCertification: Certification
}

export interface DeleteCertificationResponse {
  deleteCertification: {
    id: string
    success: boolean
    message: string
  }
}

export interface CertificationCategoriesResponse {
  certificationCategories: CertificationCategory[]
}

export interface CertificationCategoryResponse {
  certificationCategory: CertificationCategory
}

export interface CreateCertificationCategoryResponse {
  createCertificationCategory: CertificationCategory
}

export interface UpdateCertificationCategoryResponse {
  updateCertificationCategory: CertificationCategory
}

export interface DeleteCertificationCategoryResponse {
  deleteCertificationCategory: {
    id: string
    success: boolean
    message: string
  }
}

// UI State Types
export interface CertificationFormData extends CreateCertificationInput {
  file?: File | null
}

export type FileType = 'pdf' | 'image'

export interface FilePreview {
  url: string
  type: FileType
  name: string
}
