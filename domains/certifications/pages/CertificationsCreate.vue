<template>
  <!-- Page Header -->
  <PageHeader
    title="Create Certification"
    subtitle="Create a new certification"
  />

  <!-- Form Card -->
  <div class="card">
      <div class="card-header">
        <h3 class="card-title">Certification Information</h3>
      </div>

      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <!-- Title -->
          <div class="mb-10">
            <label class="form-label required">Title</label>
            <input
              type="text"
              v-model="formData.title"
              class="form-control"
              :class="{ 'is-invalid': errors.title }"
              placeholder="e.g. ISO 9001:2015"
            />
            <div class="invalid-feedback" v-if="errors.title">{{ errors.title }}</div>
          </div>

          <!-- Category -->
          <div class="mb-10">
            <label class="form-label required">Category</label>
            <select
              v-model="formData.certification_category_id"
              class="form-select"
              :class="{ 'is-invalid': errors.certification_category_id }"
            >
              <option value="">Select a category</option>
              <option
                v-for="category in categoriesStore.sortedCategories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
            <div class="invalid-feedback" v-if="errors.certification_category_id">
              {{ errors.certification_category_id }}
            </div>
          </div>

          <!-- File Upload -->
          <div class="mb-10">
            <label class="form-label required">File (PDF or Image)</label>
            <div class="file-upload-container">
              <input
                type="file"
                ref="fileInput"
                @change="handleFileSelect"
                accept=".pdf,.jpg,.jpeg,.png"
                class="form-control"
                :class="{ 'is-invalid': errors.file || uploadError }"
              />
              <div class="form-text">
                Accepted formats: PDF, JPG, PNG. Max size: 10MB
              </div>
              <div class="invalid-feedback" v-if="errors.file">{{ errors.file }}</div>
              <div class="invalid-feedback" v-if="uploadError">{{ uploadError }}</div>

              <!-- File Preview -->
              <div v-if="filePreview" class="mt-5">
                <div class="card">
                  <div class="card-body p-5">
                    <div class="d-flex align-items-center">
                      <i
                        class="ki-duotone fs-3x me-4"
                        :class="filePreview.type === 'pdf' ? 'ki-file text-danger' : 'ki-picture text-primary'"
                      >
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                      <div class="flex-grow-1">
                        <div class="fw-bold">{{ filePreview.name }}</div>
                        <div class="text-muted fs-7">{{ filePreview.type.toUpperCase() }}</div>
                      </div>
                      <button
                        type="button"
                        class="btn btn-sm btn-icon btn-light-danger"
                        @click="clearFile"
                      >
                        <i class="ki-duotone ki-cross fs-2">
                          <span class="path1"></span>
                          <span class="path2"></span>
                        </i>
                      </button>
                    </div>

                    <!-- Image Preview -->
                    <div v-if="filePreview.type === 'image'" class="mt-4">
                      <img :src="filePreview.url" class="img-fluid rounded" style="max-height: 300px" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Upload Progress -->
              <div v-if="isUploading" class="mt-5">
                <div class="progress">
                  <div
                    class="progress-bar progress-bar-striped progress-bar-animated"
                    role="progressbar"
                    :style="{ width: uploadProgress + '%' }"
                    :aria-valuenow="uploadProgress"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    {{ uploadProgress }}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Issued Date -->
          <div class="mb-10">
            <label class="form-label">Issue Date</label>
            <input
              type="text"
              ref="issuedDateInput"
              v-model="formData.issued_date"
              class="form-control"
              placeholder="Select date"
            />
            <div class="form-text">
              Date when the certification was issued
            </div>
          </div>

          <!-- Active Status -->
          <div class="mb-10">
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                id="is_active"
                v-model="formData.is_active"
              />
              <label class="form-check-label" for="is_active">
                Active certification
              </label>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="d-flex justify-content-end gap-3">
            <button
              type="button"
              class="btn btn-light"
              @click="handleCancel"
              :disabled="isSubmitting"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="isSubmitting || isUploading"
            >
              <span v-if="!isSubmitting">
                <i class="ki-duotone ki-check fs-2"></i>
                Create
              </span>
              <span v-else>
                <span class="spinner-border spinner-border-sm me-2"></span>
                Creating...
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useCertificationsStore } from '../stores/useCertificationsStore'
import { useCertificationCategoriesStore } from '../stores/useCertificationCategoriesStore'
import { useFileUpload } from '../composables/useFileUpload'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import type { CertificationFormData, FilePreview } from '../types'
import Swal from 'sweetalert2'
import flatpickr from 'flatpickr'

