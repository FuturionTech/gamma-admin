<template>
  <!-- Page Header -->
  <PageHeader title="Edit Testimonial" />

  <!-- Loading State -->
  <div v-if="isLoading" class="card">
    <div class="card-body text-center py-20">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>

  <!-- Error State -->
  <div v-else-if="loadError" class="alert alert-danger d-flex align-items-center p-5">
    <i class="ki-duotone ki-shield-cross fs-2hx text-danger me-4">
      <span class="path1"></span>
      <span class="path2"></span>
      <span class="path3"></span>
    </i>
    <div class="d-flex flex-column">
      <h4 class="mb-1 text-dark">An error occurred</h4>
      <span>{{ loadError }}</span>
    </div>
  </div>

  <!-- Form -->
  <div v-else class="card">
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
            <TestimonialFormBasicInfo
              v-model="form"
              :errors="errors"
            />
          </div>

          <!-- Settings Tab -->
          <div
            class="tab-pane fade"
            :class="{ 'show active': activeTab === 'settings' }"
            id="settings-tab"
            role="tabpanel"
          >
            <TestimonialFormSettings
              v-model="form"
              :errors="errors"
              :imagePreview="imagePreview"
              @imageChanged="handleImageChange"
              @imageRemoved="handleImageRemove"
            />
          </div>
        </div>

        <!-- Form Actions -->
        <div class="d-flex justify-content-end gap-3 mt-10 pt-10 border-top">
          <NuxtLink
            to="/testimonials"
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
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useTestimonialsStore } from '../stores/useTestimonialsStore'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import type { TestimonialFormData } from '../types'
import TestimonialFormBasicInfo from '../components/TestimonialFormBasicInfo.vue'
import TestimonialFormSettings from '../components/TestimonialFormSettings.vue'

const route = useRoute()
const router = useRouter()
const testimonialsStore = useTestimonialsStore()
const breadcrumbStore = useBreadcrumbStore()
const { showSuccess, showError } = useNotification()

const testimonialId = computed(() => route.params.id as string)

// Form state
const form = reactive<TestimonialFormData>({
  application_id: '1',
  name: '',
  content: '',
  image_url: null,
  position: null,
  company: null,
  rating: 5,
  order: 0,
  is_active: true,
  imageFile: null
})

const errors = ref<Record<string, string>>({})
const activeTab = ref<'basic' | 'settings'>('basic')
const isLoading = ref(true)
const isSubmitting = ref(false)
const loadError = ref('')
const imagePreview = ref('')

// Validation
const isFormValid = computed(() => {
  return (
    form.name.trim() !== '' &&
    form.content.trim() !== '' &&
    Object.keys(errors.value).length === 0
  )
})

const validateForm = (): boolean => {
  errors.value = {}

  if (!form.name.trim()) {
    errors.value.name = 'Name is required'
  } else if (form.name.length > 255) {
    errors.value.name = 'Name cannot exceed 255 characters'
  }

  if (!form.content.trim()) {
    errors.value.content = 'Content is required'
  } else if (form.content.length > 500) {
    errors.value.content = 'Content cannot exceed 500 characters'
  }

  if (form.rating !== null && form.rating !== undefined) {
    if (form.rating < 1 || form.rating > 5) {
      errors.value.rating = 'Rating must be between 1 and 5'
    }
  }

  if (form.order !== null && form.order !== undefined && form.order < 0) {
    errors.value.order = 'Order must be a positive number'
  }

  return Object.keys(errors.value).length === 0
}

// Load testimonial
const loadTestimonial = async () => {
  isLoading.value = true
  loadError.value = ''

  try {
    const testimonial = await testimonialsStore.fetchTestimonial(testimonialId.value)

    if (testimonial) {
      // Populate form
      form.application_id = testimonial.application_id
      form.name = testimonial.name
      form.content = testimonial.content
      form.image_url = testimonial.image_url
      form.position = testimonial.position
      form.company = testimonial.company
      form.rating = testimonial.rating
      form.order = testimonial.order
      form.is_active = testimonial.is_active

      // Set image preview
      if (testimonial.image_url) {
        imagePreview.value = testimonial.image_url
      }

      // Update breadcrumb
      breadcrumbStore.setBreadcrumb([
        { title: 'Home', path: '/' },
        { title: 'Testimonials', path: '/testimonials' },
        { title: testimonial.name, path: `/testimonials/${testimonial.id}/edit` }
      ])
    }
  } catch (error: any) {
    console.error('Error loading testimonial:', error)
    loadError.value = error.message || 'Failed to load testimonial'
  } finally {
    isLoading.value = false
  }
}

// Handlers
const handleImageChange = (file: File) => {
  form.imageFile = file

  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)

  // TODO: Upload file to server and set form.image_url to URL
}

const handleImageRemove = () => {
  form.image_url = null
  form.imageFile = null
  imagePreview.value = ''
}

const handleSubmit = async () => {
  if (!validateForm()) {
    showError('An error occurred')
    return
  }

  isSubmitting.value = true

  try {
    // Prepare input
    const input = {
      name: form.name,
      content: form.content,
      image_url: imagePreview.value || form.image_url || null,
      position: form.position || null,
      company: form.company || null,
      rating: form.rating ?? 5,
      order: form.order ?? 0,
      is_active: form.is_active ?? true
    }

    // Update testimonial
    await testimonialsStore.updateTestimonial(testimonialId.value, input)

    showSuccess('Testimonial updated successfully')

    // Redirect to list
    await router.push('/testimonials')
  } catch (error: any) {
    console.error('Error updating testimonial:', error)
    showError(error.message || 'Failed to save testimonial')
  } finally {
    isSubmitting.value = false
  }
}

// Lifecycle
onMounted(async () => {
  await loadTestimonial()
})
</script>
