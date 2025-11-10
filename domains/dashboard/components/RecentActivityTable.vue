<template>
  <div class="card card-flush">
    <div class="card-header pt-7">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bold text-gray-800">Activité récente de la plateforme</span>
        <span class="text-gray-500 mt-1 fw-semibold fs-6">Dernières inscriptions, déploiements et demandes d'assistance</span>
      </h3>
      <div class="card-toolbar">
        <div class="d-flex align-items-center position-relative me-4">
          <i class="ki-duotone ki-magnifier fs-3 position-absolute ms-3">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          <input 
            type="text" 
            v-model="searchQuery"
            class="form-control form-control-solid w-250px ps-13" 
            placeholder="Rechercher activités"
          >
        </div>
        <button class="btn btn-light btn-sm" @click="exportData">
          <i class="ki-duotone ki-file-down fs-2">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          Exporter
        </button>
      </div>
    </div>
    <div class="card-body pt-6">
      <div class="table-responsive" v-if="!loading">
        <table class="table table-row-dashed align-middle gs-0 gy-6 my-0">
          <thead>
            <tr class="fs-7 fw-bold text-gray-500 border-bottom-0">
              <th class="p-0 pb-3 min-w-100px text-start">TYPE</th>
              <th class="p-0 pb-3 min-w-140px text-start">UTILISATEUR/ORG</th>
              <th class="p-0 pb-3 min-w-120px text-start">ACTION</th>
              <th class="p-0 pb-3 w-125px text-center">STATUT</th>
              <th class="p-0 pb-3 min-w-100px text-end">HORODATAGE</th>
              <th class="p-0 pb-3 w-50px text-end">DÉTAILS</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="activity in filteredActivities" :key="`${activity.type}-${activity.timestamp}`">
              <!-- Type -->
              <td class="text-start">
                <span :class="`badge badge-light-${getActivityTypeColor(activity.type)} fs-7 fw-bold`">
                  {{ getActivityTypeLabel(activity.type) }}
                </span>
              </td>
              
              <!-- User/Organization -->
              <td class="text-start">
                <div class="d-flex align-items-center" v-if="activity.user">
                  <div class="symbol symbol-30px me-3">
                    <img 
                      :src="activity.user.avatar || '/assets/media/avatars/blank.png'" 
                      :alt="activity.user.name"
                      @error="(e) => (e.target as HTMLImageElement).src = '/assets/media/avatars/blank.png'"
                    >
                  </div>
                  <div class="d-flex flex-column">
                    <span class="text-gray-800 fw-bold fs-6">{{ activity.user.name }}</span>
                    <span class="text-gray-500 fw-semibold fs-7">{{ activity.user.email }}</span>
                  </div>
                </div>
                <div class="d-flex flex-column" v-else-if="activity.organization">
                  <span class="text-gray-800 fw-bold fs-6">{{ activity.organization.name }}</span>
                  <span class="text-gray-500 fw-semibold fs-7">Organisation</span>
                </div>
                <div v-else>
                  <span class="text-gray-500 fw-semibold fs-7">Système</span>
                </div>
              </td>
              
              <!-- Action -->
              <td class="text-start">
                <span class="text-gray-800 fw-semibold">{{ activity.title }}</span>
                <div class="text-gray-500 fw-semibold fs-7 mt-1">{{ activity.description }}</div>
              </td>
              
              <!-- Status -->
              <td class="text-center">
                <span :class="`badge badge-light-${getStatusColor(activity.status)}`">
                  {{ getStatusLabel(activity.status) }}
                </span>
              </td>
              
              <!-- Timestamp -->
              <td class="text-end">
                <span class="text-gray-500 fw-semibold">{{ formatTimestamp(activity.timestamp) }}</span>
              </td>
              
              <!-- Details button -->
              <td class="text-end">
                <button 
                  class="btn btn-sm btn-icon btn-bg-light btn-active-color-primary w-30px h-30px"
                  @click="viewDetails(activity)"
                >
                  <i class="ki-duotone ki-black-right fs-2 text-gray-500"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Empty state -->
        <div v-if="filteredActivities.length === 0" class="text-center py-10">
          <div class="text-gray-500 fs-4 fw-bold mb-2">Aucune activité trouvée</div>
          <div class="text-gray-400 fs-6">Aucune activité ne correspond à votre recherche</div>
        </div>
      </div>
      
      <!-- Loading state -->
      <div v-else class="table-responsive">
        <table class="table table-row-dashed align-middle gs-0 gy-6 my-0">
          <thead>
            <tr class="fs-7 fw-bold text-gray-500 border-bottom-0">
              <th class="p-0 pb-3 min-w-100px text-start">TYPE</th>
              <th class="p-0 pb-3 min-w-140px text-start">UTILISATEUR/ORG</th>
              <th class="p-0 pb-3 min-w-120px text-start">ACTION</th>
              <th class="p-0 pb-3 w-125px text-center">STATUT</th>
              <th class="p-0 pb-3 min-w-100px text-end">HORODATAGE</th>
              <th class="p-0 pb-3 w-50px text-end">DÉTAILS</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in 5" :key="i">
              <td><div class="shimmer-box" style="width: 60px; height: 24px;"></div></td>
              <td>
                <div class="d-flex align-items-center">
                  <div class="shimmer-box me-3" style="width: 30px; height: 30px; border-radius: 50%;"></div>
                  <div>
                    <div class="shimmer-box mb-1" style="width: 80px; height: 16px;"></div>
                    <div class="shimmer-box" style="width: 120px; height: 12px;"></div>
                  </div>
                </div>
              </td>
              <td>
                <div class="shimmer-box mb-1" style="width: 100px; height: 16px;"></div>
                <div class="shimmer-box" style="width: 150px; height: 12px;"></div>
              </td>
              <td class="text-center">
                <div class="shimmer-box mx-auto" style="width: 60px; height: 24px;"></div>
              </td>
              <td class="text-end">
                <div class="shimmer-box ms-auto" style="width: 80px; height: 16px;"></div>
              </td>
              <td class="text-end">
                <div class="shimmer-box" style="width: 30px; height: 30px;"></div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDashboardStore } from '../stores/dashboardStore';
