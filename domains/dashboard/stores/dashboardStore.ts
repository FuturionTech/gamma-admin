import { defineStore } from 'pinia'
import type {
  DashboardState,
  ContentCounts,
  BlogBreakdown,
  JobBreakdown,
  ContactRequest,
  RecentBlogPost,
} from '../types'

export const useDashboardStore = defineStore('dashboard', {
  state: (): DashboardState => ({
    counts: null,
    blogBreakdown: null,
    jobBreakdown: null,
    recentContacts: [],
    recentPosts: [],
    loading: false,
    error: null,
  }),

  getters: {
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    totalContent: (state): number => {
      if (!state.counts) return 0
      const c = state.counts
      return (
        c.services +
        c.solutions +
        c.blogPosts +
        c.team +
        c.partners +
        c.clients +
        c.certifications +
        c.faqs +
        c.testimonials +
        c.contactRequests +
        c.jobPositions
      )
    },
  },

  actions: {
    setCounts(counts: ContentCounts) {
      this.counts = counts
    },
    setBlogBreakdown(breakdown: BlogBreakdown) {
      this.blogBreakdown = breakdown
    },
    setJobBreakdown(breakdown: JobBreakdown) {
      this.jobBreakdown = breakdown
    },
    setRecentContacts(contacts: ContactRequest[]) {
      this.recentContacts = contacts
    },
    setRecentPosts(posts: RecentBlogPost[]) {
      this.recentPosts = posts
    },
    setLoading(loading: boolean) {
      this.loading = loading
    },
    setError(error: string | null) {
      this.error = error
    },
  },
})
