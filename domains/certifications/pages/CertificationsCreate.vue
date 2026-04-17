<template>
  <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
    <div class="d-flex flex-column flex-column-fluid">
      <div id="kt_app_content" class="app-content flex-column-fluid">
        <div id="kt_app_content_container" class="app-container container-fluid">

          <form class="gn-form" novalidate @submit.prevent="handleSubmit">
            <!-- Hero -->
            <header class="gn-form__hero">
              <div class="gn-form__hero-icon" aria-hidden="true">
                <GIcon name="award" :size="32" />
              </div>
              <div class="gn-form__hero-body">
                <span class="gn-form__eyebrow">New certification</span>
                <h1 class="gn-form__title">{{ formData.title || 'Untitled certification' }}</h1>
                <p class="gn-form__subtitle">
                  Add an award, accreditation or industry recognition.
                </p>
              </div>
              <div class="gn-form__hero-actions">
                <NuxtLink to="/certifications" class="gn-form__btn gn-form__btn--secondary">
                  Cancel
                </NuxtLink>
                <button
                  type="submit"
                  class="gn-form__btn gn-form__btn--primary"
                  :disabled="isSubmitting || isUploading"
                >
                  <span v-if="!isSubmitting">Create certification</span>
                  <span v-else class="gn-form__btn-loading">
                    <span class="gn-form__spinner" />
                    Creating…
                  </span>
                </button>
              </div>
            </header>

            <div class="gn-form__layout">
              <!-- Main column -->
              <div class="gn-form__main">
                <section class="gn-form__card">
                  <header class="gn-form__card-header">
                    <h3 class="gn-form__card-title">Details</h3>
                    <p class="gn-form__card-hint">
                      Required information for every certification displayed on the website.
                    </p>
                  </header>

                  <div class="gn-form__grid">
                    <div class="gn-form__field gn-form__field--full">
                      <label class="gn-form__label" for="cert-title">
                        Title <span class="gn-form__required">*</span>
                      </label>
                      <input
                        id="cert-title"
                        v-model="formData.title"
                        type="text"
                        class="gn-form__input"
                        :class="{ 'gn-form__input--error': errors.title }"
                        placeholder="e.g. ISO 9001:2015"
                        @input="clearError('title')"
                      />
                      <span v-if="errors.title" class="gn-form__helper gn-form__helper--error">
                        {{ errors.title }}
                      </span>
                    </div>

                    <div class="gn-form__field gn-form__field--full">
                      <label class="gn-form__label">
                        Category <span class="gn-form__required">*</span>
                      </label>
                      <div class="gn-form__category">
                        <select
                          v-if="!creatingCategory"
                          v-model="formData.certification_category_id"
                          class="gn-form__select"
                          :class="{ 'gn-form__input--error': errors.certification_category_id }"
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

                        <div v-else class="gn-form__category-create">
                          <input
                            v-model="newCategoryName"
                            type="text"
                            class="gn-form__input"
                            placeholder="e.g. Quality Management"
                            @keydown.enter.prevent="handleCreateCategory"
                            @keydown.escape.prevent="cancelCreateCategory"
                            ref="newCategoryInput"
                          />
                          <button
                            type="button"
                            class="gn-form__btn gn-form__btn--primary gn-form__btn--compact"
                            :disabled="!newCategoryName.trim() || savingCategory"
                            @click="handleCreateCategory"
                          >
                            <span v-if="!savingCategory">Save</span>
                            <span v-else class="gn-form__btn-loading">
                              <span class="gn-form__spinner" />
                              Saving…
                            </span>
                          </button>
                          <button
                            type="button"
                            class="gn-form__btn gn-form__btn--secondary gn-form__btn--compact"
                            @click="cancelCreateCategory"
                          >
                            Cancel
                          </button>
                        </div>

                        <button
                          v-if="!creatingCategory"
                          type="button"
                          class="gn-form__category-add"
                          @click="startCreateCategory"
                        >
                          <GIcon name="plus-circle" :size="16" />
                          <span>Add new category</span>
                        </button>
                      </div>
                      <span v-if="errors.certification_category_id" class="gn-form__helper gn-form__helper--error">
                        {{ errors.certification_category_id }}
                      </span>
                    </div>

                    <div class="gn-form__field gn-form__field--full">
                      <label class="gn-form__label">
                        Certificate file <span class="gn-form__required">*</span>
                      </label>
                      <div class="gn-form__upload" :class="{ 'gn-form__upload--error': errors.file || uploadError }">
                        <input
                          ref="fileInput"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          class="gn-form__upload-input"
                          @change="handleFileSelect"
                        />
                        <div v-if="!filePreview" class="gn-form__upload-body">
                          <span class="gn-form__upload-icon">
                            <GIcon name="cloud-upload" :size="28" />
                          </span>
                          <div class="gn-form__upload-text">
                            <span class="gn-form__upload-title">Upload a file</span>
                            <span class="gn-form__upload-hint">PDF, JPG or PNG — up to 10MB</span>
                          </div>
                        </div>
                        <div v-else class="gn-form__upload-preview">
                          <span class="gn-form__upload-icon">
                            <GIcon :name="filePreview.type === 'pdf' ? 'file-text' : 'image'" :size="22" />
                          </span>
                          <div class="gn-form__upload-meta">
                            <span class="gn-form__upload-name">{{ filePreview.name }}</span>
                            <span class="gn-form__upload-sub">{{ filePreview.type.toUpperCase() }}</span>
                          </div>
                          <button
                            type="button"
                            class="gn-form__upload-remove"
                            @click.stop="clearFile"
                            title="Remove"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div v-if="filePreview?.type === 'image' && filePreview.url" class="gn-form__upload-image-preview">
                        <img :src="filePreview.url" alt="Certificate preview" />
                      </div>

                      <div v-if="isUploading" class="gn-form__progress">
                        <div class="gn-form__progress-bar" :style="{ width: uploadProgress + '%' }" />
                        <span class="gn-form__progress-label">{{ uploadProgress }}%</span>
                      </div>

                      <span v-if="errors.file || uploadError" class="gn-form__helper gn-form__helper--error">
                        {{ errors.file || uploadError }}
                      </span>
                    </div>

                    <div class="gn-form__field gn-form__field--full">
                      <label class="gn-form__label" for="cert-issued">Issue date</label>
                      <input
                        id="cert-issued"
                        ref="issuedDateInput"
                        v-model="formData.issued_date"
                        type="text"
                        class="gn-form__input"
                        placeholder="Pick a date"
                      />
                      <span class="gn-form__helper">Date when the certification was issued.</span>
                    </div>
                  </div>
                </section>
              </div>

              <!-- Sidebar -->
              <aside class="gn-form__aside">
                <section class="gn-form__card">
                  <header class="gn-form__card-header">
                    <h3 class="gn-form__card-title">Publishing</h3>
                  </header>
                  <label class="gn-form__toggle">
                    <input
                      v-model="formData.is_active"
                      type="checkbox"
                      class="gn-form__toggle-input"
                    />
                    <span class="gn-form__toggle-track">
                      <span class="gn-form__toggle-thumb" />
                    </span>
                    <span class="gn-form__toggle-body">
                      <span class="gn-form__toggle-title">
                        {{ formData.is_active ? 'Active' : 'Inactive' }}
                      </span>
                      <span class="gn-form__toggle-hint">
                        {{ formData.is_active ? 'Visible on the public site' : 'Hidden from the public site' }}
                      </span>
                    </span>
                  </label>
                </section>
              </aside>
            </div>
          </form>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCertificationsStore } from '../stores/useCertificationsStore'
