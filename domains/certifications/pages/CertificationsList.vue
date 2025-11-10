<template>
  <!-- Page Header -->
  <PageHeader title="Certifications" subtitle="Manage your certifications and awards" />

    <!-- Statistics Cards -->
    <div class="row g-5 g-xl-8 mb-5 mb-xl-8" v-if="!certificationsStore.isLoading">
      <div class="col-xl-3">
        <div class="card card-flush h-xl-100">
          <div class="card-body">
            <span class="svg-icon svg-icon-2tx svg-icon-primary">
              <i class="ki-duotone ki-award fs-2tx text-primary">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
              </i>
            </span>
            <div class="fw-bold fs-2 mt-5">
              {{ certificationsStore.statistics.total }}
            </div>
            <div class="fw-semibold text-muted">
              Total Certifications
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3">
        <div class="card card-flush h-xl-100">
          <div class="card-body">
            <span class="svg-icon svg-icon-2tx svg-icon-success">
              <i class="ki-duotone ki-check-circle fs-2tx text-success">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </span>
            <div class="fw-bold fs-2 mt-5">
              {{ certificationsStore.statistics.active }}
            </div>
            <div class="fw-semibold text-muted">
              Active Certifications
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3">
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
              {{ Object.keys(certificationsStore.statistics.byCategory).length }}
            </div>
            <div class="fw-semibold text-muted">
              Categories
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3">
        <div class="card card-flush h-xl-100">
          <div class="card-body">
            <span class="svg-icon svg-icon-2tx svg-icon-warning">
              <i class="ki-duotone ki-time fs-2tx text-warning">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </span>
            <div class="fw-bold fs-2 mt-5">
              {{ certificationsStore.statistics.recent }}
            </div>
            <div class="fw-semibold text-muted">
              Recent (< 1 year)
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistics Skeleton -->
    <div class="row g-5 g-xl-8 mb-5 mb-xl-8" v-else>
      <div class="col-xl-3" v-for="i in 4" :key="i">
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
              <option :value="null">All statuses</option>
              <option :value="true">Active</option>
              <option :value="false">Inactive</option>
            </select>

            <!-- Filter by Category -->
            <select
              v-model="categoryFilter"
              @change="handleCategoryFilter"
              class="form-select form-select-solid w-200px"
              v-if="categoriesStore.hasCategories"
            >
              <option :value="null">All categories</option>
              <option
                v-for="category in categoriesStore.sortedCategories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>

            <!-- Export -->
            <button
              type="button"
              class="btn btn-light-primary"
              @click="handleExport"
            >
              <i class="ki-duotone ki-exit-up fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              Export
            </button>

            <!-- Create New -->
            <NuxtLink
              to="/certifications/create"
              class="btn btn-primary"
            >
              <i class="ki-duotone ki-plus fs-2"></i>
              Create Certification
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
              Selected
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
        <div class="table-responsive" v-if="!certificationsStore.isLoading && certificationsStore.hasCertifications">
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
                <th class="min-w-50px">File</th>
                <th class="min-w-200px">Title</th>
                <th class="min-w-125px">Category</th>
                <th class="min-w-125px">Issue Date</th>
                <th class="min-w-100px">Status</th>
                <th class="text-end min-w-100px">Actions</th>
              </tr>
            </thead>
            <tbody class="fw-semibold text-gray-600">
              <tr v-for="certification in certificationsStore.filteredCertifications" :key="certification.id">
                <td>
                  <div class="form-check form-check-sm form-check-custom form-check-solid">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      :checked="selectedIds.includes(certification.id)"
                      @change="toggleSelect(certification.id)"
                    />
                  </div>
                </td>
                <td>
                  <i
                    class="ki-duotone"
                    :class="getFileIconClass(certification.file_url)"
                  >
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                </td>
                <td>
                  <div class="d-flex flex-column">
                    <span class="text-gray-800 fw-bold">{{ certification.title }}</span>
                    <span class="text-muted fs-7" v-if="certification.issued_date">
                      Issued: {{ formatDate(certification.issued_date) }}
                    </span>
                  </div>
                </td>
                <td>
                  <span
                    v-if="certification.category"
                    class="badge"
                    :class="getCategoryBadgeClass(certification.category.name)"
                  >
                    {{ certification.category.name }}
                  </span>
                  <span v-else class="text-muted">—</span>
                </td>
                <td>
                  <span v-if="certification.issued_date">
                    {{ formatDate(certification.issued_date) }}
                  </span>
                  <span v-else class="text-muted">—</span>
                </td>
                <td>
                  <span
                    class="badge"
                    :class="getStatusBadgeClass(certification.is_active)"
                  >
                    {{ getStatusText(certification.is_active) }}
                  </span>
                </td>
                <td class="text-end">
                  <button
                    type="button"
                    class="btn btn-sm btn-icon btn-light btn-active-light-primary"
                    data-kt-menu-trigger="click"
                    data-kt-menu-placement="bottom-end"
                  >
                    <i class="ki-duotone ki-dots-vertical fs-2">
                      <span class="path1"></span>
                      <span class="path2"></span>
                      <span class="path3"></span>
                    </i>
                  </button>

                  <div
                    class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-150px py-4"
                    data-kt-menu="true"
                  >
                    <div class="menu-item px-3">
                      <NuxtLink
                        :to="`/certifications/${certification.id}`"
                        class="menu-link px-3"
                      >
                        View
                      </NuxtLink>
                    </div>
                    <div class="menu-item px-3">
                      <a
                        href="#"
                        class="menu-link px-3"
                        @click.prevent="handleDownload(certification)"
                      >
                        Download
                      </a>
                    </div>
                    <div class="menu-item px-3">
                      <NuxtLink
                        :to="`/certifications/${certification.id}/edit`"
                        class="menu-link px-3"
                      >
                        Edit
                      </NuxtLink>
                    </div>
                    <div class="menu-item px-3">
                      <a
                        href="#"
                        class="menu-link px-3"
                        @click.prevent="handleToggleStatus(certification)"
                      >
                        {{ certification.is_active ? 'Deactivate' : 'Activate' }}
                      </a>
                    </div>
                    <div class="menu-item px-3">
                      <a
                        href="#"
                        class="menu-link px-3 text-danger"
                        @click.prevent="handleDelete(certification)"
                      >
                        Delete
                      </a>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Table Skeleton -->
        <div class="table-responsive" v-else-if="certificationsStore.isLoading">
          <table class="table align-middle table-row-dashed fs-6 gy-5">
            <thead>
              <tr class="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                <th class="w-10px pe-2"></th>
                <th class="min-w-50px">File</th>
                <th class="min-w-200px">Title</th>
                <th class="min-w-125px">Category</th>
                <th class="min-w-125px">Issue Date</th>
                <th class="min-w-100px">Status</th>
                <th class="text-end min-w-100px">Actions</th>
              </tr>
            </thead>
            <TableSkeleton :rows="5" :columns="6" :hasCheckbox="true" :hasActions="true" />
          </table>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="!certificationsStore.hasCertifications"
          class="text-center py-20"
        >
          <i class="ki-duotone ki-folder-down fs-5x text-gray-400 mb-5">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          <div class="fw-bold fs-3 text-gray-600 mb-2">
            No certifications created yet
          </div>
          <div class="text-gray-500 mb-5">
            Create your first certification
          </div>
          <NuxtLink to="/certifications/create" class="btn btn-primary">
            <i class="ki-duotone ki-plus fs-2"></i>
            Create Certification
          </NuxtLink>
        </div>

        <!-- Error State -->
        <div
          v-else-if="certificationsStore.hasError"
          class="alert alert-danger d-flex align-items-center p-5"
        >
          <i class="ki-duotone ki-shield-cross fs-2hx text-danger me-4">
            <span class="path1"></span>
            <span class="path2"></span>
            <span class="path3"></span>
          </i>
          <div class="d-flex flex-column">
            <h4 class="mb-1 text-dark">Error</h4>
            <span>{{ certificationsStore.error }}</span>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCertificationsStore } from '../stores/useCertificationsStore'
