<template>
  <!-- Loading State -->
  <div v-if="isLoading" class="card">
    <div class="card-body text-center py-20">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>

  <!-- Error State -->
  <div v-else-if="error" class="alert alert-danger">
    {{ error }}
  </div>

  <!-- Project Details -->
  <div v-else-if="project">
    <!-- Page Header -->
    <div class="d-flex justify-content-between align-items-center mb-5">
      <div>
        <h1 class="fw-bold fs-1 mb-2">{{ project.title }}</h1>
        <div class="d-flex align-items-center gap-3">
          <span class="badge" :class="getStatusBadgeClass(project.status)">
            {{ getStatusText(project.status) }}
          </span>
          <span v-if="project.industry" class="badge" :class="getIndustryBadgeClass(project.industry)">
            {{ project.industry }}
          </span>
          <span v-if="project.completion_date" class="text-muted">
            <i class="ki-duotone ki-calendar fs-6 me-1">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            {{ formatDate(project.completion_date) }}
          </span>
        </div>
      </div>

      <!-- Actions -->
      <div class="d-flex gap-2">
        <NuxtLink
          :to="`/projects/${project.id}/edit`"
          class="btn btn-primary"
        >
          <i class="ki-duotone ki-pencil fs-2">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          Edit
        </NuxtLink>
        <button
          type="button"
          class="btn btn-light-danger"
          @click="handleDelete"
        >
          <i class="ki-duotone ki-trash fs-2">
            <span class="path1"></span>
            <span class="path2"></span>
            <span class="path3"></span>
            <span class="path4"></span>
            <span class="path5"></span>
          </i>
          Delete
        </button>
      </div>
    </div>

    <div class="row g-5">
      <!-- Main Content -->
      <div class="col-lg-8">
        <!-- Featured Image -->
        <div v-if="project.featured_image_url" class="card mb-5">
          <div class="card-body p-0">
            <img
              :src="project.featured_image_url"
              :alt="project.title"
              class="w-100 rounded"
              style="max-height: 500px; object-fit: cover;"
            />
          </div>
        </div>

        <!-- Description -->
        <div v-if="project.description" class="card mb-5">
          <div class="card-body">
            <h3 class="card-title mb-4">
              Description
            </h3>
            <p class="text-gray-700 fs-6">{{ project.description }}</p>
          </div>
        </div>

        <!-- Case Study Sections -->
        <div class="card mb-5">
          <div class="card-body">
            <!-- Challenge -->
            <div class="mb-8">
              <h3 class="fw-bold fs-3 mb-4 d-flex align-items-center">
                <i class="ki-duotone ki-question fs-1 text-danger me-3">
                  <span class="path1"></span>
                  <span class="path2"></span>
                  <span class="path3"></span>
                </i>
                Challenge
              </h3>
              <p class="text-gray-700 fs-6 ps-12">{{ project.challenge }}</p>
            </div>

            <!-- Solution -->
            <div class="mb-8">
              <h3 class="fw-bold fs-3 mb-4 d-flex align-items-center">
                <i class="ki-duotone ki-rocket fs-1 text-primary me-3">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
                Solution
              </h3>
              <p class="text-gray-700 fs-6 ps-12">{{ project.solution }}</p>
            </div>

            <!-- Results -->
            <div>
              <h3 class="fw-bold fs-3 mb-4 d-flex align-items-center">
                <i class="ki-duotone ki-chart-line-up fs-1 text-success me-3">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
                Results
              </h3>
              <p class="text-gray-700 fs-6 ps-12">{{ project.results }}</p>
            </div>
          </div>
        </div>

        <!-- Gallery -->
        <div v-if="project.gallery_images && project.gallery_images.length > 0" class="card">
          <div class="card-body">
            <h3 class="card-title mb-5">
              Gallery
              <span class="badge badge-light ms-2">{{ project.gallery_images.length }}</span>
            </h3>

            <div class="row g-4">
              <div
                v-for="(image, index) in project.gallery_images"
                :key="index"
                class="col-md-4 col-sm-6"
              >
                <a :href="image" target="_blank">
                  <img
                    :src="image"
                    :alt="`Gallery image ${index + 1}`"
                    class="w-100 rounded"
                    style="height: 200px; object-fit: cover; cursor: pointer;"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="col-lg-4">
        <!-- Project Info -->
        <div class="card mb-5">
          <div class="card-body">
            <h3 class="card-title mb-5">
              Information
            </h3>

            <!-- Client -->
            <div class="mb-5" v-if="project.client_name">
              <div class="fw-bold text-gray-600 mb-1">
                Client
              </div>
              <div class="text-gray-800 fs-6">{{ project.client_name }}</div>
            </div>

            <!-- Industry -->
            <div class="mb-5" v-if="project.industry">
              <div class="fw-bold text-gray-600 mb-1">
                Industry
              </div>
              <div>
                <span class="badge" :class="getIndustryBadgeClass(project.industry)">
                  {{ project.industry }}
                </span>
              </div>
            </div>

            <!-- Completion Date -->
            <div class="mb-5" v-if="project.completion_date">
              <div class="fw-bold text-gray-600 mb-1">
                Completion Date
              </div>
              <div class="text-gray-800 fs-6">{{ formatDate(project.completion_date) }}</div>
            </div>

            <!-- Status -->
            <div class="mb-5">
              <div class="fw-bold text-gray-600 mb-1">
                Status
              </div>
              <div>
                <span class="badge" :class="getStatusBadgeClass(project.status)">
                  {{ getStatusText(project.status) }}
                </span>
              </div>
            </div>

            <!-- Created At -->
            <div class="mb-5">
              <div class="fw-bold text-gray-600 mb-1">
                Created
              </div>
              <div class="text-gray-800 fs-7">{{ formatDate(project.created_at) }}</div>
            </div>

            <!-- Updated At -->
            <div>
              <div class="fw-bold text-gray-600 mb-1">
                Updated
              </div>
              <div class="text-gray-800 fs-7">{{ formatDate(project.updated_at) }}</div>
            </div>
          </div>
        </div>

        <!-- Technologies -->
        <div v-if="project.technologies && project.technologies.length > 0" class="card">
          <div class="card-body">
            <h3 class="card-title mb-5">
              Technologies
              <span class="badge badge-light ms-2">{{ project.technologies.length }}</span>
            </h3>

            <div class="d-flex flex-wrap gap-2">
              <span
                v-for="(tech, index) in project.technologies"
                :key="index"
                class="badge badge-lg badge-light-primary"
              >
                {{ tech }}
              </span>
            </div>
          </div>
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
import type { Project } from '../types'

const route = useRoute()
const router = useRouter()
const projectsStore = useProjectsStore()
const breadcrumbStore = useBreadcrumbStore()

const {
  formatDate,
  getStatusBadgeClass,
  getStatusText,
  getIndustryBadgeClass
} = useProjectFormatters()

const { confirmAndDeleteProject } = useProjectActions()

const projectId = computed(() => route.params.id as string)
const project = ref<Project | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

const handleDelete = async () => {
  if (!project.value) return

  const success = await confirmAndDeleteProject(project.value)
  if (success) {
    await router.push('/projects')
  }
}

const loadProject = async () => {
  isLoading.value = true
  error.value = null

  try {
    const data = await projectsStore.fetchProject(projectId.value)

    if (data) {
      project.value = data
    }
  } catch (err: any) {
      error.value = err.message || 'Failed to load'
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  await loadProject()

  if (project.value) {
    breadcrumbStore.setBreadcrumb([
      { title: Home, path: '/' },
      { title: Projects, path: '/projects' },
      { title: project.value.title, path: `/projects/${project.value.id}` }
    ])
  }
})
</script>