import { useCertificationCategoriesStore } from '../stores/useCertificationCategoriesStore'
import { useFileUpload } from '../composables/useFileUpload'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import type { CertificationFormData, FilePreview } from '../types'
import GIcon from '~/components/icons/GIcon.vue'
import flatpickr from 'flatpickr'

definePageMeta({ middleware: 'auth' })

const certificationsStore = useCertificationsStore()
const categoriesStore = useCertificationCategoriesStore()
const breadcrumbStore = useBreadcrumbStore()
const router = useRouter()
const { showSuccess, showError } = useNotification()

const {
  uploadFile,
  createFilePreview,
  isUploading,
  uploadProgress,
  uploadError,
  clearUploadError,
  validateFile,
} = useFileUpload()

const formData = reactive<CertificationFormData>({
  title: '',
  file_url: '',
  certification_category_id: '',
  issued_date: null,
  is_active: true,
  file: null,
})

const isSubmitting = ref(false)
const errors = reactive<Record<string, string>>({})
const filePreview = ref<FilePreview | null>(null)

const fileInput = ref<HTMLInputElement | null>(null)
const issuedDateInput = ref<HTMLInputElement | null>(null)
const newCategoryInput = ref<HTMLInputElement | null>(null)
let datePickerInstance: flatpickr.Instance | null = null

