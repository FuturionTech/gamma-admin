<template>
  <!-- Page Header -->
  <PageHeader title="Client Details" />

  <!-- Loading State with Shimmer -->
  <div v-if="isLoading">
    <!-- Header Skeleton -->
    <div class="d-flex justify-content-between align-items-center mb-5">
      <div>
        <div class="shimmer" style="height: 36px; width: 300px; border-radius: 4px;"></div>
        <div class="d-flex gap-3 mt-2">
          <div class="shimmer" style="height: 24px; width: 80px; border-radius: 12px;"></div>
          <div class="shimmer" style="height: 24px; width: 100px; border-radius: 12px;"></div>
        </div>
      </div>
      <div class="d-flex gap-2">
        <div class="shimmer" style="height: 40px; width: 80px; border-radius: 6px;"></div>
        <div class="shimmer" style="height: 40px; width: 80px; border-radius: 6px;"></div>
      </div>
    </div>

    <div class="row g-5 g-xl-8">
      <!-- Main Content Skeleton -->
      <div class="col-xl-8">
        <div class="card mb-5">
          <div class="card-body text-center">
            <div class="shimmer mb-5" style="height: 200px; width: 200px; border-radius: 8px; margin: 0 auto;"></div>
            <div class="shimmer mb-3" style="height: 32px; width: 250px; margin: 0 auto;"></div>
            <div class="shimmer" style="height: 24px; width: 150px; margin: 0 auto;"></div>
          </div>
        </div>
      </div>

      <!-- Sidebar Skeleton -->
      <div class="col-xl-4">
        <div class="card">
          <div class="card-body">
            <div class="shimmer mb-4" style="height: 20px; width: 120px;"></div>
            <div v-for="i in 6" :key="i" class="mb-4">
              <div class="shimmer mb-2" style="height: 12px; width: 80px;"></div>
              <div class="shimmer" style="height: 16px; width: 150px;"></div>
            </div>
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
  <div v-else-if="client" class="row g-5 g-xl-8">
    <!-- Main Content -->
    <div class="col-xl-8">
      <div class="card mb-5 mb-xl-8">
        <div class="card-body">
          <!-- Logo Display -->
          <div class="text-center mb-7">
            <div v-if="client.logo_url" class="mb-5">
              <img
                :src="client.logo_url"
                :alt="client.name"
                class="mw-100"
                style="max-height: 200px; object-fit: contain;"
              />
            </div>
            <div
              v-else
              class="symbol symbol-150px symbol-circle bg-light-primary mb-5"
              style="margin: 0 auto;"
            >
              <span class="symbol-label fs-1 fw-bold text-primary">
                {{ getInitials(client.name) }}
              </span>
            </div>
          </div>

          <!-- Client Name -->
          <div class="text-center mb-5">
            <h1 class="fw-bold text-gray-900 mb-3">{{ client.name }}</h1>
            <div class="d-flex justify-content-center gap-3">
              <span
                v-if="client.industry"
                class="badge badge-lg"
                :class="getIndustryBadgeClass(client.industry)"
              >
                {{ client.industry }}
              </span>
              <span
                class="badge badge-lg"
                :class="getStatusBadgeClass(client.is_active)"
              >
                {{ getStatusText(client.is_active) }}
              </span>
            </div>
          </div>

          <!-- Website URL -->
          <div v-if="client.website_url" class="text-center mb-7">
            <a
              :href="client.website_url"
              target="_blank"
              class="btn btn-light-primary"
            >
              <i class="ki-duotone ki-global fs-2 me-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              Visit Website
              <i class="ki-duotone ki-arrow-up-right fs-7 ms-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </a>
          </div>

          <!-- Actions -->
          <div class="d-flex justify-content-center gap-3">
            <NuxtLink
              :to="`/clients/${client.id}/edit`"
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
              :class="getStatusBadgeClass(client.is_active)"
            >
              {{ getStatusText(client.is_active) }}
            </span>
          </div>

          <!-- Industry -->
          <div v-if="client.industry" class="mb-7">
            <div class="fw-semibold text-gray-600 mb-2">
              Industry
            </div>
            <span
              class="badge badge-lg"
              :class="getIndustryBadgeClass(client.industry)"
            >
              {{ client.industry }}
            </span>
          </div>

          <!-- Website -->
          <div v-if="client.website_url" class="mb-7">
            <div class="fw-semibold text-gray-600 mb-2">
              Website
            </div>
            <a
              :href="client.website_url"
              target="_blank"
              class="text-primary text-hover-dark"
            >
              {{ formatWebsiteUrl(client.website_url) }}
              <i class="ki-duotone ki-arrow-up-right fs-7 ms-1">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </a>
          </div>

          <!-- Order -->
          <div class="mb-7">
            <div class="fw-semibold text-gray-600 mb-2">
              Display Order
            </div>
            <span class="badge badge-light-primary badge-lg">{{ client.order }}</span>
          </div>

          <!-- Created At -->
          <div class="mb-7">
            <div class="fw-semibold text-gray-600 mb-2">
              Created At
            </div>
            <div class="text-gray-800">{{ formatDate(client.created_at) }}</div>
          </div>

          <!-- Updated At -->
          <div class="mb-0">
            <div class="fw-semibold text-gray-600 mb-2">
              Updated At
            </div>
            <div class="text-gray-800">{{ formatDate(client.updated_at) }}</div>
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
              {{ client.is_active ? 'Deactivate' : 'Activate' }}
            </button>
            <NuxtLink
              to="/clients"
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
import { useClientsStore } from '../stores/useClientsStore'
import { useClientFormatters } from '../composables/useClientFormatters'
import { useClientActions } from '../composables/useClientActions'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'

const route = useRoute()
const router = useRouter()
const clientsStore = useClientsStore()
const breadcrumbStore = useBreadcrumbStore()

const {
  formatDate,
  getStatusBadgeClass,
  getStatusText,
  getIndustryBadgeClass,
  formatWebsiteUrl,
  getInitials
} = useClientFormatters()

const {
  confirmAndDeleteClient,
  toggleClientStatus
} = useClientActions()

const clientId = computed(() => route.params.id as string)

const isLoading = ref(true)
const loadError = ref('')
const client = computed(() => clientsStore.currentClient)

// Load client
const loadClient = async () => {
  isLoading.value = true
  loadError.value = ''

  try {
    const result = await clientsStore.fetchClient(clientId.value)

    if (result) {
      // Update breadcrumb
      breadcrumbStore.setBreadcrumb([
        { title: 'Home', path: '/' },
        { title: 'Clients', path: '/clients' },
        { title: result.name, path: `/clients/${result.id}` }
      ])
    }
  } catch (error: any) {
    loadError.value = error.message || 'Failed to load client'
  } finally {
    isLoading.value = false
  }
}

// Handlers
const handleDelete = async () => {
  if (!client.value) return

  const success = await confirmAndDeleteClient(client.value)
  if (success) {
    await router.push('/clients')
  }
}

const handleToggleStatus = async () => {
  if (!client.value) return
  await toggleClientStatus(client.value)
}

// Lifecycle
onMounted(async () => {
  await loadClient()
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
