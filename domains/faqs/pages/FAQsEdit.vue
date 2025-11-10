<template>
  <!-- Page Header -->
  <PageHeader title="Edit FAQ" />

  <div class="card">
    <div class="card-body">
        <!-- Loading State -->
        <div v-if="isLoading || isSubmitting" class="text-center py-20">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="loadError" class="alert alert-danger">
          <h4 class="alert-heading">Error</h4>
          <p>{{ loadError }}</p>
          <hr />
          <NuxtLink to="/faqs" class="btn btn-danger">
            Back to List
          </NuxtLink>
        </div>

        <!-- Form -->
        <form v-else-if="faq" @submit.prevent="handleSubmit">
          <!-- Question -->
          <div class="mb-10">
            <label class="form-label required">Question</label>
            <textarea
              v-model="form.question"
              class="form-control"
              :class="{ 'is-invalid': errors.question }"
              placeholder="Enter the frequently asked question"
              rows="3"
              maxlength="300"
            ></textarea>
            <div class="form-text">{{ form.question.length }} / 300 characters</div>
            <div v-if="errors.question" class="invalid-feedback d-block">
              {{ errors.question }}
            </div>
          </div>

          <!-- Answer -->
          <div class="mb-10">
            <label class="form-label required">Answer</label>
            <textarea
              v-model="form.answer"
              class="form-control"
              :class="{ 'is-invalid': errors.answer }"
              placeholder="Enter the answer to the question"
              rows="6"
              maxlength="2000"
            ></textarea>
            <div class="form-text">{{ form.answer.length }} / 2000 characters</div>
            <div v-if="errors.answer" class="invalid-feedback d-block">
              {{ errors.answer }}
            </div>
            <div class="form-text text-muted mt-2">
              <i class="ki-duotone ki-information fs-7">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
              </i>
              You can use Markdown or HTML formatting in your answer
            </div>
          </div>

          <div class="row">
            <!-- Category -->
            <div class="col-md-6 mb-10">
              <label class="form-label">Category</label>
              <select
                v-model="form.category"
                class="form-select"
                :class="{ 'is-invalid': errors.category }"
              >
                <option :value="null">Select a category</option>
                <option
                  v-for="category in FAQ_CATEGORIES"
                  :key="category"
                  :value="category"
                >
                  {{ category }}
                </option>
              </select>
              <div class="form-text">Category for grouping related FAQs</div>
              <div v-if="errors.category" class="invalid-feedback d-block">
                {{ errors.category }}
              </div>
            </div>

            <!-- Order -->
            <div class="col-md-6 mb-10">
              <label class="form-label">Order</label>
              <input
                type="number"
                v-model.number="form.order"
                class="form-control"
                :class="{ 'is-invalid': errors.order }"
                placeholder="0"
                min="0"
              />
              <div class="form-text">Display order (lower numbers appear first)</div>
              <div v-if="errors.order" class="invalid-feedback d-block">
                {{ errors.order }}
              </div>
            </div>
          </div>

          <!-- Status -->
          <div class="mb-10">
            <label class="form-label">Status</label>
            <div class="form-check form-switch form-check-custom form-check-solid">
              <input
                class="form-check-input"
                type="checkbox"
                v-model="form.is_active"
                id="is_active"
              />
              <label class="form-check-label" for="is_active">
                {{ form.is_active ? 'Active' : 'Inactive' }}
              </label>
            </div>
            <div class="form-text">Active FAQs will be displayed on the website</div>
          </div>

          <!-- Metadata -->
          <div class="card bg-light mb-10">
            <div class="card-body">
              <h5 class="card-title">Metadata</h5>
              <div class="row">
                <div class="col-md-6">
                  <p class="mb-1">
                    <strong>Created At:</strong>
                    {{ formatDateTime(faq.created_at) }}
                  </p>
                </div>
                <div class="col-md-6">
                  <p class="mb-1">
                    <strong>Updated At:</strong>
                    {{ formatDateTime(faq.updated_at) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="d-flex justify-content-between mt-10 pt-10 border-top">
            <button
              type="button"
              class="btn btn-danger"
              @click="handleDelete"
              :disabled="isSubmitting"
            >
              <i class="ki-duotone ki-trash fs-2"></i>
              Delete
            </button>

            <div class="d-flex gap-3">
              <NuxtLink
                to="/faqs"
                class="btn btn-light"
              >
                Cancel
              </NuxtLink>
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="!isFormValid || isSubmitting || !hasChanges"
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
          </div>
        </form>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useFAQsStore } from '../stores/useFAQsStore'
import { useFAQFormatters } from '../composables/useFAQFormatters'
import { useFAQActions } from '../composables/useFAQActions'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import { FAQ_CATEGORIES } from '../types'
import type { FAQ, UpdateFAQInput } from '../types'
import Swal from 'sweetalert2'

const faqsStore = useFAQsStore()
const breadcrumbStore = useBreadcrumbStore()
const { formatDateTime } = useFAQFormatters()
const { confirmAndDeleteFAQ } = useFAQActions()
const router = useRouter()
const route = useRoute()

// State
const faq = ref<FAQ | null>(null)
const form = reactive<UpdateFAQInput & { question: string; answer: string }>({
  question: '',
  answer: '',
  category: null,
  order: 0,
  is_active: true
})

const errors = ref<Record<string, string>>({})
const isLoading = ref(true)
const isSubmitting = ref(false)
const loadError = ref<string | null>(null)

// Computed
const faqId = computed(() => route.params.id as string)

const isFormValid = computed(() => {
  return (
    form.question.trim() !== '' &&
    form.answer.trim() !== '' &&
    form.answer.length >= 10 &&
    Object.keys(errors.value).length === 0
  )
})

const hasChanges = computed(() => {
  if (!faq.value) return false

  return (
    form.question !== faq.value.question ||
    form.answer !== faq.value.answer ||
    form.category !== faq.value.category ||
    form.order !== faq.value.order ||
    form.is_active !== faq.value.is_active
  )
})

// Validation
const validateForm = (): boolean => {
  errors.value = {}

  if (!form.question.trim()) {
    errors.value.question = 'Question is required'
  } else if (form.question.length > 300) {
    errors.value.question = 'Question cannot exceed 300 characters'
  }

  if (!form.answer.trim()) {
    errors.value.answer = 'Answer is required'
  } else if (form.answer.length < 10) {
    errors.value.answer = 'Answer must be at least 10 characters'
  } else if (form.answer.length > 2000) {
    errors.value.answer = 'Answer cannot exceed 2000 characters'
  }

  if (form.order !== null && form.order !== undefined && form.order < 0) {
    errors.value.order = 'Order must be a positive number'
  }

  return Object.keys(errors.value).length === 0
}

// Load FAQ data
const loadFAQ = async () => {
  isLoading.value = true
  loadError.value = null

  try {
    const data = await faqsStore.fetchFAQ(faqId.value)

    if (data) {
      faq.value = data

      // Populate form
      form.question = data.question
      form.answer = data.answer
      form.category = data.category
      form.order = data.order
      form.is_active = data.is_active
    }
  } catch (error: any) {
    console.error('Error loading FAQ:', error)
    loadError.value = error.message || 'Failed to load FAQ'
  } finally {
    isLoading.value = false
  }
}

// Handlers
const handleSubmit = async () => {
  if (!validateForm()) {
    await Swal.fire({
      title: 'Error',
      text: 'Please fix the validation errors before submitting',
      icon: 'error'
    })
    return
  }

  if (!hasChanges.value) {
    await Swal.fire({
      title: 'Warning',
      text: 'No changes have been made',
      icon: 'info'
    })
    return
  }

  isSubmitting.value = true

  try {
    // Prepare input (only send changed fields)
    const input: UpdateFAQInput = {}

    if (form.question !== faq.value?.question) {
      input.question = form.question.trim()
    }
    if (form.answer !== faq.value?.answer) {
      input.answer = form.answer.trim()
    }
    if (form.category !== faq.value?.category) {
      input.category = form.category
    }
    if (form.order !== faq.value?.order) {
      input.order = form.order
    }
    if (form.is_active !== faq.value?.is_active) {
      input.is_active = form.is_active
    }

    // Update FAQ
    const updated = await faqsStore.updateFAQ(faqId.value, input)

    if (updated) {
      faq.value = updated
    }

    await Swal.fire({
      title: 'Success',
      text: 'FAQ updated successfully',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    })

    // Redirect to list
    await router.push('/faqs')
  } catch (error: any) {
    console.error('Error updating FAQ:', error)
    await Swal.fire({
      title: 'Error',
      text: error.message || 'Failed to save FAQ',
      icon: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = async () => {
  if (!faq.value) return

  const success = await confirmAndDeleteFAQ(faq.value)

  if (success) {
    await router.push('/faqs')
  }
}

// Lifecycle
onMounted(async () => {
  await loadFAQ()

  breadcrumbStore.setBreadcrumb([
    { title: 'Home', path: '/' },
    { title: 'FAQs', path: '/faqs' },
    { title: 'Edit FAQ', path: `/faqs/${faqId.value}/edit` }
  ])
})
</script>
