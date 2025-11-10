<template>
  <!-- Page Header -->
  <PageHeader
    title="Edit Project"
    :subtitle="project?.title"
  />

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

  <!-- Form -->
  <div v-else-if="project" class="card">
    <div class="card-header border-0">
      <div class="card-title">
        <ul class="nav nav-tabs nav-line-tabs nav-stretch fs-6 border-0 fw-bold" role="tablist">
          <li class="nav-item" role="presentation">
            <a
              class="nav-link"
              :class="{ active: activeTab === 'overview' }"
              data-bs-toggle="tab"
              href="#overview-tab"
              role="tab"
              @click="activeTab = 'overview'"
            >
              <i class="ki-duotone ki-note-2 fs-2 me-2">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
                <span class="path4"></span>
              </i>
              Overview
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a
              class="nav-link"
              :class="{ active: activeTab === 'casestudy' }"
              data-bs-toggle="tab"
              href="#casestudy-tab"
              role="tab"
              @click="activeTab = 'casestudy'"
            >
              <i class="ki-duotone ki-book fs-2 me-2">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
                <span class="path4"></span>
              </i>
              Case Study
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a
              class="nav-link"
              :class="{ active: activeTab === 'media' }"
              data-bs-toggle="tab"
              href="#media-tab"
              role="tab"
              @click="activeTab = 'media'"
            >
              <i class="ki-duotone ki-picture fs-2 me-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              Media
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a
              class="nav-link"
              :class="{ active: activeTab === 'technical' }"
              data-bs-toggle="tab"
              href="#technical-tab"
              role="tab"
              @click="activeTab = 'technical'"
            >
              <i class="ki-duotone ki-code fs-2 me-2">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
                <span class="path4"></span>
              </i>
              Technical
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a
              class="nav-link"
              :class="{ active: activeTab === 'publication' }"
              data-bs-toggle="tab"
              href="#publication-tab"
              role="tab"
              @click="activeTab = 'publication'"
            >
              <i class="ki-duotone ki-check-circle fs-2 me-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              Publication
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div class="card-body">
      <form @submit.prevent="handleSubmit">
        <div class="tab-content">
          <!-- Overview Tab -->
          <div
            class="tab-pane fade"
            :class="{ 'show active': activeTab === 'overview' }"
            id="overview-tab"
            role="tabpanel"
          >
            <div class="row mb-5">
              <div class="col-md-8">
                <div class="mb-5">
                  <label class="form-label required">Project Title</label>
                  <input
                    type="text"
                    v-model="form.title"
                    class="form-control"
                    :class="{ 'is-invalid': errors.title }"
                  />
                  <div v-if="errors.title" class="invalid-feedback">{{ errors.title }}</div>
                </div>

                <div class="mb-5">
                  <label class="form-label">Slug (URL)</label>
                  <input
                    type="text"
                    v-model="form.slug"
                    class="form-control"
                    :class="{ 'is-invalid': errors.slug }"
                  />
                  <div v-if="errors.slug" class="invalid-feedback">{{ errors.slug }}</div>
                </div>

                <div class="mb-5">
                  <label class="form-label">Short Description</label>
                  <textarea
                    v-model="form.description"
                    class="form-control"
                    rows="3"
                  ></textarea>
                </div>
              </div>

              <div class="col-md-4">
                <div class="mb-5">
                  <label class="form-label">Client Name</label>
                  <input
                    type="text"
                    v-model="form.client_name"
                    class="form-control"
                  />
                </div>

                <div class="mb-5">
                  <label class="form-label">Industry</label>
                  <select v-model="form.industry" class="form-select">
                    <option :value="null">Select an industry</option>
                    <option
                      v-for="industry in COMMON_INDUSTRIES"
                      :key="industry"
                      :value="industry"
                    >
                      {{ industry }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Case Study Tab -->
          <div
            class="tab-pane fade"
            :class="{ 'show active': activeTab === 'casestudy' }"
            id="casestudy-tab"
            role="tabpanel"
          >
            <div class="mb-5">
              <label class="form-label required">Challenge / Problem</label>
              <textarea
                v-model="form.challenge"
                class="form-control"
                :class="{ 'is-invalid': errors.challenge }"
                rows="5"
              ></textarea>
              <div v-if="errors.challenge" class="invalid-feedback">{{ errors.challenge }}</div>
            </div>

            <div class="mb-5">
              <label class="form-label required">Solution</label>
              <textarea
                v-model="form.solution"
                class="form-control"
                :class="{ 'is-invalid': errors.solution }"
                rows="5"
              ></textarea>
              <div v-if="errors.solution" class="invalid-feedback">{{ errors.solution }}</div>
            </div>

            <div class="mb-5">
              <label class="form-label required">Results</label>
              <textarea
                v-model="form.results"
                class="form-control"
                :class="{ 'is-invalid': errors.results }"
                rows="5"
              ></textarea>
              <div v-if="errors.results" class="invalid-feedback">{{ errors.results }}</div>
            </div>
          </div>

          <!-- Media Tab -->
          <div
            class="tab-pane fade"
            :class="{ 'show active': activeTab === 'media' }"
            id="media-tab"
            role="tabpanel"
          >
            <div class="mb-10">
              <label class="form-label">Featured Image</label>
              <div v-if="featuredImagePreview">
                <img
                  :src="featuredImagePreview"
                  class="w-100 rounded mb-3"
                  style="max-height: 300px; object-fit: cover;"
                  alt="Featured image"
                />
                <button
                  type="button"
                  class="btn btn-sm btn-light-danger"
                  @click="handleFeaturedImageRemove"
                >
                  <i class="ki-duotone ki-trash fs-4">
                    <span class="path1"></span>
                    <span class="path2"></span>
                    <span class="path3"></span>
                    <span class="path4"></span>
                    <span class="path5"></span>
                  </i>
                  Remove
                </button>
              </div>
              <div v-else>
                <label class="btn btn-light-primary">
                  <i class="ki-duotone ki-file-up fs-2">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    class="d-none"
                    @change="handleFeaturedImageChange"
                  />
                </label>
              </div>
            </div>

            <div class="mb-5">
              <label class="form-label">Image Gallery</label>
              <GalleryManager
                v-model="form.gallery_images"
                @filesAdded="handleGalleryFilesAdded"
              />
            </div>
          </div>

          <!-- Technical Tab -->
          <div
            class="tab-pane fade"
            :class="{ 'show active': activeTab === 'technical' }"
            id="technical-tab"
            role="tabpanel"
          >
            <div class="mb-5">
              <label class="form-label">Technologies Used</label>
              <TechTagInput v-model="form.technologies" />
            </div>

            <div class="mb-5">
              <label class="form-label">Completion Date</label>
              <input
                type="date"
                v-model="form.completion_date"
                class="form-control w-auto"
              />
            </div>
          </div>

          <!-- Publication Tab -->
          <div
            class="tab-pane fade"
            :class="{ 'show active': activeTab === 'publication' }"
            id="publication-tab"
            role="tabpanel"
          >
            <div class="mb-5">
              <label class="form-label required">Status</label>
              <div class="d-flex gap-5">
                <div class="form-check form-check-custom form-check-solid">
                  <input
                    class="form-check-input"
                    type="radio"
                    v-model="form.status"
                    value="DRAFT"
                    id="status-draft"
                  />
                  <label class="form-check-label" for="status-draft">
                    Draft
                  </label>
                </div>
                <div class="form-check form-check-custom form-check-solid">
                  <input
                    class="form-check-input"
                    type="radio"
                    v-model="form.status"
                    value="PUBLISHED"
                    id="status-published"
                  />
                  <label class="form-check-label" for="status-published">
                    Published
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="d-flex justify-content-end gap-3 mt-10 pt-10 border-top">
          <NuxtLink to="/projects/list" class="btn btn-light">
            Cancel
          </NuxtLink>
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="!isFormValid || isSubmitting"
          >
            <span v-if="!isSubmitting">
              <i class="ki-duotone ki-check fs-2"></i>
              Save
            </span>
            <span v-else>
              <span class="spinner-border spinner-border-sm me-2"></span>
              Loading...
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useProjectsStore } from '../stores/useProjectsStore'
import { useProjectFormatters } from '../composables/useProjectFormatters'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import type { Project, UpdateProjectInput } from '../types'
import { COMMON_INDUSTRIES } from '../types'
import GalleryManager from '../components/GalleryManager.vue'
import TechTagInput from '../components/TechTagInput.vue'

