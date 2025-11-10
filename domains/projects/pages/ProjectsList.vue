<template>
  <!-- Page Header -->
  <PageHeader title="Projects" subtitle="Manage your case studies and projects" />

  <!-- Statistics Cards -->
  <div class="row g-5 g-xl-8 mb-5 mb-xl-8" v-if="!projectsStore.isLoading">
    <div class="col-md-6 col-xl-3">
      <div class="card card-flush h-xl-100">
        <div class="card-body">
          <span class="svg-icon svg-icon-2tx svg-icon-primary">
            <i class="ki-duotone ki-briefcase fs-2tx text-primary">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
          </span>
          <div class="fw-bold fs-2 mt-5">
            {{ projectsStore.statistics.total }}
          </div>
          <div class="fw-semibold text-muted">
            Total Projects
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
            {{ projectsStore.statistics.published }}
          </div>
          <div class="fw-semibold text-muted">
            Published
          </div>
        </div>
      </div>
    </div>

    <div class="col-md-6 col-xl-3">
      <div class="card card-flush h-xl-100">
        <div class="card-body">
          <span class="svg-icon svg-icon-2tx svg-icon-warning">
            <i class="ki-duotone ki-file-down fs-2tx text-warning">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
          </span>
          <div class="fw-bold fs-2 mt-5">
            {{ projectsStore.statistics.drafts }}
          </div>
          <div class="fw-semibold text-muted">
            Drafts
          </div>
        </div>
      </div>
    </div>

    <div class="col-md-6 col-xl-3">
      <div class="card card-flush h-xl-100">
        <div class="card-body">
          <span class="svg-icon svg-icon-2tx svg-icon-info">
            <i class="ki-duotone ki-calendar-tick fs-2tx text-info">
              <span class="path1"></span>
              <span class="path2"></span>
              <span class="path3"></span>
              <span class="path4"></span>
              <span class="path5"></span>
              <span class="path6"></span>
            </i>
          </span>
          <div class="fw-bold fs-2 mt-5">
            {{ projectsStore.statistics.recent }}
          </div>
          <div class="fw-semibold text-muted">
            Recent (< 1 year)
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
              placeholder="Search projects..."
            />
          </div>
        </div>

        <div class="card-toolbar">
          <div class="d-flex justify-content-end gap-2" data-kt-customer-table-toolbar="base">
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
              <option :value="null">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
            </select>

            <!-- Filter by Industry -->
            <select
              v-model="industryFilter"
              @change="handleIndustryFilter"
              class="form-select form-select-solid w-150px"
              v-if="projectsStore.industries.length > 0"
            >
              <option :value="null">All Industries</option>
              <option
                v-for="industry in projectsStore.industries"
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
              to="/projects/create"
              class="btn btn-primary"
            >
              <i class="ki-duotone ki-plus fs-2"></i>
              Create Project
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
        <div v-if="viewMode === 'grid' && !projectsStore.isLoading && projectsStore.hasProjects">
          <div class="row g-5">
            <div
              v-for="project in projectsStore.filteredProjects"
              :key="project.id"
              class="col-md-6 col-lg-4"
            >
              <ProjectCard :project="project" />
            </div>
          </div>
        </div>

        <!-- Table View -->
        <div class="table-responsive" v-if="viewMode === 'table' && !projectsStore.isLoading && projectsStore.hasProjects">
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
                <th class="min-w-50px">Image</th>
                <th class="min-w-200px">Title</th>
                <th class="min-w-125px">Client</th>
                <th class="min-w-125px">Industry</th>
                <th class="min-w-125px">Technologies</th>
                <th class="min-w-100px">Status</th>
                <th class="min-w-100px">Completion Date</th>
                <th class="text-end min-w-100px">Actions</th>
              </tr>
            </thead>
            <tbody class="fw-semibold text-gray-600">
              <tr v-for="project in projectsStore.filteredProjects" :key="project.id">
                <td>
                  <div class="form-check form-check-sm form-check-custom form-check-solid">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      :checked="selectedIds.includes(project.id)"
                      @change="toggleSelect(project.id)"
                    />
                  </div>
                </td>
                <td>
                  <img
                    v-if="project.featured_image_url"
                    :src="project.featured_image_url"
                    class="w-50px h-50px rounded"
                    :alt="project.title"
                    style="object-fit: cover;"
                  />
                  <i v-else class="ki-duotone ki-picture fs-2x text-gray-400">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                </td>
                <td>
                  <div class="d-flex flex-column">
                    <NuxtLink
                      :to="`/projects/edit/${project.id}`"
                      class="text-gray-800 fw-bold text-hover-primary"
                    >
                      {{ project.title }}
                    </NuxtLink>
                    <span class="text-muted fs-7" v-if="project.description">
                      {{ truncate(project.description, 50) }}
                    </span>
                  </div>
                </td>
                <td>
                  <span v-if="project.client_name">{{ project.client_name }}</span>
                  <span v-else class="text-muted">—</span>
                </td>
                <td>
                  <span
                    v-if="project.industry"
                    class="badge"
                    :class="getIndustryBadgeClass(project.industry)"
                  >
                    {{ project.industry }}
                  </span>
                  <span v-else class="text-muted">—</span>
                </td>
                <td>
                  <span class="text-gray-600">
                    {{ formatTechnologies(project.technologies, 2) }}
                  </span>
                </td>
                <td>
                  <span
                    class="badge"
                    :class="getStatusBadgeClass(project.status)"
                  >
                    {{ getStatusText(project.status) }}
                  </span>
                </td>
                <td>
                  <span v-if="project.completion_date">
                    {{ formatDateShort(project.completion_date) }}
                  </span>
                  <span v-else class="text-muted">—</span>
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
                        :to="`/projects/edit/${project.id}`"
                        class="menu-link px-3"
                      >
                        View
                      </NuxtLink>
                    </div>
                    <div class="menu-item px-3">
                      <NuxtLink
                        :to="`/projects/edit/${project.id}`"
                        class="menu-link px-3"
                      >
                        Edit
                      </NuxtLink>
                    </div>
                    <div class="menu-item px-3">
                      <a
                        href="#"
                        class="menu-link px-3"
                        @click.prevent="handleToggleStatus(project)"
                      >
                        {{
                          project.status === 'PUBLISHED'
                            ? 'Unpublish'
                            : 'Publish'
                        }}
                      </a>
                    </div>
                    <div class="menu-item px-3">
                      <a
                        href="#"
                        class="menu-link px-3 text-danger"
                        @click.prevent="handleDelete(project)"
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

        <!-- Loading Skeleton -->
        <div v-if="projectsStore.isLoading">
          <div v-if="viewMode === 'grid'" class="row g-5">
            <div class="col-md-6 col-lg-4" v-for="i in 6" :key="i">
              <CardSkeleton :showIcon="false" :lines="3" :showActions="true" />
            </div>
          </div>
          <div v-else class="table-responsive">
            <table class="table align-middle table-row-dashed fs-6 gy-5">
              <thead>
                <tr class="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                  <th class="w-10px pe-2"></th>
                  <th class="min-w-50px">Image</th>
                  <th class="min-w-200px">Title</th>
                  <th class="min-w-125px">Client</th>
                  <th class="min-w-125px">Industry</th>
                  <th class="min-w-125px">Technologies</th>
                  <th class="min-w-100px">Status</th>
                  <th class="min-w-100px">Completion Date</th>
                  <th class="text-end min-w-100px">Actions</th>
                </tr>
              </thead>
              <TableSkeleton :rows="5" :columns="8" :hasCheckbox="true" :hasActions="true" />
            </table>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="!projectsStore.hasProjects"
          class="text-center py-20"
        >
          <i class="ki-duotone ki-folder-down fs-5x text-gray-400 mb-5">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          <div class="fw-bold fs-3 text-gray-600 mb-2">
            No projects
          </div>
          <div class="text-gray-500 mb-5">
            Create your first project
          </div>
          <NuxtLink to="/projects/create" class="btn btn-primary">
            <i class="ki-duotone ki-plus fs-2"></i>
            Create Project
          </NuxtLink>
        </div>

        <!-- Error State -->
        <div
          v-else-if="projectsStore.hasError"
          class="alert alert-danger d-flex align-items-center p-5"
        >
          <i class="ki-duotone ki-shield-cross fs-2hx text-danger me-4">
            <span class="path1"></span>
            <span class="path2"></span>
            <span class="path3"></span>
          </i>
          <div class="d-flex flex-column">
            <h4 class="mb-1 text-dark">Error</h4>
            <span>{{ projectsStore.error }}</span>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProjectsStore } from '../stores/useProjectsStore'