import { useCertificationCategoriesStore } from '../stores/useCertificationCategoriesStore'
import { useCertificationFormatters } from '../composables/useCertificationFormatters'
import { useCertificationActions } from '../composables/useCertificationActions'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import type { Certification } from '../types'

const certificationsStore = useCertificationsStore()
const categoriesStore = useCertificationCategoriesStore()
const breadcrumbStore = useBreadcrumbStore()

const {
  formatDate,
  getStatusBadgeClass,
  getStatusText,
  getCategoryBadgeClass,
  getFileIconClass
} = useCertificationFormatters()

const {
  confirmAndDeleteCertification,
  toggleCertificationStatus,
  bulkDeleteCertifications,
  exportCertificationsToCSV,
  downloadCertificationFile
} = useCertificationActions()

// Search and filters
const searchQuery = ref('')
const statusFilter = ref<boolean | null>(null)
const categoryFilter = ref<string | null>(null)

// Selection
const selectedIds = ref<string[]>([])

const allSelected = computed(() => {
  return (
    certificationsStore.filteredCertifications.length > 0 &&
    selectedIds.value.length === certificationsStore.filteredCertifications.length
  )
})

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedIds.value = []
  } else {
    selectedIds.value = certificationsStore.filteredCertifications.map((c) => c.id)
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
  await certificationsStore.debouncedSearch(searchQuery.value)
}

const handleStatusFilter = async () => {
  await certificationsStore.applyStatusFilter(statusFilter.value)
}

const handleCategoryFilter = async () => {
  await certificationsStore.applyCategoryFilter(categoryFilter.value)
}

const handleDelete = async (certification: Certification) => {
  await confirmAndDeleteCertification(certification)
}

const handleToggleStatus = async (certification: Certification) => {
  await toggleCertificationStatus(certification)
}

const handleBulkDelete = async () => {
  const success = await bulkDeleteCertifications(selectedIds.value)
  if (success) {
    selectedIds.value = []
  }
}

const handleExport = () => {
  exportCertificationsToCSV()
}

const handleDownload = (certification: Certification) => {
  downloadCertificationFile(certification)
}

// Lifecycle
onMounted(async () => {
  breadcrumbStore.setBreadcrumb([
    { title: 'Home', path: '/' },
    { title: 'Certifications', path: '/certifications' }
  ])

  await certificationsStore.initialize()
  await categoriesStore.initialize()
})
</script>
