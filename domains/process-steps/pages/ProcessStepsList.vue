<template>
  <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
    <div class="d-flex flex-column flex-column-fluid">
      <div id="kt_app_content" class="app-content flex-column-fluid">
        <div id="kt_app_content_container" class="app-container container-fluid">
          <!-- Statistics Cards -->
          <div class="row g-5 g-xl-8 mb-5 mb-xl-8" v-if="!processStepsStore.isLoading">
            <div class="col-md-6 col-xl-3">
              <div class="card card-flush h-xl-100">
                <div class="card-body">
                  <span class="svg-icon svg-icon-2tx svg-icon-primary">
                    <i class="ki-duotone ki-abstract-26 fs-2tx text-primary">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </span>
                  <div class="fw-bold fs-2 mt-5">
                    {{ processStepsStore.statistics.total }}
                  </div>
                  <div class="fw-semibold text-muted">
                    Total Steps
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
                    {{ processStepsStore.statistics.active }}
                  </div>
                  <div class="fw-semibold text-muted">
                    Active Steps
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
                    {{ processStepsStore.statistics.inactive }}
                  </div>
                  <div class="fw-semibold text-muted">
                    Inactive Steps
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
                    {{ processStepsStore.statistics.totalItems }}
                  </div>
                  <div class="fw-semibold text-muted">
                    Total Items
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
                    placeholder="Search by title..."
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
                    to="/process-steps/create"
                    class="btn btn-primary"
                  >
                    <i class="ki-duotone ki-plus fs-2"></i>
                    Create Step
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
              <div class="table-responsive" v-if="!processStepsStore.isLoading && processStepsStore.hasProcessSteps">
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
                      <th class="min-w-70px">Step #</th>
                      <th class="min-w-200px">Title</th>
                      <th class="min-w-150px">Short Description</th>
                      <th class="min-w-80px">Items</th>
                      <th class="min-w-100px">Status</th>
                      <th class="min-w-70px">Order</th>
                      <th class="text-end min-w-100px">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="fw-semibold text-gray-600">
                    <tr v-for="step in processStepsStore.filteredProcessSteps" :key="step.id">
                      <td>
                        <div class="form-check form-check-sm form-check-custom form-check-solid">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            :checked="selectedIds.includes(step.id)"
                            @change="toggleSelect(step.id)"
                          />
                        </div>
                      </td>
                      <td>
                        <span class="badge badge-light-primary fw-bold fs-6">
                          {{ formatStepNumber(step.step_number) }}
                        </span>
                      </td>
                      <td>
                        <div class="d-flex align-items-center">
                          <div
                            v-if="step.icon"
                            class="symbol symbol-40px me-3"
                          >
                            <span
                              class="symbol-label"
                              :style="step.icon_color ? `background-color: ${step.icon_color}15;` : ''"
                            >
                              <i
                                :class="step.icon"
                                class="fs-2"
                                :style="step.icon_color ? `color: ${step.icon_color};` : ''"
                              ></i>
                            </span>
                          </div>
                          <div class="d-flex flex-column">
                            <NuxtLink
                              :to="`/process-steps/${step.id}`"
                              class="text-gray-800 fw-bold text-hover-primary"
                            >
                              {{ step.title }}
                            </NuxtLink>
                            <span class="text-muted fs-7">
                              {{ step.slug }}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span class="text-gray-600" v-if="step.short_description">
                          {{ truncate(step.short_description, 50) }}
                        </span>
                        <span v-else class="text-muted">--</span>
                      </td>
                      <td>
                        <span class="badge badge-light">
                          {{ step.items?.length || 0 }} item(s)
                        </span>
                      </td>
                      <td>
                        <span
                          class="badge"
                          :class="getStatusBadgeClass(step.is_active)"
                        >
                          {{ getStatusText(step.is_active) }}
                        </span>
                      </td>
                      <td>
                        <span class="badge badge-light">{{ step.order }}</span>
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
                              :to="`/process-steps/${step.id}`"
                              class="menu-link px-3"
                            >
                              View
                            </NuxtLink>
                          </div>
                          <div class="menu-item px-3">
                            <NuxtLink
                              :to="`/process-steps/${step.id}/edit`"
                              class="menu-link px-3"
                            >
                              Edit
                            </NuxtLink>
                          </div>
                          <div class="menu-item px-3">
                            <a
                              href="#"
                              class="menu-link px-3"
                              @click.prevent="handleToggleStatus(step)"
                            >
                              {{ step.is_active ? 'Deactivate' : 'Activate' }}
                            </a>
                          </div>
                          <div class="menu-item px-3">
                            <a
                              href="#"
                              class="menu-link px-3 text-danger"
                              @click.prevent="handleDelete(step)"
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
              <div class="table-responsive" v-else-if="processStepsStore.isLoading">
                <table class="table align-middle table-row-dashed fs-6 gy-5">
                  <thead>
                    <tr class="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                      <th class="w-10px pe-2"></th>
                      <th class="min-w-70px">Step #</th>
                      <th class="min-w-200px">Title</th>
                      <th class="min-w-150px">Short Description</th>
                      <th class="min-w-80px">Items</th>
                      <th class="min-w-100px">Status</th>
                      <th class="min-w-70px">Order</th>
                      <th class="text-end min-w-100px">Actions</th>
                    </tr>
                  </thead>
                  <TableSkeleton :rows="5" :columns="7" :hasCheckbox="true" :hasActions="true" />
                </table>
              </div>

              <!-- Empty State -->
              <div
                v-else-if="!processStepsStore.hasProcessSteps"
                class="text-center py-20"
              >
                <i class="ki-duotone ki-folder-down fs-5x text-gray-400 mb-5">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
                <div class="fw-bold fs-3 text-gray-600 mb-2">
                  No process steps created yet
                </div>
                <div class="text-gray-500 mb-5">
                  Create your first process step
                </div>
                <NuxtLink to="/process-steps/create" class="btn btn-primary">
                  <i class="ki-duotone ki-plus fs-2"></i>
                  Create Step
                </NuxtLink>
              </div>

              <!-- Error State -->
              <div
                v-else-if="processStepsStore.hasError"
                class="alert alert-danger d-flex align-items-center p-5"
              >
                <i class="ki-duotone ki-shield-cross fs-2hx text-danger me-4">
                  <span class="path1"></span>
                  <span class="path2"></span>
                  <span class="path3"></span>
                </i>
                <div class="d-flex flex-column">
                  <h4 class="mb-1 text-dark">An error occurred</h4>
                  <span>{{ processStepsStore.error }}</span>
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
import { useProcessStepsStore } from '../stores/useProcessStepsStore'
import { useProcessStepFormatters } from '../composables/useProcessStepFormatters'
import { useProcessStepActions } from '../composables/useProcessStepActions'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import type { ProcessStep } from '../types'

