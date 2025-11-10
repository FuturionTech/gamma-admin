<template>
  <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
    <!--begin::Content wrapper-->
    <div class="d-flex flex-column flex-column-fluid">
      <!--begin::Content-->
      <div id="kt_app_content" class="app-content flex-column-fluid">
        <!--begin::Content container-->
        <div id="kt_app_content_container" class="app-container container-fluid">
          
          <!-- Loading State -->
          <DashboardSkeleton v-if="isLoading" />
          
          <!-- Main Dashboard Content -->
          <template v-else>
            <!-- Dashboard Header -->
            <div class="row mb-5">
              <div class="col-12">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <div class="text-gray-500 fs-6">Gamma Neutral Consulting - Site Analytics Overview</div>
                  </div>
                </div>
                <hr class="border-gray-300 my-6">
              </div>
            </div>

            <!-- Key Metrics Cards -->
            <div class="row g-5 g-xl-8 mb-5 mb-xl-10">
              <!-- Total Visitors -->
              <div class="col-xl-3 col-md-6">
                <div class="card card-flush bgi-no-repeat bgi-size-contain bgi-position-x-end h-xl-100"
                     style="background-color: #7239EA; background-image: url('/assets/media/svg/shapes/wave-bg-purple.svg')">
                  <div class="card-header pt-5">
                    <div class="card-title d-flex flex-column">
                      <span class="fs-2hx fw-bold text-white me-2 lh-1 ls-n2">
                        {{ formatNumber(visitorsThisMonth) }}
                      </span>
                      <span class="text-white opacity-75 pt-1 fw-semibold fs-6">Total Visitors</span>
                    </div>
                  </div>
                  <div class="card-body d-flex align-items-end pt-0">
                    <div class="d-flex align-items-center flex-column mt-3 w-100">
                      <div class="d-flex justify-content-between fw-bold fs-6 text-white opacity-75 w-100 mt-auto mb-2">
                        <span>Growth</span>
                        <span class="d-flex align-items-center">
                          <i class="ki-duotone ki-arrow-up fs-3 me-1" v-if="organizationGrowth.trend === 'up'">
                            <span class="path1"></span><span class="path2"></span>
                          </i>
                          {{ organizationGrowth.percentage.toFixed(1) }}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Page Views -->
              <div class="col-xl-3 col-md-6">
                <div class="card card-flush bgi-no-repeat bgi-size-contain bgi-position-x-end h-xl-100"
                     style="background-color: #17C653; background-image: url('/assets/media/svg/shapes/wave-bg-green.svg')">
                  <div class="card-header pt-5">
                    <div class="card-title d-flex flex-column">
                      <span class="fs-2hx fw-bold text-white me-2 lh-1 ls-n2">
                        {{ formatNumber(pageViewsThisMonth) }}
                      </span>
                      <span class="text-white opacity-75 pt-1 fw-semibold fs-6">Page Views</span>
                    </div>
                  </div>
                  <div class="card-body d-flex align-items-end pt-0">
                    <div class="d-flex align-items-center flex-column mt-3 w-100">
                      <div class="d-flex justify-content-between fw-bold fs-6 text-white opacity-75 w-100 mt-auto mb-2">
                        <span>Growth</span>
                        <span class="d-flex align-items-center">
                          <i class="ki-duotone ki-arrow-up fs-3 me-1" v-if="tenantGrowth.trend === 'up'">
                            <span class="path1"></span><span class="path2"></span>
                          </i>
                          {{ tenantGrowth.percentage.toFixed(1) }}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Bounce Rate -->
              <div class="col-xl-3 col-md-6">
                <div class="card card-flush bgi-no-repeat bgi-size-contain bgi-position-x-end h-xl-100"
                     style="background-color: #F1416C; background-image: url('/assets/media/svg/shapes/wave-bg-red.svg')">
                  <div class="card-header pt-5">
                    <div class="card-title d-flex flex-column">
                      <span class="fs-2hx fw-bold text-white me-2 lh-1 ls-n2">
                        {{ (dashboardStore.getTotalApplications / 100).toFixed(1) }}%
                      </span>
                      <span class="text-white opacity-75 pt-1 fw-semibold fs-6">Bounce Rate</span>
                    </div>
                  </div>
                  <div class="card-body d-flex align-items-end pt-0">
                    <div class="d-flex align-items-center flex-column mt-3 w-100">
                      <div class="d-flex justify-content-between fw-bold fs-6 text-white opacity-75 w-100 mt-auto mb-2">
                        <span>Change</span>
                        <span class="d-flex align-items-center">
                          <i class="ki-duotone ki-arrow-up fs-3 me-1" v-if="applicationGrowth.trend === 'up'">
                            <span class="path1"></span><span class="path2"></span>
                          </i>
                          {{ applicationGrowth.percentage.toFixed(1) }}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Avg Session Duration -->
              <div class="col-xl-3 col-md-6">
                <div class="card card-flush bgi-no-repeat bgi-size-contain bgi-position-x-end h-xl-100"
                     style="background-color: #FFC700; background-image: url('/assets/media/svg/shapes/wave-bg-yellow.svg')">
                  <div class="card-header pt-5">
                    <div class="card-title d-flex flex-column">
                      <span class="fs-2hx fw-bold text-white me-2 lh-1 ls-n2">
                        {{ (totalSubscriptions / 60).toFixed(1) }}m
                      </span>
                      <span class="text-white opacity-75 pt-1 fw-semibold fs-6">Avg Session</span>
                    </div>
                  </div>
                  <div class="card-body d-flex align-items-end pt-0">
                    <div class="d-flex align-items-center flex-column mt-3 w-100">
                      <div class="d-flex justify-content-between fw-bold fs-6 text-white opacity-75 w-100 mt-auto mb-2">
                        <span>Change</span>
                        <span class="d-flex align-items-center">
                          <i class="ki-duotone ki-arrow-up fs-3 me-1" v-if="subscriptionGrowth.trend === 'up'">
                            <span class="path1"></span><span class="path2"></span>
                          </i>
                          {{ subscriptionGrowth.percentage.toFixed(1) }}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Enhanced Revenue Analytics Section -->
            <RevenueAnalytics 
              :platform-statistics="platformStatistics"
              :is-loading="isLoading"
              :selected-currency="selectedCurrency"
            />

            <!-- Geographic Distribution and System Health Row -->
            <div class="row g-5 g-xl-8 mb-5 mb-xl-10">
              <!-- Geographic Distribution -->
              <div class="col-xl-6">
                <GeographicDistribution 
                  :top-countries="platformStatistics?.topCountries || []"
                  :is-loading="isLoading"
                />
              </div>

              <!-- System Health Card -->
              <div class="col-xl-6">
                <div class="card card-flush h-xl-100">
                  <div class="card-header pt-7">
                    <h3 class="card-title align-items-start flex-column">
                      <span class="card-label fw-bold text-gray-800">Site Performance</span>
                      <span class="text-gray-500 mt-1 fw-semibold fs-6">Service status</span>
                    </h3>
                  </div>
                  <div class="card-body pt-6">
                    <!-- Overall Score -->
                    <div class="d-flex align-items-center mb-7">
                      <div class="symbol symbol-45px me-5">
                        <span class="symbol-label bg-light-success text-success fw-bold fs-6">
                          {{ systemHealthScore }}%
                        </span>
                      </div>
                      <div class="flex-grow-1">
                        <span class="text-gray-900 fs-6 fw-bold">Overall Score</span>
                        <div class="progress h-6px bg-light mt-2">
                          <div class="progress-bar bg-success"
                               :style="`width: ${systemHealthScore}%`"></div>
                        </div>
                      </div>
                    </div>

                    <!-- Service Status -->
                    <div class="d-flex flex-stack fs-6">
                      <div class="text-gray-700 fw-semibold">Services</div>
                      <div class="d-flex">
                        <span class="badge badge-light-success me-2">Website</span>
                        <span class="badge badge-light-success me-2">API</span>
                        <span class="badge badge-light-success">Database</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Analytics & Activity Row -->
            <div class="row g-5 g-xl-8 mb-5 mb-xl-10">
              <!-- Analytics Chart -->
              <div class="col-xl-8">
                <div class="card card-flush h-xl-100">
                  <div class="card-header pt-7">
                    <h3 class="card-title align-items-start flex-column">
                      <span class="card-label fw-bold text-gray-800">Traffic Analytics</span>
                      <span class="text-gray-500 mt-1 fw-semibold fs-6">Visitors and page views</span>
                    </h3>
                  </div>
                  <div class="card-body pt-6">
                    <!-- Visitor Stats -->
                    <div class="row mb-7">
                      <div class="col-6">
                        <div class="border border-gray-300 border-dashed rounded p-6">
                          <span class="fs-2hx fw-bold text-gray-900">{{ formatNumber(visitorsThisMonth) }}</span>
                          <span class="d-block text-gray-500 fw-semibold fs-6 mt-2">Visitors this month</span>
                        </div>
                      </div>
                      <div class="col-6">
                        <div class="border border-gray-300 border-dashed rounded p-6">
                          <span class="fs-2hx fw-bold text-gray-900">{{ formatNumber(pageViewsThisMonth) }}</span>
                          <span class="d-block text-gray-500 fw-semibold fs-6 mt-2">Page views</span>
                        </div>
                      </div>
                    </div>

                    <!-- Device Breakdown -->
                    <div class="d-flex justify-content-between text-gray-500 fs-6 fw-semibold mb-4">
                      <span>Device breakdown</span>
                    </div>
                    <div class="row">
                      <div class="col-4 text-center">
                        <span class="fs-6 fw-bold text-gray-800">{{ deviceMobilePercentage }}%</span>
                        <span class="d-block text-gray-500 fs-7">Mobile</span>
                      </div>
                      <div class="col-4 text-center">
                        <span class="fs-6 fw-bold text-gray-800">{{ deviceDesktopPercentage }}%</span>
                        <span class="d-block text-gray-500 fs-7">Desktop</span>
                      </div>
                      <div class="col-4 text-center">
                        <span class="fs-6 fw-bold text-gray-800">{{ deviceTabletPercentage }}%</span>
                        <span class="d-block text-gray-500 fs-7">Tablet</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Recent Activity -->
              <div class="col-xl-4">
                <div class="card card-flush h-xl-100">
                  <div class="card-header pt-7">
                    <h3 class="card-title align-items-start flex-column">
                      <span class="card-label fw-bold text-gray-800">Recent Activity</span>
                      <span class="text-gray-500 mt-1 fw-semibold fs-6">Latest actions</span>
                    </h3>
                  </div>
                  <div class="card-body pt-6">
                    <div class="timeline timeline-border-dashed">
                      <div v-for="(activity, index) in recentActivities" :key="index" class="timeline-item">
                        <div class="timeline-line w-40px"></div>
                        <div class="timeline-icon symbol symbol-circle symbol-40px">
                          <div class="symbol-label" :class="getActivityIconClass(activity.type)">
                            <i :class="getActivityIcon(activity.type)" class="fs-4"></i>
                          </div>
                        </div>
                        <div class="timeline-content mb-10 mt-n1">
                          <div class="pe-3 mb-5">
                            <div class="fs-6 fw-semibold mb-2 text-gray-900">
                              {{ activity.title }}
                            </div>
                            <div class="d-flex align-items-center mt-1 fs-7">
                              <div class="text-muted me-2">{{ activity.description }}</div>
                            </div>
                          </div>
                          <div class="d-flex align-items-center">
                            <span :class="getStatusBadgeClass(activity.status)" class="badge fs-8">
                              {{ getStatusLabel(activity.status) }}
                            </span>
                            <span class="text-muted fs-7 ms-2">{{ formatTimeAgo(activity.timestamp) }}</span>
                          </div>
                        </div>
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
                        <a href="#" @click.prevent class="card bg-body hoverable card-xl-stretch mb-xl-8">
                          <div class="card-body">
                            <i class="ki-duotone ki-chart-line text-primary fs-2x mb-4">
                              <span class="path1"></span><span class="path2"></span>
                            </i>
                            <div class="text-gray-900 fw-bold fs-6 mb-2">View Reports</div>
                            <div class="text-gray-500 fs-7">Access detailed analytics reports</div>
                          </div>
                        </a>
                      </div>
                      <div class="col-lg-3 col-md-6">
                        <a href="#" @click.prevent class="card bg-body hoverable card-xl-stretch mb-xl-8">
                          <div class="card-body">
                            <i class="ki-duotone ki-rocket text-success fs-2x mb-4">
                              <span class="path1"></span><span class="path2"></span>
                            </i>
                            <div class="text-gray-900 fw-bold fs-6 mb-2">SEO Insights</div>
                            <div class="text-gray-500 fs-7">Search engine optimization data</div>
                          </div>
                        </a>
                      </div>
                      <div class="col-lg-3 col-md-6">
                        <a href="#" @click.prevent class="card bg-body hoverable card-xl-stretch mb-xl-8">
                          <div class="card-body">
                            <i class="ki-duotone ki-people text-warning fs-2x mb-4">
                              <span class="path1"></span><span class="path2"></span>
                            </i>
                            <div class="text-gray-900 fw-bold fs-6 mb-2">User Behavior</div>
                            <div class="text-gray-500 fs-7">Track visitor engagement patterns</div>
                          </div>
                        </a>
                      </div>
                      <div class="col-lg-3 col-md-6">
                        <a href="#" @click.prevent class="card bg-body hoverable card-xl-stretch mb-xl-8">
                          <div class="card-body">
                            <i class="ki-duotone ki-gear text-danger fs-2x mb-4">
                              <span class="path1"></span><span class="path2"></span>
                            </i>
                            <div class="text-gray-900 fw-bold fs-6 mb-2">Site Settings</div>
                            <div class="text-gray-500 fs-7">Configure tracking and preferences</div>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </template>
          
        </div>
        <!--end::Content container-->
      </div>
      <!--end::Content-->
    </div>
    <!--end::Content wrapper-->
    <!--begin::Footer-->
    <div id="kt_app_footer" class="app-footer">
      <!--begin::Footer container-->
      <div class="app-container container-fluid d-flex flex-column flex-md-row flex-center flex-md-stack py-3">
        <!--begin::Copyright-->
        <div class="text-gray-900 order-2 order-md-1">
          <span class="text-muted fw-semibold me-1">{{ currentYear }}&copy;</span>
          <a href="https://futurion.tech" target="_blank" class="text-gray-800 text-hover-primary">Futurion</a>
        </div>
        <!--end::Copyright-->
      </div>
      <!--end::Footer container-->
    </div>
    <!--end::Footer-->
  </div>
