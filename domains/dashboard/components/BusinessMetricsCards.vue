<template>
  <div class="row g-5 g-xl-8 mb-5 mb-xl-10">
    <!-- Taux de conversion -->
    <div class="col-xl-3 col-lg-6 col-md-6">
      <div class="card card-flush h-100 bg-light-primary">
        <div class="card-body">
          <!-- Header avec icône -->
          <div class="d-flex align-items-center mb-2">
            <div class="symbol symbol-45px me-3">
              <span class="symbol-label bg-primary">
                <i class="ki-duotone ki-chart-pie-4 fs-2 text-white">
                  <span class="path1"></span>
                  <span class="path2"></span>
                  <span class="path3"></span>
                </i>
              </span>
            </div>
            <div class="flex-grow-1">
              <span class="text-gray-500 fw-semibold fs-7 d-block">Taux</span>
              <span class="text-gray-800 fw-bold fs-6">Conversion</span>
            </div>
          </div>
          
          <!-- Valeur principale -->
          <div class="d-flex align-items-end justify-content-between">
            <div class="text-gray-800 fw-bolder fs-2x">
              {{ conversionRate }}%
            </div>
            <span :class="`badge badge-light-${conversionTrend === 'up' ? 'success' : 'danger'} fs-7`">
              <i :class="`ki-duotone ki-arrow-${conversionTrend} fs-6`">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              +2.4%
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Temps de réponse moyen -->
    <div class="col-xl-3 col-lg-6 col-md-6">
      <div class="card card-flush h-100 bg-light-success">
        <div class="card-body">
          <!-- Header avec icône -->
          <div class="d-flex align-items-center mb-2">
            <div class="symbol symbol-45px me-3">
              <span class="symbol-label bg-success">
                <i class="ki-duotone ki-timer fs-2 text-white">
                  <span class="path1"></span>
                  <span class="path2"></span>
                  <span class="path3"></span>
                </i>
              </span>
            </div>
            <div class="flex-grow-1">
              <span class="text-gray-500 fw-semibold fs-7 d-block">Temps</span>
              <span class="text-gray-800 fw-bold fs-6">Réponse moyen</span>
            </div>
          </div>
          
          <!-- Valeur principale -->
          <div class="d-flex align-items-end justify-content-between">
            <div class="text-gray-800 fw-bolder fs-2x">
              {{ avgResponseTime }}ms
            </div>
            <span class="badge badge-light-success fs-7">
              <i class="ki-duotone ki-arrow-down fs-6">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              -12%
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Taux de satisfaction -->
    <div class="col-xl-3 col-lg-6 col-md-6">
      <div class="card card-flush h-100 bg-light-warning">
        <div class="card-body">
          <!-- Header avec icône -->
          <div class="d-flex align-items-center mb-2">
            <div class="symbol symbol-45px me-3">
              <span class="symbol-label bg-warning">
                <i class="ki-duotone ki-like fs-2 text-white">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
              </span>
            </div>
            <div class="flex-grow-1">
              <span class="text-gray-500 fw-semibold fs-7 d-block">Taux</span>
              <span class="text-gray-800 fw-bold fs-6">Satisfaction</span>
            </div>
          </div>
          
          <!-- Valeur principale -->
          <div class="d-flex align-items-end justify-content-between">
            <div class="text-gray-800 fw-bolder fs-2x">
              {{ satisfactionRate }}%
            </div>
            <span class="badge badge-light-warning fs-7">
              <i class="ki-duotone ki-arrow-up fs-6">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              +5.2%
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Nouveaux utilisateurs cette semaine -->
    <div class="col-xl-3 col-lg-6 col-md-6">
      <div class="card card-flush h-100 bg-light-info">
        <div class="card-body">
          <!-- Header avec icône -->
          <div class="d-flex align-items-center mb-2">
            <div class="symbol symbol-45px me-3">
              <span class="symbol-label bg-info">
                <i class="ki-duotone ki-user-tick fs-2 text-white">
                  <span class="path1"></span>
                  <span class="path2"></span>
                  <span class="path3"></span>
                </i>
              </span>
            </div>
            <div class="flex-grow-1">
              <span class="text-gray-500 fw-semibold fs-7 d-block">Nouveaux</span>
              <span class="text-gray-800 fw-bold fs-6">Utilisateurs</span>
            </div>
          </div>
          
          <!-- Valeur principale -->
          <div class="d-flex align-items-end justify-content-between">
            <div class="text-gray-800 fw-bolder fs-2x">
              {{ newUsersThisWeek }}
            </div>
            <span class="badge badge-light-info fs-7">
              <i class="ki-duotone ki-arrow-up fs-6">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              +18%
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDashboardStore } from '../stores/dashboardStore';
import { storeToRefs } from 'pinia';

const dashboardStore = useDashboardStore();
const { analyticsSummary, loading } = storeToRefs(dashboardStore);

// Enhanced business metrics
const conversionRate = computed(() => {
  if (!analyticsSummary.value) return '0.0';
  // Calculate conversion rate based on form submissions vs visits
  const conversion = (analyticsSummary.value.formSubmissionsThisWeek / analyticsSummary.value.visitorsThisWeek) * 100;
  return conversion.toFixed(1);
});

const conversionTrend = ref('up');

const avgResponseTime = computed(() => {
  // Mock average response time - in real app this would come from monitoring
  return 245;
});

const satisfactionRate = computed(() => {
  if (!analyticsSummary.value) return '0.0';
  // Mock satisfaction rate - in real app this would come from feedback/surveys
  return '94.2';
});

const newUsersThisWeek = computed(() => {
  if (!analyticsSummary.value) return '0';
  // Calculate new users from daily stats
  const newUsers = analyticsSummary.value.dailyStats7Days.reduce((total, day) => {
    return total + day.newVisitors;
  }, 0);
  return new Intl.NumberFormat('fr-FR').format(newUsers);
});

// Debug logging
onMounted(() => {
  console.log('🎯 [BusinessMetricsCards] Component mounted');
  console.log('📊 [BusinessMetricsCards] Analytics summary:', analyticsSummary.value);
});

watch(analyticsSummary, (newAnalytics) => {
  console.log('📈 [BusinessMetricsCards] Analytics updated:', newAnalytics);
});
</script>

<style scoped>
/* Enhanced card backgrounds */
.bg-light-primary {
  background-color: rgba(27, 132, 255, 0.1) !important;
}

.bg-light-success {
  background-color: rgba(80, 205, 137, 0.1) !important;
}

.bg-light-warning {
  background-color: rgba(255, 199, 0, 0.1) !important;
}

.bg-light-info {
  background-color: rgba(124, 58, 237, 0.1) !important;
}
</style>