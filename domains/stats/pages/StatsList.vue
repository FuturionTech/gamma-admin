<template>
  <!-- Page Header -->
  <PageHeader title="Statistics" subtitle="Manage website statistics and metrics" />

  <!-- Statistics Cards -->
    <div class="row g-5 g-xl-8 mb-5 mb-xl-8" v-if="!statsStore.isLoading">
      <div class="col-xl-4">
        <div class="card card-flush h-xl-100">
          <div class="card-body">
            <span class="svg-icon svg-icon-2tx svg-icon-primary">
              <i class="ki-duotone ki-chart-simple fs-2tx text-primary">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
                <span class="path4"></span>
              </i>
            </span>
            <div class="fw-bold fs-2 mt-5">
              {{ statsStore.statistics.total }}
            </div>
            <div class="fw-semibold text-muted">
              Total Statistics
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-4">
        <div class="card card-flush h-xl-100">
          <div class="card-body">
            <span class="svg-icon svg-icon-2tx svg-icon-success">
              <i class="ki-duotone ki-check-circle fs-2tx text-success">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </span>
            <div class="fw-bold fs-2 mt-5">
              {{ statsStore.statistics.active }}
            </div>
            <div class="fw-semibold text-muted">
              Active Statistics
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-4">
        <div class="card card-flush h-xl-100">
          <div class="card-body">
            <span class="svg-icon svg-icon-2tx svg-icon-danger">
              <i class="ki-duotone ki-cross-circle fs-2tx text-danger">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </span>
            <div class="fw-bold fs-2 mt-5">
              {{ statsStore.statistics.inactive }}
            </div>
            <div class="fw-semibold text-muted">
              Inactive Statistics
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistics Skeleton -->
    <div class="row g-5 g-xl-8 mb-5 mb-xl-8" v-else>
      <div class="col-xl-4" v-for="i in 3" :key="i">
        <CardSkeleton :showIcon="true" :lines="0" :showActions="false" />
      </div>
    </div>

    <!-- Main Card -->
    <div class="card">
      <div class="card-header border-0 pt-6">
        <div class="card-title">
          <!-- Search -->
          <div class="d-flex align-items-center position-relative my-1">
            <i class="ki-duotone ki-magnifier fs-1 position-absolute ms-6">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            <input
              type="text"
              v-model="searchQuery"
              @input="handleSearch"
              class="form-control form-control-solid w-250px ps-15"
              placeholder="Search statistics..."
            />
          </div>
        </div>

        <div class="card-toolbar">
          <div class="d-flex justify-content-end gap-2" data-kt-stat-table-toolbar="base">
            <!-- Filter Dropdown -->
            <button
              type="button"
              class="btn btn-light-primary"
              data-bs-toggle="dropdown"
            >
              <i class="ki-duotone ki-filter fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              Filter
            </button>
            <div class="dropdown-menu menu menu-sub menu-sub-dropdown w-300px w-md-325px" data-kt-menu="true">
              <div class="px-7 py-5">
                <div class="fs-5 text-dark fw-bold">Filter Options</div>
              </div>

              <div class="separator border-gray-200"></div>

              <div class="px-7 py-5">
                <!-- Status Filter -->
                <div class="mb-10">
                  <label class="form-label fw-semibold">Status:</label>
                  <div>
                    <select
                      v-model="statusFilter"
                      @change="handleFilterChange"
                      class="form-select form-select-solid"
                    >
                      <option :value="null">All Statuses</option>
                      <option :value="true">Active</option>
                      <option :value="false">Inactive</option>
                    </select>
                  </div>
                </div>

                <!-- Actions -->
                <div class="d-flex justify-content-end">
                  <button
                    type="reset"
                    class="btn btn-sm btn-light btn-active-light-primary me-2"
                    @click="handleResetFilters"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-primary"
                    data-kt-menu-dismiss="true"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>

            <!-- Export Button -->
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

            <!-- Add New Button -->
            <NuxtLink
              to="/stats/create"
              class="btn btn-primary"
            >
              <i class="ki-duotone ki-plus fs-2"></i>
              Add New Statistic
            </NuxtLink>
          </div>
        </div>
      </div>

      <div class="card-body py-4">
        <!-- Loading State -->
        <div v-if="statsStore.isLoading" class="text-center py-20">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="!statsStore.hasStats" class="text-center py-20">
          <div class="mb-5">
            <i class="ki-duotone ki-chart-simple fs-5tx text-muted">
              <span class="path1"></span>
              <span class="path2"></span>
              <span class="path3"></span>
            </i>
          </div>
          <h3 class="text-muted">No Statistics Found</h3>
          <p class="text-muted">Create your first statistic to get started</p>
          <NuxtLink to="/stats/create" class="btn btn-primary mt-3">
            <i class="ki-duotone ki-plus fs-2"></i>
            Add New Statistic
          </NuxtLink>
        </div>

        <!-- Stats Table -->
        <div v-else class="table-responsive">
          <table class="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
            <thead>
              <tr class="fw-bold text-muted">
                <th class="w-25px">
                  <div class="form-check form-check-sm form-check-custom form-check-solid">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="selectAll"
                      @change="handleSelectAll"
                    />
                  </div>
                </th>
                <th class="min-w-50px">Order</th>
                <th class="min-w-100px">Icon</th>
                <th class="min-w-150px">Label</th>
                <th class="min-w-100px">Value</th>
                <th class="min-w-100px">Status</th>
                <th class="min-w-150px">Created At</th>
                <th class="min-w-100px text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="stat in displayedStats" :key="stat.id">
                <td>
                  <div class="form-check form-check-sm form-check-custom form-check-solid">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      :value="stat.id"
                      v-model="selectedStats"
                    />
                  </div>
                </td>
                <td>
                  <div class="d-flex flex-column">
                    <span class="text-dark fw-bold">{{ stat.order }}</span>
                    <div class="btn-group btn-group-sm mt-2">
                      <button
                        @click="handleMoveUp(stat)"
                        class="btn btn-icon btn-light btn-sm"
                        :disabled="stat.order === 1"
                        title="Monter"
                      >
                        <i class="ki-duotone ki-arrow-up fs-3"></i>
                      </button>
                      <button
                        @click="handleMoveDown(stat)"
                        class="btn btn-icon btn-light btn-sm"
                        :disabled="stat.order === statsStore.stats.length"
                        title="Descendre"
                      >
                        <i class="ki-duotone ki-arrow-down fs-3"></i>
                      </button>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="symbol symbol-50px me-3">
                      <span class="symbol-label bg-light-primary">
                        <i :class="getIconClasses(stat.icon)" class="fs-2x text-primary"></i>
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="text-dark fw-bold d-block">{{ stat.label }}</span>
                </td>
                <td>
                  <span class="badge badge-light-info fs-5">{{ formatStatValue(stat) }}</span>
                </td>
                <td>
                  <span
                    class="badge"
                    :class="getStatusBadgeClass(stat.is_active)"
                  >
                    {{ getStatusText(stat.is_active) }}
                  </span>
                </td>
                <td>
                  <span class="text-muted">{{ formatDate(stat.created_at) }}</span>
                </td>
                <td>
                  <div class="d-flex justify-content-end flex-shrink-0 gap-1">
                    <NuxtLink
                      :to="`/stats/edit/${stat.id}`"
                      class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"
                      title="Edit"
                    >
                      <i class="ki-duotone ki-pencil fs-3">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                    </NuxtLink>

                    <button
                      @click="handleToggleStatus(stat)"
                      class="btn btn-icon btn-bg-light btn-sm"
                      :class="stat.is_active ? 'btn-active-color-danger' : 'btn-active-color-success'"
                      :title="stat.is_active ? 'Deactivate' : 'Activate'"
                    >
                      <i
                        class="ki-duotone fs-3"
                        :class="stat.is_active ? 'ki-cross-circle' : 'ki-check-circle'"
                      >
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                    </button>

                    <button
                      @click="handleDelete(stat)"
                      class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"
                      title="Delete"
                    >
                      <i class="ki-duotone ki-trash fs-3">
                        <span class="path1"></span>
                        <span class="path2"></span>
                        <span class="path3"></span>
                        <span class="path4"></span>
                        <span class="path5"></span>
                      </i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Bulk Actions Bar -->
        <div
          v-if="selectedStats.length > 0"
          class="d-flex justify-content-between align-items-center p-5 bg-light-primary rounded mt-5"
        >
          <div class="fw-bold">
            <span class="me-2">{{ selectedStats.length }}</span>
            {{ selectedStats.length === 1 ? 'statistic selected' : 'statistics selected' }}
          </div>
          <div>
            <button
              @click="handleBulkDelete"
              class="btn btn-sm btn-danger"
            >
              <i class="ki-duotone ki-trash fs-3 me-1">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
                <span class="path4"></span>
                <span class="path5"></span>
              </i>
              Delete Selected
            </button>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStatsStore } from '../stores/useStatsStore'
