<template>
  <!-- Page Header -->
  <PageHeader title="Clients" subtitle="Manage your clients" />

    <!-- Statistics Cards -->
    <div class="row g-5 g-xl-8 mb-5 mb-xl-8" v-if="!clientsStore.isLoading">
      <div class="col-md-6 col-xl-3">
        <div class="card card-flush h-xl-100">
          <div class="card-body">
            <span class="svg-icon svg-icon-2tx svg-icon-primary">
              <i class="ki-duotone ki-profile-user fs-2tx text-primary">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
                <span class="path4"></span>
              </i>
            </span>
            <div class="fw-bold fs-2 mt-5">
              {{ clientsStore.statistics.total }}
            </div>
            <div class="fw-semibold text-muted">
              Total Clients
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
              {{ clientsStore.statistics.active }}
            </div>
            <div class="fw-semibold text-muted">
              Active Clients
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
              {{ clientsStore.statistics.inactive }}
            </div>
            <div class="fw-semibold text-muted">
              Inactive Clients
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
              {{ Object.keys(clientsStore.statistics.byIndustry).length }}
            </div>
            <div class="fw-semibold text-muted">
              Industries
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
              placeholder="Search by name, industry..."
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

            <!-- Filter by Industry -->
            <select
              v-model="industryFilter"
              @change="handleIndustryFilter"
              class="form-select form-select-solid w-150px"
              v-if="clientsStore.industries.length > 0"
            >
              <option :value="null">All Industries</option>
              <option
                v-for="industry in clientsStore.industries"
                :key="industry"
                :value="industry"
              >
                {{ industry }}
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
              to="/clients/create"
              class="btn btn-primary"
            >
              <i class="ki-duotone ki-plus fs-2"></i>
              Create Client
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
        <div class="table-responsive" v-if="!clientsStore.isLoading && clientsStore.hasClients">
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
                <th class="min-w-50px">Logo</th>
                <th class="min-w-200px">Name</th>
                <th class="min-w-125px">Industry</th>
                <th class="min-w-150px">Website</th>
                <th class="min-w-100px">Status</th>
                <th class="min-w-70px">Order</th>
                <th class="text-end min-w-100px">Actions</th>
              </tr>
            </thead>
            <tbody class="fw-semibold text-gray-600">
              <tr v-for="client in clientsStore.filteredClients" :key="client.id">
                <td>
                  <div class="form-check form-check-sm form-check-custom form-check-solid">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      :checked="selectedIds.includes(client.id)"
                      @change="toggleSelect(client.id)"
                    />
                  </div>
                </td>
                <td>
                  <img
                    v-if="client.logo_url"
                    :src="client.logo_url"
                    class="w-50px h-50px object-fit-contain"
                    :alt="client.name"
                  />
                  <div
                    v-else
                    class="symbol symbol-50px bg-light-primary"
                  >
                    <div class="symbol-label fs-5 fw-bold text-primary">
                      {{ getInitials(client.name) }}
                    </div>
                  </div>
                </td>
                <td>
                  <div class="d-flex flex-column">
                    <span class="text-gray-800 fw-bold">{{ client.name }}</span>
                  </div>
                </td>
                <td>
                  <span
                    v-if="client.industry"
                    class="badge"
                    :class="getIndustryBadgeClass(client.industry)"
                  >
                    {{ client.industry }}
                  </span>
                  <span v-else class="text-muted">—</span>
                </td>
                <td>
                  <a
                    v-if="client.website_url"
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
                  <span v-else class="text-muted">—</span>
                </td>
                <td>
                  <span
                    class="badge"
                    :class="getStatusBadgeClass(client.is_active)"
                  >
                    {{ getStatusText(client.is_active) }}
                  </span>
                </td>
                <td>
                  <span class="badge badge-light">{{ client.order }}</span>
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
                        :to="`/clients/${client.id}/edit`"
                        class="menu-link px-3"
                      >
                        Edit
                      </NuxtLink>
                    </div>
                    <div class="menu-item px-3">
                      <a
                        href="#"
                        class="menu-link px-3"
                        @click.prevent="handleToggleStatus(client)"
                      >
                        {{ client.is_active ? 'Deactivate' : 'Activate' }}
                      </a>
                    </div>
                    <div class="menu-item px-3">
                      <a
                        href="#"
                        class="menu-link px-3 text-danger"
                        @click.prevent="handleDelete(client)"
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
        <div class="table-responsive" v-else-if="clientsStore.isLoading">
          <table class="table align-middle table-row-dashed fs-6 gy-5">
            <thead>
              <tr class="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                <th class="w-10px pe-2"></th>
                <th class="min-w-50px">Logo</th>
                <th class="min-w-200px">Name</th>
                <th class="min-w-125px">Industry</th>
                <th class="min-w-150px">Website</th>
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
          v-else-if="!clientsStore.hasClients"
          class="text-center py-20"
        >
          <i class="ki-duotone ki-folder-down fs-5x text-gray-400 mb-5">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          <div class="fw-bold fs-3 text-gray-600 mb-2">
            No clients created yet
          </div>
          <div class="text-gray-500 mb-5">
            Create your first client
          </div>
          <NuxtLink to="/clients/create" class="btn btn-primary">
            <i class="ki-duotone ki-plus fs-2"></i>
            Create Client
          </NuxtLink>
        </div>

        <!-- Error State -->
        <div
          v-else-if="clientsStore.hasError"
          class="alert alert-danger d-flex align-items-center p-5"
        >
          <i class="ki-duotone ki-shield-cross fs-2hx text-danger me-4">
            <span class="path1"></span>
            <span class="path2"></span>
            <span class="path3"></span>
          </i>
          <div class="d-flex flex-column">
            <h4 class="mb-1 text-dark">An error occurred</h4>
            <span>{{ clientsStore.error }}</span>
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
import type { Client } from '../types'

const clientsStore = useClientsStore()
const breadcrumbStore = useBreadcrumbStore()

const {
  getStatusBadgeClass,
  getStatusText,
  getIndustryBadgeClass,
  formatWebsiteUrl,
  getInitials
} = useClientFormatters()

const {
  confirmAndDeleteClient,
  toggleClientStatus,
  bulkDeleteClients,
  exportClientsToCSV
} = useClientActions()

// Search and filters
const searchQuery = ref('')
const statusFilter = ref<boolean | null>(null)
const industryFilter = ref<string | null>(null)

// Selection
const selectedIds = ref<string[]>([])

const allSelected = computed(() => {
  return (
    clientsStore.filteredClients.length > 0 &&
    selectedIds.value.length === clientsStore.filteredClients.length
  )
})

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedIds.value = []
  } else {
    selectedIds.value = clientsStore.filteredClients.map((c) => c.id)
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
  await clientsStore.debouncedSearch(searchQuery.value)
}

const handleStatusFilter = async () => {
  await clientsStore.applyStatusFilter(statusFilter.value)
}

const handleIndustryFilter = async () => {
  await clientsStore.applyIndustryFilter(industryFilter.value)
}

const handleDelete = async (client: Client) => {
  await confirmAndDeleteClient(client)
}

const handleToggleStatus = async (client: Client) => {
  await toggleClientStatus(client)
}

const handleBulkDelete = async () => {
  const success = await bulkDeleteClients(selectedIds.value)
  if (success) {
    selectedIds.value = []
  }
}

const handleExport = () => {
  exportClientsToCSV()
}

// Lifecycle
onMounted(async () => {
  breadcrumbStore.setBreadcrumb([
    { title: 'Home', path: '/' },
    { title: 'Clients', path: '/clients' }
  ])

  await clientsStore.initialize()
})
</script>
