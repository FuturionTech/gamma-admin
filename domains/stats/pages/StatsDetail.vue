<template>
  <!-- Page Header -->
  <PageHeader title="Statistic Details" />

  <!-- Loading Skeleton -->
  <div v-if="isLoading" class="row g-5 g-xl-8">
    <!-- Main Content Skeleton -->
    <div class="col-xl-8">
      <div class="card mb-5 mb-xl-8">
        <div class="card-body">
          <!-- Icon Skeleton -->
          <div class="text-center mb-7">
            <div class="shimmer mx-auto" style="height: 150px; width: 150px; border-radius: 50%;"></div>
          </div>

          <!-- Value Skeleton -->
          <div class="text-center mb-7">
            <div class="shimmer mx-auto mb-3" style="height: 48px; width: 200px; border-radius: 4px;"></div>
            <div class="shimmer mx-auto" style="height: 24px; width: 150px; border-radius: 4px;"></div>
          </div>

          <!-- Actions Skeleton -->
          <div class="d-flex justify-content-center gap-3">
            <div class="shimmer" style="height: 40px; width: 100px; border-radius: 6px;"></div>
            <div class="shimmer" style="height: 40px; width: 100px; border-radius: 6px;"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sidebar Skeleton -->
    <div class="col-xl-4">
      <div class="card mb-5 mb-xl-8">
        <div class="card-header border-0">
          <div class="shimmer" style="height: 20px; width: 120px; border-radius: 4px;"></div>
        </div>
        <div class="card-body pt-0">
          <div v-for="i in 6" :key="i" class="mb-7">
            <div class="shimmer mb-2" style="height: 14px; width: 80px; border-radius: 4px;"></div>
            <div class="shimmer" style="height: 18px; width: 120px; border-radius: 4px;"></div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header border-0">
          <div class="shimmer" style="height: 20px; width: 120px; border-radius: 4px;"></div>
        </div>
        <div class="card-body pt-0">
          <div v-for="i in 3" :key="i" class="mb-3">
            <div class="shimmer" style="height: 40px; width: 100%; border-radius: 6px;"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Error State -->
  <div v-else-if="loadError" class="alert alert-danger d-flex align-items-center p-5">
    <i class="ki-duotone ki-shield-cross fs-2hx text-danger me-4">
      <span class="path1"></span>
      <span class="path2"></span>
      <span class="path3"></span>
    </i>
    <div class="d-flex flex-column">
      <h4 class="mb-1 text-dark">An error occurred</h4>
      <span>{{ loadError }}</span>
    </div>
  </div>

  <!-- Detail View -->
  <div v-else-if="stat" class="row g-5 g-xl-8">
    <!-- Main Content -->
    <div class="col-xl-8">
      <div class="card mb-5 mb-xl-8">
        <div class="card-body">
          <!-- Icon Display -->
          <div class="text-center mb-7">
            <div class="symbol symbol-150px mx-auto">
              <span class="symbol-label bg-light-primary">
                <i :class="getIconClasses(stat.icon)" class="fs-5x text-primary"></i>
              </span>
            </div>
          </div>

          <!-- Stat Value & Label -->
          <div class="text-center mb-10">
            <div class="fw-bold text-gray-900 fs-2x mb-3">
              {{ formatStatValue(stat) }}
            </div>
            <div class="text-muted fs-3 fw-semibold">
              {{ stat.label }}
            </div>
          </div>

          <!-- Actions -->
          <div class="d-flex justify-content-center gap-3">
            <NuxtLink
              :to="`/stats/edit/${stat.id}`"
              class="btn btn-primary"
            >
              <i class="ki-duotone ki-pencil fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              Edit
            </NuxtLink>
            <button
              type="button"
              class="btn btn-light-danger"
              @click="handleDelete"
            >
              <i class="ki-duotone ki-trash fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
                <span class="path4"></span>
                <span class="path5"></span>
              </i>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Sidebar -->
    <div class="col-xl-4">
      <!-- Details Card -->
      <div class="card mb-5 mb-xl-8">
        <div class="card-header border-0">
          <div class="card-title">
            <h3 class="fw-bold m-0">Information</h3>
          </div>
        </div>
        <div class="card-body pt-0">
          <!-- Status -->
          <div class="mb-7">
            <div class="fw-semibold text-gray-600 mb-2">
              Status
            </div>
            <span
              class="badge badge-lg"
              :class="getStatusBadgeClass(stat.is_active)"
            >
              {{ getStatusText(stat.is_active) }}
            </span>
          </div>

          <!-- Value -->
          <div class="mb-7">
            <div class="fw-semibold text-gray-600 mb-2">
              Value
            </div>
            <div class="text-gray-800 fw-bold">{{ stat.value }}</div>
          </div>

          <!-- Unit -->
          <div class="mb-7">
            <div class="fw-semibold text-gray-600 mb-2">
              Unit
            </div>
            <div class="text-gray-800">{{ stat.unit || 'None' }}</div>
          </div>

          <!-- Icon -->
          <div class="mb-7">
            <div class="fw-semibold text-gray-600 mb-2">
              Icon
            </div>
            <div class="d-flex align-items-center gap-3">
              <i :class="getIconClasses(stat.icon)" class="fs-2x text-primary"></i>
              <span class="text-gray-800">{{ stat.icon || 'None' }}</span>
            </div>
          </div>

          <!-- Order -->
          <div class="mb-7">
            <div class="fw-semibold text-gray-600 mb-2">
              Order
            </div>
            <span class="badge badge-light-primary badge-lg">{{ stat.order }}</span>
          </div>

          <!-- Created At -->
          <div class="mb-7">
            <div class="fw-semibold text-gray-600 mb-2">
              Created At
            </div>
            <div class="text-gray-800">{{ formatDate(stat.created_at) }}</div>
          </div>

          <!-- Updated At -->
          <div class="mb-7">
            <div class="fw-semibold text-gray-600 mb-2">
              Updated At
            </div>
            <div class="text-gray-800">{{ formatDate(stat.updated_at) }}</div>
          </div>

          <!-- Application -->
          <div v-if="stat.application" class="mb-7">
            <div class="fw-semibold text-gray-600 mb-2">
              Application
            </div>
            <div class="text-gray-800">{{ stat.application.name }}</div>
          </div>
        </div>
      </div>

      <!-- Quick Actions Card -->
      <div class="card">
        <div class="card-header border-0">
          <div class="card-title">
            <h3 class="fw-bold m-0">Quick Actions</h3>
          </div>
        </div>
        <div class="card-body pt-0">
          <div class="d-flex flex-column gap-3">
            <button
              type="button"
              class="btn btn-light-primary w-100 justify-content-start"
              @click="handleToggleStatus"
            >
              <i class="ki-duotone ki-toggle-off-circle fs-2 me-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              {{ stat.is_active ? 'Deactivate' : 'Activate' }}
            </button>
            <NuxtLink
              to="/stats"
              class="btn btn-light w-100 justify-content-start"
            >
              <i class="ki-duotone ki-arrow-left fs-2 me-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              Back to List
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStatsStore } from '../stores/useStatsStore'
import { useStatFormatters } from '../composables/useStatFormatters'
import { useStatActions } from '../composables/useStatActions'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'

