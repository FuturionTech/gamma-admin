<template>
  <!-- Loading State -->
  <div v-if="processStepsStore.isLoading && !processStep" class="card">
    <div class="card-body">
      <FormSkeleton :fields="6" :showActions="true" />
    </div>
  </div>

  <!-- Error State -->
  <div
    v-else-if="processStepsStore.hasError"
    class="alert alert-danger d-flex align-items-center p-5"
  >
    <i class="ki-duotone ki-shield-cross fs-2hx text-danger me-4">
      <span class="path1"></span>
      <span class="path2"></span>
      <span class="path3"></span>
    </i>
    <div class="d-flex flex-column">
      <h4 class="mb-1 text-dark">An error occurred</h4>
      <span>{{ processStepsStore.error }}</span>
    </div>
  </div>

  <!-- Form -->
  <div v-else-if="processStep">
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
              <!-- Title -->
              <div class="mb-7">
                <label class="required fw-semibold fs-6 mb-2">Title</label>
                <input
                  type="text"
                  v-model="form.title"
                  class="form-control form-control-solid"
                  :class="{ 'is-invalid': errors.title }"
                  placeholder="e.g., Discovery"
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
              </div>

              <!-- Order -->
              <div class="mb-7">
                <label class="fw-semibold fs-6 mb-2">Display Order</label>
                <input
                  type="number"
                  v-model.number="form.order"
                  class="form-control form-control-solid"
                  :class="{ 'is-invalid': errors.order }"
                  placeholder="0"
                  min="0"
                />
                <div v-if="errors.order" class="invalid-feedback">{{ errors.order }}</div>
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

    <!-- Items Section -->
    <div class="card mt-5">
      <div class="card-header border-0 pt-5">
        <h3 class="card-title align-items-start flex-column">
          <span class="card-label fw-bold fs-3 mb-1">Sub-Items</span>
          <span class="text-muted mt-1 fw-semibold fs-7">
            {{ processStep.items?.length || 0 }} item(s) in this step
          </span>
        </h3>
        <div class="card-toolbar">
          <button
            type="button"
            class="btn btn-sm btn-primary"
            @click="showAddItemForm = !showAddItemForm"
          >
            <i class="ki-duotone ki-plus fs-2"></i>
            Add Item
          </button>
        </div>
      </div>

      <div class="card-body py-3">
        <!-- Add Item Form -->
        <div v-if="showAddItemForm" class="border rounded p-5 mb-5 bg-light-primary">
          <h5 class="fw-bold mb-4">New Item</h5>
          <div class="row g-4">
            <div class="col-md-6">
              <label class="required fw-semibold fs-6 mb-2">Title</label>
              <input
                type="text"
                v-model="newItemForm.title"
                class="form-control form-control-solid"
                placeholder="Item title"
              />
            </div>
            <div class="col-md-3">
              <label class="fw-semibold fs-6 mb-2">Icon</label>
              <input
                type="text"
                v-model="newItemForm.icon"
                class="form-control form-control-solid"
                placeholder="ki-duotone ki-..."
              />
            </div>
            <div class="col-md-3">
              <label class="fw-semibold fs-6 mb-2">Order</label>
              <input
                type="number"
                v-model.number="newItemForm.order"
                class="form-control form-control-solid"
                placeholder="0"
                min="0"
              />
            </div>
            <div class="col-12">
              <label class="fw-semibold fs-6 mb-2">Description</label>
              <textarea
                v-model="newItemForm.description"
                class="form-control form-control-solid"
                rows="2"
                placeholder="Item description"
              ></textarea>
            </div>
            <div class="col-12 d-flex justify-content-end gap-2">
              <button
                type="button"
                class="btn btn-sm btn-light"
                @click="cancelAddItem"
              >
                Cancel
              </button>
              <button
                type="button"
                class="btn btn-sm btn-primary"
                @click="handleCreateItem"
                :disabled="!newItemForm.title.trim() || isItemSubmitting"
              >
                <span v-if="!isItemSubmitting">Add Item</span>
                <span v-else>
                  <span class="spinner-border spinner-border-sm me-1"></span>
                  Adding...
                </span>
              </button>
            </div>
          </div>
        </div>

        <!-- Items List -->
        <div v-if="processStep.items && processStep.items.length > 0">
          <div
            v-for="(item, index) in sortedItems"
            :key="item.id"
            class="d-flex align-items-center border rounded p-4 mb-3"
            :class="{ 'bg-light-warning': editingItemId === item.id }"
          >
            <!-- Item Display Mode -->
            <template v-if="editingItemId !== item.id">
              <div class="d-flex align-items-center flex-grow-1">
                <span class="badge badge-light-primary me-3">{{ item.order }}</span>
                <div v-if="item.icon" class="me-3">
                  <i :class="item.icon" class="fs-2 text-gray-600"></i>
                </div>
                <div class="flex-grow-1">
                  <div class="fw-bold text-gray-800">{{ item.title }}</div>
                  <div class="text-muted fs-7" v-if="item.description">
                    {{ truncate(item.description, 80) }}
                  </div>
                </div>
              </div>
              <div class="d-flex gap-1">
                <button
                  type="button"
                  class="btn btn-sm btn-icon btn-light-primary"
                  @click="startEditItem(item)"
                  title="Edit"
                >
                  <i class="ki-duotone ki-pencil fs-4">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                </button>
                <button
                  type="button"
                  class="btn btn-sm btn-icon btn-light-danger"
                  @click="handleDeleteItem(item)"
                  title="Delete"
                >
                  <i class="ki-duotone ki-trash fs-4">
                    <span class="path1"></span>
                    <span class="path2"></span>
                    <span class="path3"></span>
                    <span class="path4"></span>
                    <span class="path5"></span>
                  </i>
                </button>
              </div>
            </template>

            <!-- Item Edit Mode -->
            <template v-else>
              <div class="flex-grow-1">
                <div class="row g-3">
                  <div class="col-md-6">
                    <input
                      type="text"
                      v-model="editItemForm.title"
                      class="form-control form-control-solid form-control-sm"
                      placeholder="Title"
                    />
                  </div>
                  <div class="col-md-3">
                    <input
                      type="text"
                      v-model="editItemForm.icon"
                      class="form-control form-control-solid form-control-sm"
                      placeholder="Icon class"
                    />
                  </div>
                  <div class="col-md-3">
                    <input
                      type="number"
                      v-model.number="editItemForm.order"
                      class="form-control form-control-solid form-control-sm"
                      placeholder="Order"
                      min="0"
                    />
                  </div>
                  <div class="col-12">
                    <textarea
                      v-model="editItemForm.description"
                      class="form-control form-control-solid form-control-sm"
                      rows="2"
                      placeholder="Description"
                    ></textarea>
                  </div>
                  <div class="col-12 d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      class="btn btn-sm btn-light"
                      @click="cancelEditItem"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      class="btn btn-sm btn-primary"
                      @click="handleUpdateItem(item.id)"
                      :disabled="!editItemForm.title.trim() || isItemSubmitting"
                    >
                      <span v-if="!isItemSubmitting">Save</span>
                      <span v-else>
                        <span class="spinner-border spinner-border-sm me-1"></span>
                        Saving...
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>

        <!-- No Items -->
        <div v-else class="text-center py-10">
          <i class="ki-duotone ki-notepad fs-3x text-gray-400 mb-3">
            <span class="path1"></span>
            <span class="path2"></span>
            <span class="path3"></span>
            <span class="path4"></span>
            <span class="path5"></span>
          </i>
          <div class="text-gray-500 fs-6">
            No items yet. Click "Add Item" to create one.
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
import { useProcessStepActions } from '../composables/useProcessStepActions'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import type { ProcessStep, ProcessStepItem, ProcessStepFormData, ProcessStepItemFormData } from '../types'