const creatingCategory = ref(false)
const savingCategory = ref(false)
const newCategoryName = ref('')

const clearError = (field: string) => {
  delete errors[field]
}

const startCreateCategory = async () => {
  creatingCategory.value = true
  newCategoryName.value = ''
  await nextTick()
  newCategoryInput.value?.focus()
}

const cancelCreateCategory = () => {
  creatingCategory.value = false
  newCategoryName.value = ''
}

const handleCreateCategory = async () => {
  const name = newCategoryName.value.trim()
  if (!name) return

  savingCategory.value = true
  try {
    const created = await categoriesStore.createCategory({ name })
    if (created && 'id' in created) {
      formData.certification_category_id = (created as { id: string }).id
    }
    showSuccess('Category created')
    cancelCreateCategory()
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create category'
    showError(message)
  } finally {
    savingCategory.value = false
  }
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const validation = validateFile(file)
  if (!validation.valid) {
    errors.file = validation.error || ''
    return
  }

  clearUploadError()
  clearError('file')

  formData.file = file
  const preview = createFilePreview(file)
  if (preview) {
    filePreview.value = preview
  }
}

const clearFile = () => {
  formData.file = null
  if (filePreview.value?.url) {
    URL.revokeObjectURL(filePreview.value.url)
  }
  filePreview.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  clearError('file')
  clearUploadError()
}

const validateForm = (): boolean => {
  Object.keys(errors).forEach((key) => delete errors[key])
  let valid = true

  if (!formData.title.trim()) {
    errors.title = 'Title is required'
    valid = false
  }
  if (!formData.certification_category_id) {
    errors.certification_category_id = 'Category is required'
    valid = false
  }
  if (!formData.file) {
    errors.file = 'File is required'
    valid = false
  }
  return valid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    showError('Please fix the form errors')
    return
  }

  isSubmitting.value = true
  try {
    if (formData.file) {
      const fileUrl = await uploadFile(formData.file)
      formData.file_url = fileUrl
    }

    const input = {
      title: formData.title,
      file_url: formData.file_url,
      certification_category_id: formData.certification_category_id,
      issued_date: formData.issued_date,
      is_active: formData.is_active,
    }

    await certificationsStore.createCertification(input)
    showSuccess('Certification created successfully')
    router.push('/certifications')
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create certification'
    showError(message)
  } finally {
    isSubmitting.value = false
  }
}

const initDatePicker = () => {
  if (!issuedDateInput.value) return
  datePickerInstance = flatpickr(issuedDateInput.value, {
    dateFormat: 'Y-m-d',
    maxDate: 'today',
    onChange: (_selectedDates: Date[], dateStr: string) => {
      formData.issued_date = dateStr || null
    },
  })
}

onMounted(async () => {
  breadcrumbStore.setBreadcrumb([
    { title: 'Dashboard', path: '/' },
    { title: 'Certifications', path: '/certifications' },
    { title: 'New certification', path: '/certifications/create' },
  ])

  await categoriesStore.initialize()
  initDatePicker()
})

onUnmounted(() => {
  datePickerInstance?.destroy()
  if (filePreview.value?.url) {
    URL.revokeObjectURL(filePreview.value.url)
  }
})
</script>

<style scoped>
.gn-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: #0f172a;
}

/* Hero */
.gn-form__hero {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.5rem 1.75rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fc 100%);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 20px;
  box-shadow: 0 20px 48px -32px rgba(15, 23, 42, 0.15);
}

.gn-form__hero-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(167, 139, 250, 0.18) 0%, rgba(124, 58, 237, 0.24) 100%);
  border: 1px solid rgba(167, 139, 250, 0.38);
  color: #6d28d9;
  flex-shrink: 0;
  box-shadow: 0 12px 24px -14px rgba(124, 58, 237, 0.5);
}

