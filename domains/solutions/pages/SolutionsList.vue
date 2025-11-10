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
            >
              <i class="ki-duotone ki-plus fs-2"></i>
              Create Solution
            </NuxtLink>
          </div>
        </div>
      </div>

      <div class="card-body pt-0">
        <!-- Grid View -->
        <div class="row g-6 g-xl-9" v-if="!solutionsStore.isLoading && solutionsStore.hasSolutions">
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

        <!-- Loading Skeleton -->
        <div class="row g-6 g-xl-9" v-else-if="solutionsStore.isLoading">
          <div
            v-for="i in 6"
            :key="i"
            class="col-md-6 col-xl-4"
          >
            <SolutionCardSkeleton />
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-10">
          <i class="ki-duotone ki-folder fs-5x text-muted mb-5">
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

onMounted(async () => {
  await solutionsStore.initialize()
})
</script>
