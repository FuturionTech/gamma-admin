<template>
  <!-- Page Header -->
  <PageHeader
    :title="service ? 'Edit Service' : 'Loading...'"
    :subtitle="service?.title"
  />

  <!-- Loading State -->
  <div v-if="servicesStore.isLoading" class="card">
    <div class="card-body">
      <FormSkeleton :fields="6" :showActions="true" />
    </div>
  </div>

  <!-- Error State -->
  <div
    v-else-if="servicesStore.hasError"
    class="alert alert-danger d-flex align-items-center p-5"
  >
    <i class="ki-duotone ki-shield-cross fs-2hx text-danger me-4">
      <span class="path1"></span>
      <span class="path2"></span>
      <span class="path3"></span>
    </i>
    <div class="d-flex flex-column">
      <h4 class="mb-1 text-dark">An error occurred</h4>
      <span>{{ servicesStore.error }}</span>
    </div>
  </div>

  <!-- Form -->
  <div v-else-if="service" class="card">
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

        <!-- Delete Button -->
        <div class="card-toolbar">
          <button
            type="button"
            class="btn btn-light-danger"
            @click="handleDelete"
            :disabled="isSubmitting"
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

      <div class="card-body">
        <!-- Submitting State -->
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
              <ServiceFormBasicInfo
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
              <ServiceFormSettings
                v-model="form"
                :errors="errors"
                :iconPreview="iconPreview"
                @iconChanged="handleIconChange"
                @iconRemoved="handleIconRemove"
              />
            </div>
          </div>

          <!-- Form Actions -->
          <div class="d-flex justify-content-end gap-3 mt-10 pt-10 border-top">
            <NuxtLink
              to="/services/list"
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
                Save Changes
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
import { useServicesStore } from '../stores/useServicesStore'
import { useServiceFormatters } from '../composables/useServiceFormatters'
import { useServiceActions } from '../composables/useServiceActions'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import type { ServiceFormData, Service } from '../types'

const servicesStore = useServicesStore()
const breadcrumbStore = useBreadcrumbStore()
const route = useRoute()
const router = useRouter()
const { showSuccess, showError } = useNotification()
const { generateSlug } = useServiceFormatters()
const { confirmAndDeleteService } = useServiceActions()

const serviceId = computed(() => route.params.id as string)
const service = computed(() => servicesStore.currentService)

// Form state
const form = reactive<ServiceFormData>({
  title: '',
  description: null,
  icon: null,
  category: null,
  slug: null,
  order: 0,
  is_active: true,
  iconFile: null
})

const errors = ref<Record<string, string>>({})
const activeTab = ref<'basic' | 'settings'>('basic')
const isSubmitting = ref(false)
const iconPreview = ref('')

// Validation
const isFormValid = computed(() => {
  return (
    form.title.trim() !== '' &&
    (form.slug?.trim() || '') !== '' &&
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

  if (!form.slug?.trim()) {
    if (form.title.trim()) {
      form.slug = generateSlug(form.title)
    } else {
      errors.value.slug = 'Slug is required'
    }
  }

  if (form.order !== null && form.order !== undefined && form.order < 0) {
    errors.value.order = 'Order must be a positive number'
  }

  return Object.keys(errors.value).length === 0
}

// Populate form with existing service data
const populateForm = (service: Service) => {
  form.title = service.title
  form.description = service.description
  form.icon = service.icon
  form.category = service.category
  form.slug = service.slug
  form.order = service.order
  form.is_active = service.is_active

  if (service.icon) {
    iconPreview.value = service.icon
  }
}

// Watch for service changes
watch(
  () => servicesStore.currentService,
  (newService) => {
    if (newService) {
      populateForm(newService)
    }
  },
  { immediate: true }
)

// Handlers
const handleIconChange = (file: File) => {
  form.iconFile = file

  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    iconPreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const handleIconRemove = () => {
  form.icon = null
  form.iconFile = null
  iconPreview.value = ''
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
      title: form.title,
      description: form.description || null,
      icon: iconPreview.value || form.icon || null,
      category: form.category || null,
      slug: form.slug || generateSlug(form.title),
      order: form.order ?? 0,
      is_active: form.is_active ?? true
    }

    // Update service
    await servicesStore.updateService(serviceId.value, input)

    showSuccess('Service updated successfully')

    // Redirect to list
    await router.push('/services/list')
  } catch (error: any) {
    console.error('Error updating service:', error)
    showError(error.message || 'Failed to save service')
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = async () => {
  if (!service.value) return

  const deleted = await confirmAndDeleteService(service.value)
  if (deleted) {
    await router.push('/services/list')
  }
}

// Lifecycle
onMounted(async () => {
  // Fetch service
  try {
    await servicesStore.fetchService(serviceId.value)

    if (service.value) {
      breadcrumbStore.setBreadcrumb([
        { title: 'Home', path: '/' },
        { title: 'Services', path: '/services/list' },
        { title: service.value.title, path: `/services/edit/${serviceId.value}` }
      ])
    }
  } catch (error) {
    console.error('Error loading service:', error)
  }
})
</script>
