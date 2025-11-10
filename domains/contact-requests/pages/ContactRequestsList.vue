<template>
  <!-- Page Header -->
  <PageHeader title="Contact Requests" subtitle="Manage customer contact requests" />

    <!-- Statistics Cards -->
    <div class="row g-5 g-xl-8 mb-5 mb-xl-8" v-if="!contactRequestsStore.isLoading">
      <div class="col-xl-3">
        <div class="card card-flush h-xl-100">
          <div class="card-body">
            <span class="svg-icon svg-icon-2tx svg-icon-primary">
              <i class="bi bi-envelope-fill fs-2tx text-primary"></i>
            </span>
            <div class="fw-bold fs-2 mt-5">
              {{ contactRequestsStore.statistics.total }}
            </div>
            <div class="fw-semibold text-muted">
              Total Requests
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3">
        <div class="card card-flush h-xl-100">
          <div class="card-body">
            <span class="svg-icon svg-icon-2tx svg-icon-danger">
              <i class="bi bi-exclamation-circle-fill fs-2tx text-danger"></i>
            </span>
            <div class="fw-bold fs-2 mt-5">
              {{ contactRequestsStore.statistics.new }}
            </div>
            <div class="fw-semibold text-muted">
              New Requests
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3">
        <div class="card card-flush h-xl-100">
          <div class="card-body">
            <span class="svg-icon svg-icon-2tx svg-icon-warning">
              <i class="bi bi-clock-history fs-2tx text-warning"></i>
            </span>
            <div class="fw-bold fs-2 mt-5">
              {{ contactRequestsStore.statistics.inProgress }}
            </div>
            <div class="fw-semibold text-muted">
              In Progress
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3">
        <div class="card card-flush h-xl-100">
          <div class="card-body">
            <span class="svg-icon svg-icon-2tx svg-icon-success">
              <i class="bi bi-check-circle-fill fs-2tx text-success"></i>
            </span>
            <div class="fw-bold fs-2 mt-5">
              {{ contactRequestsStore.statistics.resolved }}
            </div>
            <div class="fw-semibold text-muted">
              Resolved
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
              placeholder="Search by name, email..."
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
              <option value="NEW">New</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
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
          </div>

          <!-- Bulk Actions -->
          <div
            class="d-flex justify-content-end align-items-center gap-2"
            data-kt-customer-table-toolbar="selected"
            v-if="selectedIds.length > 0"
          >
            <div class="fw-bold me-5">
              <span class="me-2">{{ selectedIds.length }}</span>
              selected
            </div>
            <select
              v-model="bulkStatus"
              class="form-select form-select-solid w-150px"
            >
              <option value="">Change Status</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
            <button
              type="button"
              class="btn btn-primary"
              @click="handleBulkStatusUpdate"
              :disabled="!bulkStatus"
            >
              Apply
            </button>
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
        <div class="table-responsive" v-if="!contactRequestsStore.isLoading && contactRequestsStore.hasContactRequests">
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
                <th class="min-w-50px">ID</th>
                <th class="min-w-200px">Name</th>
                <th class="min-w-150px">Email</th>
                <th class="min-w-150px">Subject</th>
                <th class="min-w-200px">Message</th>
                <th class="min-w-100px">Status</th>
                <th class="min-w-125px">Date</th>
                <th class="text-end min-w-100px">Actions</th>
              </tr>
            </thead>
            <tbody class="fw-semibold text-gray-600">
              <tr v-for="contactRequest in contactRequestsStore.filteredContactRequests" :key="contactRequest.id">
                <td>
                  <div class="form-check form-check-sm form-check-custom form-check-solid">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      :checked="selectedIds.includes(contactRequest.id)"
                      @change="toggleSelect(contactRequest.id)"
                    />
                  </div>
                </td>
                <td>
                  <span class="text-muted fw-bold">#{{ contactRequest.id }}</span>
                </td>
                <td>
                  <div class="d-flex flex-column">
                    <span class="text-gray-800 fw-bold">{{ getFullName(contactRequest) }}</span>
                    <span class="text-muted fs-7" v-if="contactRequest.phone">{{ formatPhone(contactRequest.phone) }}</span>
                  </div>
                </td>
                <td>
                  <a :href="`mailto:${contactRequest.email}`" class="text-gray-800">
                    {{ contactRequest.email }}
                  </a>
                </td>
                <td>
                  <span class="text-gray-800">
                    {{ contactRequest.subject || '—' }}
                  </span>
                </td>
                <td>
                  <span class="text-muted fs-7">
                    {{ truncateMessage(contactRequest.message, 80) }}
                  </span>
                </td>
                <td>
                  <span
                    class="badge"
                    :class="getStatusBadgeClass(contactRequest.status)"
                  >
                    <i :class="getStatusIcon(contactRequest.status)" class="me-1"></i>
                    {{ getStatusLabel(contactRequest.status) }}
                  </span>
                </td>
                <td>
                  <div class="d-flex flex-column">
                    <span class="text-gray-800">{{ formatDateShort(contactRequest.created_at) }}</span>
                    <span class="text-muted fs-7">{{ formatRelativeTime(contactRequest.created_at) }}</span>
                  </div>
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
                    class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-175px py-4"
                    data-kt-menu="true"
                  >
                    <div class="menu-item px-3">
                      <NuxtLink
                        :to="`/contact-requests/${contactRequest.id}`"
                        class="menu-link px-3"
                      >
                        View
                      </NuxtLink>
                    </div>
                    <div class="menu-item px-3">
                      <a
                        href="#"
                        class="menu-link px-3"
                        @click.prevent="handleCopyEmail(contactRequest.email)"
                      >
                        Copy Email
                      </a>
                    </div>
                    <div class="separator my-2"></div>
                    <div class="menu-item px-3" v-if="contactRequest.status !== 'IN_PROGRESS'">
                      <a
                        href="#"
                        class="menu-link px-3"
                        @click.prevent="handleStatusUpdate(contactRequest.id, 'IN_PROGRESS')"
                      >
                        Mark In Progress
                      </a>
                    </div>
                    <div class="menu-item px-3" v-if="contactRequest.status !== 'RESOLVED'">
                      <a
                        href="#"
                        class="menu-link px-3"
                        @click.prevent="handleStatusUpdate(contactRequest.id, 'RESOLVED')"
                      >
                        Mark Resolved
                      </a>
                    </div>
                    <div class="separator my-2"></div>
                    <div class="menu-item px-3">
                      <a
                        href="#"
                        class="menu-link px-3 text-danger"
                        @click.prevent="handleDelete(contactRequest)"
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
        <div class="table-responsive" v-else-if="contactRequestsStore.isLoading">
          <table class="table align-middle table-row-dashed fs-6 gy-5">
            <thead>
              <tr class="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                <th class="w-10px pe-2"></th>
                <th class="min-w-50px">ID</th>
                <th class="min-w-200px">Name</th>
                <th class="min-w-150px">Email</th>
                <th class="min-w-150px">Subject</th>
                <th class="min-w-200px">Message</th>
                <th class="min-w-100px">Status</th>
                <th class="min-w-125px">Date</th>
                <th class="text-end min-w-100px">Actions</th>
              </tr>
            </thead>
            <TableSkeleton :rows="5" :columns="8" :hasCheckbox="true" :hasActions="true" />
          </table>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="!contactRequestsStore.hasContactRequests"
          class="text-center py-20"
        >
          <i class="bi bi-inbox fs-5x text-gray-400 mb-5"></i>
          <div class="fw-bold fs-3 text-gray-600 mb-2">
            No contact requests yet
          </div>
          <div class="text-gray-500 mb-5">
            Contact requests from customers will appear here
          </div>
        </div>

        <!-- Error State -->
        <div
          v-else-if="contactRequestsStore.hasError"
          class="alert alert-danger d-flex align-items-center p-5"
        >
          <i class="ki-duotone ki-shield-cross fs-2hx text-danger me-4">
            <span class="path1"></span>
            <span class="path2"></span>
            <span class="path3"></span>
          </i>
          <div class="d-flex flex-column">
            <h4 class="mb-1 text-dark">An error occurred</h4>
            <span>{{ contactRequestsStore.error }}</span>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useContactRequestsStore } from '../stores/useContactRequestsStore'
