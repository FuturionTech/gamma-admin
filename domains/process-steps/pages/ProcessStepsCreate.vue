<template>
  <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
    <div class="d-flex flex-column flex-column-fluid">
      <div id="kt_app_content" class="app-content flex-column-fluid">
        <div id="kt_app_content_container" class="app-container container-fluid">
          <div class="card">
            <!-- Tabs Navigation -->
            <div class="card-header border-0">
              <div class="card-title">
                <ul class="nav nav-tabs nav-line-tabs nav-stretch fs-6 border-0 fw-bold" role="tablist">
                  <li class="nav-item" role="presentation">
                    <a
                      class="nav-link"
                      :class="{ active: activeTab === 'basic' }"
                      data-bs-toggle="tab"
                      href="#basic-info-tab"
                      role="tab"
                      @click="activeTab = 'basic'"
                    >
                      <i class="ki-duotone ki-note-2 fs-2 me-2">
                        <span class="path1"></span>
                        <span class="path2"></span>
                        <span class="path3"></span>
                        <span class="path4"></span>
                      </i>
                      Basic Information
                    </a>
                  </li>
                  <li class="nav-item" role="presentation">
                    <a
                      class="nav-link"
                      :class="{ active: activeTab === 'settings' }"
                      data-bs-toggle="tab"
                      href="#settings-tab"
                      role="tab"
                      @click="activeTab = 'settings'"
                    >
                      <i class="ki-duotone ki-setting-2 fs-2 me-2">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                      Settings
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
                  <!-- Basic Info Tab -->
                  <div
                    class="tab-pane fade"
                    :class="{ 'show active': activeTab === 'basic' }"
                    id="basic-info-tab"
                    role="tabpanel"
                  >
                    <!-- Title -->
                    <div class="mb-7">
                      <label class="required fw-semibold fs-6 mb-2">Title</label>
                      <input
                        type="text"
                        v-model="form.title"
                        class="form-control form-control-solid"
                        :class="{ 'is-invalid': errors.title }"
                        placeholder="e.g., Discovery"
                        @input="autoGenerateSlug"
                      />
                      <div v-if="errors.title" class="invalid-feedback">{{ errors.title }}</div>
                    </div>

                    <!-- Slug -->
                    <div class="mb-7">
                      <label class="required fw-semibold fs-6 mb-2">Slug</label>
                      <input
                        type="text"
                        v-model="form.slug"
                        class="form-control form-control-solid"
                        :class="{ 'is-invalid': errors.slug }"
                        placeholder="auto-generated-slug"
                      />
                      <div v-if="errors.slug" class="invalid-feedback">{{ errors.slug }}</div>
                      <div class="form-text">URL-friendly identifier, auto-generated from title.</div>
                    </div>

                    <!-- Step Number -->
                    <div class="mb-7">
                      <label class="required fw-semibold fs-6 mb-2">Step Number</label>
                      <input
                        type="number"
                        v-model.number="form.step_number"
                        class="form-control form-control-solid"
                        :class="{ 'is-invalid': errors.step_number }"
                        placeholder="1"
                        min="1"
                      />
                      <div v-if="errors.step_number" class="invalid-feedback">{{ errors.step_number }}</div>
                      <div class="form-text">The sequential number for this step in the methodology.</div>
                    </div>

                    <!-- Short Description -->
                    <div class="mb-7">
                      <label class="fw-semibold fs-6 mb-2">Short Description</label>
                      <input
                        type="text"
                        v-model="form.short_description"
                        class="form-control form-control-solid"
                        placeholder="A brief summary of this step"
                      />
                    </div>

                    <!-- Description -->
                    <div class="mb-7">
                      <label class="fw-semibold fs-6 mb-2">Description</label>
                      <textarea
                        v-model="form.description"
                        class="form-control form-control-solid"
                        rows="5"
                        placeholder="Detailed description of this process step"
                      ></textarea>
                    </div>
                  </div>

                  <!-- Settings Tab -->
                  <div
                    class="tab-pane fade"
                    :class="{ 'show active': activeTab === 'settings' }"
                    id="settings-tab"
                    role="tabpanel"
                  >
                    <!-- Icon -->
                    <div class="mb-7">
                      <label class="fw-semibold fs-6 mb-2">Icon</label>
                      <input
                        type="text"
                        v-model="form.icon"
                        class="form-control form-control-solid"
                        placeholder="e.g., ki-duotone ki-magnifier"
                      />
                      <div class="form-text">CSS class name for the icon (ki-duotone or bi-* icons).</div>
                      <div v-if="form.icon" class="mt-3">
                        <span class="text-muted me-2">Preview:</span>
                        <i :class="form.icon" class="fs-2x"></i>
                      </div>
                    </div>

                    <!-- Icon Color -->
                    <div class="mb-7">
                      <label class="fw-semibold fs-6 mb-2">Icon Color</label>
                      <div class="d-flex align-items-center gap-3">
                        <input
                          type="color"
                          v-model="iconColorValue"
                          class="form-control form-control-color"
                          style="width: 50px; height: 40px;"
                        />
                        <input
                          type="text"
                          v-model="form.icon_color"
                          class="form-control form-control-solid"
                          placeholder="#8b5cf6"
                        />
                      </div>
                      <div class="form-text">Hex color for the icon.</div>
                    </div>

                    <!-- Is Active -->
                    <div class="mb-7">
                      <label class="fw-semibold fs-6 mb-2">Status</label>
                      <div class="form-check form-switch form-check-custom form-check-solid">
                        <input
                          class="form-check-input"
                          type="checkbox"
                          v-model="form.is_active"
                          id="is_active"
                        />
                        <label class="form-check-label fw-semibold text-muted" for="is_active">
                          {{ form.is_active ? 'Active' : 'Inactive' }}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Form Actions -->
                <div class="d-flex justify-content-end gap-3 mt-10 pt-10 border-top">
                  <NuxtLink
                    to="/process-steps"
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

          <!-- Info Notice -->
          <div class="card mt-5">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <i class="ki-duotone ki-information-5 fs-2x text-info me-4">
                  <span class="path1"></span>
                  <span class="path2"></span>
                  <span class="path3"></span>
                </i>
                <div>
                  <div class="fw-bold text-gray-800">Sub-items</div>
                  <div class="text-muted">
                    You can add sub-items to this process step after creating it, from the edit page.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useProcessStepsStore } from '../stores/useProcessStepsStore'
