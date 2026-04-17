<template>
  <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
    <div class="d-flex flex-column flex-column-fluid">
      <div id="kt_app_content" class="app-content flex-column-fluid">
        <div id="kt_app_content_container" class="app-container container-fluid">
          <!-- Statistics Cards -->
          <div class="row g-5 g-xl-8 mb-5 mb-xl-8" v-if="!industriesStore.isLoading">
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
                    {{ industriesStore.statistics.total }}
                  </div>
                  <div class="fw-semibold text-muted">
                    Total Industries
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
                    {{ industriesStore.statistics.active }}
                  </div>
                  <div class="fw-semibold text-muted">
                    Active Industries
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
                    {{ industriesStore.statistics.inactive }}
                  </div>
                  <div class="fw-semibold text-muted">
                    Inactive Industries
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
                    {{ Object.keys(industriesStore.statistics.byCategory).length }}
                  </div>
                  <div class="fw-semibold text-muted">
                    Categories
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
              class="form-select form-select-solid w-180px"
            >
              <option :value="null">All Categories</option>
              <option
                v-for="cat in categoryOptions"
                :key="cat.value"
                :value="cat.value"
              >
                {{ cat.label }}
              </option>
            </select>

            <!-- Create New -->
            <NuxtLink
              to="/industries/create"
              class="btn btn-primary"
            >
              <i class="ki-duotone ki-plus fs-2"></i>
              Create Industry
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
        <!-- Table -->
        <div class="table-responsive" v-if="!industriesStore.isLoading && industriesStore.hasIndustries">
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
                <th class="min-w-150px">Short Description</th>
                <th class="min-w-125px">Slug</th>
                <th class="min-w-100px">Status</th>
                <th class="min-w-70px">Order</th>
                <th class="text-end min-w-100px">Actions</th>
              </tr>
            </thead>
            <tbody class="fw-semibold text-gray-600">
              <tr v-for="industry in industriesStore.filteredIndustries" :key="industry.id">
                <td>
                  <div class="form-check form-check-sm form-check-custom form-check-solid">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      :checked="selectedIds.includes(industry.id)"
                      @change="toggleSelect(industry.id)"
                    />
                  </div>
                </td>
                <td>
                  <div class="symbol symbol-40px">
                    <div class="symbol-label gn-list-icon" :style="iconTileStyle(industry.icon_color)">
                      <GIcon :name="industry.icon || 'briefcase'" :size="20" />
                    </div>
                  </div>
                </td>
                <td>
                  <div class="d-flex flex-column">
                    <NuxtLink
                      :to="`/industries/${industry.id}/edit`"
                      class="text-gray-800 fw-bold text-hover-primary mb-1 d-block"
                    >
                      {{ industry.title }}
                    </NuxtLink>
                    <span class="text-muted fs-7" v-if="industry.short_description">
                      {{ truncate(industry.short_description, 50) }}
                    </span>
                  </div>
                </td>
                <td>
                  <span
                    v-if="industry.category"
                    class="badge"
                    :class="getCategoryBadgeClass(industry.category)"
                  >
                    <i :class="getCategoryIcon(industry.category)" class="me-1"></i>
                    {{ formatCategory(industry.category) }}
                  </span>
                  <span v-else class="text-muted">&mdash;</span>
                </td>
                <td>
                  <span class="text-gray-600">{{ truncate(industry.short_description, 40) }}</span>
                </td>
                <td>
                  <span class="text-gray-600">{{ industry.slug }}</span>
                </td>
                <td>
                  <span
                    class="badge"
                    :class="getStatusBadgeClass(industry.is_active)"
                  >
                    {{ getStatusText(industry.is_active) }}
                  </span>
                </td>
                <td>
                  <span class="badge badge-light">{{ industry.order }}</span>
                </td>
                <td class="text-end">
                  <NuxtLink
                    :to="`/industries/${industry.id}/edit`"
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
                    @click="handleDelete(industry)"
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

        <!-- Table Skeleton -->
        <div class="table-responsive" v-else-if="industriesStore.isLoading">
          <table class="table align-middle table-row-dashed fs-6 gy-5">
            <thead>
              <tr class="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                <th class="w-10px pe-2"></th>
                <th class="min-w-50px">Icon</th>
                <th class="min-w-200px">Title</th>
                <th class="min-w-125px">Category</th>
                <th class="min-w-150px">Short Description</th>
                <th class="min-w-125px">Slug</th>
                <th class="min-w-100px">Status</th>
                <th class="min-w-70px">Order</th>
                <th class="text-end min-w-100px">Actions</th>
              </tr>
            </thead>
            <TableSkeleton :rows="5" :columns="8" :hasCheckbox="true" :hasActions="true" />
          </table>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="!industriesStore.hasIndustries"
          class="text-center py-20"
        >
          <i class="ki-duotone ki-folder-down fs-5x text-gray-400 mb-5">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          <div class="fw-bold fs-3 text-gray-600 mb-2">
            No industries created yet
          </div>
          <div class="text-gray-500 mb-5">
            Create your first industry sector
          </div>
          <NuxtLink to="/industries/create" class="btn btn-primary">
            <i class="ki-duotone ki-plus fs-2"></i>
            Create Industry
          </NuxtLink>
        </div>

        <!-- Error State -->
        <div
          v-else-if="industriesStore.hasError"
          class="alert alert-danger d-flex align-items-center p-5"
        >
          <i class="ki-duotone ki-shield-cross fs-2hx text-danger me-4">
            <span class="path1"></span>
            <span class="path2"></span>
            <span class="path3"></span>
          </i>
          <div class="d-flex flex-column">
            <h4 class="mb-1 text-dark">An error occurred</h4>
            <span>{{ industriesStore.error }}</span>
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
import { useIndustriesStore } from '../stores/useIndustriesStore'
import { useIndustryFormatters } from '../composables/useIndustryFormatters'
import { useIndustryActions } from '../composables/useIndustryActions'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import { useListIconTile } from '~/composables/useListIconTile'
import { IndustryCategory, INDUSTRY_CATEGORY_CONFIG } from '../types'
import type { Industry } from '../types'
import GIcon from '~/components/icons/GIcon.vue'