const certificationsStore = useCertificationsStore()
const categoriesStore = useCertificationCategoriesStore()
const breadcrumbStore = useBreadcrumbStore()
const router = useRouter()

const {
  uploadFile,
  createFilePreview,
  isUploading,
  uploadProgress,
  uploadError,
  clearUploadError,
  validateFile
} = useFileUpload()

// Form data
const formData = reactive<CertificationFormData>({
  application_id: '1', // Default application ID
  title: '',
  file_url: '',
  certification_category_id: '',
  issued_date: null,
  is_active: true,
  file: null
})

// Form state
const isSubmitting = ref(false)
const errors = reactive<Record<string, string>>({})
const filePreview = ref<FilePreview | null>(null)

// Refs
const fileInput = ref<HTMLInputElement | null>(null)
const issuedDateInput = ref<HTMLInputElement | null>(null)
let datePickerInstance: any = null

// Initialize Flatpickr
const initDatePicker = () => {
  if (issuedDateInput.value) {
    datePickerInstance = flatpickr(issuedDateInput.value, {
      dateFormat: 'Y-m-d',
      maxDate: 'today',
      onChange: (selectedDates, dateStr) => {
        formData.issued_date = dateStr || null
      }
    })
  }
}

// Handle file selection
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // Validate file
  const validation = validateFile(file)
  if (!validation.valid) {
    errors.file = validation.error || ''
    return
  }

  clearUploadError()
  errors.file = ''

  // Store file
  formData.file = file

  // Create preview
  const preview = createFilePreview(file)
  if (preview) {
    filePreview.value = preview
  }
}

// Clear file
const clearFile = () => {
  formData.file = null
  filePreview.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  errors.file = ''
  clearUploadError()
}

// Validate form
const validateForm = (): boolean => {
  // Clear previous errors
  Object.keys(errors).forEach(key => delete errors[key])

  let isValid = true

  if (!formData.title.trim()) {
    errors.title = 'Title is required'
    isValid = false
  }

  if (!formData.certification_category_id) {
    errors.certification_category_id = 'Category is required'
    isValid = false
  }

  if (!formData.file) {
    errors.file = 'File is required'
    isValid = false
  }

  return isValid
}

// Handle submit
const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    // Upload file first
    if (formData.file) {
      const fileUrl = await uploadFile(formData.file)
      formData.file_url = fileUrl
    }

    // Create certification
    const input = {
      application_id: formData.application_id,
      title: formData.title,
      file_url: formData.file_url,
      certification_category_id: formData.certification_category_id,
      issued_date: formData.issued_date,
      is_active: formData.is_active
    }

    await certificationsStore.createCertification(input)

    await Swal.fire({
      title: 'Success',
      text: 'Certification created successfully',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    })

    router.push('/certifications')
  } catch (error: any) {
    console.error('Error creating certification:', error)
    await Swal.fire({
      title: 'Error',
      text: error.message || 'Failed to create certification',
      icon: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}

// Handle cancel
const handleCancel = () => {
  router.push('/certifications')
}

// Lifecycle
onMounted(async () => {
  breadcrumbStore.setBreadcrumb([
    { title: 'Home', path: '/' },
    { title: 'Certifications', path: '/certifications' },
    { title: 'Create Certification', path: '/certifications/create' }
  ])

  await categoriesStore.initialize()
  initDatePicker()
})

onUnmounted(() => {
  // Cleanup
  if (datePickerInstance) {
    datePickerInstance.destroy()
  }
  if (filePreview.value?.url) {
    URL.revokeObjectURL(filePreview.value.url)
  }
})
</script>

<style scoped>
.file-upload-container {
  width: 100%;
}
</style>