import { useStatActions } from '../composables/useStatActions'
import { useStatFormatters } from '../composables/useStatFormatters'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import type { Stat } from '../types'

const statsStore = useStatsStore()
const breadcrumbStore = useBreadcrumbStore()
const { confirmAndDeleteStat, toggleStatStatus, bulkDeleteStats, exportStatsToCSV, moveStatUp, moveStatDown } = useStatActions()
const { formatDate, getStatusBadgeClass, getStatusText, formatStatValue, getIconClasses } = useStatFormatters()

// State
const searchQuery = ref('')
const statusFilter = ref<boolean | null>(null)
const selectedStats = ref<string[]>([])
const selectAll = ref(false)

// Computed
const displayedStats = computed(() => statsStore.filteredStats)

// Handlers
const handleSearch = () => {
  statsStore.debouncedSearch(searchQuery.value)
}

const handleFilterChange = () => {
  statsStore.applyStatusFilter(statusFilter.value)
}

const handleResetFilters = () => {
  searchQuery.value = ''
  statusFilter.value = null
  statsStore.resetFilters()
}

const handleSelectAll = () => {
  if (selectAll.value) {
    selectedStats.value = displayedStats.value.map(s => s.id)
  } else {
    selectedStats.value = []
  }
}

const handleDelete = async (stat: Stat) => {
  const deleted = await confirmAndDeleteStat(stat)
  if (deleted) {
    selectedStats.value = selectedStats.value.filter(id => id !== stat.id)
  }
}

const handleToggleStatus = async (stat: Stat) => {
  await toggleStatStatus(stat)
}

const handleBulkDelete = async () => {
  const deleted = await bulkDeleteStats(selectedStats.value)
  if (deleted) {
    selectedStats.value = []
    selectAll.value = false
  }
}

const handleExport = () => {
  exportStatsToCSV()
}

const handleMoveUp = async (stat: Stat) => {
  await moveStatUp(stat)
  await statsStore.fetchStats()
}

const handleMoveDown = async (stat: Stat) => {
  await moveStatDown(stat)
  await statsStore.fetchStats()
}

// Lifecycle
onMounted(async () => {
  breadcrumbStore.setBreadcrumb([
    { title: 'Home', path: '/' },
    { title: 'Statistics', path: '/stats' }
  ])

  await statsStore.initialize()
})
</script>
