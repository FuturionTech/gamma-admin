<template>
  <!-- Page Header -->
  <PageHeader title="Solutions" subtitle="Manage your solutions" />

    <!-- Statistics Cards -->
    <div class="row g-5 g-xl-8 mb-5 mb-xl-8" v-if="!solutionsStore.isLoading">
      <div class="col-xl-3 col-md-6">
        <StatCard
          :value="solutionsStore.statistics.total"
          label="Total Solutions"
          icon="ki-grid-2"
          color="primary"
        />
      </div>

      <div class="col-xl-3 col-md-6">
        <StatCard
          :value="solutionsStore.statistics.active"
          label="Active Solutions"
          icon="ki-check-circle"
          color="success"
        />
      </div>

      <div class="col-xl-3 col-md-6">
        <StatCard
          :value="solutionsStore.statistics.inactive"
          label="Inactive Solutions"
          icon="ki-cross-circle"
          color="danger"
        />
      </div>

      <div class="col-xl-3 col-md-6">
        <StatCard
          :value="solutionsStore.statistics.totalFeatures"
          label="Total Features"
          icon="ki-star"
          color="warning"
        />
      </div>

      <div class="col-xl-3 col-md-6">
        <StatCard
          :value="solutionsStore.statistics.totalBenefits"
          label="Total Benefits"
          icon="ki-medal-star"
          color="info"
        />
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
              placeholder="Search by title, subtitle..."
            />
          </div>
        </div>

        <div class="card-toolbar">
          <div class="d-flex justify-content-end gap-2">
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
              <option :value="null">All Status</option>
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
              to="/solutions/create"
              class="btn btn-primary"
              v-if="solutionsStore.hasSolutions"
            >
              <i class="ki-duotone ki-plus fs-2"></i>
              Create Solution
            </NuxtLink>
          </div>
        </div>
      </div>

      <div class="card-body pt-0">
        <!-- Grid View -->
        <div class="row g-6 g-xl-9" v-if="viewMode === 'grid' && !solutionsStore.isLoading && solutionsStore.hasSolutions">
          <div
            v-for="solution in solutionsStore.filteredSolutions"
            :key="solution.id"
            class="col-md-6 col-xl-4"
          >
            <SolutionCard
              :solution="solution"
              @deleted="handleSolutionDeleted"
            />
          </div>
        </div>

        <!-- Table View -->
        <div class="table-responsive" v-if="viewMode === 'table' && !solutionsStore.isLoading && solutionsStore.hasSolutions">
          <table class="table align-middle table-row-dashed fs-6 gy-5">
            <thead>
              <tr class="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                <th class="min-w-50px">Icon</th>
                <th class="min-w-200px">Title</th>
                <th class="min-w-125px">Features</th>
                <th class="min-w-100px">Status</th>
                <th class="min-w-70px">Order</th>
                <th class="text-end min-w-100px">Actions</th>
              </tr>
            </thead>
            <tbody class="fw-semibold text-gray-600">
              <tr v-for="solution in solutionsStore.filteredSolutions" :key="solution.id">
                <td>
                  <img
                    v-if="solution.icon"
                    :src="resolveIcon(solution.icon)"
                    class="w-40px"
                    :alt="solution.title"
                  />
                  <i v-else class="ki-duotone ki-grid-2 fs-2x text-gray-400">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                </td>
                <td>
                  <div class="d-flex flex-column">
                    <NuxtLink :to="`/solutions/${solution.id}`" class="text-gray-800 fw-bold text-hover-primary">{{ solution.title }}</NuxtLink>
                    <span class="text-muted fs-7" v-if="solution.subtitle">
                      {{ solution.subtitle }}
                    </span>
                  </div>
                </td>
                <td>
                  <div class="d-flex align-items-center gap-2">
                    <span class="badge badge-light-success">{{ solution.features?.length || 0 }} Feat.</span>
                    <span class="badge badge-light-warning">{{ solution.benefits?.length || 0 }} Ben.</span>
                  </div>
                </td>
                <td>
                  <span
                    class="badge"
                    :class="solution.is_active ? 'badge-light-success' : 'badge-light-danger'"
                  >
                    {{ solution.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>
                  <span class="badge badge-light">{{ solution.order }}</span>
                </td>
                <td class="text-end">
                  <NuxtLink
                    :to="`/solutions/${solution.id}`"
                    class="btn btn-sm btn-icon btn-light btn-active-light-info me-2"
                  >
                    <i class="ki-duotone ki-eye fs-3">
                      <span class="path1"></span>
                      <span class="path2"></span>
                      <span class="path3"></span>
                    </i>
                  </NuxtLink>
                  <NuxtLink
                    :to="`/solutions/${solution.id}/edit`"
                    class="btn btn-sm btn-icon btn-light btn-active-light-primary me-2"
                  >
                    <i class="ki-duotone ki-pencil fs-3">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Loading Skeleton -->
        <div v-else-if="solutionsStore.isLoading">
          <div v-if="viewMode === 'grid'" class="row g-6 g-xl-9">
            <div class="col-md-6 col-xl-4" v-for="i in 6" :key="i">
              <SolutionCardSkeleton />
            </div>
          </div>
          <div v-else class="table-responsive">
            <table class="table align-middle table-row-dashed fs-6 gy-5">
              <thead>
                <tr class="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                  <th class="min-w-50px">Icon</th>
                  <th class="min-w-200px">Title</th>
                  <th class="min-w-125px">Features</th>
                  <th class="min-w-100px">Status</th>
                  <th class="min-w-70px">Order</th>
                  <th class="text-end min-w-100px">Actions</th>
                </tr>
              </thead>
              <TableSkeleton :rows="5" :columns="6" :hasCheckbox="false" :hasActions="true" />
            </table>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-10">
          <i class="ki-duotone ki-lightbulb fs-5x text-muted mb-5">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          <div class="fw-bold fs-3 text-gray-600 mb-2">
            No solutions created yet
          </div>
          <div class="text-muted fs-6">
            Create your first solution
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSolutionsStore } from '../stores/useSolutionsStore'
import { useSolutionActions } from '../composables/useSolutionActions'
import SolutionCard from '../components/SolutionCard.vue'
import SolutionCardSkeleton from '../components/SolutionCardSkeleton.vue'

definePageMeta({
  layout: 'default',
  middleware: ['auth']
})

const solutionsStore = useSolutionsStore()
const { exportSolutionsToCSV } = useSolutionActions()

const viewMode = ref<'grid' | 'table'>('grid')
const searchQuery = ref('')
const statusFilter = ref<boolean | null>(null)

const handleSearch = () => {
  solutionsStore.debouncedSearch(searchQuery.value)
}

const handleStatusFilter = () => {
  solutionsStore.applyStatusFilter(statusFilter.value)
}

const handleExport = () => {
  exportSolutionsToCSV()
}

const handleSolutionDeleted = () => {
  // Refresh list after deletion
  solutionsStore.fetchSolutions()
}

const resolveIcon = (icon: string) => {
  if (['/cloud', '/brain', '/chart'].includes(icon)) {
    return `${icon}.svg`
  }
  return icon
}

onMounted(async () => {
  await solutionsStore.initialize()
})
</script>