</template>

<script setup lang="ts">
import { useBreadcrumbStore } from "~/domains/shared/stores/breadcrumbStore";
import { useDashboardStore } from "../stores/dashboardStore";
import DashboardSkeleton from "../components/DashboardSkeleton.vue";
import RevenueAnalytics from "../components/RevenueAnalytics.vue";
import GeographicDistribution from "../components/GeographicDistribution.vue";
import type { ActivityType, ActivityStatus, RecentActivity } from "../types";

definePageMeta({
  middleware: 'auth',
});

const breadcrumbStore = useBreadcrumbStore();
const dashboardStore = useDashboardStore();

// Dynamic copyright year
const currentYear = computed(() => new Date().getFullYear());

// Set breadcrumb
breadcrumbStore.setBreadcrumb([
  { title: 'Dashboard', path: '/' },
]);

// Computed properties for dashboard data - using storeToRefs for proper reactivity
const { 
  platformStatistics, 
  analyticsSummary, 
  recentActivity,
  isLoading 
} = storeToRefs(dashboardStore);

const totalTenants = computed(() => {
  return platformStatistics.value?.totalTenants || 0;
});

const totalSubscriptions = computed(() => {
  return platformStatistics.value?.totalSubscriptions || 0;
});

const organizationGrowth = computed(() => {
  return platformStatistics.value?.organizationGrowth || {
    current: 0,
    previous: 0,
    percentage: 0,
    trend: 'up' as const
  };
});

