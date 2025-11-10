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
                  <div class="text-gray-500 fs-6">Gamma Neutral Content Management System Overview</div>
                </div>
                <div>
                  <button
                    @click="refreshData"
                    class="btn btn-sm btn-light-primary"
                    :disabled="loading"
                  >
                    <i class="ki-duotone ki-arrows-circle fs-3" :class="{ 'spinner-border-sm': loading }">
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
          <DashboardSkeleton v-if="loading && !dashboardData" />

          <!-- Main Dashboard Content -->
          <template v-else>
            <!-- Metric Cards Row 1 -->
            <div class="row g-5 g-xl-8 mb-5 mb-xl-10">
              <div class="col-xl-3 col-md-6">
                <ServicesMetricCard :metrics="dashboardData.services" />
              </div>
              <div class="col-xl-3 col-md-6">
                <SolutionsMetricCard :metrics="dashboardData.solutions" />
              </div>
              <div class="col-xl-3 col-md-6">
                <BlogMetricCard :metrics="dashboardData.blog" />
              </div>
              <div class="col-xl-3 col-md-6">
                <ProjectsMetricCard :metrics="dashboardData.projects" />
              </div>
            </div>

            <!-- Metric Cards Row 2 -->
            <div class="row g-5 g-xl-8 mb-5 mb-xl-10">
              <div class="col-xl-3 col-md-6">
                <TeamMetricCard :metrics="dashboardData.team" />
              </div>
              <div class="col-xl-3 col-md-6">
                <PartnersMetricCard :metrics="dashboardData.partners" />
              </div>
              <div class="col-xl-3 col-md-6">
                <ClientsMetricCard :metrics="dashboardData.clients" />
              </div>
              <div class="col-xl-3 col-md-6">
                <CertificationsMetricCard :metrics="dashboardData.certifications" />
              </div>
            </div>

            <!-- Metric Cards Row 3 -->
            <div class="row g-5 g-xl-8 mb-5 mb-xl-10">
              <div class="col-xl-3 col-md-6">
                <FAQsMetricCard :metrics="dashboardData.faqs" />
              </div>
              <div class="col-xl-3 col-md-6">
                <CareersMetricCard :metrics="dashboardData.careers" />
              </div>
              <div class="col-xl-3 col-md-6">
                <TestimonialsMetricCard :metrics="dashboardData.testimonials" />
              </div>
              <div class="col-xl-3 col-md-6">
                <StatsMetricCard :metrics="dashboardData.stats" />
              </div>
            </div>

            <!-- Widgets Row -->
            <div class="row g-5 g-xl-8 mb-5 mb-xl-10">
              <!-- Content Overview -->
              <div class="col-xl-4">
                <ContentOverviewWidget
                  :distribution="contentDistribution"
                  :loading="loading"
                />
              </div>

              <!-- Recent Activity -->
              <div class="col-xl-8">
                <RecentActivityWidget
                  :activities="recentActivity"
                  :loading="loading"
                  :limit="10"
                />
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="row g-5 g-xl-8">
              <div class="col-12">
                <QuickActionsWidget :dashboard-data="dashboardData" />
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
import { computed, onMounted, onUnmounted } from 'vue';
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore';
import { useDashboardData } from '../composables/useDashboardData';

// Import metric card components
import ServicesMetricCard from '../components/metrics/ServicesMetricCard.vue';
import SolutionsMetricCard from '../components/metrics/SolutionsMetricCard.vue';
import BlogMetricCard from '../components/metrics/BlogMetricCard.vue';
import ProjectsMetricCard from '../components/metrics/ProjectsMetricCard.vue';
import TeamMetricCard from '../components/metrics/TeamMetricCard.vue';
import PartnersMetricCard from '../components/metrics/PartnersMetricCard.vue';
import ClientsMetricCard from '../components/metrics/ClientsMetricCard.vue';
import CertificationsMetricCard from '../components/metrics/CertificationsMetricCard.vue';
import FAQsMetricCard from '../components/metrics/FAQsMetricCard.vue';
import CareersMetricCard from '../components/metrics/CareersMetricCard.vue';
import TestimonialsMetricCard from '../components/metrics/TestimonialsMetricCard.vue';
import StatsMetricCard from '../components/metrics/StatsMetricCard.vue';

// Import widget components
import ContentOverviewWidget from '../components/widgets/ContentOverviewWidget.vue';
import RecentActivityWidget from '../components/widgets/RecentActivityWidget.vue';
import QuickActionsWidget from '../components/widgets/QuickActionsWidget.vue';
import DashboardSkeleton from '../components/DashboardSkeleton.vue';

definePageMeta({
  middleware: 'auth',
});

const breadcrumbStore = useBreadcrumbStore();

// Dynamic copyright year
const currentYear = computed(() => new Date().getFullYear());

// Set breadcrumb
breadcrumbStore.setBreadcrumb([
  { title: 'Dashboard', path: '/' },
]);

// Use the dashboard data composable
const {
  loading,
  error,
  dashboardData,
  recentActivity,
  contentDistribution,
  fetchDashboardData,
} = useDashboardData();

// Refresh data function
const refreshData = async () => {
  await fetchDashboardData();
};

// Auto-refresh interval reference
let refreshInterval: NodeJS.Timeout | null = null;

// Initialize dashboard data on mount
onMounted(async () => {
  try {
    await fetchDashboardData();

    // Set up auto-refresh interval (5 minutes)
    refreshInterval = setInterval(() => {
      fetchDashboardData();
    }, 5 * 60 * 1000);

  } catch (err) {
    console.error('Dashboard initialization error:', err);
  }
});

// Cleanup interval on unmount
onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
});
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
