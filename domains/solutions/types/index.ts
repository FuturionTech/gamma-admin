import type { Application } from '~/domains/shared/types/application'

export interface SolutionFeature {
  id: string
  solution_id: string
  title: string
  description?: string | null
  icon?: string | null
  order: number
  created_at: string
  updated_at: string
}

export interface SolutionBenefit {
  id: string
  solution_id: string
  title: string
  description?: string | null
  icon?: string | null
  order: number
  created_at: string
  updated_at: string
}

export interface Solution {
  id: string
  application_id: string
  title: string
  subtitle?: string | null
  description?: string | null
  slug: string
  icon?: string | null
  icon_color?: string | null
  hero_image_url?: string | null
  order: number
  is_active: boolean
  created_at: string
  updated_at: string
  application?: Application
  features?: SolutionFeature[]
  benefits?: SolutionBenefit[]
}

export interface CreateSolutionInput {
  application_id: string
  title: string
  subtitle?: string | null
  description?: string | null
  slug?: string | null
  icon?: string | null
  icon_color?: string | null
  hero_image_url?: string | null
  order?: number | null
  is_active?: boolean | null
}

export interface UpdateSolutionInput {
  title?: string | null
  subtitle?: string | null
  description?: string | null
  slug?: string | null
  icon?: string | null
  icon_color?: string | null
  hero_image_url?: string | null
  order?: number | null
  is_active?: boolean | null
}

export interface SolutionFilterInput {
  search?: string | null
  is_active?: boolean | null
  application_id?: string
}

export interface SolutionStatistics {
  total: number
  active: number
  inactive: number
  totalFeatures: number
  totalBenefits: number
}

// GraphQL Response Types
export interface SolutionsResponse {
  solutions: Solution[]
}

export interface SolutionResponse {
  solution: Solution
}

export interface CreateSolutionResponse {
  createSolution: Solution
}

export interface UpdateSolutionResponse {
  updateSolution: Solution
}

export interface DeleteSolutionResponse {
  deleteSolution: {
    id: string
    success: boolean
    message: string
  }
}

// UI State Types
export interface SolutionFormData extends CreateSolutionInput {
  iconFile?: File | null
  heroImageFile?: File | null
}

// Feature Input Types
export interface CreateFeatureInput {
  solution_id: string
  title: string
  description?: string | null
  icon?: string | null
  order?: number | null
}

export interface UpdateFeatureInput {
  title?: string | null
  description?: string | null
  icon?: string | null
  order?: number | null
}

// Benefit Input Types
export interface CreateBenefitInput {
  solution_id: string
  title: string
  description?: string | null
  icon?: string | null
  order?: number | null
}

export interface UpdateBenefitInput {
  title?: string | null
  description?: string | null
  icon?: string | null
  order?: number | null
}

// GraphQL Response Types - Features
export interface FeaturesResponse {
  solutionFeatures: SolutionFeature[]
}

export interface FeatureResponse {
  solutionFeature: SolutionFeature
}

export interface CreateFeatureResponse {
  createSolutionFeature: SolutionFeature
}

export interface UpdateFeatureResponse {
  updateSolutionFeature: SolutionFeature
}

export interface DeleteFeatureResponse {
  deleteSolutionFeature: {
    id: string
    success: boolean
    message: string
  }
}

// GraphQL Response Types - Benefits
export interface BenefitsResponse {
  solutionBenefits: SolutionBenefit[]
}

export interface BenefitResponse {
  solutionBenefit: SolutionBenefit
}

export interface CreateBenefitResponse {
  createSolutionBenefit: SolutionBenefit
}

export interface UpdateBenefitResponse {
  updateSolutionBenefit: SolutionBenefit
}

export interface DeleteBenefitResponse {
  deleteSolutionBenefit: {
    id: string
    success: boolean
    message: string
  }
}

// UI Form Data Types
export interface FeatureFormData extends CreateFeatureInput {
  iconFile?: File | null
}

export interface BenefitFormData extends CreateBenefitInput {
  iconFile?: File | null
}
