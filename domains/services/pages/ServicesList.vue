<template>
  <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
    <div class="d-flex flex-column flex-column-fluid">
      <div id="kt_app_content" class="app-content flex-column-fluid">
        <div id="kt_app_content_container" class="app-container container-fluid">
          <!-- Statistics Cards -->
          <div class="row g-5 g-xl-8 mb-5 mb-xl-8" v-if="!servicesStore.isLoading">
            <div class="col-md-6 col-xl-3">
              <div class="card card-flush h-xl-100">
                <div class="card-body">
                  <span class="svg-icon svg-icon-2tx svg-icon-primary">
                    <i class="ki-duotone ki-category fs-2tx text-primary">
                      <span class="path1"></span>
                      <span class="path2"></span>
                      <span class="path3"></span>
                      <span class="path4"></span>
                    </i>
                  </span>
                  <div class="fw-bold fs-2 mt-5">
                    {{ servicesStore.statistics.total }}
                  </div>
                  <div class="fw-semibold text-muted">
                    Total Services
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-6 col-xl-3">
              <div class="card card-flush h-xl-100">
                <div class="card-body">
                  <span class="svg-icon svg-icon-2tx svg-icon-success">
                    <i class="ki-duotone ki-check-circle fs-2tx text-success">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </span>
                  <div class="fw-bold fs-2 mt-5">
                    {{ servicesStore.statistics.active }}
                  </div>
                  <div class="fw-semibold text-muted">
                    Active Services
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-6 col-xl-3">
              <div class="card card-flush h-xl-100">
                <div class="card-body">
                  <span class="svg-icon svg-icon-2tx svg-icon-danger">
                    <i class="ki-duotone ki-cross-circle fs-2tx text-danger">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </span>
                  <div class="fw-bold fs-2 mt-5">
                    {{ servicesStore.statistics.inactive }}
                  </div>
                  <div class="fw-semibold text-muted">
                    Inactive Services
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-6 col-xl-3">
              <div class="card card-flush h-xl-100">
                <div class="card-body">
                  <span class="svg-icon svg-icon-2tx svg-icon-info">
                    <i class="ki-duotone ki-element-11 fs-2tx text-info">
                      <span class="path1"></span>
                      <span class="path2"></span>
                      <span class="path3"></span>
                      <span class="path4"></span>
                    </i>
                  </span>
                  <div class="fw-bold fs-2 mt-5">
                    {{ Object.keys(servicesStore.statistics.byCategory).length }}
                  </div>
                  <div class="fw-semibold text-muted">
                    By Category
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Statistics Skeleton -->
          <div class="row g-5 g-xl-8 mb-5 mb-xl-8" v-else>
            <div class="col-md-6 col-xl-3" v-for="i in 4" :key="i">
              <CardSkeleton :showIcon="true" :lines="0" :showActions="false" />
            </div>
          </div>

          <!-- Main Card -->
          <div class="card">
      <div class="card-header border-0 pt-6">
        <div class="card-title">
          <!-- Search -->
          <div class="d-flex align-items-center position-relative my-1">
            <i class="ki-duotone ki-magnifier fs-3 position-absolute ms-5">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            <input
              type="text"
              v-model="searchQuery"
              @input="handleSearch"
              class="form-control form-control-solid w-250px ps-13"
              placeholder="Search by title, category..."
            />
          </div>
        </div>

        <div class="card-toolbar">
          <div class="d-flex justify-content-end gap-2" data-kt-customer-table-toolbar="base">
            <!-- View Toggle -->
            <div class="btn-group" role="group">
              <button
                type="button"
                class="btn btn-sm"
                :class="viewMode === 'grid' ? 'btn-primary' : 'btn-light'"
                @click="viewMode = 'grid'"
              >
                <i class="ki-duotone ki-element-11 fs-3">
                  <span class="path1"></span>
                  <span class="path2"></span>
                  <span class="path3"></span>
                  <span class="path4"></span>
                </i>
              </button>
              <button
                type="button"
                class="btn btn-sm"
                :class="viewMode === 'table' ? 'btn-primary' : 'btn-light'"
                @click="viewMode = 'table'"
              >
                <i class="ki-duotone ki-row-horizontal fs-3">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
              </button>
            </div>

            <!-- Filter by Status -->
            <select
              v-model="statusFilter"
              @change="handleStatusFilter"
              class="form-select form-select-solid w-150px"
            >
              <option :value="null">All Statuses</option>
              <option :value="true">Active</option>
              <option :value="false">Inactive</option>
            </select>

            <!-- Filter by Category -->
            <select
              v-model="categoryFilter"
              @change="handleCategoryFilter"
              class="form-select form-select-solid w-150px"
              v-if="servicesStore.categories.length > 0"
            >
              <option :value="null">All Categories</option>
              <option
                v-for="category in servicesStore.categories"
                :key="category"
                :value="category"
              >
                {{ category }}
              </option>
            </select>

            <!-- Create New -->
            <NuxtLink
              to="/services/create"
              class="btn btn-primary"
              v-if="servicesStore.hasServices"
            >
              <i class="ki-duotone ki-plus fs-2"></i>
              Create Service
            </NuxtLink>
          </div>

          <!-- Bulk Delete -->
          <div
            class="d-flex justify-content-end align-items-center gap-2"
            data-kt-customer-table-toolbar="selected"
            v-if="selectedIds.length > 0"
          >
            <div class="fw-bold me-5">
              <span class="me-2">{{ selectedIds.length }}</span>
              selected
            </div>
            <button
              type="button"
              class="btn btn-danger"
              @click="handleBulkDelete"
            >
              Delete Selected
            </button>
          </div>
        </div>
      </div>

      <div class="card-body pt-0">
        <!-- Grid View -->
        <div v-if="viewMode === 'grid' && !servicesStore.isLoading && servicesStore.hasServices">
          <div class="row g-5">
            <div
              v-for="service in servicesStore.filteredServices"
              :key="service.id"
              class="col-md-6 col-lg-4"
            >
              <ServiceCard :service="service" />
            </div>
          </div>
        </div>

        <!-- Table View -->
        <div class="table-responsive" v-if="viewMode === 'table' && !servicesStore.isLoading && servicesStore.hasServices">
          <table class="table align-middle table-row-dashed fs-6 gy-5">
            <thead>
              <tr class="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                <th class="w-10px pe-2">
                  <div class="form-check form-check-sm form-check-custom form-check-solid me-3">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      :checked="allSelected"
                      @change="toggleSelectAll"
                    />
                  </div>
                </th>
                <th class="min-w-50px">Icon</th>
                <th class="min-w-200px">Title</th>
                <th class="min-w-125px">Category</th>
                <th class="min-w-125px">Slug</th>
                <th class="min-w-100px">Status</th>
                <th class="min-w-70px">Order</th>
                <th class="text-end min-w-100px">Actions</th>
              </tr>
            </thead>
            <tbody class="fw-semibold text-gray-600">
              <tr v-for="service in servicesStore.filteredServices" :key="service.id">
                <td>
                  <div class="form-check form-check-sm form-check-custom form-check-solid">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      :checked="selectedIds.includes(service.id)"
                      @change="toggleSelect(service.id)"
                    />
                  </div>
                </td>
                <td>
                  <div class="symbol symbol-40px">
                    <div class="symbol-label gn-list-icon" :style="iconTileStyle(service.icon_color)">
                      <GIcon :name="service.icon || 'layers'" :size="20" />
                    </div>
                  </div>
                </td>
                <td>
                  <div class="d-flex flex-column">
                    <NuxtLink
                      :to="`/services/${service.id}/edit`"
                      class="text-gray-800 fw-bold text-hover-primary mb-1 d-block"
                    >
                      {{ service.title }}
                    </NuxtLink>
                    <span class="text-muted fs-7" v-if="service.description">
                      {{ truncate(service.description, 50) }}
                    </span>
                  </div>
                </td>
                <td>
                  <span
                    v-if="service.category"
                    class="badge"
                    :class="getCategoryBadgeClass(service.category)"
                  >
                    {{ service.category }}
                  </span>
                  <span v-else class="text-muted">—</span>
                </td>
                <td>
                  <span class="text-gray-600">{{ service.slug }}</span>
                </td>
                <td>
                  <span
                    class="badge"
                    :class="getStatusBadgeClass(service.is_active)"
                  >
                    {{ getStatusText(service.is_active) }}
                  </span>
                </td>
                <td>
                  <span class="badge badge-light">{{ service.order }}</span>
                </td>
                <td class="text-end">
                  <NuxtLink
                    :to="`/services/${service.id}/edit`"
                    class="btn btn-sm btn-icon btn-light btn-active-light-primary me-2"
                    title="Edit"
                  >
                    <i class="ki-duotone ki-pencil fs-3">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </NuxtLink>
                  <button
                    type="button"
                    class="btn btn-sm btn-icon btn-light btn-active-light-danger"
                    title="Delete"
                    @click="handleDelete(service)"
                  >
                    <i class="ki-duotone ki-trash fs-3">
                      <span class="path1"></span>
                      <span class="path2"></span>
                      <span class="path3"></span>
                      <span class="path4"></span>
                      <span class="path5"></span>
                    </i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Loading Skeleton -->
        <div v-else-if="servicesStore.isLoading">
          <div v-if="viewMode === 'grid'" class="row g-5">
            <div class="col-md-6 col-lg-4" v-for="i in 6" :key="i">
              <CardSkeleton :showIcon="true" :lines="3" :showActions="true" />
            </div>
          </div>
          <div v-else class="table-responsive">
          <table class="table align-middle table-row-dashed fs-6 gy-5">
            <thead>
              <tr class="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                <th class="w-10px pe-2"></th>
                <th class="min-w-50px">Icon</th>
                <th class="min-w-200px">Title</th>
                <th class="min-w-125px">Category</th>
                <th class="min-w-125px">Slug</th>
                <th class="min-w-100px">Status</th>
                <th class="min-w-70px">Order</th>
                <th class="text-end min-w-100px">Actions</th>
              </tr>
            </thead>
            <TableSkeleton :rows="5" :columns="7" :hasCheckbox="true" :hasActions="true" />
          </table>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="!servicesStore.hasServices"
          class="text-center py-20"
        >
          <i class="ki-duotone ki-briefcase fs-5x text-gray-400 mb-5">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          <div class="fw-bold fs-3 text-gray-600 mb-2">
            No services created yet
          </div>
          <div class="text-gray-500 mb-5">
            Create your first service
          </div>
          <NuxtLink to="/services/create" class="btn btn-primary">
            <i class="ki-duotone ki-plus fs-2"></i>
            Create Service
          </NuxtLink>
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
      </div>
    </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useServicesStore } from '../stores/useServicesStore'
