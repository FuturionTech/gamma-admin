import type { Application } from '~/domains/shared/types/application'

export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published'
}

export interface BlogPost {
  id: string
  application_id: string
  title: string
  slug: string
  excerpt?: string | null
  content: string
  featured_image_url?: string | null
  author_id?: string | null
  category?: string | null
  tags?: string[] | null
  status: PostStatus
  published_at?: string | null
  view_count: number
  created_at: string
  updated_at: string
  application?: Application
  author?: {
    id: string
    first_name: string
    last_name: string
  } | null
}

export interface CreateBlogPostInput {
  application_id: string
  title: string
  slug?: string | null
  excerpt?: string | null
  content: string
  featured_image_url?: string | null
  author_id?: string | null
  category?: string | null
  tags?: string[] | null
  status?: PostStatus | null
  published_at?: string | null
}

export interface UpdateBlogPostInput {
  title?: string | null
  slug?: string | null
  excerpt?: string | null
  content?: string | null
  featured_image_url?: string | null
  author_id?: string | null
  category?: string | null
  tags?: string[] | null
  status?: PostStatus | null
  published_at?: string | null
}

export interface BlogPostFilterInput {
  search?: string | null
  status?: PostStatus | null
  category?: string | null
  author_id?: string | null
  application_id?: string
  dateFrom?: string | null
  dateTo?: string | null
}

export interface BlogPostStatistics {
  total: number
  published: number
  drafts: number
  totalViews: number
  mostViewed?: BlogPost | null
  byCategory: Record<string, number>
  byAuthor: Record<string, number>
}

// GraphQL Response Types
export interface BlogPostsResponse {
  blogPosts: BlogPost[]
}

export interface BlogPostResponse {
  blogPost: BlogPost
}

export interface CreateBlogPostResponse {
  createBlogPost: BlogPost
}

export interface UpdateBlogPostResponse {
  updateBlogPost: BlogPost
}

export interface DeleteBlogPostResponse {
  deleteBlogPost: {
    id: string
    success: boolean
    message: string
  }
}

// UI State Types
export interface BlogPostFormData extends CreateBlogPostInput {
  featuredImageFile?: File | null
}
