<template>
  <!-- Page Header -->
  <PageHeader title="Partners" subtitle="Manage your partners and sponsors" />

  <!-- Statistics Cards -->
  <div class="row g-5 g-xl-8 mb-5 mb-xl-8" v-if="!partnersStore.isLoading">
      <div class="col-md-6 col-xl-4">
        <div class="card card-flush h-xl-100">
          <div class="card-body">
            <span class="svg-icon svg-icon-2tx svg-icon-primary">
              <i class="ki-duotone ki-handshake fs-2tx text-primary">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </span>
            <div class="fw-bold fs-2 mt-5">
              {{ partnersStore.statistics.total }}
            </div>
            <div class="fw-semibold text-muted">
              Total Partners
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-xl-4">
        <div class="card card-flush h-xl-100">
          <div class="card-body">
            <span class="svg-icon svg-icon-2tx svg-icon-success">
              <i class="ki-duotone ki-check-circle fs-2tx text-success">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </span>
            <div class="fw-bold fs-2 mt-5">
              {{ partnersStore.statistics.active }}
            </div>
            <div class="fw-semibold text-muted">
              Active Partners
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-xl-4">
        <div class="card card-flush h-xl-100">
          <div class="card-body">
            <span class="svg-icon svg-icon-2tx svg-icon-danger">
              <i class="ki-duotone ki-cross-circle fs-2tx text-danger">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </span>
            <div class="fw-bold fs-2 mt-5">
              {{ partnersStore.statistics.inactive }}
            </div>
            <div class="fw-semibold text-muted">
              Inactive Partners
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistics Skeleton -->
    <div class="row g-5 g-xl-8 mb-5 mb-xl-8" v-else>
      <div class="col-md-6 col-xl-4" v-for="i in 3" :key="i">
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
              placeholder="Search by name, website..."
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
              to="/partners/create"
              class="btn btn-primary"
            >
              <i class="ki-duotone ki-plus fs-2"></i>
              Create Partner
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
        <div v-if="!partnersStore.isLoading && partnersStore.hasPartners" class="row g-6 g-xl-9 mt-5">
          <div
            v-for="partner in partnersStore.filteredPartners"
            :key="partner.id"
            class="col-md-6 col-xl-3"
          >
            <div class="card border border-2 border-gray-300 border-hover h-100">
              <!-- Selection Checkbox -->
              <div class="card-header border-0 pt-5 pb-0">
                <div class="form-check form-check-sm form-check-custom form-check-solid">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :checked="selectedIds.includes(partner.id)"
                    @change="toggleSelect(partner.id)"
                  />
                </div>

                <!-- Status Badge -->
                <div class="card-toolbar">
                  <span
                    class="badge"
                    :class="getStatusBadgeClass(partner.is_active)"
                  >
                    {{ getStatusText(partner.is_active) }}
                  </span>
                </div>
              </div>

              <!-- Logo -->
              <div class="card-body text-center pt-5 pb-5">
                <div class="d-flex justify-content-center align-items-center mb-5" style="height: 120px;">
                  <img
                    v-if="partner.logo_url"
                    :src="partner.logo_url"
                    :alt="partner.name"
                    class="mw-100 mh-100"
                    style="max-height: 120px; object-fit: contain;"
                  />
                  <i v-else class="ki-duotone ki-handshake fs-5x text-gray-400">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                </div>

                <!-- Partner Name -->
                <div class="fs-5 fw-bold text-gray-900 mb-2">
                  {{ partner.name }}
                </div>

                <!-- Website -->
                <div v-if="partner.website_url" class="text-muted fs-7 mb-3">
                  <a
                    :href="partner.website_url"
                    target="_blank"
                    class="text-hover-primary"
                  >
                    <i class="ki-duotone ki-global fs-6 me-1">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                    {{ formatWebsiteUrl(partner.website_url) }}
                  </a>
                </div>

                <!-- Order Badge -->
                <div class="mb-3">
                  <span class="badge badge-light">Ordre: {{ partner.order }}</span>
                </div>
              </div>

              <!-- Actions -->
              <div class="card-footer border-0 pt-0 pb-5">
                <div class="d-flex justify-content-center gap-2">
                  <NuxtLink
                    :to="`/partners/${partner.id}/edit`"
                    class="btn btn-sm btn-light-primary flex-grow-1"
                  >
                    <i class="ki-duotone ki-pencil fs-3">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                    Edit
                  </NuxtLink>
                  <button
                    type="button"
                    class="btn btn-sm btn-light-danger"
                    @click="handleDelete(partner)"
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
              </div>
            </div>
          </div>
        </div>

        <!-- Grid Skeleton -->
        <div v-else-if="partnersStore.isLoading" class="row g-6 g-xl-9 mt-5">
          <div class="col-md-6 col-xl-3" v-for="i in 8" :key="i">
            <CardSkeleton :showIcon="true" :lines="2" :showActions="true" />
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="!partnersStore.hasPartners"
          class="text-center py-20"
        >
          <i class="ki-duotone ki-folder-down fs-5x text-gray-400 mb-5">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          <div class="fw-bold fs-3 text-gray-600 mb-2">
            No partners created yet
          </div>
          <div class="text-gray-500 mb-5">
            Create your first partner
          </div>
          <NuxtLink to="/partners/create" class="btn btn-primary">
            <i class="ki-duotone ki-plus fs-2"></i>
            Create Partner
          </NuxtLink>
        </div>

        <!-- Error State -->
        <div
          v-else-if="partnersStore.hasError"
          class="alert alert-danger d-flex align-items-center p-5"
        >
          <i class="ki-duotone ki-shield-cross fs-2hx text-danger me-4">
            <span class="path1"></span>
            <span class="path2"></span>
            <span class="path3"></span>
          </i>
          <div class="d-flex flex-column">
            <h4 class="mb-1 text-dark">An error occurred</h4>
            <span>{{ partnersStore.error }}</span>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { usePartnersStore } from '../stores/usePartnersStore'
import { usePartnerFormatters } from '../composables/usePartnerFormatters'
import { usePartnerActions } from '../composables/usePartnerActions'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import type { Partner } from '../types'

const partnersStore = usePartnersStore()
const breadcrumbStore = useBreadcrumbStore()

const {
  getStatusBadgeClass,
  getStatusText,
  formatWebsiteUrl
} = usePartnerFormatters()

const {
  confirmAndDeletePartner,
  bulkDeletePartners,
  exportPartnersToCSV
} = usePartnerActions()

// Search and filters
const searchQuery = ref('')
const statusFilter = ref<boolean | null>(null)

// Selection
const selectedIds = ref<string[]>([])

const allSelected = computed(() => {
  return (
    partnersStore.filteredPartners.length > 0 &&
    selectedIds.value.length === partnersStore.filteredPartners.length
  )
})

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
  await partnersStore.debouncedSearch(searchQuery.value)
}

const handleStatusFilter = async () => {
  await partnersStore.applyStatusFilter(statusFilter.value)
}

const handleDelete = async (partner: Partner) => {
  await confirmAndDeletePartner(partner)
}

const handleBulkDelete = async () => {
  const success = await bulkDeletePartners(selectedIds.value)
  if (success) {
    selectedIds.value = []
  }
}

const handleExport = () => {
  exportPartnersToCSV()
}

// Lifecycle
onMounted(async () => {
  breadcrumbStore.setBreadcrumb([
    { title: 'Home', path: '/' },
    { title: 'Partners', path: '/partners' }
  ])

  await partnersStore.initialize()
})
</script>