const tenantGrowth = computed(() => {
  return platformStatistics.value?.tenantGrowth || {
    current: 0,
    previous: 0,
    percentage: 0,
    trend: 'up' as const
  };
});

const applicationGrowth = computed(() => {
  return platformStatistics.value?.applicationGrowth || {
    current: 0,
    previous: 0,
    percentage: 0,
    trend: 'up' as const
  };
});

const subscriptionGrowth = computed(() => {
  return platformStatistics.value?.subscriptionGrowth || {
    current: 0,
    previous: 0,
    percentage: 0,
    trend: 'up' as const
  };
});

const revenueGrowth = computed(() => {
  return platformStatistics.value?.revenueGrowth || {
    current: 0,
    previous: 0,
    percentage: 0,
    trend: 'up' as const
  };
});

const systemHealthScore = computed(() => {
  return dashboardStore.getSystemHealthScore || 85;
});

// Analytics data
const visitorsThisMonth = computed(() => {
  return analyticsSummary.value?.visitorsThisMonth || 0;
});

const pageViewsThisMonth = computed(() => {
  return analyticsSummary.value?.pageViewsThisMonth || 0;
});

const deviceMobilePercentage = computed(() => {
  return analyticsSummary.value?.deviceBreakdown?.mobilePercentage?.toFixed(1) || '0';
});

