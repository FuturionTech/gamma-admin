<template>
  <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
    <div class="d-flex flex-column flex-column-fluid">
      <div id="kt_app_content" class="app-content flex-column-fluid">
        <div id="kt_app_content_container" class="app-container container-fluid">
          <!-- Page Header -->
          <PageHeader title="Create Project" />

          <div class="card">
      <!-- Tabs Navigation -->
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
        <!-- Loading State -->
        <div v-if="isSubmitting" class="text-center py-20">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <!-- Form -->
        <form v-else @submit.prevent="handleSubmit">
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
                  <!-- Title -->
                  <div class="mb-5">
                    <label class="form-label required">
                      Project Title
                    </label>
                    <input
                      type="text"
                      v-model="form.title"
                      class="form-control"
                      :class="{ 'is-invalid': errors.title }"
                      placeholder="e.g. E-commerce platform for..."
                      @input="handleTitleChange"
                    />
                    <div v-if="errors.title" class="invalid-feedback">{{ errors.title }}</div>
                  </div>

                  <!-- Slug -->
                  <div class="mb-5">
                    <label class="form-label">
                      Slug (URL)
                    </label>
                    <input
                      type="text"
                      v-model="form.slug"
                      class="form-control"
                      :class="{ 'is-invalid': errors.slug }"
                      placeholder="auto-generated"
                    />
                    <div class="form-text">
                      Leave empty to auto-generate
                    </div>
                    <div v-if="errors.slug" class="invalid-feedback">{{ errors.slug }}</div>
                  </div>

                  <!-- Description -->
                  <div class="mb-5">
                    <label class="form-label">
                      Short Description
                    </label>
                    <textarea
                      v-model="form.description"
                      class="form-control"
                      rows="3"
                      placeholder="A brief description of the project..."
                    ></textarea>
                  </div>
                </div>

                <div class="col-md-4">
                  <!-- Client Name -->
                  <div class="mb-5">
                    <label class="form-label">
                      Client Name
                    </label>
                    <input
                      type="text"
                      v-model="form.client_name"
                      class="form-control"
                      placeholder="e.g. ACME Corp"
                    />
                  </div>

                  <!-- Industry -->
                  <div class="mb-5">
                    <label class="form-label">
                      Industry
                    </label>
                    <select
                      v-model="form.industry"
                      class="form-select"
                    >
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
              <!-- Challenge -->
              <div class="mb-5">
                <label class="form-label required">
                  Challenge / Problem
                </label>
                <textarea
                  v-model="form.challenge"
                  class="form-control"
                  :class="{ 'is-invalid': errors.challenge }"
                  rows="5"
                  placeholder="Describe the problem the client was facing..."
                ></textarea>
                <div class="form-text">
                  Explain the context and challenges to address
                </div>
                <div v-if="errors.challenge" class="invalid-feedback">{{ errors.challenge }}</div>
              </div>

              <!-- Solution -->
              <div class="mb-5">
                <label class="form-label required">
                  Solution
                </label>
                <textarea
                  v-model="form.solution"
                  class="form-control"
                  :class="{ 'is-invalid': errors.solution }"
                  rows="5"
                  placeholder="Describe the solution implemented..."
                ></textarea>
                <div class="form-text">
                  Detail your approach and the developed solution
                </div>
                <div v-if="errors.solution" class="invalid-feedback">{{ errors.solution }}</div>
              </div>

              <!-- Results -->
              <div class="mb-5">
                <label class="form-label required">
                  Results
                </label>
                <textarea
                  v-model="form.results"
                  class="form-control"
                  :class="{ 'is-invalid': errors.results }"
                  rows="5"
                  placeholder="Describe the results achieved..."
                ></textarea>
                <div class="form-text">
                  Highlight measurable benefits
                </div>
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
              <!-- Featured Image -->
              <div class="mb-10">
                <label class="form-label">
                  Featured Image
                </label>
                <div v-if="featuredImagePreview">
                  <img
                    :src="featuredImagePreview"
                    class="w-100 rounded mb-3"
                    style="max-height: 300px; object-fit: cover;"
                    alt="Featured image preview"
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

              <!-- Gallery Images -->
              <div class="mb-5">
                <label class="form-label">
                  Image Gallery
                </label>
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
              <!-- Technologies -->
              <div class="mb-5">
                <label class="form-label">
                  Technologies Used
                </label>
                <TechTagInput
                  v-model="form.technologies"
                  placeholder="e.g. React, Node.js, AWS..."
                  hint="Press Enter to add"
                />
              </div>

              <!-- Completion Date -->
              <div class="mb-5">
                <label class="form-label">
                  Completion Date
                </label>
                <input
                  type="date"
                  v-model="form.completion_date"
                  class="form-control w-auto"
                />
                <div class="form-text">
                  Project delivery or completion date
                </div>
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
                <label class="form-label required">
                  Status
                </label>
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
                <div class="form-text">
                  Drafts are not publicly visible
                </div>
              </div>

              <!-- Preview -->
              <div class="alert alert-info d-flex align-items-center p-5">
                <i class="ki-duotone ki-information-5 fs-2hx text-info me-4">
                  <span class="path1"></span>
                  <span class="path2"></span>
                  <span class="path3"></span>
                </i>
                <div class="d-flex flex-column">
                  <h4 class="mb-1 text-dark">Ready to publish?</h4>
                  <span>Verify that all information is complete before publishing.</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="d-flex justify-content-end gap-3 mt-10 pt-10 border-top">
            <NuxtLink
              to="/projects/list"
              class="btn btn-light"
            >
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useProjectsStore } from '../stores/useProjectsStore'
import { useProjectFormatters } from '../composables/useProjectFormatters'
import { useProjectActions } from '../composables/useProjectActions'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import type { ProjectFormData } from '../types'
import { ProjectStatus, COMMON_INDUSTRIES } from '../types'
import GalleryManager from '../components/GalleryManager.vue'
import TechTagInput from '../components/TechTagInput.vue'