import { useContactRequestFormatters } from '../composables/useContactRequestFormatters'
import { useContactRequestActions } from '../composables/useContactRequestActions'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import type { ContactRequest, ContactRequestStatus } from '../types'

const contactRequestsStore = useContactRequestsStore()
const breadcrumbStore = useBreadcrumbStore()

const {
  formatDateShort,
  formatRelativeTime,
  getFullName,
  formatPhone,
  truncateMessage,
  getStatusBadgeClass,
  getStatusLabel,
  getStatusIcon
} = useContactRequestFormatters()

const {
  confirmAndDeleteContactRequest,
  updateStatus,
  bulkUpdateStatus,
  bulkDeleteContactRequests,
  exportContactRequestsToCSV,
  copyEmailToClipboard
} = useContactRequestActions()

// Search and filters
const searchQuery = ref('')
const statusFilter = ref<ContactRequestStatus | null>(null)

// Selection and bulk actions
const selectedIds = ref<string[]>([])
const bulkStatus = ref<ContactRequestStatus | ''>('')

const allSelected = computed(() => {
  return (
    contactRequestsStore.filteredContactRequests.length > 0 &&
    selectedIds.value.length === contactRequestsStore.filteredContactRequests.length
  )
})

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedIds.value = []
  } else {
    selectedIds.value = contactRequestsStore.filteredContactRequests.map((cr) => cr.id)
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
  await contactRequestsStore.debouncedSearch(searchQuery.value)
}

const handleStatusFilter = async () => {
  await contactRequestsStore.applyStatusFilter(statusFilter.value)
}

const handleDelete = async (contactRequest: ContactRequest) => {
  await confirmAndDeleteContactRequest(contactRequest)
}

const handleStatusUpdate = async (id: string, status: ContactRequestStatus) => {
  await updateStatus(id, status)
}

const handleCopyEmail = async (email: string) => {
  await copyEmailToClipboard(email)
}

const handleBulkStatusUpdate = async () => {
  if (!bulkStatus.value) return

  const success = await bulkUpdateStatus(selectedIds.value, bulkStatus.value as ContactRequestStatus)
  if (success) {
    selectedIds.value = []
    bulkStatus.value = ''
  }
}

const handleBulkDelete = async () => {
  const success = await bulkDeleteContactRequests(selectedIds.value)
  if (success) {
    selectedIds.value = []
  }
}

const handleExport = () => {
  exportContactRequestsToCSV()
}

// Lifecycle
onMounted(async () => {
  breadcrumbStore.setBreadcrumb([
    { title: 'Home', path: '/' },
    { title: 'Contact Requests', path: '/contact-requests' }
  ])

  await contactRequestsStore.initialize()
})
</script>
