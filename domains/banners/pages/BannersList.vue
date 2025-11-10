<template>
  <!-- Page Header -->
  <PageHeader title="Hero Banners" subtitle="Manage hero banners for your homepage" />

    <!-- Statistics Cards -->
    <div class="row g-5 g-xl-8 mb-5 mb-xl-8" v-if="!bannersStore.isLoading">
      <div class="col-xl-3">
        <div class="card card-flush h-xl-100">
          <div class="card-body">
            <span class="svg-icon svg-icon-2tx svg-icon-primary">
              <i class="ki-duotone ki-picture fs-2tx text-primary">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </span>
            <div class="fw-bold fs-2 mt-5">
              {{ bannersStore.statistics.total }}
            </div>
            <div class="fw-semibold text-muted">
              Total Banners
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
              {{ bannersStore.statistics.active }}
            </div>
            <div class="fw-semibold text-muted">
              Active Banners
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3">
        <div class="card card-flush h-xl-100">
          <div class="card-body">
            <span class="svg-icon svg-icon-2tx svg-icon-secondary">
              <i class="ki-duotone ki-cross-circle fs-2tx text-secondary">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </span>
            <div class="fw-bold fs-2 mt-5">
              {{ bannersStore.statistics.inactive }}
            </div>
            <div class="fw-semibold text-muted">
              Inactive Banners
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-3">
        <div class="card card-flush h-xl-100">
          <div class="card-body">
            <span class="svg-icon svg-icon-2tx svg-icon-info">
              <i class="ki-duotone ki-click fs-2tx text-info">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </span>
            <div class="fw-bold fs-2 mt-5">
              {{ bannersStore.statistics.withCta }}
            </div>
            <div class="fw-semibold text-muted">
              With CTA
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
              placeholder="Search banners..."
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

            <!-- Filter by CTA -->
            <select
              v-model="ctaFilter"
              @change="handleCtaFilter"
              class="form-select form-select-solid w-150px"
            >
              <option :value="null">All</option>
              <option :value="true">With CTA</option>
              <option :value="false">Without CTA</option>
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
              to="/banners/create"
              class="btn btn-primary"
            >
              <i class="ki-duotone ki-plus fs-2"></i>
              New Banner
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
        <!-- Grid View -->
        <div v-if="!bannersStore.isLoading && bannersStore.hasBanners" class="row g-6 g-xl-9">
          <div
            v-for="banner in bannersStore.filteredBanners"
            :key="banner.id"
            class="col-md-6 col-xl-4"
          >
            <BannerCard :banner="banner" />
          </div>
        </div>

        <!-- Grid Skeleton -->
        <div v-else-if="bannersStore.isLoading" class="row g-6 g-xl-9">
          <div v-for="i in 6" :key="i" class="col-md-6 col-xl-4">
            <CardSkeleton :lines="3" :showImage="true" />
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="!bannersStore.hasBanners"
          class="text-center py-20"
        >
          <i class="ki-duotone ki-picture fs-5x text-gray-400 mb-5">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          <div class="fw-bold fs-3 text-gray-600 mb-2">
            No banners found
          </div>
          <div class="text-gray-500 mb-5">
            Create your first hero banner
          </div>
          <NuxtLink to="/banners/create" class="btn btn-primary">
            <i class="ki-duotone ki-plus fs-2"></i>
            New Banner
          </NuxtLink>
        </div>

        <!-- Error State -->
        <div
          v-else-if="bannersStore.hasError"
          class="alert alert-danger d-flex align-items-center p-5"
        >
          <i class="ki-duotone ki-shield-cross fs-2hx text-danger me-4">
            <span class="path1"></span>
            <span class="path2"></span>
            <span class="path3"></span>
          </i>
          <div class="d-flex flex-column">
            <h4 class="mb-1 text-dark">Error</h4>
            <span>{{ bannersStore.error }}</span>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBannersStore } from '../stores/useBannersStore'
import { useBannersActions } from '../composables/useBannersActions'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import BannerCard from '../components/BannerCard.vue'

const bannersStore = useBannersStore()
const breadcrumbStore = useBreadcrumbStore()

const {
  bulkDeleteBanners,
  exportBannersToCSV
} = useBannersActions()

// Search and filters
const searchQuery = ref('')
const statusFilter = ref<boolean | null>(null)
const ctaFilter = ref<boolean | null>(null)

// Selection
const selectedIds = ref<string[]>([])

// Handlers
const handleSearch = async () => {
  await bannersStore.debouncedSearch(searchQuery.value)
}

const handleStatusFilter = async () => {
  await bannersStore.applyActiveFilter(statusFilter.value)
}

const handleCtaFilter = async () => {
  await bannersStore.applyCtaFilter(ctaFilter.value)
}

const handleBulkDelete = async () => {
  const success = await bulkDeleteBanners(selectedIds.value)
  if (success) {
    selectedIds.value = []
  }
}

const handleExport = () => {
  exportBannersToCSV()
}

// Lifecycle
onMounted(async () => {
  breadcrumbStore.setBreadcrumb([
    { title: 'Home', path: '/' },
    { title: 'Banners', path: '/banners' }
  ])

  await bannersStore.initialize()
})
</script>