import { useServiceFormatters } from '../composables/useServiceFormatters'
import { useServiceActions } from '../composables/useServiceActions'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import { useListIconTile } from '~/composables/useListIconTile'
import type { Service } from '../types'
import ServiceCard from '../components/ServiceCard.vue'
import GIcon from '~/components/icons/GIcon.vue'

const { iconTileStyle } = useListIconTile()

const servicesStore = useServicesStore()
const breadcrumbStore = useBreadcrumbStore()

const {
  truncate,
  getStatusBadgeClass,
  getStatusText,
  getCategoryBadgeClass
} = useServiceFormatters()

const {
  confirmAndDeleteService,
  toggleServiceStatus,
  bulkDeleteServices
} = useServiceActions()

// View mode, Search and filters
const viewMode = ref<'grid' | 'table'>('table')
const searchQuery = ref('')
const statusFilter = ref<boolean | null>(null)
const categoryFilter = ref<string | null>(null)

// Selection
const selectedIds = ref<string[]>([])

const allSelected = computed(() => {
  return (
    servicesStore.filteredServices.length > 0 &&
    selectedIds.value.length === servicesStore.filteredServices.length
  )
})

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedIds.value = []
  } else {
    selectedIds.value = servicesStore.filteredServices.map((s) => s.id)
  }
}

