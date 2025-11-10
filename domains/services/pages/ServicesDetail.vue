<template>
  <!-- Page Header -->
  <PageHeader
    :title="service ? service.title : 'Loading...'"
    subtitle="Service details"
  />

  <!-- Loading State -->
  <div v-if="servicesStore.isLoading" class="card">
    <div class="card-body">
      <FormSkeleton :fields="6" :showActions="false" />
    </div>
  </div>

  <!-- Error State -->
  <div
    v-else-if="servicesStore.hasError"
    class="alert alert-danger d-flex align-items-center p-5"
  >
    <i class="ki-duotone ki-shield-cross fs-2hx text-danger me-4">
      <span class="path1"></span>
      <span class="path2"></span>
      <span class="path3"></span>
    </i>
    <div class="d-flex flex-column">
      <h4 class="mb-1 text-dark">An error occurred</h4>
      <span>{{ servicesStore.error }}</span>
    </div>
  </div>

  <!-- Service Details -->
  <div v-else-if="service" class="row g-5 g-xl-8">
      <!-- Main Details Card -->
      <div class="col-xl-8">
        <div class="card mb-5 mb-xl-8">
          <div class="card-header border-0 pt-5">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold fs-3 mb-1">
                Basic Information
              </span>
            </h3>
            <div class="card-toolbar">
              <NuxtLink
                :to="`/services/${service.id}/edit`"
                class="btn btn-sm btn-light-primary"
              >
                <i class="ki-duotone ki-pencil fs-3">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
                Edit
              </NuxtLink>
            </div>
          </div>

          <div class="card-body py-3">
            <!-- Icon -->
            <div class="mb-7" v-if="service.icon">
              <label class="fw-bold fs-6 mb-2">Icon</label>
              <div class="symbol symbol-150px mt-2">
                <img :src="service.icon" :alt="service.title" class="w-150px" />
              </div>
            </div>

            <!-- Title -->
            <div class="mb-7">
              <label class="fw-bold fs-6 mb-2">Title</label>
              <div class="fs-4 text-gray-800">{{ service.title }}</div>
            </div>

            <!-- Description -->
            <div class="mb-7" v-if="service.description">
              <label class="fw-bold fs-6 mb-2">Description</label>
              <div class="text-gray-700 fs-6">{{ service.description }}</div>
            </div>

            <!-- Category -->
            <div class="mb-7" v-if="service.category">
              <label class="fw-bold fs-6 mb-2">Category</label>
              <div>
                <span
                  class="badge badge-lg"
                  :class="getCategoryBadgeClass(service.category)"
                >
                  {{ service.category }}
                </span>
              </div>
            </div>

            <!-- Slug -->
            <div class="mb-7">
              <label class="fw-bold fs-6 mb-2">Slug</label>
              <div class="text-gray-700">
                <code class="bg-light p-2 rounded">{{ service.slug }}</code>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="col-xl-4">
        <!-- Status & Settings Card -->
        <div class="card mb-5 mb-xl-8">
          <div class="card-header border-0 pt-5">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold fs-3 mb-1">
                Settings
              </span>
            </h3>
          </div>

          <div class="card-body py-3">
            <!-- Status -->
            <div class="mb-7">
              <label class="fw-bold fs-6 mb-2">Status</label>
              <div>
                <span
                  class="badge badge-lg"
                  :class="getStatusBadgeClass(service.is_active)"
                >
                  {{ getStatusText(service.is_active) }}
                </span>
              </div>
            </div>

            <!-- Order -->
            <div class="mb-7">
              <label class="fw-bold fs-6 mb-2">Order</label>
              <div class="text-gray-800">{{ service.order }}</div>
            </div>

            <!-- Application -->
            <div class="mb-7" v-if="service.application">
              <label class="fw-bold fs-6 mb-2">Application</label>
              <div class="text-gray-800">{{ service.application.name }}</div>
            </div>

            <!-- Created At -->
            <div class="mb-7">
              <label class="fw-bold fs-6 mb-2">Created At</label>
              <div class="text-gray-700">
                {{ formatDateTime(service.created_at) }}
              </div>
              <div class="text-muted fs-7">
                {{ formatRelativeDate(service.created_at) }}
              </div>
            </div>

            <!-- Updated At -->
            <div class="mb-7">
              <label class="fw-bold fs-6 mb-2">Updated At</label>
              <div class="text-gray-700">
                {{ formatDateTime(service.updated_at) }}
              </div>
              <div class="text-muted fs-7">
                {{ formatRelativeDate(service.updated_at) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Actions Card -->
        <div class="card">
          <div class="card-header border-0 pt-5">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold fs-3 mb-1">
                Actions
              </span>
            </h3>
          </div>

          <div class="card-body py-3">
            <div class="d-flex flex-column gap-3">
              <!-- Edit -->
              <NuxtLink
                :to="`/services/${service.id}/edit`"
                class="btn btn-light-primary"
              >
                <i class="ki-duotone ki-pencil fs-3">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
                Edit
              </NuxtLink>

              <!-- Toggle Status -->
              <button
                type="button"
                class="btn"
                :class="service.is_active ? 'btn-light-warning' : 'btn-light-success'"
                @click="handleToggleStatus"
              >
                <i class="ki-duotone ki-toggle-on fs-3">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
                {{ service.is_active ? 'Deactivate' : 'Activate' }}
              </button>

              <!-- Duplicate -->
              <button
                type="button"
                class="btn btn-light-info"
                @click="handleDuplicate"
              >
                <i class="ki-duotone ki-copy fs-3">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
                Duplicate
              </button>

              <!-- Delete -->
              <button
                type="button"
                class="btn btn-light-danger"
                @click="handleDelete"
              >
                <i class="ki-duotone ki-trash fs-3">
                  <span class="path1"></span>
                  <span class="path2"></span>
                  <span class="path3"></span>
                  <span class="path4"></span>
                  <span class="path5"></span>
                </i>
                Delete
              </button>

              <!-- Back to List -->
              <NuxtLink
                to="/services"
                class="btn btn-light"
              >
                <i class="ki-duotone ki-arrow-left fs-3">
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
import { computed, onMounted } from 'vue'
import { useServicesStore } from '../stores/useServicesStore'
import { useServiceFormatters } from '../composables/useServiceFormatters'
import { useServiceActions } from '../composables/useServiceActions'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'

const servicesStore = useServicesStore()
const breadcrumbStore = useBreadcrumbStore()
const route = useRoute()
const router = useRouter()

const {
  formatDateTime,
  formatRelativeDate,
  getStatusBadgeClass,
  getStatusText,
  getCategoryBadgeClass
} = useServiceFormatters()

const {
  confirmAndDeleteService,
  toggleServiceStatus,
  duplicateService
} = useServiceActions()

const serviceId = computed(() => route.params.id as string)
const service = computed(() => servicesStore.currentService)

// Handlers
const handleToggleStatus = async () => {
  if (!service.value) return

  const success = await toggleServiceStatus(service.value)
  if (success) {
    // Refresh the service data
    await servicesStore.fetchService(serviceId.value)
  }
}

const handleDuplicate = async () => {
  if (!service.value) return

  const success = await duplicateService(service.value)
  if (success) {
    // Redirect to services list
    await router.push('/services')
  }
}

const handleDelete = async () => {
  if (!service.value) return

  const deleted = await confirmAndDeleteService(service.value)
  if (deleted) {
    await router.push('/services')
  }
}

// Lifecycle
onMounted(async () => {
  // Fetch service
  try {
    await servicesStore.fetchService(serviceId.value)

    if (service.value) {
      breadcrumbStore.setBreadcrumb([
        { title: 'Home', path: '/' },
        { title: 'Services', path: '/services' },
        { title: service.value.title, path: `/services/${serviceId.value}` }
      ])
    }
  } catch (error) {
    console.error('Error loading service:', error)
  }
})
</script>