const processStepsStore = useProcessStepsStore()
const breadcrumbStore = useBreadcrumbStore()
const route = useRoute()
const router = useRouter()
const { showSuccess, showError } = useNotification()
const { generateSlug, truncate } = useProcessStepFormatters()
const { confirmAndDeleteProcessStep, confirmAndDeleteItem } = useProcessStepActions()

const processStepId = computed(() => route.params.id as string)
const processStep = computed(() => processStepsStore.currentProcessStep)

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

// Item management state
const showAddItemForm = ref(false)
const editingItemId = ref<string | null>(null)
const isItemSubmitting = ref(false)

const newItemForm = reactive<ProcessStepItemFormData>({
  title: '',
  description: null,
  icon: null,
  order: 0
})

const editItemForm = reactive<ProcessStepItemFormData>({
  title: '',
  description: null,
  icon: null,
  order: 0
})

const sortedItems = computed(() => {
  if (!processStep.value?.items) return []
  return [...processStep.value.items].sort((a, b) => a.order - b.order)
})

// Validation
const isFormValid = computed(() => {
  return (
    form.title.trim() !== '' &&
    form.step_number > 0 &&
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

  if (form.order !== null && form.order !== undefined && form.order < 0) {
    errors.value.order = 'Order must be a positive number'
  }

  return Object.keys(errors.value).length === 0
}

// Populate form with existing data
const populateForm = (step: ProcessStep) => {
  form.title = step.title
  form.description = step.description ?? null
  form.short_description = step.short_description ?? null
  form.step_number = step.step_number
  form.icon = step.icon ?? null
  form.icon_color = step.icon_color ?? null
  form.slug = step.slug
  form.order = step.order
  form.is_active = step.is_active
}

// Watch for process step changes
watch(
  () => processStepsStore.currentProcessStep,
  (newStep) => {
    if (newStep) {
      populateForm(newStep)
    }
  },
  { immediate: true }
)

// Step form handlers
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

    await processStepsStore.updateProcessStep(processStepId.value, input)

    showSuccess('Process step updated successfully')

    await router.push('/process-steps')
  } catch (error: any) {
    showError(error.message || 'Failed to update process step')
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = async () => {
  if (!processStep.value) return

  const deleted = await confirmAndDeleteProcessStep(processStep.value)
  if (deleted) {
    await router.push('/process-steps')
  }
}

// Item handlers
const resetNewItemForm = () => {
  newItemForm.title = ''
  newItemForm.description = null
  newItemForm.icon = null
  newItemForm.order = 0
}

const cancelAddItem = () => {
  showAddItemForm.value = false
  resetNewItemForm()
}

const handleCreateItem = async () => {
  if (!newItemForm.title.trim()) return

  isItemSubmitting.value = true

  try {
    await processStepsStore.createItem({
      process_step_id: processStepId.value,
      title: newItemForm.title,
      description: newItemForm.description || null,
      icon: newItemForm.icon || null,
      order: newItemForm.order ?? 0
    })

    showSuccess('Item added successfully')
    resetNewItemForm()
    showAddItemForm.value = false
  } catch (error: any) {
    showError(error.message || 'Failed to add item')
  } finally {
    isItemSubmitting.value = false
  }
}

const startEditItem = (item: ProcessStepItem) => {
  editingItemId.value = item.id
  editItemForm.title = item.title
  editItemForm.description = item.description ?? null
  editItemForm.icon = item.icon ?? null
  editItemForm.order = item.order
}

const cancelEditItem = () => {
  editingItemId.value = null
}

const handleUpdateItem = async (itemId: string) => {
  if (!editItemForm.title.trim()) return

  isItemSubmitting.value = true

  try {
    await processStepsStore.updateItem(itemId, {
      title: editItemForm.title,
      description: editItemForm.description || null,
      icon: editItemForm.icon || null,
      order: editItemForm.order ?? 0
    })

    showSuccess('Item updated successfully')
    editingItemId.value = null
  } catch (error: any) {
    showError(error.message || 'Failed to update item')
  } finally {
    isItemSubmitting.value = false
  }
}

const handleDeleteItem = async (item: ProcessStepItem) => {
  await confirmAndDeleteItem(item)
}

// Lifecycle
onMounted(async () => {
  try {
    await processStepsStore.fetchProcessStep(processStepId.value)

    if (processStep.value) {
      breadcrumbStore.setBreadcrumb([
        { title: 'Home', path: '/' },
        { title: 'Process Steps', path: '/process-steps' },
        { title: processStep.value.title, path: `/process-steps/${processStepId.value}/edit` }
      ])
    }
  } catch (error) {
  }
})
</script>