import { useProjectFormatters } from '../composables/useProjectFormatters'
import { useProjectActions } from '../composables/useProjectActions'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import type { Project, ProjectStatus } from '../types'
import ProjectCard from '../components/ProjectCard.vue'

const projectsStore = useProjectsStore()
const breadcrumbStore = useBreadcrumbStore()

const {
  truncate,
  getStatusBadgeClass,
  getStatusText,
  getIndustryBadgeClass,
  formatTechnologies,
  formatDateShort
} = useProjectFormatters()

const {
  confirmAndDeleteProject,
  toggleProjectStatus,
  bulkDeleteProjects,
  exportProjectsToCSV
} = useProjectActions()

// View mode and filters
const viewMode = ref<'grid' | 'table'>('grid')
const searchQuery = ref('')
const statusFilter = ref<ProjectStatus | null>(null)
const industryFilter = ref<string | null>(null)

// Selection
const selectedIds = ref<string[]>([])

const allSelected = computed(() => {
  return (
    projectsStore.filteredProjects.length > 0 &&
    selectedIds.value.length === projectsStore.filteredProjects.length
  )
})

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedIds.value = []
  } else {
    selectedIds.value = projectsStore.filteredProjects.map((p) => p.id)
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
  await projectsStore.debouncedSearch(searchQuery.value)
}

const handleStatusFilter = async () => {
  await projectsStore.applyStatusFilter(statusFilter.value)
}

const handleIndustryFilter = async () => {
  await projectsStore.applyIndustryFilter(industryFilter.value)
}

const handleDelete = async (project: Project) => {
  await confirmAndDeleteProject(project)
}

const handleToggleStatus = async (project: Project) => {
  await toggleProjectStatus(project)
}

const handleBulkDelete = async () => {
  const success = await bulkDeleteProjects(selectedIds.value)
  if (success) {
    selectedIds.value = []
  }
}

const handleExport = () => {
  exportProjectsToCSV()
}

// Lifecycle
onMounted(async () => {
  breadcrumbStore.setBreadcrumb([
    { title: 'Home', path: '/' },
    { title: 'Projects', path: '/projects/list' }
  ])

  await projectsStore.initialize()
})
</script>
