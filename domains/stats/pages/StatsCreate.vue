<template>
  <!-- Page Header -->
  <PageHeader title="Create Statistic" />

  <div class="card">
      <div class="card-body">
        <!-- Form -->
        <form @submit.prevent="handleSubmit">
          <div class="row">
            <!-- Left Column -->
            <div class="col-lg-8">
              <!-- Label -->
              <div class="mb-10">
                <label class="required form-label">Label</label>
                <input
                  type="text"
                  v-model="form.label"
                  class="form-control"
                  :class="{
                    'is-invalid': touched.label && errors.label,
                    'is-valid': touched.label && form.label && !errors.label
                  }"
                  placeholder="e.g., Satisfied Clients"
                  maxlength="255"
                  @blur="validateField('label')"
                  @input="clearError('label')"
                />
                <div v-if="touched.label && errors.label" class="invalid-feedback d-block">
                  {{ errors.label }}
                </div>
                <div class="form-text">The label will be displayed below the statistic value</div>
              </div>

              <!-- Value & Unit Row -->
              <div class="row mb-10">
                <div class="col-md-6">
                  <label class="required form-label">Value</label>
                  <input
                    type="text"
                    v-model="form.value"
                    class="form-control"
                    :class="{
                      'is-invalid': touched.value && errors.value,
                      'is-valid': touched.value && form.value && !errors.value
                    }"
                    placeholder="e.g., 500, 2.5, 98"
                    @blur="validateField('value')"
                    @input="clearError('value')"
                  />
                  <div v-if="touched.value && errors.value" class="invalid-feedback d-block">
                    {{ errors.value }}
                  </div>
                  <div class="form-text">The numeric value or text for the statistic</div>
                </div>

                <div class="col-md-6">
                  <label class="form-label">Unit</label>
                  <select
                    v-model="form.unit"
                    class="form-select"
                    :class="{ 'is-invalid': errors.unit }"
                  >
                    <option v-for="option in unitOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                  <div v-if="errors.unit" class="invalid-feedback">{{ errors.unit }}</div>
                  <div class="form-text">Optional suffix (e.g., +, %, K, M)</div>
                </div>
              </div>

              <!-- Icon Picker -->
              <div class="mb-10">
                <label class="form-label">Icon</label>
                <div class="border rounded p-5">
                  <div class="row g-3">
                    <div
                      v-for="option in iconOptions"
                      :key="option.value"
                      class="col-2"
                    >
                      <button
                        type="button"
                        @click="form.icon = option.value"
                        class="btn btn-outline btn-outline-dashed w-100 p-4"
                        :class="{ 'btn-primary': form.icon === option.value, 'btn-light': form.icon !== option.value }"
                        :title="option.label"
                      >
                        <i :class="`fas ${option.class} fs-2x`"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="form-text">Select an icon to represent this statistic</div>
              </div>

              <!-- Order -->
              <div class="mb-10">
                <label class="form-label">Order</label>
                <input
                  type="number"
                  v-model.number="form.order"
                  class="form-control"
                  :class="{
                    'is-invalid': touched.order && errors.order,
                    'is-valid': touched.order && form.order && !errors.order
                  }"
                  placeholder="1"
                  min="1"
                  @blur="validateField('order')"
                  @input="clearError('order')"
                />
                <div v-if="touched.order && errors.order" class="invalid-feedback d-block">
                  {{ errors.order }}
                </div>
                <div class="form-text">Display order on the website (lower number = shown first)</div>
              </div>

              <!-- Active Status -->
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
                <div class="form-text">Enable or disable this statistic on the website</div>
              </div>
            </div>

            <!-- Right Column - Preview -->
            <div class="col-lg-4">
              <div class="card bg-light-primary sticky-top" style="top: 100px;">
                <div class="card-header">
                  <h3 class="card-title">Preview</h3>
                </div>
                <div class="card-body text-center">
                  <div class="symbol symbol-100px mx-auto mb-5">
                    <span class="symbol-label bg-white">
                      <i :class="getIconClasses(form.icon)" class="fs-2qx text-primary"></i>
                    </span>
                  </div>
                  <div class="fw-bold fs-2x mb-2">
                    {{ previewValue }}
                  </div>
                  <div class="fw-semibold text-muted fs-5">
                    {{ form.label || 'Statistic Label' }}
                  </div>
                  <div class="mt-5">
                    <span
                      class="badge badge-lg"
                      :class="getStatusBadgeClass(form.is_active ?? true)"
                    >
                      {{ getStatusText(form.is_active ?? true) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="d-flex justify-content-end gap-3 mt-10 pt-10 border-top">
            <NuxtLink
              to="/stats"
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
                Saving...
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useStatsStore } from '../stores/useStatsStore'
import { useStatFormatters } from '../composables/useStatFormatters'
import { useFormValidation } from '~/domains/shared/composables/useFormValidation'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import type { StatFormData } from '../types'
import { STAT_UNIT_OPTIONS, STAT_ICON_OPTIONS } from '../types'

const statsStore = useStatsStore()
const breadcrumbStore = useBreadcrumbStore()
const router = useRouter()
const { showSuccess, showError } = useNotification()
const { getStatusBadgeClass, getStatusText, getIconClasses } = useStatFormatters()

// Form state
const form = ref<StatFormData>({
  label: '',
  value: '',
  unit: '',
  icon: 'fa-chart-line',
  order: null,
  is_active: true
})

const isSubmitting = ref(false)

// Validation
const { errors, touched, validateField, validateAll, clearError, hasErrors } = useFormValidation(
  form,
  {
    label: { required: true, maxLength: 255 },
    value: { required: true, maxLength: 50 },
    order: { min: 1 }
  }
)

// Options
const unitOptions = STAT_UNIT_OPTIONS
const iconOptions = STAT_ICON_OPTIONS

// Computed
const previewValue = computed(() => {
  if (!form.value.value) return '---'
  return `${form.value.value}${form.value.unit || ''}`
})

const isFormValid = computed(() => {
  return (
    form.value.label.trim() !== '' &&
    form.value.value.trim() !== '' &&
    !hasErrors.value
  )
})

// Handlers
const handleSubmit = async () => {
  if (!validateAll()) {
    showError('Please fix the validation errors')
    return
  }

  isSubmitting.value = true

  try {
    // Prepare input
    const input = {
      label: form.value.label,
      value: form.value.value,
      unit: form.value.unit || null,
      icon: form.value.icon || null,
      order: form.value.order ?? null,
      is_active: form.value.is_active ?? true
    }

    // Create stat
    await statsStore.createStat(input)

    showSuccess('Statistic created successfully')

    // Redirect to list
    await router.push('/stats')
  } catch (error: any) {
    console.error('Error creating stat:', error)
    showError(error.message || 'Failed to save statistic')
  } finally {
    isSubmitting.value = false
  }
}

// Lifecycle
onMounted(() => {
  breadcrumbStore.setBreadcrumb([
    { title: 'Home', path: '/' },
    { title: 'Statistics', path: '/stats' },
    { title: 'Create Statistic', path: '/stats/create' }
  ])
})
</script>
