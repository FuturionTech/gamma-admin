<template>
  <!-- Page Header -->
  <PageHeader title="Team" subtitle="Manage your team members" />

  <!-- Statistics Cards -->
  <div class="row g-5 g-xl-8 mb-5 mb-xl-8" v-if="!teamStore.isLoading">
      <div class="col-md-6 col-xl-3">
        <div class="card card-flush h-xl-100">
          <div class="card-body">
            <span class="svg-icon svg-icon-2tx svg-icon-primary">
              <i class="ki-duotone ki-people fs-2tx text-primary">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
                <span class="path4"></span>
                <span class="path5"></span>
              </i>
            </span>
            <div class="fw-bold fs-2 mt-5">
              {{ teamStore.statistics.total }}
            </div>
            <div class="fw-semibold text-muted">
              Total Team Members
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
              {{ teamStore.statistics.active }}
            </div>
            <div class="fw-semibold text-muted">
              Active Team Members
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
              {{ teamStore.statistics.inactive }}
            </div>
            <div class="fw-semibold text-muted">
              Inactive Team Members
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-xl-3">
        <div class="card card-flush h-xl-100">
          <div class="card-body">
            <span class="svg-icon svg-icon-2tx svg-icon-info">
              <i class="ki-duotone ki-badge fs-2tx text-info">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
                <span class="path4"></span>
                <span class="path5"></span>
              </i>
            </span>
            <div class="fw-bold fs-2 mt-5">
              {{ Object.keys(teamStore.statistics.byRole).length }}
            </div>
            <div class="fw-semibold text-muted">
              Unique Roles
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

    <!-- Toolbar -->
    <div class="card mb-5">
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
              placeholder="Search by name, role..."
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
              <option :value="null">All Statuses</option>
              <option :value="true">Active</option>
              <option :value="false">Inactive</option>
            </select>

            <!-- Filter by Role -->
            <select
              v-model="roleFilter"
              @change="handleRoleFilter"
              class="form-select form-select-solid w-150px"
              v-if="teamStore.roles.length > 0"
            >
              <option :value="null">All Roles</option>
              <option
                v-for="role in teamStore.roles"
                :key="role"
                :value="role"
              >
                {{ role }}
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
              to="/team/create"
              class="btn btn-primary"
            >
              <i class="ki-duotone ki-plus fs-2"></i>
              Create Team Member
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Team Cards Grid -->
    <div class="row g-6 g-xl-9 mb-6 mb-xl-9" v-if="!teamStore.isLoading && teamStore.hasTeams">
      <div
        v-for="team in teamStore.filteredTeams"
        :key="team.id"
        class="col-md-6 col-xl-4"
      >
        <TeamCard :team="team" @delete="handleDelete" />
      </div>
    </div>

    <!-- Loading Skeleton -->
    <div class="row g-6 g-xl-9 mb-6 mb-xl-9" v-else-if="teamStore.isLoading">
      <div
        v-for="i in 6"
        :key="i"
        class="col-md-6 col-xl-4"
      >
        <TeamCardSkeleton />
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="!teamStore.hasTeams"
      class="card"
    >
      <div class="card-body text-center py-20">
        <i class="ki-duotone ki-user-square fs-5x text-gray-400 mb-5">
          <span class="path1"></span>
          <span class="path2"></span>
          <span class="path3"></span>
        </i>
        <div class="fw-bold fs-3 text-gray-600 mb-2">
          No team members yet
        </div>
        <div class="text-gray-500 mb-5">
          Create your first team member
        </div>
        <NuxtLink to="/team/create" class="btn btn-primary">
          <i class="ki-duotone ki-plus fs-2"></i>
          Create Team Member
        </NuxtLink>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="teamStore.hasError"
      class="alert alert-danger d-flex align-items-center p-5"
    >
      <i class="ki-duotone ki-shield-cross fs-2hx text-danger me-4">
        <span class="path1"></span>
        <span class="path2"></span>
        <span class="path3"></span>
      </i>
      <div class="d-flex flex-column">
        <h4 class="mb-1 text-dark">An error occurred</h4>
        <span>{{ teamStore.error }}</span>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTeamStore } from '../stores/useTeamStore'
import { useTeamActions } from '../composables/useTeamActions'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import type { Team } from '../types'

const teamStore = useTeamStore()
const breadcrumbStore = useBreadcrumbStore()

const {
  confirmAndDeleteTeam,
  exportTeamsToCSV
} = useTeamActions()

// Search and filters
const searchQuery = ref('')
const statusFilter = ref<boolean | null>(null)
const roleFilter = ref<string | null>(null)

// Handlers
const handleSearch = async () => {
  await teamStore.debouncedSearch(searchQuery.value)
}

const handleStatusFilter = async () => {
  await teamStore.applyStatusFilter(statusFilter.value)
}

const handleRoleFilter = async () => {
  await teamStore.applyRoleFilter(roleFilter.value)
}

const handleDelete = async (team: Team) => {
  await confirmAndDeleteTeam(team)
}

const handleExport = () => {
  exportTeamsToCSV()
}

// Lifecycle
onMounted(async () => {
  breadcrumbStore.setBreadcrumb([
    { title: 'Home', path: '/' },
    { title: 'Team', path: '/team/list' }
  ])

  await teamStore.initialize()
})
</script>
