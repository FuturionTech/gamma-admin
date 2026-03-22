<template>
  <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
    <div class="d-flex flex-column flex-column-fluid">
      <div id="kt_app_content" class="app-content flex-column-fluid">
        <div id="kt_app_content_container" class="app-container container-fluid">
          <form @submit.prevent="handleSubmit">
            <div class="row g-5">
              <!-- Main Form Column -->
              <div class="col-xl-8">
                <div class="card mb-5">
                  <div class="card-header">
                    <h3 class="card-title">Basic Information</h3>
                  </div>
                  <div class="card-body">
                    <!-- Loading State -->
                    <div v-if="isSubmitting" class="text-center py-20">
                      <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    </div>
                    <ServiceFormBasicInfo
                      v-else
                      v-model="form"
                      :errors="errors"
                    />
                  </div>
                </div>
              </div>

              <!-- Sidebar Column -->
              <div class="col-xl-4">
                <div class="card mb-5">
                  <div class="card-header">
                    <h3 class="card-title">Settings & Icon</h3>
                  </div>
                  <div class="card-body">
                    <ServiceFormSettings
                      v-model="form"
                      :errors="errors"
                      :iconPreview="iconPreview"
                      @iconChanged="handleIconChange"
                      @iconRemoved="handleIconRemove"
                    />
                  </div>
                </div>

                <!-- Actions Card -->
                <div class="card mt-5">
                  <div class="card-body d-flex flex-column gap-3">
                    <button
                      type="submit"
                      class="btn btn-primary w-100"
                      :disabled="!isFormValid || isSubmitting"
                    >
                      <span v-if="!isSubmitting">
                        <i class="ki-duotone ki-check fs-2"></i>
                        Save Service
                      </span>
                      <span v-else>
                        <span class="spinner-border spinner-border-sm me-2"></span>
                        Saving...
                      </span>
                    </button>

                    <NuxtLink
                      to="/services/list"
                      class="btn btn-light w-100"
                    >
                      <i class="ki-duotone ki-cross fs-2">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                      Cancel
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useServicesStore } from '../stores/useServicesStore'
import { useServiceFormatters } from '../composables/useServiceFormatters'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import type { ServiceFormData } from '../types'

const servicesStore = useServicesStore()
const breadcrumbStore = useBreadcrumbStore()
const router = useRouter()
const { showSuccess, showError } = useNotification()
const { generateSlug } = useServiceFormatters()

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
    // Auto-generate if empty
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

// Handlers
const handleIconChange = (file: File) => {
  form.iconFile = file

  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    iconPreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)

  // Base64 preview is stored in iconPreview and sent as icon value on submit
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

    // Create service
    const newService = await servicesStore.createService(input)

    showSuccess('Service created successfully')

    // Redirect to list
    await router.push('/services/list')
  } catch (error: any) {
    showError(error.message || 'Failed to save service')
  } finally {
    isSubmitting.value = false
  }
}

// Lifecycle
onMounted(() => {
  breadcrumbStore.setBreadcrumb([
    { title: 'Home', path: '/' },
    { title: 'Services', path: '/services/list' },
    { title: 'Create Service', path: '/services/create' }
  ])
})
</script>
