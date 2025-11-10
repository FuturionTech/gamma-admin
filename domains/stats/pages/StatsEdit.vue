<template>
  <!-- Page Header -->
  <PageHeader title="Edit Statistic" />

  <div class="card">
      <div class="card-body">
        <!-- Loading State -->
        <div v-if="isLoading || isSubmitting" class="text-center py-20">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="loadError" class="text-center py-20">
          <div class="mb-5">
            <i class="ki-duotone ki-information-5 fs-5tx text-danger">
              <span class="path1"></span>
              <span class="path2"></span>
              <span class="path3"></span>
            </i>
          </div>
          <h3 class="text-danger">Failed to Load Statistic</h3>
          <p class="text-muted">{{ loadError }}</p>
          <NuxtLink to="/stats" class="btn btn-primary mt-3">
            Back to List
          </NuxtLink>
        </div>

        <!-- Form -->
        <form v-else @submit.prevent="handleSubmit">
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
                  :class="{ 'is-invalid': errors.label }"
                  placeholder="e.g., Satisfied Clients"
                  maxlength="255"
                />
                <div v-if="errors.label" class="invalid-feedback">{{ errors.label }}</div>
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
                    :class="{ 'is-invalid': errors.value }"
                    placeholder="e.g., 500, 2.5, 98"
                  />
                  <div v-if="errors.value" class="invalid-feedback">{{ errors.value }}</div>
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
                  :class="{ 'is-invalid': errors.order }"
                  placeholder="1"
                  min="1"
                />
                <div v-if="errors.order" class="invalid-feedback">{{ errors.order }}</div>
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

              <!-- Metadata -->
              <div class="mb-10">
                <div class="card bg-light">
                  <div class="card-body">
                    <div class="row">
                      <div class="col-md-6">
                        <div class="fw-bold text-muted mb-1">Created At</div>
                        <div class="text-dark">{{ formatDate(currentStat?.created_at || '') }}</div>
                      </div>
                      <div class="col-md-6">
                        <div class="fw-bold text-muted mb-1">Updated At</div>
                        <div class="text-dark">{{ formatDate(currentStat?.updated_at || '') }}</div>
                      </div>
                    </div>
                  </div>
                </div>
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
                Save Changes
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
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import type { UpdateStatInput, Stat } from '../types'
import { STAT_UNIT_OPTIONS, STAT_ICON_OPTIONS } from '../types'

const statsStore = useStatsStore()
const breadcrumbStore = useBreadcrumbStore()
const route = useRoute()
const router = useRouter()
const { showSuccess, showError } = useNotification()
const { formatDate, getStatusBadgeClass, getStatusText, getIconClasses } = useStatFormatters()

// Get ID from route
const statId = route.params.id as string

// Form state
const form = reactive<UpdateStatInput & { label: string; value: string }>({
  label: '',
  value: '',
  unit: '',
  icon: 'fa-chart-line',
  order: null,
  is_active: true
})

const errors = ref<Record<string, string>>({})
const isLoading = ref(true)
const isSubmitting = ref(false)
const loadError = ref<string | null>(null)
const currentStat = ref<Stat | null>(null)

// Options
const unitOptions = STAT_UNIT_OPTIONS
const iconOptions = STAT_ICON_OPTIONS

// Computed
const previewValue = computed(() => {
  if (!form.value) return '---'
  return `${form.value}${form.unit || ''}`
})

const isFormValid = computed(() => {
  return (
    form.label.trim() !== '' &&
    form.value.trim() !== '' &&
    Object.keys(errors.value).length === 0
  )
})

// Validation
const validateForm = (): boolean => {
  errors.value = {}

  if (!form.label.trim()) {
    errors.value.label = 'Label is required'
  } else if (form.label.length > 255) {
    errors.value.label = 'Label cannot exceed 255 characters'
  }

  if (!form.value.trim()) {
    errors.value.value = 'Value is required'
  }

  if (form.order !== null && form.order !== undefined && form.order < 0) {
    errors.value.order = 'Order must be a positive number'
  }

  return Object.keys(errors.value).length === 0
}

// Load stat data
const loadStat = async () => {
  isLoading.value = true
  loadError.value = null

  try {
    const stat = await statsStore.fetchStat(statId)

    if (stat) {
      currentStat.value = stat

      // Populate form
      form.label = stat.label
      form.value = stat.value
      form.unit = stat.unit || ''
      form.icon = stat.icon || 'fa-chart-line'
      form.order = stat.order
      form.is_active = stat.is_active
    } else {
      loadError.value = 'Statistic not found'
    }
  } catch (error: any) {
    console.error('Error loading stat:', error)
    loadError.value = error.message || 'Failed to load statistic'
  } finally {
    isLoading.value = false
  }
}

// Handlers
const handleSubmit = async () => {
  if (!validateForm()) {
    showError('Please fix the validation errors')
    return
  }

  isSubmitting.value = true

  try {
    // Prepare input - only send changed fields
    const input: UpdateStatInput = {}

    if (form.label !== currentStat.value?.label) {
      input.label = form.label
    }
    if (form.value !== currentStat.value?.value) {
      input.value = form.value
    }
    if (form.unit !== currentStat.value?.unit) {
      input.unit = form.unit || null
    }
    if (form.icon !== currentStat.value?.icon) {
      input.icon = form.icon || null
    }
    if (form.order !== currentStat.value?.order) {
      input.order = form.order
    }
    if (form.is_active !== currentStat.value?.is_active) {
      input.is_active = form.is_active
    }

    // Update stat
    await statsStore.updateStat(statId, input)

    showSuccess('Statistic updated successfully')

    // Redirect to list
    await router.push('/stats')
  } catch (error: any) {
    console.error('Error updating stat:', error)
    showError(error.message || 'Failed to save statistic')
  } finally {
    isSubmitting.value = false
  }
}

// Lifecycle
onMounted(async () => {
  breadcrumbStore.setBreadcrumb([
    { title: 'Home', path: '/' },
    { title: 'Statistics', path: '/stats' },
    { title: 'Edit Statistic', path: `/stats/edit/${statId}` }
  ])

  await loadStat()
})
</script>
