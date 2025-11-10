<template>
  <div class="row g-5 g-xl-8 mb-5 mb-xl-10">
    <!-- Organisations totales -->
    <div class="col-xl-3 col-lg-6 col-md-6">
      <div class="card card-flush h-100">
        <div class="card-body">
          <!-- Header avec icône -->
          <div class="d-flex align-items-center mb-2">
            <div class="symbol symbol-45px me-3">
              <span class="symbol-label bg-light-primary">
                <i class="ki-duotone ki-office-bag fs-2 text-primary">
                  <span class="path1"></span>
                  <span class="path2"></span>
                  <span class="path3"></span>
                </i>
              </span>
            </div>
            <div class="flex-grow-1">
              <span class="text-gray-500 fw-semibold fs-7 d-block">Total</span>
              <span class="text-gray-800 fw-bold fs-6">Organisations</span>
            </div>
          </div>
          
          <!-- Valeur principale -->
          <div class="d-flex align-items-end justify-content-between">
            <div v-if="!loading" class="text-gray-800 fw-bolder fs-2x">
              {{ formatNumber(statistics?.totalOrganizations) }}
            </div>
            <div v-else class="shimmer-box" style="width: 80px; height: 36px;"></div>
            
            <!-- Trend indicator -->
            <div v-if="!loading && statistics?.organizationGrowth" class="d-flex flex-column align-items-end">
              <span :class="`badge badge-light-${statistics.organizationGrowth.trend === 'up' ? 'success' : 'danger'} fs-7`">
                <i :class="`ki-duotone ki-arrow-${statistics.organizationGrowth.trend} fs-6`">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
                {{ formatPercentage(statistics.organizationGrowth.percentage) }}%
              </span>
              <span class="text-gray-500 fs-8 mt-1">vs mois dernier</span>
            </div>
          </div>
        </div>
        <div class="card-footer pt-0" v-if="!loading && statistics?.organizationGrowth">
          <div class="d-flex align-items-center">
            <span 
              :class="`badge badge-light-${statistics.organizationGrowth.trend === 'up' ? 'success' : 'danger'} fs-base`"
            >
              <i 
                :class="`ki-duotone ki-arrow-${statistics.organizationGrowth.trend === 'up' ? 'up' : 'down'} fs-5 text-${statistics.organizationGrowth.trend === 'up' ? 'success' : 'danger'} ms-n1`"
              >
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              {{ formatPercentage(statistics.organizationGrowth.percentage) }}%
            </span>
            <span class="text-gray-500 fs-7 fw-bold ms-1">vs mois dernier</span>
          </div>
        </div>
        <div v-else-if="loading" class="card-footer pt-0">
          <div class="shimmer-box" style="width: 120px; height: 20px;"></div>
        </div>
      </div>
    </div>

    <!-- Utilisateurs actifs -->
    <div class="col-xl-3 col-lg-6 col-md-6">
      <div class="card card-flush h-100">
        <div class="card-body">
          <!-- Header avec icône -->
          <div class="d-flex align-items-center mb-2">
            <div class="symbol symbol-45px me-3">
              <span class="symbol-label bg-light-info">
                <i class="ki-duotone ki-profile-user fs-2 text-info">
                  <span class="path1"></span>
                  <span class="path2"></span>
                  <span class="path3"></span>
                  <span class="path4"></span>
                </i>
              </span>
            </div>
            <div class="flex-grow-1">
              <span class="text-gray-500 fw-semibold fs-7 d-block">Total</span>
              <span class="text-gray-800 fw-bold fs-6">Utilisateurs actifs</span>
            </div>
          </div>
          
          <!-- Valeur principale -->
          <div class="d-flex align-items-end justify-content-between">
            <div v-if="!loading" class="text-gray-800 fw-bolder fs-2x">
              {{ formatNumber(statistics?.totalTenants) }}
            </div>
            <div v-else class="shimmer-box" style="width: 80px; height: 36px;"></div>
            
            <!-- Trend indicator -->
            <div v-if="!loading && statistics?.tenantGrowth" class="d-flex flex-column align-items-end">
              <span :class="`badge badge-light-${statistics.tenantGrowth.trend === 'up' ? 'info' : 'danger'} fs-7`">
                <i :class="`ki-duotone ki-arrow-${statistics.tenantGrowth.trend} fs-6`">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
                {{ formatPercentage(statistics.tenantGrowth.percentage) }}%
              </span>
              <span class="text-gray-500 fs-8 mt-1">cette semaine</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sites web créés -->
    <div class="col-xl-3 col-lg-6 col-md-6">
      <div class="card card-flush h-100">
        <div class="card-body">
          <!-- Header avec icône -->
          <div class="d-flex align-items-center mb-2">
            <div class="symbol symbol-45px me-3">
              <span class="symbol-label bg-light-warning">
                <i class="ki-duotone ki-abstract-39 fs-2 text-warning">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
              </span>
            </div>
            <div class="flex-grow-1">
              <span class="text-gray-500 fw-semibold fs-7 d-block">Total</span>
              <span class="text-gray-800 fw-bold fs-6">Sites web</span>
            </div>
          </div>
          
          <!-- Valeur principale -->
          <div class="d-flex align-items-end justify-content-between">
            <div v-if="!loading" class="text-gray-800 fw-bolder fs-2x">
              {{ formatNumber(statistics?.totalApplications) }}
            </div>
            <div v-else class="shimmer-box" style="width: 80px; height: 36px;"></div>
            
            <!-- Trend indicator -->
            <div v-if="!loading && statistics?.applicationGrowth" class="d-flex flex-column align-items-end">
              <span :class="`badge badge-light-${statistics.applicationGrowth.trend === 'up' ? 'warning' : 'danger'} fs-7`">
                <i :class="`ki-duotone ki-arrow-${statistics.applicationGrowth.trend} fs-6`">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
                +{{ Math.abs(statistics.applicationGrowth.current - statistics.applicationGrowth.previous) }}
              </span>
              <span class="text-gray-500 fs-8 mt-1">ce mois</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Revenus mensuels -->
    <div class="col-xl-3 col-lg-6 col-md-6">
      <div class="card card-flush h-100">
        <div class="card-body">
          <!-- Header avec icône -->
          <div class="d-flex align-items-center mb-2">
            <div class="symbol symbol-45px me-3">
              <span class="symbol-label bg-light-success">
                <i class="ki-duotone ki-euro fs-2 text-success">
                  <span class="path1"></span>
                  <span class="path2"></span>
                  <span class="path3"></span>
                </i>
              </span>
            </div>
            <div class="flex-grow-1">
              <span class="text-gray-500 fw-semibold fs-7 d-block">Mensuel</span>
              <span class="text-gray-800 fw-bold fs-6">Revenus</span>
            </div>
          </div>
          
          <!-- Valeur principale -->
          <div class="d-flex align-items-end justify-content-between">
            <div v-if="!loading" class="text-gray-800 fw-bolder fs-2x">
              {{ formatCurrency(statistics?.monthlyRevenue) }}€
            </div>
            <div v-else class="shimmer-box" style="width: 100px; height: 36px;"></div>
            
            <!-- Trend indicator -->
            <div v-if="!loading && statistics?.revenueGrowth" class="d-flex flex-column align-items-end">
              <span :class="`badge badge-light-${statistics.revenueGrowth.trend === 'up' ? 'success' : 'danger'} fs-7`">
                <i :class="`ki-duotone ki-arrow-${statistics.revenueGrowth.trend} fs-6`">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
                {{ formatPercentage(statistics.revenueGrowth.percentage) }}%
              </span>
              <span class="text-gray-500 fs-8 mt-1">vs mois dernier</span>
            </div>
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
const { platformStatistics: statistics, loading } = storeToRefs(dashboardStore);

