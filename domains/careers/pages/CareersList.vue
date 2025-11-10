<template>
  <div class="careers-list">
    <!-- Page Header -->
    <PageHeader
      title="Job Positions"
      subtitle="Manage your organization's career opportunities"
    />

    <!-- Statistics Cards -->
    <div class="row g-5 g-xl-8 mb-5 mb-xl-8" v-if="!careersStore.isLoading">
      <div class="col-xl-3">
        <div class="card card-flush h-xl-100">
          <div class="card-body">
            <span class="svg-icon svg-icon-2tx svg-icon-primary">
              <i class="ki-duotone ki-briefcase fs-2tx text-primary">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </span>
            <div class="fw-bold fs-2 mt-5">
              {{ careersStore.statistics.total }}
            </div>
            <div class="fw-semibold text-muted">
              Total Positions
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
              {{ careersStore.statistics.active }}
            </div>
            <div class="fw-semibold text-muted">
              Active Positions
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3">
        <div class="card card-flush h-xl-100">
          <div class="card-body">
            <span class="svg-icon svg-icon-2tx svg-icon-danger">
              <i class="ki-duotone ki-cross-circle fs-2tx text-danger">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </span>
            <div class="fw-bold fs-2 mt-5">
              {{ careersStore.statistics.closed }}
            </div>
            <div class="fw-semibold text-muted">
              Closed Positions
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3">
        <div class="card card-flush h-xl-100">
          <div class="card-body">
            <span class="svg-icon svg-icon-2tx svg-icon-info">
              <i class="ki-duotone ki-geolocation fs-2tx text-info">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </span>
            <div class="fw-bold fs-2 mt-5">
              {{ careersStore.statistics.remote }}
            </div>
            <div class="fw-semibold text-muted">
              Remote Positions
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
              placeholder="Search positions..."
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
              <option value="ACTIVE">Active</option>
              <option value="CLOSED">Closed</option>
            </select>

            <!-- Filter by Job Type -->
            <select
              v-model="jobTypeFilter"
              @change="handleJobTypeFilter"
              class="form-select form-select-solid w-150px"
            >
              <option :value="null">All Types</option>
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
            </select>

            <!-- Filter by Remote -->
            <select
              v-model="remoteFilter"
              @change="handleRemoteFilter"
              class="form-select form-select-solid w-150px"
            >
              <option :value="null">All Locations</option>
              <option :value="true">Remote</option>
              <option :value="false">On-site</option>
            </select>

            <!-- Filter by Department -->
            <select
              v-model="departmentFilter"
              @change="handleDepartmentFilter"
              class="form-select form-select-solid w-150px"
              v-if="careersStore.departments.length > 0"
            >
              <option :value="null">All Departments</option>
              <option
                v-for="dept in careersStore.departments"
                :key="dept"
                :value="dept"
              >
                {{ dept }}
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
              to="/careers/positions/create"
              class="btn btn-primary"
            >
              <i class="ki-duotone ki-plus fs-2"></i>
              New Position
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
              Delete Selection
            </button>
          </div>
        </div>
      </div>

      <div class="card-body pt-0">
        <!-- Table -->
        <div class="table-responsive" v-if="!careersStore.isLoading && careersStore.hasJobPositions">
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
                <th class="min-w-250px">Title</th>
                <th class="min-w-125px">Department</th>
                <th class="min-w-125px">Location</th>
                <th class="min-w-100px">Type</th>
                <th class="min-w-80px">Remote</th>
                <th class="min-w-100px">Status</th>
                <th class="min-w-100px">Posted</th>
                <th class="text-end min-w-100px">Actions</th>
              </tr>
            </thead>
            <tbody class="fw-semibold text-gray-600">
              <tr v-for="job in careersStore.filteredJobPositions" :key="job.id">
                <td>
                  <div class="form-check form-check-sm form-check-custom form-check-solid">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      :checked="selectedIds.includes(job.id)"
                      @change="toggleSelect(job.id)"
                    />
                  </div>
                </td>
                <td>
                  <div class="d-flex flex-column">
                    <NuxtLink
                      :to="`/careers/positions/${job.id}`"
                      class="text-gray-800 text-hover-primary fw-bold mb-1"
                    >
                      {{ job.title }}
                    </NuxtLink>
                    <span class="text-muted fs-7">{{ truncateText(job.summary, 60) }}</span>
                  </div>
                </td>
                <td>
                  <span
                    v-if="job.department"
                    class="badge"
                    :class="getDepartmentBadgeClass(job.department)"
                  >
                    {{ job.department }}
                  </span>
                  <span v-else class="text-muted">—</span>
                </td>
                <td>
                  <span v-if="job.location">{{ job.location }}</span>
                  <span v-else class="text-muted">—</span>
                </td>
                <td>
                  <span
                    class="badge"
                    :class="getJobTypeBadgeClass(job.job_type)"
                  >
                    {{ getJobTypeText(job.job_type) }}
                  </span>
                </td>
                <td>
                  <span
                    class="badge"
                    :class="getRemoteBadgeClass(job.is_remote)"
                  >
                    {{ getRemoteText(job.is_remote) }}
                  </span>
                </td>
                <td>
                  <span
                    class="badge"
                    :class="getStatusBadgeClass(job.status)"
                  >
                    {{ getStatusText(job.status) }}
                  </span>
                </td>
                <td>
                  <span class="text-gray-600">{{ formatRelativeDate(job.posted_date) }}</span>
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
                    class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-125px py-4"
                    data-kt-menu="true"
                  >
                    <div class="menu-item px-3">
                      <NuxtLink
                        :to="`/careers/positions/${job.id}`"
                        class="menu-link px-3"
                      >
                        View
                      </NuxtLink>
                    </div>
                    <div class="menu-item px-3">
                      <NuxtLink
                        :to="`/careers/positions/${job.id}/edit`"
                        class="menu-link px-3"
                      >
                        Edit
                      </NuxtLink>
                    </div>
                    <div class="menu-item px-3">
                      <a
                        href="#"
                        class="menu-link px-3"
                        @click.prevent="handleToggleStatus(job)"
                      >
                        {{
                          job.status === 'ACTIVE'
                            ? 'Close'
                            : 'Open'
                        }}
                      </a>
                    </div>
                    <div class="menu-item px-3">
                      <a
                        href="#"
                        class="menu-link px-3 text-danger"
                        @click.prevent="handleDelete(job)"
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
        <div class="table-responsive" v-else-if="careersStore.isLoading">
          <table class="table align-middle table-row-dashed fs-6 gy-5">
            <thead>
              <tr class="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                <th class="w-10px pe-2"></th>
                <th class="min-w-250px">Title</th>
                <th class="min-w-125px">Department</th>
                <th class="min-w-125px">Location</th>
                <th class="min-w-100px">Type</th>
                <th class="min-w-80px">Remote</th>
                <th class="min-w-100px">Status</th>
                <th class="min-w-100px">Posted</th>
                <th class="text-end min-w-100px">Actions</th>
              </tr>
            </thead>
            <TableSkeleton :rows="5" :columns="8" :hasCheckbox="true" :hasActions="true" />
          </table>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="!careersStore.hasJobPositions"
          class="text-center py-20"
        >
          <i class="ki-duotone ki-folder-down fs-5x text-gray-400 mb-5">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          <div class="fw-bold fs-3 text-gray-600 mb-2">
            No Job Positions
          </div>
          <div class="text-gray-500 mb-5">
            Start by creating your first job position
          </div>
          <NuxtLink to="/careers/positions/create" class="btn btn-primary">
            <i class="ki-duotone ki-plus fs-2"></i>
            New Position
          </NuxtLink>
        </div>

        <!-- Error State -->
        <div
          v-else-if="careersStore.hasError"
          class="alert alert-danger d-flex align-items-center p-5"
        >
          <i class="ki-duotone ki-shield-cross fs-2hx text-danger me-4">
            <span class="path1"></span>
            <span class="path2"></span>
            <span class="path3"></span>
          </i>
          <div class="d-flex flex-column">
            <h4 class="mb-1 text-dark">Error</h4>
            <span>{{ careersStore.error }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCareersStore } from '../stores/useCareersStore'
