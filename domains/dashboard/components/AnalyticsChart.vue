<template>
  <div class="card card-flush h-xl-100">
    <div class="card-header pt-7">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bold text-gray-800">Analyse de la plateforme</span>
        <span class="text-gray-500 mt-1 fw-semibold fs-6">Trafic, inscriptions et déploiements</span>
      </h3>
      <div class="card-toolbar">
        <div class="d-flex align-items-center">
          <!-- Date Range Picker -->
          <select 
            v-model="selectedRange" 
            @change="updateDateRange"
            class="form-select form-select-sm w-150px me-3"
          >
            <option value="last_7_days">7 derniers jours</option>
            <option value="last_30_days">30 derniers jours</option>
            <option value="last_90_days">90 derniers jours</option>
            <option value="last_12_months">12 derniers mois</option>
          </select>
          
          <!-- Refresh Button -->
          <button 
            @click="refreshData"
            :disabled="refreshing"
            class="btn btn-sm btn-light d-flex align-items-center px-4"
          >
            <i :class="`ki-duotone ki-arrows-circle fs-6 ${refreshing ? 'spinner-border spinner-border-sm' : ''}`">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            <span class="ms-2">{{ getDateRangeLabel() }}</span>
          </button>
        </div>
      </div>
    </div>
    <div class="card-body pt-6">
      <!-- Chart container -->
      <div v-if="!loading" class="min-h-auto" style="height: 350px;">
        <canvas ref="chartCanvas" id="analytics_chart"></canvas>
      </div>
      
      <!-- Loading state -->
      <div v-else class="d-flex align-items-center justify-content-center" style="height: 350px;">
        <div class="d-flex flex-column align-items-center">
          <div class="spinner-border text-primary mb-3" role="status">
            <span class="visually-hidden">Chargement...</span>
          </div>
          <div class="text-gray-600 fw-semibold">Chargement des données analytiques...</div>
        </div>
      </div>
      
      <!-- Error state -->
      <div v-if="error && !loading" class="d-flex align-items-center justify-content-center flex-column" style="height: 350px;">
        <i class="ki-duotone ki-cross-circle fs-3x text-danger mb-3">
          <span class="path1"></span>
          <span class="path2"></span>
        </i>
        <div class="text-gray-600 fw-semibold text-center">
          <div class="mb-2">Erreur lors du chargement des données</div>
          <div class="text-gray-500 fs-7">{{ error }}</div>
        </div>
        <button @click="refreshData" class="btn btn-sm btn-light-primary mt-3">
          Réessayer
        </button>
      </div>
      
      <!-- Summary metrics below chart -->
      <div v-if="!loading && analyticsSummary" class="row g-5 mt-6">
        <div class="col-6 col-md-3">
          <div class="d-flex align-items-center">
            <div class="symbol symbol-30px me-3">
              <span class="symbol-label bg-light-primary">
                <i class="ki-duotone ki-profile-user fs-3 text-primary">
                  <span class="path1"></span>
                  <span class="path2"></span>
                  <span class="path3"></span>
                  <span class="path4"></span>
                </i>
              </span>
            </div>
            <div class="flex-grow-1">
              <div class="text-gray-800 fw-bold fs-6">{{ formatNumber(analyticsSummary.visitorsThisMonth) }}</div>
              <div class="text-gray-500 fw-semibold fs-7">Visiteurs ce mois</div>
            </div>
          </div>
        </div>
        
        <div class="col-6 col-md-3">
          <div class="d-flex align-items-center">
            <div class="symbol symbol-30px me-3">
              <span class="symbol-label bg-light-info">
                <i class="ki-duotone ki-element-11 fs-3 text-info">
                  <span class="path1"></span>
                  <span class="path2"></span>
                  <span class="path3"></span>
                  <span class="path4"></span>
                </i>
              </span>
            </div>
            <div class="flex-grow-1">
              <div class="text-gray-800 fw-bold fs-6">{{ formatNumber(analyticsSummary.pageViewsThisMonth) }}</div>
              <div class="text-gray-500 fw-semibold fs-7">Pages vues</div>
            </div>
          </div>
        </div>
        
        <div class="col-6 col-md-3">
          <div class="d-flex align-items-center">
            <div class="symbol symbol-30px me-3">
              <span class="symbol-label bg-light-success">
                <i class="ki-duotone ki-time fs-3 text-success">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
              </span>
            </div>
            <div class="flex-grow-1">
              <div class="text-gray-800 fw-bold fs-6">{{ analyticsSummary.avgTimeOnSite.toFixed(1) }}min</div>
              <div class="text-gray-500 fw-semibold fs-7">Temps moyen</div>
            </div>
          </div>
        </div>
        
        <div class="col-6 col-md-3">
          <div class="d-flex align-items-center">
            <div class="symbol symbol-30px me-3">
              <span class="symbol-label bg-light-warning">
                <i class="ki-duotone ki-whatsapp fs-3 text-warning">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
              </span>
            </div>
            <div class="flex-grow-1">
              <div class="text-gray-800 fw-bold fs-6">{{ formatNumber(analyticsSummary.whatsappClicksThisWeek) }}</div>
              <div class="text-gray-500 fw-semibold fs-7">Clics WhatsApp</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Chart, type ChartConfiguration } from 'chart.js/auto';
