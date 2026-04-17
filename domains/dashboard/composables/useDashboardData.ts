import { ref } from 'vue'
import type {
  ContentCounts,
  BlogBreakdown,
  JobBreakdown,
  ContactRequest,
  RecentBlogPost,
} from '../types'
import {
  GET_DASHBOARD_OVERVIEW,
  GET_RECENT_CONTACT_REQUESTS,
  GET_RECENT_BLOG_POSTS,
} from '../graphql/content-queries'

export const useDashboardData = () => {
  const loading = ref(true)
  const error = ref<string | null>(null)

  const counts = ref<ContentCounts | null>(null)
  const blogBreakdown = ref<BlogBreakdown | null>(null)
  const jobBreakdown = ref<JobBreakdown | null>(null)
  const recentContacts = ref<ContactRequest[]>([])
  const recentPosts = ref<RecentBlogPost[]>([])

  const fetchDashboardData = async () => {
    loading.value = true
    error.value = null

    const { $apollo } = useNuxtApp() as unknown as {
      $apollo: { defaultClient: { query: (opts: { query: unknown; fetchPolicy?: string }) => Promise<{ data: any; errors?: unknown[] }> } }
    }
    const client = $apollo.defaultClient

    try {
      const [overviewRes, contactsRes, postsRes] = await Promise.all([
        client.query({ query: GET_DASHBOARD_OVERVIEW, fetchPolicy: 'network-only' }),
        client.query({ query: GET_RECENT_CONTACT_REQUESTS, fetchPolicy: 'network-only' }),
        client.query({ query: GET_RECENT_BLOG_POSTS, fetchPolicy: 'network-only' }),
      ])

      const d = overviewRes?.data
      if (d) {
        const servicesList = d.services ?? []
        const solutionsList = d.solutions ?? []
        const blogList = d.blogPosts ?? []
        const teamData = d.teams?.data ?? []
        const partnerData = d.partners?.data ?? []
        const clientsList = d.clients ?? []
        const certData = d.certifications?.data ?? []
        const faqsList = d.faqs ?? []
        const testimData = d.testimonials?.data ?? []
        const contactsList = d.contactRequests ?? []
        const jobsList = d.jobPositions ?? []
        const industriesList = d.industries ?? []
        const processStepsList = d.processSteps ?? []

        counts.value = {
          services: servicesList.length,
          solutions: solutionsList.length,
          blogPosts: blogList.length,
          team: teamData.length,
          partners: partnerData.length,
          clients: clientsList.length,
          certifications: certData.length,
          faqs: faqsList.length,
          testimonials: testimData.length,
          contactRequests: contactsList.length,
          jobPositions: jobsList.length,
          industries: industriesList.length,
          processSteps: processStepsList.length,
        }

        const published = blogList.filter((p: any) => p.status === 'published').length
        const draft = blogList.filter((p: any) => p.status === 'draft').length
        const totalViews = blogList.reduce((s: number, p: any) => s + (p.view_count ?? 0), 0)
        blogBreakdown.value = { total: blogList.length, published, draft, totalViews }

        const activeJobs = jobsList.filter((j: any) => j.status === 'active').length
        const closedJobs = jobsList.filter((j: any) => j.status === 'closed').length
        jobBreakdown.value = { total: jobsList.length, active: activeJobs, closed: closedJobs }
      }

      recentContacts.value = contactsRes?.data?.contactRequests ?? []
      recentPosts.value = postsRes?.data?.blogPosts ?? []
    } catch (err: any) {
      error.value = err?.message || 'Failed to load dashboard data'
      // eslint-disable-next-line no-console
      console.error('[useDashboardData]', err)
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    counts,
    blogBreakdown,
    jobBreakdown,
    recentContacts,
    recentPosts,
    fetchDashboardData,
  }
}