.gn-form__hero-body {
  flex: 1;
  min-width: 0;
}

.gn-form__eyebrow {
  display: block;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #a78bfa;
  margin-bottom: 0.3rem;
}

.gn-form__title {
  margin: 0;
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  font-size: clamp(1.4rem, 2.2vw, 1.9rem);
  font-weight: 700;
  letter-spacing: -0.022em;
  line-height: 1.12;
  color: #0f172a;
}

.gn-form__subtitle {
  margin: 0.35rem 0 0;
  font-size: 0.92rem;
  color: rgba(15, 23, 42, 0.6);
  line-height: 1.5;
}

.gn-form__hero-actions {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-shrink: 0;
}

.gn-form__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.4rem;
  border: 0;
  border-radius: 12px;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition:
    transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    box-shadow 0.25s ease,
    background 0.25s ease,
    filter 0.25s ease;
}

.gn-form__btn--compact {
  padding: 0.6rem 1rem;
  font-size: 0.82rem;
  border-radius: 10px;
}

.gn-form__btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.gn-form__btn--primary {
  background: linear-gradient(135deg, #a78bfa 0%, #7c3aed 55%, #6d28d9 100%);
  color: #ffffff;
  box-shadow: 0 16px 32px -14px rgba(124, 58, 237, 0.6);
}

.gn-form__btn--primary:hover:not(:disabled) {
  transform: translateY(-1px);
  filter: brightness(1.05);
  box-shadow: 0 22px 44px -16px rgba(124, 58, 237, 0.7);
}

.gn-form__btn--secondary {
  background: rgba(15, 23, 42, 0.05);
  color: rgba(15, 23, 42, 0.7);
}

.gn-form__btn--secondary:hover {
  background: rgba(15, 23, 42, 0.09);
  color: #0f172a;
}

.gn-form__btn-loading {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.gn-form__spinner {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #ffffff;
  animation: gn-spin 0.75s linear infinite;
}

@keyframes gn-spin {
  to { transform: rotate(360deg); }
}

/* Layout */
.gn-form__layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 1200px) {
  .gn-form__layout {
    grid-template-columns: minmax(0, 1.6fr) minmax(320px, 0.9fr);
  }
}

.gn-form__main,
.gn-form__aside {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Cards */
.gn-form__card {
  padding: 1.75rem;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.07);
  border-radius: 18px;
  box-shadow: 0 18px 40px -32px rgba(15, 23, 42, 0.14);
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}

.gn-form__card-header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.gn-form__card-title {
  margin: 0;
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: -0.012em;
  color: #0f172a;
}

.gn-form__card-hint {
  margin: 0;
  font-size: 0.8rem;
  color: rgba(15, 23, 42, 0.55);
  line-height: 1.45;
}

/* Field grid */
.gn-form__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.1rem 1.25rem;
}

.gn-form__field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.gn-form__field--full {
  grid-column: 1 / -1;
}

.gn-form__label {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: rgba(15, 23, 42, 0.58);
}

.gn-form__required {
  color: #dc2626;
  margin-left: 0.15rem;
}

.gn-form__input,
.gn-form__select {
  width: 100%;
  padding: 0.85rem 1rem;
  background: rgba(15, 23, 42, 0.02);
  border: 1px solid rgba(15, 23, 42, 0.1);
  border-radius: 14px;
  font-family: inherit;
  font-size: 0.92rem;
  font-weight: 500;
  color: #0f172a;
  line-height: 1.5;
  transition:
    border-color 0.25s ease,
    background 0.25s ease,
    box-shadow 0.25s ease;
}

.gn-form__select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='rgb(15 23 42 / 0.5)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 18px;
  padding-right: 2.5rem;
}

.gn-form__input:focus,
.gn-form__select:focus {
  outline: none;
  border-color: rgba(139, 92, 246, 0.55);
  background: rgba(139, 92, 246, 0.04);
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
}

.gn-form__input--error {
  border-color: rgba(220, 38, 38, 0.5);
  background: rgba(220, 38, 38, 0.04);
}

.gn-form__input::placeholder {
  color: rgba(15, 23, 42, 0.35);
  font-weight: 400;
}

.gn-form__helper {
  font-size: 0.76rem;
  color: rgba(15, 23, 42, 0.5);
  line-height: 1.45;
}