const route = useRoute()
const router = useRouter()
const statsStore = useStatsStore()
const breadcrumbStore = useBreadcrumbStore()

const {
  formatDate,
  formatStatValue,
  getStatusBadgeClass,
  getStatusText,
  getIconClasses
} = useStatFormatters()

const {
  confirmAndDeleteStat,
  toggleStatStatus
} = useStatActions()

const statId = computed(() => route.params.id as string)

const isLoading = ref(true)
const loadError = ref('')
const stat = computed(() => statsStore.currentStat)

// Load statistic
const loadStat = async () => {
  isLoading.value = true
  loadError.value = ''

  try {
    const result = await statsStore.fetchStat(statId.value)

    if (result) {
      // Update breadcrumb
      breadcrumbStore.setBreadcrumb([
        { title: 'Home', path: '/' },
        { title: 'Statistics', path: '/stats' },
        { title: result.label, path: `/stats/${result.id}` }
      ])
    }
  } catch (error: any) {
    loadError.value = error.message || 'Failed to load statistic'
  } finally {
    isLoading.value = false
  }
}

// Handlers
const handleDelete = async () => {
  if (!stat.value) return

  const success = await confirmAndDeleteStat(stat.value)
  if (success) {
    await router.push('/stats')
  }
}

const handleToggleStatus = async () => {
  if (!stat.value) return
  await toggleStatStatus(stat.value)
  // Reload to show updated status
  await loadStat()
}

// Lifecycle
onMounted(async () => {
  await loadStat()
})
</script>

<style scoped>
.shimmer {
  background: linear-gradient(90deg,
    rgba(240, 240, 240, 0.4) 25%,
    rgba(240, 240, 240, 0.8) 37%,
    rgba(240, 240, 240, 0.4) 63%
  );
  background-size: 400% 100%;
  animation: shimmer-wave 1.8s ease-in-out infinite;
}

@keyframes shimmer-wave {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
</style>
