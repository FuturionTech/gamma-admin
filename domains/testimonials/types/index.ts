import type { Application } from '~/domains/shared/types/application'

export interface Testimonial {
  id: string
  application_id: string
  name: string
  content: string
  image_url?: string | null
  position?: string | null
  company?: string | null
  rating: number
  order: number
  is_active: boolean
  created_at: string
  updated_at: string
  application?: Application
}

export interface CreateTestimonialInput {
  application_id: string
  name: string
  content: string
  image_url?: string | null
  position?: string | null
  company?: string | null
  rating?: number | null
  order?: number | null
  is_active?: boolean | null
}

export interface UpdateTestimonialInput {
  name?: string | null
  content?: string | null
  image_url?: string | null
  position?: string | null
  company?: string | null
  rating?: number | null
  order?: number | null
  is_active?: boolean | null
}

export interface TestimonialFilterInput {
  search?: string | null
  is_active?: boolean | null
  rating?: number | null
  application_id?: string
}

export interface TestimonialStatistics {
  total: number
  active: number
  inactive: number
  averageRating: number
  byRating: Record<number, number>
}

// GraphQL Response Types
export interface TestimonialsResponse {
  testimonials: Testimonial[]
}

export interface TestimonialResponse {
  testimonial: Testimonial
}

export interface CreateTestimonialResponse {
  createTestimonial: Testimonial
}

export interface UpdateTestimonialResponse {
  updateTestimonial: Testimonial
}

export interface DeleteTestimonialResponse {
  deleteTestimonial: {
    id: string
    success: boolean
    message: string
  }
}

// UI State Types
export interface TestimonialFormData extends CreateTestimonialInput {
  imageFile?: File | null
}