import { useDashboardStore } from '../stores/dashboardStore';
import { storeToRefs } from 'pinia';
import type { DateRangeOption } from '../types';

const dashboardStore = useDashboardStore();
const { analyticsSummary, loading, error } = storeToRefs(dashboardStore);

const chartCanvas = ref<HTMLCanvasElement>();
const chart = ref<Chart>();
const refreshing = ref(false);
const selectedRange = ref<DateRangeOption>('last_30_days');

// Ensure analytics data is loaded
onMounted(async () => {
  await initializeChart();
  if (!analyticsSummary.value) {
    await dashboardStore.fetchAnalyticsSummary();
  }
});

// Watch for analytics data changes to update chart
watch(analyticsSummary, (newData) => {
  if (newData && chart.value) {
    updateChart(newData);
  }
});

const initializeChart = async () => {
  if (!chartCanvas.value) return;

  // Create chart configuration
  const config: ChartConfiguration = {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Visiteurs uniques',
          data: [],
          borderColor: '#1B84FF',
          backgroundColor: 'rgba(27, 132, 255, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
        {
          label: 'Pages vues',
          data: [],
          borderColor: '#8950FC',
          backgroundColor: 'rgba(137, 80, 252, 0.1)',
          borderWidth: 2,
          fill: false,
          tension: 0.4,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 20,
          }
        },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: '#1B84FF',
          borderWidth: 1,
        }
      },
      scales: {
        x: {
          display: true,
          grid: {
            display: false
          },
          ticks: {
            color: '#A1A5B7'
          }
        },
        y: {
          display: true,
          grid: {
            color: 'rgba(161, 165, 183, 0.3)'
          },
          ticks: {
            color: '#A1A5B7',
            callback: function(value) {
              return formatNumber(Number(value));
            }
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
    }
  };

  chart.value = new Chart(chartCanvas.value, config);
};

const updateChart = (data: typeof analyticsSummary.value) => {
  if (!chart.value || !data?.dailyStats7Days) return;

  // Update chart data
  const labels = data.dailyStats7Days.map(stat => {
    const date = new Date(stat.date);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  });

  const visitorsData = data.dailyStats7Days.map(stat => stat.uniqueVisitors);
  const pageViewsData = data.dailyStats7Days.map(stat => stat.totalPageViews);

  chart.value.data.labels = labels;
  chart.value.data.datasets[0].data = visitorsData;
  chart.value.data.datasets[1].data = pageViewsData;

  chart.value.update();
};

const updateDateRange = async () => {
  dashboardStore.setDateRange(selectedRange.value);
  await refreshData();
};

const refreshData = async () => {
  refreshing.value = true;
  try {
    await dashboardStore.fetchAnalyticsSummary();
  } finally {
    refreshing.value = false;
  }
};

const getDateRangeLabel = (): string => {
  switch (selectedRange.value) {
    case 'last_7_days':
      return '7 derniers jours';
    case 'last_30_days':
      return '30 derniers jours';
    case 'last_90_days':
      return '90 derniers jours';
    case 'last_12_months':
      return '12 derniers mois';
    default:
      return '30 derniers jours';
  }
};

const formatNumber = (value: number): string => {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M';
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K';
  }
  return value.toString();
};

// Cleanup chart on unmount
onUnmounted(() => {
  if (chart.value) {
    chart.value.destroy();
  }
});
</script>

<style scoped>
/* Chart container styling */
#analytics_chart {
  max-height: 350px;
}

/* Loading spinner styling */
.spinner-border {
  width: 2rem;
  height: 2rem;
}
</style>