const { iconTileStyle } = useListIconTile()

const industriesStore = useIndustriesStore()
const breadcrumbStore = useBreadcrumbStore()

const {
  truncate,
  getStatusBadgeClass,
  getStatusText,
  getCategoryBadgeClass,
  getCategoryIcon,
  formatCategory
} = useIndustryFormatters()

const {
  confirmAndDeleteIndustry,
  toggleIndustryStatus,
  bulkDeleteIndustries
} = useIndustryActions()

// Category options for filter dropdown
const categoryOptions = Object.entries(INDUSTRY_CATEGORY_CONFIG).map(([value, config]) => ({
  value,
  label: config.label
}))

// Search and filters
const searchQuery = ref('')
const statusFilter = ref<boolean | null>(null)
const categoryFilter = ref<IndustryCategory | null>(null)

// Selection
const selectedIds = ref<string[]>([])

const allSelected = computed(() => {
  return (
    industriesStore.filteredIndustries.length > 0 &&
    selectedIds.value.length === industriesStore.filteredIndustries.length
  )
})

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedIds.value = []
  } else {
    selectedIds.value = industriesStore.filteredIndustries.map((i) => i.id)
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
  await industriesStore.debouncedSearch(searchQuery.value)
}

const handleStatusFilter = async () => {
  await industriesStore.applyStatusFilter(statusFilter.value)
}

const handleCategoryFilter = async () => {
  await industriesStore.applyCategoryFilter(categoryFilter.value)
}

const handleDelete = async (industry: Industry) => {
  await confirmAndDeleteIndustry(industry)
}

const handleToggleStatus = async (industry: Industry) => {
  await toggleIndustryStatus(industry)
}

const handleBulkDelete = async () => {
  const success = await bulkDeleteIndustries(selectedIds.value)
  if (success) {
    selectedIds.value = []
  }
}

// Lifecycle
onMounted(async () => {
  breadcrumbStore.setBreadcrumb([
    { title: 'Home', path: '/' },
    { title: 'Industries', path: '/industries' }
  ])

  await industriesStore.initialize()
})
</script>