import { useProcessStepFormatters } from '../composables/useProcessStepFormatters'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import type { ProcessStepFormData } from '../types'

const processStepsStore = useProcessStepsStore()
const breadcrumbStore = useBreadcrumbStore()
const router = useRouter()
const { showSuccess, showError } = useNotification()
const { generateSlug } = useProcessStepFormatters()

// Form state
const form = reactive<ProcessStepFormData>({
  title: '',
  description: null,
  short_description: null,
  step_number: 1,
  icon: null,
  icon_color: null,
  slug: null,
  order: 0,
  is_active: true
})

const errors = ref<Record<string, string>>({})
const activeTab = ref<'basic' | 'settings'>('basic')
const isSubmitting = ref(false)

// Color picker sync
const iconColorValue = computed({
  get: () => form.icon_color || '#8b5cf6',
  set: (val: string) => { form.icon_color = val }
})

// Auto-generate slug from title
const autoGenerateSlug = () => {
  if (form.title) {
    form.slug = generateSlug(form.title)
  }
}

// Validation
const isFormValid = computed(() => {
  return (
    form.title.trim() !== '' &&
    form.step_number > 0 &&
    Object.keys(errors.value).length === 0
  )
})

const validateForm = (): boolean => {
  errors.value = {}

  if (!form.title.trim()) {
    errors.value.title = 'Title is required'
  } else if (form.title.length > 255) {
    errors.value.title = 'Title cannot exceed 255 characters'
  }

  if (!form.step_number || form.step_number < 1) {
    errors.value.step_number = 'Step number is required and must be at least 1'
  }

  if (!form.slug?.trim()) {
    if (form.title.trim()) {
      form.slug = generateSlug(form.title)
    } else {
      errors.value.slug = 'Slug is required'
    }
  }

  return Object.keys(errors.value).length === 0
}

// Handlers
const handleSubmit = async () => {
  if (!validateForm()) {
    showError('Please fix the errors before submitting')
    return
  }

  isSubmitting.value = true

  try {
    const input = {
      title: form.title,
      description: form.description || null,
      short_description: form.short_description || null,
      step_number: form.step_number,
      icon: form.icon || null,
      icon_color: form.icon_color || null,
      slug: form.slug || generateSlug(form.title),
      order: form.order ?? 0,
      is_active: form.is_active ?? true
    }

    await processStepsStore.createProcessStep(input)

    showSuccess('Process step created successfully')

    await router.push('/process-steps')
  } catch (error: any) {
    showError(error.message || 'Failed to create process step')
  } finally {
    isSubmitting.value = false
  }
}

// Lifecycle
onMounted(() => {
  breadcrumbStore.setBreadcrumb([
    { title: 'Home', path: '/' },
    { title: 'Process Steps', path: '/process-steps' },
    { title: 'Create Step', path: '/process-steps/create' }
  ])
})
</script>