.gn-form__helper--error {
  color: #dc2626;
  font-weight: 500;
}

/* Category inline create */
.gn-form__category {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.gn-form__category-create {
  display: flex;
  gap: 0.5rem;
  align-items: stretch;
}

.gn-form__category-create .gn-form__input {
  flex: 1;
}

.gn-form__category-add {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.7rem;
  background: transparent;
  border: 0;
  color: #7c3aed;
  font-family: inherit;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: 999px;
  transition: background 0.2s ease, color 0.2s ease;
}

.gn-form__category-add:hover {
  background: rgba(139, 92, 246, 0.1);
  color: #6d28d9;
}

/* Upload */
.gn-form__upload {
  position: relative;
  padding: 1.5rem;
  background: rgba(15, 23, 42, 0.02);
  border: 1.5px dashed rgba(15, 23, 42, 0.14);
  border-radius: 16px;
  cursor: pointer;
  transition: border-color 0.25s ease, background 0.25s ease;
}

.gn-form__upload:hover {
  border-color: rgba(139, 92, 246, 0.5);
  background: rgba(139, 92, 246, 0.04);
}

.gn-form__upload--error {
  border-color: rgba(220, 38, 38, 0.5);
  background: rgba(220, 38, 38, 0.04);
}

.gn-form__upload-input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.gn-form__upload-body {
  display: flex;
  align-items: center;
  gap: 1rem;
  pointer-events: none;
}

.gn-form__upload-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: rgba(139, 92, 246, 0.1);
  color: #7c3aed;
  flex-shrink: 0;
}

.gn-form__upload-text {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.gn-form__upload-title {
  font-size: 0.92rem;
  font-weight: 600;
  color: #0f172a;
}

.gn-form__upload-hint {
  font-size: 0.78rem;
  color: rgba(15, 23, 42, 0.55);
}

.gn-form__upload-preview {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  position: relative;
  z-index: 1;
}

.gn-form__upload-meta {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  flex: 1;
  min-width: 0;
}

.gn-form__upload-name {
  font-size: 0.92rem;
  font-weight: 600;
  color: #0f172a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gn-form__upload-sub {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(15, 23, 42, 0.5);
}

.gn-form__upload-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  background: rgba(220, 38, 38, 0.08);
  color: #dc2626;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.25s ease;
  z-index: 2;
}

.gn-form__upload-remove svg {
  width: 16px;
  height: 16px;
}

.gn-form__upload-remove:hover {
  background: rgba(220, 38, 38, 0.16);
}

.gn-form__upload-image-preview {
  margin-top: 0.8rem;
  max-width: 400px;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(15, 23, 42, 0.08);
}

.gn-form__upload-image-preview img {
  display: block;
  width: 100%;
  height: auto;
  max-height: 280px;
  object-fit: cover;
}

.gn-form__progress {
  position: relative;
  margin-top: 0.5rem;
  height: 6px;
  background: rgba(15, 23, 42, 0.08);
  border-radius: 999px;
  overflow: hidden;
}

.gn-form__progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #a78bfa 0%, #7c3aed 100%);
  transition: width 0.3s ease;
}

.gn-form__progress-label {
  position: absolute;
  right: 0;
  top: 8px;
  font-size: 0.7rem;
  color: rgba(15, 23, 42, 0.55);
}

/* Toggle */
.gn-form__toggle {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  cursor: pointer;
  user-select: none;
}

.gn-form__toggle-input {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
}

.gn-form__toggle-track {
  position: relative;
  display: inline-block;
  width: 42px;
  height: 24px;
  background: rgba(15, 23, 42, 0.12);
  border-radius: 999px;
  transition: background 0.3s ease;
  flex-shrink: 0;
}

.gn-form__toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: 999px;
  background: #ffffff;
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.25);
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.gn-form__toggle-input:checked + .gn-form__toggle-track {
  background: linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%);
}

.gn-form__toggle-input:checked + .gn-form__toggle-track .gn-form__toggle-thumb {
  transform: translateX(18px);
}

.gn-form__toggle-body {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  flex: 1;
}

.gn-form__toggle-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #0f172a;
}

.gn-form__toggle-hint {
  font-size: 0.76rem;
  color: rgba(15, 23, 42, 0.55);
}

