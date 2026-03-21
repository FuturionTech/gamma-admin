<template>
  <!-- Page Header -->
  <PageHeader title="Create FAQ" />

  <div class="card">
    <div class="card-body">
      <!-- Form -->
      <form @submit.prevent="handleSubmit">
        <!-- Question -->
        <div class="mb-10">
          <label class="form-label required">Question</label>
          <textarea
            v-model="form.question"
            class="form-control"
            :class="{
              'is-invalid': touched.question && errors.question,
              'is-valid': touched.question && form.question && !errors.question
            }"
            placeholder="Enter the frequently asked question"
            rows="3"
            maxlength="300"
            @blur="validateField('question')"
            @input="clearError('question')"
          ></textarea>
          <div class="form-text">{{ form.question.length }} / 300 characters</div>
          <div v-if="touched.question && errors.question" class="invalid-feedback d-block">
            {{ errors.question }}
          </div>
        </div>

        <!-- Answer -->
        <div class="mb-10">
          <label class="form-label required">Answer</label>
          <textarea
            v-model="form.answer"
            class="form-control"
            :class="{
              'is-invalid': touched.answer && errors.answer,
              'is-valid': touched.answer && form.answer && !errors.answer
            }"
            placeholder="Enter the answer to the question"
            rows="6"
            maxlength="2000"
            @blur="validateField('answer')"
            @input="clearError('answer')"
          ></textarea>
          <div class="form-text">{{ form.answer.length }} / 2000 characters</div>
          <div v-if="touched.answer && errors.answer" class="invalid-feedback d-block">
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
              :class="{
                'is-invalid': touched.category && errors.category,
                'is-valid': touched.category && form.category && !errors.category
              }"
              @blur="validateField('category')"
              @change="clearError('category')"
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
            <div v-if="touched.category && errors.category" class="invalid-feedback d-block">
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
              :class="{
                'is-invalid': touched.order && errors.order,
                'is-valid': touched.order && form.order !== null && !errors.order
              }"
              placeholder="0"
              min="0"
              @blur="validateField('order')"
              @input="clearError('order')"
            />
            <div class="form-text">Display order (lower numbers appear first)</div>
            <div v-if="touched.order && errors.order" class="invalid-feedback d-block">
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

        <!-- Form Actions -->
        <div class="d-flex justify-content-end gap-3 mt-10 pt-10 border-top">
          <NuxtLink
            to="/faqs"
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
import { useFAQsStore } from '../stores/useFAQsStore'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import { FAQ_CATEGORIES } from '../types'
import type { FAQFormData } from '../types'
import Swal from 'sweetalert2'

const faqsStore = useFAQsStore()
const breadcrumbStore = useBreadcrumbStore()
const router = useRouter()

// Form state
const form = reactive<FAQFormData>({
  question: '',
  answer: '',
  category: null,
  order: 0,
  is_active: true
})

const errors = ref<Record<string, string>>({})
const touched = ref<Record<string, boolean>>({})
const isSubmitting = ref(false)

// Validation
const hasErrors = computed(() => {
  return Object.values(errors.value).some(e => e)
})

const isFormValid = computed(() => {
  return (
    form.question.trim() !== '' &&
    form.answer.trim() !== '' &&
    form.answer.length >= 10 &&
    !hasErrors.value
  )
})

const validateField = (field: string): boolean => {
  touched.value[field] = true

  switch (field) {
    case 'question':
      if (!form.question.trim()) {
        errors.value.question = 'Question is required'
        return false
      } else if (form.question.length > 300) {
        errors.value.question = 'Question cannot exceed 300 characters'
        return false
      }
      errors.value.question = ''
      return true

    case 'answer':
      if (!form.answer.trim()) {
        errors.value.answer = 'Answer is required'
        return false
      } else if (form.answer.length < 10) {
        errors.value.answer = 'Answer must be at least 10 characters'
        return false
      } else if (form.answer.length > 2000) {
        errors.value.answer = 'Answer cannot exceed 2000 characters'
        return false
      }
      errors.value.answer = ''
      return true

    case 'order':
      if (form.order !== null && form.order !== undefined && form.order < 0) {
        errors.value.order = 'Order must be a positive number'
        return false
      }
      errors.value.order = ''
      return true

    default:
      return true
  }
}

const clearError = (field: string) => {
  errors.value[field] = ''
}

const validateForm = (): boolean => {
  let isValid = true

  if (!validateField('question')) isValid = false
  if (!validateField('answer')) isValid = false
  if (!validateField('order')) isValid = false

  return isValid
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

  isSubmitting.value = true

  try {
    // Prepare input
    const input = {
      question: form.question.trim(),
      answer: form.answer.trim(),
      category: form.category || null,
      order: form.order ?? 0,
      is_active: form.is_active ?? true
    }

    // Create FAQ
    await faqsStore.createFAQ(input)

    await Swal.fire({
      title: 'Success',
      text: 'FAQ created successfully',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    })

    // Redirect to list
    await router.push('/faqs')
  } catch (error: any) {
    console.error('Error creating FAQ:', error)
    await Swal.fire({
      title: 'Error',
      text: error.message || 'Failed to save FAQ',
      icon: 'error'
    })
  } finally {
    isSubmitting.value = false
  }
}

// Lifecycle
onMounted(() => {
  breadcrumbStore.setBreadcrumb([
    { title: 'Home', path: '/' },
    { title: 'FAQs', path: '/faqs' },
    { title: 'Create FAQ', path: '/faqs/create' }
  ])
})
</script>