const projectsStore = useProjectsStore()
const breadcrumbStore = useBreadcrumbStore()
const router = useRouter()
const { showSuccess, showError } = useNotification()
const { generateSlug } = useProjectFormatters()
const { uploadFeaturedImage, uploadGalleryImages } = useProjectActions()

// Form state
const form = reactive<ProjectFormData>({
  title: '',
  slug: null,
  description: null,
  challenge: '',
  solution: '',
  results: '',
  featured_image_url: null,
  gallery_images: [],
  client_name: null,
  industry: null,
  technologies: [],
  status: ProjectStatus.DRAFT,
  completion_date: null,
  featuredImageFile: null,
  galleryImageFiles: []
})

const errors = ref<Record<string, string>>({})
const activeTab = ref<'overview' | 'casestudy' | 'media' | 'technical' | 'publication'>('overview')
const isSubmitting = ref(false)
const featuredImagePreview = ref('')

// Validation
const isFormValid = computed(() => {
  return (
    form.title.trim() !== '' &&
    form.challenge.trim() !== '' &&
    form.solution.trim() !== '' &&
    form.results.trim() !== '' &&
    Object.keys(errors.value).length === 0
  )
})

const validateForm = (): boolean => {
  errors.value = {}

  if (!form.title.trim()) {
    errors.value.title = 'Title is required'
  }

  if (!form.slug?.trim()) {
    // Auto-generate if empty
    if (form.title.trim()) {
      form.slug = generateSlug(form.title)
    } else {
      errors.value.slug = 'Slug is required'
    }
  }

  if (!form.challenge.trim()) {
    errors.value.challenge = 'Challenge is required'
  }

  if (!form.solution.trim()) {
    errors.value.solution = 'Solution is required'
  }

  if (!form.results.trim()) {
    errors.value.results = 'Results are required'
  }

  return Object.keys(errors.value).length === 0
}

// Handlers
const handleTitleChange = () => {
  if (!form.slug) {
    form.slug = generateSlug(form.title)
  }
}

const handleFeaturedImageChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  form.featuredImageFile = file

  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    featuredImagePreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)

  // Upload to server (optional: can be done on submit)
  // const url = await uploadFeaturedImage(file)
  // if (url) form.featured_image_url = url
}

const handleFeaturedImageRemove = () => {
  form.featured_image_url = null
  form.featuredImageFile = null
  featuredImagePreview.value = ''
}

const handleGalleryFilesAdded = async (files: File[]) => {
  // Store files for upload on submit
  if (!form.galleryImageFiles) {
    form.galleryImageFiles = []
  }
  form.galleryImageFiles.push(...files)

  // Upload to server (optional: can be done on submit)
  // const urls = await uploadGalleryImages(files)
  // if (urls.length > 0) {
  //   form.gallery_images = [...(form.gallery_images || []), ...urls]
  // }
}

const handleSubmit = async () => {
  if (!validateForm()) {
    showError('Please correct the errors')
    return
  }

  isSubmitting.value = true

  try {
    // Prepare input
    const input = {
      title: form.title,
      slug: form.slug || generateSlug(form.title),
      description: form.description || null,
      challenge: form.challenge,
      solution: form.solution,
      results: form.results,
      featured_image_url: featuredImagePreview.value || form.featured_image_url || null,
      gallery_images: form.gallery_images || [],
      client_name: form.client_name || null,
      industry: form.industry || null,
      technologies: form.technologies || [],
      status: form.status,
      completion_date: form.completion_date || null
    }

    // Create project
    await projectsStore.createProject(input)

    showSuccess('Project created successfully')

    // Redirect to list
    await router.push('/projects/list')
  } catch (error: any) {
    console.error('Error creating project:', error)
    showError(error.message || 'Failed to save')
  } finally {
    isSubmitting.value = false
  }
}

// Lifecycle
onMounted(() => {
  breadcrumbStore.setBreadcrumb([
    { title: 'Home', path: '/' },
    { title: 'Projects', path: '/projects/list' },
    { title: 'Create Project', path: '/projects/create' }
  ])
})
</script>