const toggleSelect = (id: string) => {
  const index = selectedIds.value.indexOf(id)
  if (index > -1) {
    selectedIds.value.splice(index, 1)
  } else {
    selectedIds.value.push(id)
  }
}

// Handlers
const handleSearch = async () => {
  await servicesStore.debouncedSearch(searchQuery.value)
}

const handleStatusFilter = async () => {
  await servicesStore.applyStatusFilter(statusFilter.value)
}

const handleCategoryFilter = async () => {
  await servicesStore.applyCategoryFilter(categoryFilter.value)
}

const handleDelete = async (service: Service) => {
  await confirmAndDeleteService(service)
}

const handleToggleStatus = async (service: Service) => {
  await toggleServiceStatus(service)
}

const handleBulkDelete = async () => {
  const success = await bulkDeleteServices(selectedIds.value)
  if (success) {
    selectedIds.value = []
  }
}

const resolveIcon = (icon: string) => {
  if (['/cloud', '/brain', '/chart'].includes(icon)) {
    return `${icon}.svg`
  }
  return icon
}

// Lifecycle
onMounted(async () => {
  breadcrumbStore.setBreadcrumb([
    { title: 'Home', path: '/' },
    { title: 'Services', path: '/services/list' }
  ])

  await servicesStore.initialize()
})
</script>
