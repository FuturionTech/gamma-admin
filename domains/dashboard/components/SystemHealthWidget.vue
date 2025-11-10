<template>
  <div class="card card-flush h-xl-100">
    <div class="card-header pt-7">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bold text-gray-800">État du système</span>
        <span class="text-gray-500 mt-1 fw-semibold fs-6">Aperçu des services de la plateforme</span>
      </h3>
      <div class="card-toolbar">
        <button 
          @click="refreshHealth"
          :disabled="refreshing"
          class="btn btn-sm btn-light-primary"
        >
          <i :class="`ki-duotone ki-arrows-circle fs-4 ${refreshing ? 'spinner-border spinner-border-sm' : ''}`">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          <span class="ms-2">Actualiser</span>
        </button>
      </div>
    </div>
    <div class="card-body pt-6">
      <!-- Score général de santé -->
      <div class="d-flex align-items-center mb-8" v-if="!loading">
        <div class="flex-grow-1">
          <div class="text-gray-800 fw-bold fs-2">Score de santé global</div>
          <div class="text-gray-500 fw-semibold fs-6">État général de la plateforme</div>
        </div>
        <div class="d-flex align-items-center">
          <div class="fw-bolder fs-1" :class="getHealthScoreColor(healthScore)">
            {{ healthScore }}%
          </div>
          <div class="ms-3">
            <i 
              :class="`ki-duotone fs-2x ${getHealthScoreIcon(healthScore)} ${getHealthScoreColor(healthScore)}`"
            >
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
          </div>
        </div>
      </div>
      <div v-else class="mb-8">
        <div class="shimmer-box" style="width: 100%; height: 60px;"></div>
      </div>

      <!-- Indicateurs de service -->
      <div v-if="!loading && systemHealth">
        <div class="d-flex align-items-center mb-6">
          <span 
            :class="`bullet bullet-dot me-3 ${getStatusColor(systemHealth.deploymentService.status)}`" 
            style="width: 15px; height: 15px;"
          ></span>
          <div class="flex-grow-1">
            <div class="text-gray-800 fw-bold fs-6">Service de déploiement</div>
            <div class="text-gray-500 fw-semibold fs-7">{{ systemHealth.deploymentService.description }}</div>
          </div>
          <div class="d-flex flex-column align-items-end">
            <span :class="`badge badge-light-${getStatusBadgeColor(systemHealth.deploymentService.status)}`">
              {{ getStatusLabel(systemHealth.deploymentService.status) }}
            </span>
            <span class="text-gray-500 fs-8 mt-1" v-if="systemHealth.deploymentService.responseTime">
              {{ systemHealth.deploymentService.responseTime }}ms
            </span>
          </div>
        </div>
        
        <div class="d-flex align-items-center mb-6">
          <span 
            :class="`bullet bullet-dot me-3 ${getStatusColor(systemHealth.emailService.status)}`" 
            style="width: 15px; height: 15px;"
          ></span>
          <div class="flex-grow-1">
            <div class="text-gray-800 fw-bold fs-6">Service email</div>
            <div class="text-gray-500 fw-semibold fs-7">{{ systemHealth.emailService.description }}</div>
          </div>
          <div class="d-flex flex-column align-items-end">
            <span :class="`badge badge-light-${getStatusBadgeColor(systemHealth.emailService.status)}`">
              {{ getStatusLabel(systemHealth.emailService.status) }}
            </span>
            <span class="text-gray-500 fs-8 mt-1" v-if="systemHealth.emailService.responseTime">
              {{ systemHealth.emailService.responseTime }}ms
            </span>
          </div>
        </div>
        
        <div class="d-flex align-items-center mb-8">
          <span 
            :class="`bullet bullet-dot me-3 ${getStatusColor(systemHealth.databaseService.status)}`" 
            style="width: 15px; height: 15px;"
          ></span>
          <div class="flex-grow-1">
            <div class="text-gray-800 fw-bold fs-6">Base de données</div>
            <div class="text-gray-500 fw-semibold fs-7">{{ systemHealth.databaseService.description }}</div>
          </div>
          <div class="d-flex flex-column align-items-end">
            <span :class="`badge badge-light-${getStatusBadgeColor(systemHealth.databaseService.status)}`">
              {{ getStatusLabel(systemHealth.databaseService.status) }}
            </span>
            <span class="text-gray-500 fs-8 mt-1" v-if="systemHealth.databaseService.responseTime">
              {{ systemHealth.databaseService.responseTime }}ms
            </span>
          </div>
        </div>
      </div>
      
      <!-- Loading state -->
      <div v-else-if="loading" class="mb-8">
        <div class="d-flex align-items-center mb-4">
          <div class="shimmer-box me-3" style="width: 15px; height: 15px; border-radius: 50%;"></div>
          <div class="flex-grow-1">
            <div class="shimmer-box mb-2" style="width: 140px; height: 16px;"></div>
            <div class="shimmer-box" style="width: 200px; height: 12px;"></div>
          </div>
          <div class="shimmer-box" style="width: 60px; height: 24px;"></div>
        </div>
        <div class="d-flex align-items-center mb-4">
          <div class="shimmer-box me-3" style="width: 15px; height: 15px; border-radius: 50%;"></div>
          <div class="flex-grow-1">
            <div class="shimmer-box mb-2" style="width: 120px; height: 16px;"></div>
            <div class="shimmer-box" style="width: 180px; height: 12px;"></div>
          </div>
          <div class="shimmer-box" style="width: 60px; height: 24px;"></div>
        </div>
        <div class="d-flex align-items-center">
          <div class="shimmer-box me-3" style="width: 15px; height: 15px; border-radius: 50%;"></div>
          <div class="flex-grow-1">
            <div class="shimmer-box mb-2" style="width: 130px; height: 16px;"></div>
            <div class="shimmer-box" style="width: 160px; height: 12px;"></div>
          </div>
          <div class="shimmer-box" style="width: 60px; height: 24px;"></div>
        </div>
      </div>

      <!-- Actions rapides -->
      <div class="separator separator-dashed mb-6"></div>
      <h4 class="text-gray-800 fw-bold mb-4">Actions rapides</h4>
      
      <div class="d-grid gap-2">
        <button class="btn btn-light-primary btn-sm" @click="sendAnnouncement">
          <i class="ki-duotone ki-notification fs-4 me-2">
            <span class="path1"></span>
            <span class="path2"></span>
            <span class="path3"></span>
          </i>
          Envoyer une annonce plateforme
        </button>
        <button class="btn btn-light-info btn-sm" @click="toggleMaintenance">
          <i class="ki-duotone ki-setting fs-4 me-2">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          Mode maintenance
        </button>
        <button class="btn btn-light-warning btn-sm" @click="exportReport">
          <i class="ki-duotone ki-file-down fs-4 me-2">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          Exporter rapport plateforme
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDashboardStore } from '../stores/dashboardStore';
import { storeToRefs } from 'pinia';
import type { ServiceStatus } from '../types';

