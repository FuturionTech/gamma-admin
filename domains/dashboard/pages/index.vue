<template>
  <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
    <div class="d-flex flex-column flex-column-fluid">
      <div id="kt_app_content" class="app-content flex-column-fluid">
        <div id="kt_app_content_container" class="app-container container-fluid">

          <!-- Dashboard Header -->
          <div class="row mb-5">
            <div class="col-12">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h1 class="text-gray-900 fw-bold fs-2x mb-2">Dashboard</h1>
                  <div class="text-gray-500 fs-6">Gamma Neutral Content Management Overview</div>
                </div>
                <div>
                  <button
                    @click="refreshData"
                    class="btn btn-sm btn-light-primary"
                    :disabled="loading"
                  >
                    <i class="ki-duotone ki-arrows-circle fs-3">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                    Refresh
                  </button>
                </div>
              </div>
              <hr class="border-gray-300 my-6">
            </div>
          </div>

          <!-- Loading State -->
          <DashboardSkeleton v-if="loading && !counts" />

          <!-- Main Dashboard Content -->
          <template v-else-if="counts">
            <!-- Metric Cards Row 1 -->
            <div class="row g-5 g-xl-8 mb-5 mb-xl-10">
              <div class="col-xl-3 col-md-6">
                <MetricCard title="Services" :count="counts.services" color="#7239EA" link="/services/list" />
              </div>
              <div class="col-xl-3 col-md-6">
                <MetricCard title="Solutions" :count="counts.solutions" color="#17C653" link="/solutions/list" />
              </div>
              <div class="col-xl-3 col-md-6">
                <MetricCard title="Blog Posts" :count="counts.blogPosts" color="#009EF7" link="/blog/list" :subtitle="blogSubtitle" />
              </div>
              <div class="col-xl-3 col-md-6">
                <MetricCard title="Projects" :count="counts.projects" color="#F1416C" link="/projects/list" />
              </div>
            </div>

            <!-- Metric Cards Row 2 -->
            <div class="row g-5 g-xl-8 mb-5 mb-xl-10">
              <div class="col-xl-3 col-md-6">
                <MetricCard title="Team Members" :count="counts.team" color="#FFC700" link="/team/list" />
              </div>
              <div class="col-xl-3 col-md-6">
                <MetricCard title="Clients" :count="counts.clients" color="#7239EA" link="/clients" />
              </div>
              <div class="col-xl-3 col-md-6">
                <MetricCard title="Partners" :count="counts.partners" color="#17C653" link="/partners" />
              </div>
              <div class="col-xl-3 col-md-6">
                <MetricCard title="Contact Requests" :count="counts.contactRequests" color="#009EF7" link="/contact-requests" />
              </div>
            </div>

            <!-- Metric Cards Row 3 -->
            <div class="row g-5 g-xl-8 mb-5 mb-xl-10">
              <div class="col-xl-3 col-md-6">
                <MetricCard title="Testimonials" :count="counts.testimonials" color="#F1416C" link="/testimonials" />
              </div>
              <div class="col-xl-3 col-md-6">
                <MetricCard title="Certifications" :count="counts.certifications" color="#FFC700" link="/certifications" />
              </div>
              <div class="col-xl-3 col-md-6">
                <MetricCard title="FAQs" :count="counts.faqs" color="#7239EA" link="/faqs/list" />
              </div>
              <div class="col-xl-3 col-md-6">
                <MetricCard title="Job Positions" :count="counts.jobPositions" color="#17C653" link="/careers" :subtitle="jobSubtitle" />
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="row g-5 g-xl-8">
              <div class="col-12">
                <div class="card card-flush">
                  <div class="card-header pt-7">
                    <h3 class="card-title">
                      <span class="card-label fw-bold text-gray-800">Quick Actions</span>
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
import { computed, onMounted, onUnmounted } from 'vue'
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
  fetchDashboardData,
} = useDashboardData()

const blogSubtitle = computed(() => {
  if (!blogBreakdown.value) return ''
  return `${blogBreakdown.value.published} published, ${blogBreakdown.value.draft} draft`
})

const jobSubtitle = computed(() => {
  if (!jobBreakdown.value) return ''
  return `${jobBreakdown.value.active} open, ${jobBreakdown.value.closed} closed`
})

const refreshData = async () => {
  await fetchDashboardData()
}

let refreshInterval: NodeJS.Timeout | null = null

onMounted(async () => {
  await fetchDashboardData()
  refreshInterval = setInterval(() => fetchDashboardData(), 5 * 60 * 1000)
})

onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval)
})
</script>

<style scoped>
.hoverable {
  transition: all 0.3s ease;
}
.hoverable:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1.5rem 0.5rem rgba(0, 0, 0, 0.075);
}
</style>