import { useCareerFormatters } from '../composables/useCareerFormatters'
import { useCareerActions } from '../composables/useCareerActions'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import type { JobPosition } from '../types'

const careersStore = useCareersStore()
const breadcrumbStore = useBreadcrumbStore()

const {
  getStatusBadgeClass,
  getStatusText,
  getJobTypeBadgeClass,
  getJobTypeText,
  getDepartmentBadgeClass,
  getRemoteBadgeClass,
  getRemoteText,
  formatRelativeDate,
  truncateText
} = useCareerFormatters()

const {
  confirmAndDeleteJobPosition,
  toggleJobPositionStatus,
  bulkDeleteJobPositions,
  exportJobPositionsToCSV
} = useCareerActions()

// Search and filters
const searchQuery = ref('')
const statusFilter = ref<string | null>(null)
const jobTypeFilter = ref<string | null>(null)
const remoteFilter = ref<boolean | null>(null)
const departmentFilter = ref<string | null>(null)

// Selection
const selectedIds = ref<string[]>([])

const allSelected = computed(() => {
  return (
    careersStore.filteredJobPositions.length > 0 &&
    selectedIds.value.length === careersStore.filteredJobPositions.length
  )
})

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedIds.value = []
  } else {
    selectedIds.value = careersStore.filteredJobPositions.map((jp) => jp.id)
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
  await careersStore.debouncedSearch(searchQuery.value)
}

const handleStatusFilter = async () => {
  await careersStore.applyStatusFilter(statusFilter.value as any)
}

const handleJobTypeFilter = async () => {
  await careersStore.applyJobTypeFilter(jobTypeFilter.value as any)
}

const handleRemoteFilter = async () => {
  await careersStore.applyRemoteFilter(remoteFilter.value)
}

const handleDepartmentFilter = async () => {
  await careersStore.applyDepartmentFilter(departmentFilter.value)
}

const handleDelete = async (job: JobPosition) => {
  await confirmAndDeleteJobPosition(job)
}

const handleToggleStatus = async (job: JobPosition) => {
  await toggleJobPositionStatus(job)
}

const handleBulkDelete = async () => {
  const success = await bulkDeleteJobPositions(selectedIds.value)
  if (success) {
    selectedIds.value = []
  }
}

const handleExport = () => {
  exportJobPositionsToCSV()
}

// Lifecycle
onMounted(async () => {
  breadcrumbStore.setBreadcrumb([
    { title: 'Home', path: '/' },
    { title: 'Job Positions', path: '/careers/positions' }
  ])

  await careersStore.initialize()
})
</script>