import { storeToRefs } from 'pinia';
import type { RecentActivity, ActivityType, ActivityStatus } from '../types';

const dashboardStore = useDashboardStore();
const { recentActivity, loading } = storeToRefs(dashboardStore);

const searchQuery = ref('');

// Ensure activity data is loaded
onMounted(async () => {
  if (!recentActivity.value || recentActivity.value.length === 0) {
    await dashboardStore.fetchRecentActivity();
  }
});

// Filtered activities based on search
const filteredActivities = computed(() => {
  if (!searchQuery.value) return recentActivity.value || [];
  
  const query = searchQuery.value.toLowerCase();
  return (recentActivity.value || []).filter(activity => 
    activity.title.toLowerCase().includes(query) ||
    activity.description.toLowerCase().includes(query) ||
    activity.user?.name.toLowerCase().includes(query) ||
    activity.user?.email.toLowerCase().includes(query) ||
    activity.organization?.name.toLowerCase().includes(query)
  );
});

// Utility functions
const getActivityTypeColor = (type: ActivityType): string => {
  switch (type) {
    case 'user_registration':
      return 'primary';
    case 'organization_created':
      return 'success';
    case 'application_created':
    case 'application_deployed':
      return 'info';
    case 'subscription_created':
      return 'success';
    case 'subscription_cancelled':
      return 'warning';
    case 'domain_purchased':
      return 'primary';
    case 'support_request':
      return 'warning';
    default:
      return 'secondary';
  }
};

const getActivityTypeLabel = (type: ActivityType): string => {
  switch (type) {
    case 'user_registration':
      return 'UTILISATEUR';
    case 'organization_created':
      return 'ORG';
    case 'application_created':
      return 'APP';
    case 'application_deployed':
      return 'DÉPLOIEMENT';
    case 'subscription_created':
      return 'ABONNEMENT';
    case 'subscription_cancelled':
      return 'ANNULATION';
    case 'domain_purchased':
      return 'DOMAINE';
    case 'support_request':
      return 'SUPPORT';
    default:
      return 'SYSTÈME';
  }
};

const getStatusColor = (status: ActivityStatus): string => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'in_progress':
      return 'warning';
    case 'failed':
      return 'danger';
    case 'pending':
      return 'info';
    default:
      return 'secondary';
  }
};

const getStatusLabel = (status: ActivityStatus): string => {
  switch (status) {
    case 'completed':
      return 'Terminé';
    case 'in_progress':
      return 'En cours';
    case 'failed':
      return 'Échoué';
    case 'pending':
      return 'En attente';
    default:
      return 'Inconnu';
  }
};

const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (minutes < 1) return 'À l\'instant';
  if (minutes < 60) return `il y a ${minutes} min`;
  if (hours < 24) return `il y a ${hours}h`;
  if (days < 7) return `il y a ${days}j`;
  
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Action handlers
const viewDetails = (activity: RecentActivity) => {
  // TODO: Implement activity details modal or navigation
  console.log('Affichage des détails pour:', activity);
};

const exportData = () => {
  // TODO: Implement data export
  console.log('Export des données d\'activité...');
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