// Ensure statistics are loaded
onMounted(async () => {
  console.log('🔧 [PlatformStatsCards] Component mounted, statistics:', statistics.value);
  console.log('🔧 [PlatformStatsCards] Loading state:', loading.value);
  
  if (!statistics.value) {
    console.log('🔄 [PlatformStatsCards] Fetching platform statistics...');
    await dashboardStore.fetchPlatformStatistics();
  } else {
    console.log('✅ [PlatformStatsCards] Statistics already loaded');
  }
});

// Watch for statistics changes
watch(statistics, (newStats, oldStats) => {
  console.log('📊 [PlatformStatsCards] Statistics updated:', { old: oldStats, new: newStats });
}, { deep: true });

watch(loading, (newLoading) => {
  console.log('🔄 [PlatformStatsCards] Loading state changed:', newLoading);
});

// Utility functions for formatting
const formatNumber = (value?: number): string => {
  if (!value) return '0';
  return new Intl.NumberFormat('fr-FR').format(value);
};

const formatCurrency = (value?: number): string => {
  if (!value) return '0';
  return new Intl.NumberFormat('fr-FR').format(value);
};

const formatPercentage = (value?: number): string => {
  if (!value) return '0';
  return Math.abs(value).toFixed(1);
};
</script>

<style scoped>
.shimmer-box {
  background: #f6f7f8;
  background-image: linear-gradient(90deg, #f6f7f8 0px, #eaeaea 40px, #f6f7f8 80px);
  background-size: 600px;
  animation: shimmer 1.2s infinite;
  border-radius: 4px;
}

@keyframes shimmer {
  0% {
    background-position: -600px 0;
  }
  100% {
    background-position: 600px 0;
  }
}
</style>