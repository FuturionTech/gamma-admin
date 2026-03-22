<template>
  <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
    <div class="d-flex flex-column flex-column-fluid">
      <div id="kt_app_content" class="app-content flex-column-fluid">
        <div id="kt_app_content_container" class="app-container container-fluid">

          <!-- Loading State -->
          <DashboardSkeleton v-if="loading" />

          <!-- Error State -->
          <div v-else-if="error" class="alert alert-danger d-flex align-items-center p-5 mb-10">
            <i class="ki-duotone ki-shield-cross fs-2hx text-danger me-4">
              <span class="path1"></span><span class="path2"></span><span class="path3"></span>
            </i>
            <div>
              <h4 class="mb-1 text-dark">Dashboard Error</h4>
              <span>{{ error }}</span>
            </div>
          </div>

          <!-- Main Dashboard Content -->
          <template v-else-if="counts">
            <!-- Header -->
            <div class="row mb-5">
              <div class="col-12">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <div class="text-gray-500 fs-6">Gamma Neutral Consulting - Content Overview</div>
                  </div>
                </div>
                <hr class="border-gray-300 my-6">
              </div>
            </div>

            <!-- Key Metrics Row 1 -->
            <div class="row g-5 g-xl-8 mb-5 mb-xl-10">
              <div class="col-xl-3 col-md-6">
                <MetricCard title="Services" :count="counts.services" icon="ki-duotone ki-setting-2" color="#7239EA" link="/services/list" />
              </div>
              <div class="col-xl-3 col-md-6">
                <MetricCard title="Solutions" :count="counts.solutions" icon="ki-duotone ki-abstract-26" color="#17C653" link="/solutions/list" />
              </div>
              <div class="col-xl-3 col-md-6">
                <MetricCard title="Blog Posts" :count="counts.blogPosts" icon="ki-duotone ki-book" color="#009EF7" link="/blog/list" :subtitle="blogSubtitle" />
              </div>
              <div class="col-xl-3 col-md-6">
                <MetricCard title="Projects" :count="counts.projects" icon="ki-duotone ki-briefcase" color="#F1416C" link="/projects/list" />
              </div>
            </div>

            <!-- Key Metrics Row 2 -->
            <div class="row g-5 g-xl-8 mb-5 mb-xl-10">
              <div class="col-xl-3 col-md-6">
                <MetricCard title="Team Members" :count="counts.team" icon="ki-duotone ki-people" color="#FFC700" link="/team/list" />
              </div>
              <div class="col-xl-3 col-md-6">
                <MetricCard title="Clients" :count="counts.clients" icon="ki-duotone ki-user-tick" color="#7239EA" link="/clients" />
              </div>
              <div class="col-xl-3 col-md-6">
                <MetricCard title="Partners" :count="counts.partners" icon="ki-duotone ki-handshake" color="#17C653" link="/partners" />
              </div>
              <div class="col-xl-3 col-md-6">
                <MetricCard title="Contact Requests" :count="counts.contactRequests" icon="ki-duotone ki-sms" color="#009EF7" link="/contact-requests" :subtitle="contactSubtitle" />
              </div>
            </div>

            <!-- Key Metrics Row 3 -->
            <div class="row g-5 g-xl-8 mb-5 mb-xl-10">
              <div class="col-xl-3 col-md-6">
                <MetricCard title="Testimonials" :count="counts.testimonials" icon="ki-duotone ki-like" color="#F1416C" link="/testimonials" />
              </div>
              <div class="col-xl-3 col-md-6">
                <MetricCard title="Certifications" :count="counts.certifications" icon="ki-duotone ki-shield-tick" color="#FFC700" link="/certifications" />
              </div>
              <div class="col-xl-3 col-md-6">
                <MetricCard title="FAQs" :count="counts.faqs" icon="ki-duotone ki-question" color="#7239EA" link="/faqs/list" />
              </div>
              <div class="col-xl-3 col-md-6">
                <MetricCard title="Job Positions" :count="counts.jobPositions" icon="ki-duotone ki-rocket" color="#17C653" link="/careers" :subtitle="jobSubtitle" />
              </div>
            </div>

            <!-- Key Metrics Row 4 -->
            <div class="row g-5 g-xl-8 mb-5 mb-xl-10">
              <div class="col-xl-3 col-md-6">
                <MetricCard title="Industries" :count="counts.industries" icon="ki-duotone ki-bank" color="#50CD89" link="/industries" />
              </div>
              <div class="col-xl-3 col-md-6">
                <MetricCard title="Process Steps" :count="counts.processSteps" icon="ki-duotone ki-chart" color="#009EF7" link="/process-steps" />
              </div>
            </div>

            <!-- Recent Activity Row -->
            <div class="row g-5 g-xl-8 mb-5 mb-xl-10">
              <!-- Recent Contact Requests -->
              <div class="col-xl-6">
                <div class="card card-flush h-xl-100">
                  <div class="card-header pt-7">
                    <h3 class="card-title align-items-start flex-column">
                      <span class="card-label fw-bold text-gray-800">Recent Contact Requests</span>
                      <span class="text-gray-500 mt-1 fw-semibold fs-6">Latest inquiries</span>
                    </h3>
                    <div class="card-toolbar">
                      <NuxtLink to="/contact-requests" class="btn btn-sm btn-light-primary">View All</NuxtLink>
                    </div>
                  </div>
                  <div class="card-body pt-6">
                    <div v-if="recentContacts.length === 0" class="text-center text-muted py-10">
                      No contact requests yet
                    </div>
                    <div v-else>
                      <div
                        v-for="contact in recentContacts"
                        :key="contact.id"
                        class="d-flex align-items-center mb-7"
                      >
                        <div class="symbol symbol-45px me-5">
                          <span class="symbol-label bg-light-primary text-primary fw-bold fs-6">
                            {{ contact.first_name.charAt(0) }}{{ contact.last_name.charAt(0) }}
                          </span>
                        </div>
                        <div class="flex-grow-1">
                          <span class="text-gray-900 fw-bold d-block fs-6">
                            {{ contact.first_name }} {{ contact.last_name }}
                          </span>
                          <span class="text-gray-500 fw-semibold d-block fs-7">
                            {{ contact.subject || contact.email }}
                          </span>
                        </div>
                        <span
                          class="badge fs-8"
                          :class="contactStatusClass(contact.status)"
                        >
                          {{ contact.status }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Recent Blog Posts -->
              <div class="col-xl-6">
                <div class="card card-flush h-xl-100">
                  <div class="card-header pt-7">
                    <h3 class="card-title align-items-start flex-column">
                      <span class="card-label fw-bold text-gray-800">Recent Blog Posts</span>
                      <span class="text-gray-500 mt-1 fw-semibold fs-6">Latest articles</span>
                    </h3>
                    <div class="card-toolbar">
                      <NuxtLink to="/blog/list" class="btn btn-sm btn-light-primary">View All</NuxtLink>
                    </div>
                  </div>
                  <div class="card-body pt-6">
                    <div v-if="recentPosts.length === 0" class="text-center text-muted py-10">
                      No blog posts yet
                    </div>
                    <div v-else>
                      <div
                        v-for="post in recentPosts"
                        :key="post.id"
                        class="d-flex align-items-center mb-7"
                      >
                        <div class="symbol symbol-45px me-5">
                          <span class="symbol-label bg-light-info text-info fw-bold">
                            <i class="ki-duotone ki-book fs-3"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span></i>
                          </span>
                        </div>
                        <div class="flex-grow-1">
                          <NuxtLink :to="`/blog/edit/${post.id}`" class="text-gray-900 fw-bold d-block fs-6 text-hover-primary">
                            {{ post.title }}
                          </NuxtLink>
                          <span class="text-gray-500 fw-semibold d-block fs-7">
                            {{ post.view_count }} views
                          </span>
                        </div>
                        <span
                          class="badge fs-8"
                          :class="post.status === 'published' ? 'badge-light-success' : 'badge-light-warning'"
                        >
                          {{ post.status }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="row g-5 g-xl-8">
              <div class="col-12">
                <div class="card card-flush">
                  <div class="card-header pt-7">
                    <h3 class="card-title align-items-start flex-column">
                      <span class="card-label fw-bold text-gray-800">Quick Actions</span>
                      <span class="text-gray-500 mt-1 fw-semibold fs-6">Access to main sections</span>
                    </h3>
                  </div>
                  <div class="card-body pt-6">
                    <div class="row g-6">
                      <div class="col-lg-3 col-md-6">
                        <NuxtLink to="/blog/create" class="card bg-body hoverable card-xl-stretch mb-xl-8">
                          <div class="card-body">
                            <i class="ki-duotone ki-book text-primary fs-2x mb-4"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span></i>
                            <div class="text-gray-900 fw-bold fs-6 mb-2">New Blog Post</div>
                            <div class="text-gray-500 fs-7">Write a new article</div>
                          </div>
                        </NuxtLink>
                      </div>
                      <div class="col-lg-3 col-md-6">
                        <NuxtLink to="/projects/create" class="card bg-body hoverable card-xl-stretch mb-xl-8">
                          <div class="card-body">
                            <i class="ki-duotone ki-briefcase text-success fs-2x mb-4"><span class="path1"></span><span class="path2"></span></i>
                            <div class="text-gray-900 fw-bold fs-6 mb-2">New Project</div>
                            <div class="text-gray-500 fs-7">Add a case study</div>
                          </div>
                        </NuxtLink>
                      </div>
                      <div class="col-lg-3 col-md-6">
                        <NuxtLink to="/team/create" class="card bg-body hoverable card-xl-stretch mb-xl-8">
                          <div class="card-body">
                            <i class="ki-duotone ki-people text-warning fs-2x mb-4"><span class="path1"></span><span class="path2"></span></i>
                            <div class="text-gray-900 fw-bold fs-6 mb-2">Add Team Member</div>
                            <div class="text-gray-500 fs-7">Grow the team</div>
                          </div>
                        </NuxtLink>
                      </div>
                      <div class="col-lg-3 col-md-6">
                        <NuxtLink to="/contact-requests" class="card bg-body hoverable card-xl-stretch mb-xl-8">
                          <div class="card-body">
                            <i class="ki-duotone ki-sms text-danger fs-2x mb-4"><span class="path1"></span><span class="path2"></span></i>
                            <div class="text-gray-900 fw-bold fs-6 mb-2">Contact Requests</div>
                            <div class="text-gray-500 fs-7">View incoming inquiries</div>
                          </div>
                        </NuxtLink>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>

        </div>
      </div>
    </div>

    <!-- Footer -->
    <div id="kt_app_footer" class="app-footer">
      <div class="app-container container-fluid d-flex flex-column flex-md-row flex-center flex-md-stack py-3">
        <div class="text-gray-900 order-2 order-md-1">
          <span class="text-muted fw-semibold me-1">{{ currentYear }}&copy;</span>
          <a href="https://futurion.tech" target="_blank" class="text-gray-800 text-hover-primary">Futurion</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import { useDashboardData } from '../composables/useDashboardData'
import DashboardSkeleton from '../components/DashboardSkeleton.vue'
import MetricCard from '../components/metrics/MetricCard.vue'

definePageMeta({
  middleware: 'auth',
})

const breadcrumbStore = useBreadcrumbStore()
breadcrumbStore.setBreadcrumb([{ title: 'Dashboard', path: '/' }])

const currentYear = computed(() => new Date().getFullYear())

const {
  loading,
  error,
  counts,
  blogBreakdown,
  jobBreakdown,
  recentContacts,
  recentPosts,
  fetchDashboardData,
} = useDashboardData()

// Subtitles
const blogSubtitle = computed(() => {
  if (!blogBreakdown.value) return ''
  return `${blogBreakdown.value.published} published, ${blogBreakdown.value.draft} draft`
})

const jobSubtitle = computed(() => {
  if (!jobBreakdown.value) return ''
  return `${jobBreakdown.value.active} open, ${jobBreakdown.value.closed} closed`
})

const contactSubtitle = computed(() => {
  if (!recentContacts.value.length) return ''
  const newCount = recentContacts.value.filter(c => c.status === 'new').length
  return newCount > 0 ? `${newCount} new` : ''
})

const contactStatusClass = (status: string) => {
  const map: Record<string, string> = {
    new: 'badge-light-primary',
    in_progress: 'badge-light-warning',
    resolved: 'badge-light-success',
  }
  return map[status] || 'badge-light-secondary'
}

onMounted(async () => {
  await fetchDashboardData()
})
</script>
