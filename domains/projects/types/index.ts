export enum ProjectStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED'
}

export interface Project {
  id: string
  title: string
  slug: string
  description?: string | null
  challenge: string
  solution: string
  results: string
  featured_image_url?: string | null
  gallery_images?: string[] | null
  client_name?: string | null
  industry?: string | null
  technologies?: string[] | null
  status: ProjectStatus
  completion_date?: string | null
  created_at: string
  updated_at: string
}

export interface CreateProjectInput {
  title: string
  slug?: string | null
  description?: string | null
  challenge: string
  solution: string
  results: string
  featured_image_url?: string | null
  gallery_images?: string[] | null
  client_name?: string | null
  industry?: string | null
  technologies?: string[] | null
  status?: ProjectStatus | null
  completion_date?: string | null
}

export interface UpdateProjectInput {
  title?: string | null
  slug?: string | null
  description?: string | null
  challenge?: string | null
  solution?: string | null
  results?: string | null
  featured_image_url?: string | null
  gallery_images?: string[] | null
  client_name?: string | null
  industry?: string | null
  technologies?: string[] | null
  status?: ProjectStatus | null
  completion_date?: string | null
}

export interface ProjectFilterInput {
  search?: string | null
  status?: ProjectStatus | null
  industry?: string | null
  completion_year?: number | null
}

export interface ProjectStatistics {
  total: number
  published: number
  drafts: number
  byIndustry: Record<string, number>
  recent: number // Projects completed in the last year
}

// GraphQL Response Types
export interface ProjectsResponse {
  projects: Project[]
}

export interface ProjectResponse {
  project: Project
}

export interface CreateProjectResponse {
  createProject: Project
}

export interface UpdateProjectResponse {
  updateProject: Project
}

export interface DeleteProjectResponse {
  deleteProject: {
    id: string
    success: boolean
    message: string
  }
}

// UI State Types
export interface ProjectFormData extends CreateProjectInput {
  featuredImageFile?: File | null
  galleryImageFiles?: File[] | null
}

// Common Industries
export const COMMON_INDUSTRIES = [
  'Finance',
  'Healthcare',
  'E-commerce',
  'Education',
  'Technology',
  'Manufacturing',
  'Retail',
  'Real Estate',
  'Transportation',
  'Media & Entertainment',
  'Government',
  'Non-Profit',
  'Energy',
  'Telecommunications',
  'Hospitality',
  'Other'
] as const

// Common Technologies
export const COMMON_TECHNOLOGIES = [
  // Frontend
  'React',
  'Vue',
  'Angular',
  'Nuxt',
  'Next.js',
  'Svelte',
  'TypeScript',
  'JavaScript',

  // Backend
  'Node.js',
  'Laravel',
  'Python',
  'Django',
  'FastAPI',
  'Express',
  'NestJS',
  'Ruby on Rails',
  'PHP',
  'Go',
  'Java',
  'Spring Boot',
  '.NET',

  // Cloud & Infrastructure
  'AWS',
  'Azure',
  'GCP',
  'Docker',
  'Kubernetes',
  'Terraform',
  'Vercel',
  'Netlify',

  // Databases
  'PostgreSQL',
  'MongoDB',
  'MySQL',
  'Redis',
  'Elasticsearch',
  'DynamoDB',
  'Supabase',
  'Firebase',

  // AI/ML
  'TensorFlow',
  'PyTorch',
  'OpenAI',
  'LangChain',
  'Hugging Face',

  // Mobile
  'React Native',
  'Flutter',
  'Swift',
  'Kotlin',

  // Other
  'GraphQL',
  'REST API',
  'Microservices',
  'WebSockets',
  'Stripe',
  'Shopify'
] as const

export type Industry = typeof COMMON_INDUSTRIES[number] | string
export type Technology = typeof COMMON_TECHNOLOGIES[number] | string