const dashboardStore = useDashboardStore();
const { platformStatistics, loading } = storeToRefs(dashboardStore);

const refreshing = ref(false);

const systemHealth = computed(() => platformStatistics.value?.systemHealth);
const healthScore = computed(() => systemHealth.value?.overallScore || 0);

// Ensure statistics are loaded
onMounted(async () => {
  if (!platformStatistics.value) {
    await dashboardStore.fetchPlatformStatistics();
  }
});

// Utility functions
const getStatusColor = (status: string): string => {
  switch (status) {
    case 'online':
      return 'bg-success';
    case 'degraded':
      return 'bg-warning';
    case 'offline':
      return 'bg-danger';
    default:
      return 'bg-gray-400';
  }
};

const getStatusBadgeColor = (status: string): string => {
  switch (status) {
    case 'online':
      return 'success';
    case 'degraded':
      return 'warning';
    case 'offline':
      return 'danger';
    default:
      return 'secondary';
  }
};

const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'online':
      return 'En ligne';
    case 'degraded':
      return 'Dégradé';
    case 'offline':
      return 'Hors ligne';
    default:
      return 'Inconnu';
  }
};

const getHealthScoreColor = (score: number): string => {
  if (score >= 90) return 'text-success';
  if (score >= 70) return 'text-warning';
  return 'text-danger';
};

const getHealthScoreIcon = (score: number): string => {
  if (score >= 90) return 'ki-check-circle';
  if (score >= 70) return 'ki-information';
  return 'ki-cross-circle';
};

// Action handlers
const refreshHealth = async () => {
  refreshing.value = true;
  try {
    await dashboardStore.fetchPlatformStatistics();
  } finally {
    refreshing.value = false;
  }
};

const sendAnnouncement = () => {
  // TODO: Implement announcement modal
  console.log('Ouverture du modal d\'annonce...');
};

const toggleMaintenance = () => {
  // TODO: Implement maintenance mode toggle
  console.log('Basculement du mode maintenance...');
};

const exportReport = () => {
  // TODO: Implement report export
  console.log('Export du rapport de la plateforme...');
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