const deviceDesktopPercentage = computed(() => {
  return analyticsSummary.value?.deviceBreakdown?.desktopPercentage?.toFixed(1) || '0';
});

const deviceTabletPercentage = computed(() => {
  return analyticsSummary.value?.deviceBreakdown?.tabletPercentage?.toFixed(1) || '0';
});

// Recent activities
const recentActivities = computed(() => {
  return recentActivity.value?.slice(0, 4) || [];
});

// Utility functions
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

import { formatCurrency as formatCurrencyUtil, formatFCFA, convertCurrency, type SupportedCurrency } from "../utils/currency";

// Currency selector state
const selectedCurrency = ref<SupportedCurrency>('XOF');

const formatCurrency = (amount: number, compact: boolean = false): string => {
  // Convert amount to selected currency if needed
  const convertedAmount = selectedCurrency.value !== 'XOF' 
    ? convertCurrency(amount, 'XOF', selectedCurrency.value)
    : amount;
    
  if (selectedCurrency.value === 'XOF') {
    return compact ? formatFCFA(convertedAmount, true) : formatCurrencyUtil(convertedAmount, 'XOF');
  } else {
    return formatCurrencyUtil(convertedAmount, selectedCurrency.value);
  }
};

const onCurrencyChange = () => {
  console.log('Currency changed to:', selectedCurrency.value);
  // Force reactive updates by triggering re-computation
  nextTick(() => {
    // This will cause all computed currency values to recalculate
  });
};

const formatTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours}h ago`;
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    return `${days}d ago`;
  }
};

// Activity helpers
const getActivityIcon = (type: ActivityType): string => {
  const icons = {
    'user_registration': 'ki-duotone ki-user',
    'organization_created': 'ki-duotone ki-abstract-26',
    'application_created': 'ki-duotone ki-abstract-39',
    'application_deployed': 'ki-duotone ki-rocket',
    'subscription_created': 'ki-duotone ki-credit-cart',
    'subscription_cancelled': 'ki-duotone ki-cross-circle',
    'domain_purchased': 'ki-duotone ki-globe',
    'support_request': 'ki-duotone ki-questionnaire-tablet'
  };
  return icons[type] || 'ki-duotone ki-notification';
};

const getActivityIconClass = (type: ActivityType): string => {
  const classes = {
    'user_registration': 'bg-light-primary text-primary',
    'organization_created': 'bg-light-success text-success',
    'application_created': 'bg-light-info text-info',
    'application_deployed': 'bg-light-warning text-warning',
    'subscription_created': 'bg-light-success text-success',
    'subscription_cancelled': 'bg-light-danger text-danger',
    'domain_purchased': 'bg-light-primary text-primary',
    'support_request': 'bg-light-secondary text-secondary'
  };
  return classes[type] || 'bg-light-primary text-primary';
};

const getStatusBadgeClass = (status: ActivityStatus): string => {
  const classes = {
    'completed': 'badge-light-success',
    'in_progress': 'badge-light-warning',
    'failed': 'badge-light-danger',
    'pending': 'badge-light-secondary'
  };
  return classes[status] || 'badge-light-secondary';
};

const getStatusLabel = (status: ActivityStatus): string => {
  const labels = {
    'completed': 'Completed',
    'in_progress': 'In Progress',
    'failed': 'Failed',
    'pending': 'Pending'
  };
  return labels[status] || 'Unknown';
};

// Auto-refresh interval reference
let refreshInterval: NodeJS.Timeout | null = null;

// Initialize dashboard data on mount
onMounted(async () => {
  try {
    // Use enhanced data fetching with real APIs
    await dashboardStore.fetchAllEnhancedDashboardData();
    
    // Set up auto-refresh interval (5 minutes) 
    refreshInterval = setInterval(() => {
      if (dashboardStore?.refreshData) {
        dashboardStore.refreshData(['statistics', 'analytics', 'activity']);
      }
    }, 5 * 60 * 1000);
    
  } catch (error) {
    console.error('Enhanced dashboard initialization error:', error);
    // Fallback to basic data if enhanced fails
    try {
      await dashboardStore.fetchAllDashboardData();
    } catch (fallbackError) {
      console.error('Fallback dashboard initialization failed:', fallbackError);
    }
  }
});

// Cleanup interval on unmount
onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
});
</script>