@media (max-width: 640px) {
  .gn-form__grid {
    grid-template-columns: 1fr;
  }
}
</style>

<style>
/* Dark theme */
html[data-bs-theme='dark'] .gn-form__hero {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 24px 48px -28px rgba(0, 0, 0, 0.55);
}

html[data-bs-theme='dark'] .gn-form__hero-icon {
  background: linear-gradient(135deg, rgba(167, 139, 250, 0.22) 0%, rgba(124, 58, 237, 0.3) 100%);
  border-color: rgba(167, 139, 250, 0.45);
  color: #c4b5fd;
}

html[data-bs-theme='dark'] .gn-form__title {
  color: #f5f5f7;
}

html[data-bs-theme='dark'] .gn-form__subtitle {
  color: rgba(245, 245, 247, 0.65);
}

html[data-bs-theme='dark'] .gn-form__btn--secondary {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(245, 245, 247, 0.8);
}

html[data-bs-theme='dark'] .gn-form__btn--secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

html[data-bs-theme='dark'] .gn-form__card {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 22px 48px -28px rgba(0, 0, 0, 0.55);
}

html[data-bs-theme='dark'] .gn-form__card-title {
  color: #f5f5f7;
}

html[data-bs-theme='dark'] .gn-form__card-hint {
  color: rgba(245, 245, 247, 0.55);
}

html[data-bs-theme='dark'] .gn-form__label {
  color: rgba(245, 245, 247, 0.55);
}

html[data-bs-theme='dark'] .gn-form__input,
html[data-bs-theme='dark'] .gn-form__select {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.1);
  color: #f5f5f7;
}

html[data-bs-theme='dark'] .gn-form__select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='rgb(245 245 247 / 0.55)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
}

html[data-bs-theme='dark'] .gn-form__input:focus,
html[data-bs-theme='dark'] .gn-form__select:focus {
  border-color: rgba(167, 139, 250, 0.6);
  background: rgba(167, 139, 250, 0.06);
}

html[data-bs-theme='dark'] .gn-form__input::placeholder {
  color: rgba(245, 245, 247, 0.35);
}

html[data-bs-theme='dark'] .gn-form__helper {
  color: rgba(245, 245, 247, 0.5);
}

html[data-bs-theme='dark'] .gn-form__category-add {
  color: #c4b5fd;
}

html[data-bs-theme='dark'] .gn-form__category-add:hover {
  background: rgba(167, 139, 250, 0.14);
  color: #ddd6fe;
}

html[data-bs-theme='dark'] .gn-form__upload {
  background: rgba(255, 255, 255, 0.02);
  border-color: rgba(255, 255, 255, 0.12);
}

html[data-bs-theme='dark'] .gn-form__upload:hover {
  border-color: rgba(167, 139, 250, 0.5);
  background: rgba(167, 139, 250, 0.06);
}

html[data-bs-theme='dark'] .gn-form__upload-icon {
  background: rgba(167, 139, 250, 0.18);
  color: #c4b5fd;
}

html[data-bs-theme='dark'] .gn-form__upload-title,
html[data-bs-theme='dark'] .gn-form__upload-name {
  color: #f5f5f7;
}

html[data-bs-theme='dark'] .gn-form__upload-hint,
html[data-bs-theme='dark'] .gn-form__upload-sub {
  color: rgba(245, 245, 247, 0.5);
}

html[data-bs-theme='dark'] .gn-form__upload-remove {
  background: rgba(248, 113, 113, 0.14);
  color: #fca5a5;
}

html[data-bs-theme='dark'] .gn-form__upload-remove:hover {
  background: rgba(248, 113, 113, 0.24);
}

html[data-bs-theme='dark'] .gn-form__upload-image-preview {
  border-color: rgba(255, 255, 255, 0.1);
}

html[data-bs-theme='dark'] .gn-form__progress {
  background: rgba(255, 255, 255, 0.06);
}

html[data-bs-theme='dark'] .gn-form__toggle-track {
  background: rgba(255, 255, 255, 0.12);
}

html[data-bs-theme='dark'] .gn-form__toggle-title {
  color: #f5f5f7;
}

html[data-bs-theme='dark'] .gn-form__toggle-hint {
  color: rgba(245, 245, 247, 0.5);
}
</style>
