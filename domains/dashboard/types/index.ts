/** Types that match the real gamma-api schema */

export interface ContentCounts {
  services: number
  solutions: number
  blogPosts: number
  projects: number
  team: number
  partners: number
  clients: number
  certifications: number
  faqs: number
  testimonials: number
  stats: number
  contactRequests: number
  jobPositions: number
}

export interface BlogBreakdown {
  total: number
  published: number
  draft: number
  totalViews: number
}

export interface JobBreakdown {
  total: number
  active: number
  closed: number
}

export interface ContactRequest {
  id: string
  first_name: string
  last_name: string
  email: string
  subject: string | null
  status: string
  created_at: string
}

export interface RecentBlogPost {
  id: string
  title: string
  slug: string
  status: string
  view_count: number
  created_at: string
}

export interface DashboardState {
  counts: ContentCounts | null
  blogBreakdown: BlogBreakdown | null
  jobBreakdown: JobBreakdown | null
  recentContacts: ContactRequest[]
  recentPosts: RecentBlogPost[]
  loading: boolean
  error: string | null
}

// Keep minimal legacy types that are still referenced by unused components
// (allows a clean build even if some widget files still exist)
export type ActivityType =
  | 'contact_request'
  | 'blog_post'
  | 'project'
  | 'team_member'

export type ActivityStatus = 'completed' | 'in_progress' | 'pending'

export interface RecentActivity {
  type: ActivityType
  title: string
  description: string
  status: ActivityStatus
  timestamp: string
}