const processStepsStore = useProcessStepsStore()
const breadcrumbStore = useBreadcrumbStore()

const {
  truncate,
  getStatusBadgeClass,
  getStatusText,
  formatStepNumber
} = useProcessStepFormatters()

const {
  confirmAndDeleteProcessStep,
  toggleProcessStepStatus,
  bulkDeleteProcessSteps,
  exportProcessStepsToCSV
} = useProcessStepActions()

// Search and filters
const searchQuery = ref('')
const statusFilter = ref<boolean | null>(null)

// Selection
const selectedIds = ref<string[]>([])

const allSelected = computed(() => {
  return (
    processStepsStore.filteredProcessSteps.length > 0 &&
    selectedIds.value.length === processStepsStore.filteredProcessSteps.length
  )
})

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedIds.value = []
  } else {
    selectedIds.value = processStepsStore.filteredProcessSteps.map((s) => s.id)
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
  await processStepsStore.debouncedSearch(searchQuery.value)
}

const handleStatusFilter = async () => {
  await processStepsStore.applyStatusFilter(statusFilter.value)
}

const handleDelete = async (step: ProcessStep) => {
  await confirmAndDeleteProcessStep(step)
}

const handleToggleStatus = async (step: ProcessStep) => {
  await toggleProcessStepStatus(step)
}

const handleBulkDelete = async () => {
  const success = await bulkDeleteProcessSteps(selectedIds.value)
  if (success) {
    selectedIds.value = []
  }
}

const handleExport = () => {
  exportProcessStepsToCSV()
}

// Lifecycle
onMounted(async () => {
  breadcrumbStore.setBreadcrumb([
    { title: 'Home', path: '/' },
    { title: 'Process Steps', path: '/process-steps' }
  ])

  await processStepsStore.initialize()
})
</script>