const route = useRoute()
const router = useRouter()
const projectsStore = useProjectsStore()
const breadcrumbStore = useBreadcrumbStore()
const { showSuccess, showError } = useNotification()
const { generateSlug } = useProjectFormatters()

const projectId = computed(() => route.params.id as string)
const project = ref<Project | null>(null)
const isLoading = ref(true)
const isSubmitting = ref(false)
const error = ref<string | null>(null)
const activeTab = ref<'overview' | 'casestudy' | 'media' | 'technical' | 'publication'>('overview')
const featuredImagePreview = ref('')

const form = reactive<UpdateProjectInput & { gallery_images?: string[] | null; technologies?: string[] | null }>({
  title: '',
  slug: '',
  description: null,
  challenge: '',
  solution: '',
  results: '',
  featured_image_url: null,
  gallery_images: [],
  client_name: null,
  industry: null,
  technologies: [],
  status: null,
  completion_date: null
})

const errors = ref<Record<string, string>>({})

const isFormValid = computed(() => {
  return (
    form.title?.trim() !== '' &&
    form.challenge?.trim() !== '' &&
    form.solution?.trim() !== '' &&
    form.results?.trim() !== '' &&
    Object.keys(errors.value).length === 0
  )
})

const validateForm = (): boolean => {
  errors.value = {}

  if (!form.title?.trim()) {
      errors.value.title = 'Title is required'
  }

  if (!form.challenge?.trim()) {
    errors.value.challenge = 'Challenge is required'
  }

  if (!form.solution?.trim()) {
    errors.value.solution = 'Solution is required'
  }

  if (!form.results?.trim()) {
    errors.value.results = 'Results are required'
  }

  return Object.keys(errors.value).length === 0
}

const handleFeaturedImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    featuredImagePreview.value = e.target?.result as string
    form.featured_image_url = featuredImagePreview.value
  }
  reader.readAsDataURL(file)
}

const handleFeaturedImageRemove = () => {
  form.featured_image_url = null
  featuredImagePreview.value = ''
}

const handleGalleryFilesAdded = (files: File[]) => {
  // Handle gallery files
}

const handleSubmit = async () => {
  if (!validateForm()) {
    showError('Please correct the errors')
    return
  }

  isSubmitting.value = true

  try {
    await projectsStore.updateProject(projectId.value, form)
    showSuccess('Project updated successfully')
    await router.push('/projects/list')
  } catch (err: any) {
    console.error('Error updating project:', err)
    showError(err.message || 'Failed to save')
  } finally {
    isSubmitting.value = false
  }
}

const loadProject = async () => {
  isLoading.value = true
  error.value = null

  try {
    const data = await projectsStore.fetchProject(projectId.value)

    if (data) {
      project.value = data

      // Populate form
      form.title = data.title
      form.slug = data.slug
      form.description = data.description
      form.challenge = data.challenge
      form.solution = data.solution
      form.results = data.results
      form.featured_image_url = data.featured_image_url
      form.gallery_images = data.gallery_images || []
      form.client_name = data.client_name
      form.industry = data.industry
      form.technologies = data.technologies || []
      form.status = data.status
      form.completion_date = data.completion_date

      if (data.featured_image_url) {
        featuredImagePreview.value = data.featured_image_url
      }
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
      { title: 'Home', path: '/' },
      { title: 'Projects', path: '/projects/list' },
      { title: project.value.title, path: `/projects/edit/${project.value.id}` }
    ])
  }
})
</script>
