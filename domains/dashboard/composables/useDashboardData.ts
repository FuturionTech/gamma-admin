import { ref } from 'vue'
import { useLazyAsyncQuery } from '#imports'
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

    try {
      // Fetch overview counts
      const { data: overviewData, error: overviewError } =
        await useLazyAsyncQuery(GET_DASHBOARD_OVERVIEW)

      if (overviewError.value) {
        throw new Error(overviewError.value.message)
      }

      const d = overviewData.value
      if (d) {
        const servicesList = d.services ?? []
        const solutionsList = d.solutions ?? []
        const blogList = d.blogPosts ?? []
        const projectsList = d.projects ?? []
        const teamData = d.teams?.data ?? []
        const partnerData = d.partners?.data ?? []
        const clientsList = d.clients ?? []
        const certData = d.certifications?.data ?? []
        const faqsList = d.faqs ?? []
        const testimData = d.testimonials?.data ?? []
        const statsList = d.stats ?? []
        const contactsList = d.contactRequests ?? []
        const jobsList = d.jobPositions ?? []
        const industriesList = d.industries ?? []
        const processStepsList = d.processSteps ?? []

        counts.value = {
          services: servicesList.length,
          solutions: solutionsList.length,
          blogPosts: blogList.length,
          projects: projectsList.length,
          team: teamData.length,
          partners: partnerData.length,
          clients: clientsList.length,
          certifications: certData.length,
          faqs: faqsList.length,
          testimonials: testimData.length,
          stats: statsList.length,
          contactRequests: contactsList.length,
          jobPositions: jobsList.length,
          industries: industriesList.length,
          processSteps: processStepsList.length,
        }

        // Blog breakdown
        const published = blogList.filter((p: any) => p.status === 'published').length
        const draft = blogList.filter((p: any) => p.status === 'draft').length
        const totalViews = blogList.reduce((s: number, p: any) => s + (p.view_count ?? 0), 0)
        blogBreakdown.value = { total: blogList.length, published, draft, totalViews }

        // Job breakdown
        const activeJobs = jobsList.filter((j: any) => j.status === 'active').length
        const closedJobs = jobsList.filter((j: any) => j.status === 'closed').length
        jobBreakdown.value = { total: jobsList.length, active: activeJobs, closed: closedJobs }
      }

      // Fetch recent contacts
      const { data: contactData } = await useLazyAsyncQuery(GET_RECENT_CONTACT_REQUESTS)
      if (contactData.value?.contactRequests) {
        recentContacts.value = contactData.value.contactRequests
      }

      // Fetch recent blog posts
      const { data: blogData } = await useLazyAsyncQuery(GET_RECENT_BLOG_POSTS)
      if (blogData.value?.blogPosts) {
        recentPosts.value = blogData.value.blogPosts
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to load dashboard data'
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
