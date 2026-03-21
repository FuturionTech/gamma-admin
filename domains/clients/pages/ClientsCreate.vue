<template>
  <!-- Page Header -->
  <PageHeader title="Create Client" />

  <div class="card">
    <div class="card-body">
      <!-- Form -->
      <form @submit.prevent="handleSubmit" :class="{ 'opacity-50 pe-none': isSubmitting }">
        <div class="row">
          <!-- Left Column: Basic Info -->
          <div class="col-lg-8">
            <div class="card card-flush mb-5">
              <div class="card-header">
                <h3 class="card-title">Basic Information</h3>
              </div>
              <div class="card-body pt-0">
                <!-- Client Name -->
                <div class="mb-5">
                  <label class="form-label required">Client Name</label>
                  <input
                    type="text"
                    v-model="form.name"
                    class="form-control"
                    :class="{
                      'is-invalid': touched.name && errors.name,
                      'is-valid': touched.name && form.name && !errors.name
                    }"
                    placeholder="Enter client name"
                    @blur="validateField('name')"
                    @input="clearError('name')"
                  />
                  <div v-if="touched.name && errors.name" class="invalid-feedback d-block">
                    {{ errors.name }}
                  </div>
                </div>

                <!-- Industry -->
                <div class="mb-5">
                  <label class="form-label">Industry</label>
                  <select
                    v-model="form.industry"
                    class="form-select"
                    :class="{
                      'is-invalid': touched.industry && errors.industry,
                      'is-valid': touched.industry && form.industry && !errors.industry
                    }"
                    @blur="validateField('industry')"
                    @change="clearError('industry')"
                  >
                    <option :value="null">Select an industry</option>
                    <option
                      v-for="industry in INDUSTRIES"
                      :key="industry"
                      :value="industry"
                    >
                      {{ industry }}
                    </option>
                  </select>
                  <div v-if="touched.industry && errors.industry" class="invalid-feedback d-block">
                    {{ errors.industry }}
                  </div>
                </div>

                <!-- Website URL -->
                <div class="mb-5">
                  <label class="form-label">Website URL</label>
                  <input
                    type="url"
                    v-model="form.website_url"
                    class="form-control"
                    :class="{
                      'is-invalid': touched.website_url && errors.website_url,
                      'is-valid': touched.website_url && form.website_url && !errors.website_url
                    }"
                    placeholder="https://example.com"
                    @blur="validateField('website_url')"
                    @input="clearError('website_url')"
                  />
                  <div v-if="touched.website_url && errors.website_url" class="invalid-feedback d-block">
                    {{ errors.website_url }}
                  </div>
                  <div class="form-text">Client's website URL (optional)</div>
                </div>

                <!-- Display Order -->
                <div class="mb-5">
                  <label class="form-label">Display Order</label>
                  <input
                    type="number"
                    v-model.number="form.order"
                    class="form-control"
                    :class="{
                      'is-invalid': touched.order && errors.order,
                      'is-valid': touched.order && (form.order !== null && form.order !== undefined) && !errors.order
                    }"
                    min="0"
                    placeholder="0"
                    @blur="validateField('order')"
                    @input="clearError('order')"
                  />
                  <div v-if="touched.order && errors.order" class="invalid-feedback d-block">
                    {{ errors.order }}
                  </div>
                  <div class="form-text">Display order (lower = shown first)</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Logo & Settings -->
          <div class="col-lg-4">
            <!-- Logo Upload -->
            <div class="card card-flush mb-5">
              <div class="card-header">
                <h3 class="card-title">Logo</h3>
              </div>
              <div class="card-body text-center pt-0">
                <!-- Logo Preview -->
                <div class="image-input image-input-outline mb-5" data-kt-image-input="true">
                  <div
                    class="image-input-wrapper w-125px h-125px"
                    :style="logoPreview ? `background-image: url(${logoPreview})` : ''"
                  ></div>

                  <!-- Upload Button -->
                  <label
                    class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                    data-kt-image-input-action="change"
                    data-bs-toggle="tooltip"
                    title="Change logo"
                  >
                    <i class="ki-duotone ki-pencil fs-7">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                    <input
                      type="file"
                      name="logo"
                      accept="image/*"
                      @change="handleLogoChange"
                    />
                  </label>

                  <!-- Remove Button -->
                  <span
                    v-if="logoPreview"
                    class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow"
                    data-kt-image-input-action="remove"
                    data-bs-toggle="tooltip"
                    title="Remove logo"
                    @click="handleLogoRemove"
                  >
                    <i class="ki-duotone ki-cross fs-2">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </span>
                </div>

                <div class="form-text">Upload client logo (PNG, JPG, SVG)</div>
              </div>
            </div>

            <!-- Settings -->
            <div class="card card-flush">
              <div class="card-header">
                <h3 class="card-title">Settings</h3>
              </div>
              <div class="card-body pt-0">
                <!-- Active Status -->
                <div class="mb-0">
                  <label class="form-check form-switch form-check-custom form-check-solid">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="form.is_active"
                    />
                    <span class="form-check-label fw-semibold text-muted">
                      Active
                    </span>
                  </label>
                  <div class="form-text">Enable or disable this client</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="d-flex justify-content-end gap-3 mt-10 pt-10 border-top">
          <NuxtLink
            to="/clients"
            class="btn btn-light"
          >
            Cancel
          </NuxtLink>
          <button
            type="submit"
            class="btn btn-primary"
            :disabled="isSubmitting || hasErrors"
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
import { useClientsStore } from '../stores/useClientsStore'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import type { ClientFormData } from '../types'
import { INDUSTRIES } from '../types'

const clientsStore = useClientsStore()
const breadcrumbStore = useBreadcrumbStore()
const router = useRouter()
const { showSuccess, showError } = useNotification()

// Form state
const form = reactive<ClientFormData>({
  name: '',
  logo_url: null,
  industry: null,
  website_url: null,
  order: 0,
  is_active: true,
  logoFile: null
})

const errors = ref<Record<string, string>>({})
const touched = ref<Record<string, boolean>>({})
const isSubmitting = ref(false)
const logoPreview = ref('')

// Validation
const validateField = (field: keyof ClientFormData): boolean => {
  touched.value[field] = true
  const value = form[field]

  switch (field) {
    case 'name':
      if (!value || (typeof value === 'string' && !value.trim())) {
        errors.value.name = 'Client name is required'
        return false
      }
      if (typeof value === 'string' && value.length > 255) {
        errors.value.name = 'Client name cannot exceed 255 characters'
        return false
      }
      errors.value.name = ''
      return true

    case 'website_url':
      if (value && typeof value === 'string' && !isValidUrl(value)) {
        errors.value.website_url = 'Please enter a valid URL (e.g., https://example.com)'
        return false
      }
      errors.value.website_url = ''
      return true

    case 'order':
      if (value !== null && value !== undefined && typeof value === 'number' && value < 0) {
        errors.value.order = 'Order must be a positive number'
        return false
      }
      errors.value.order = ''
      return true

    default:
      return true
  }
}

const validateAll = (): boolean => {
  let isValid = true
  const fieldsToValidate: Array<keyof ClientFormData> = ['name', 'website_url', 'order']

  for (const field of fieldsToValidate) {
    if (!validateField(field)) {
      isValid = false
    }
  }

  return isValid
}

const clearError = (field: string) => {
  errors.value[field] = ''
}

const hasErrors = computed(() => {
  return Object.values(errors.value).some(e => e)
})

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Handlers
const handleLogoChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  form.logoFile = file

  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    logoPreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)

  // TODO: Upload file to server and set form.logo_url to URL
  // For now, we'll just use the preview
}

const handleLogoRemove = () => {
  form.logo_url = null
  form.logoFile = null
  logoPreview.value = ''
}

const handleSubmit = async () => {
  if (!validateAll()) {
    showError('Please fix the validation errors')
    return
  }

  isSubmitting.value = true

  try {
    // Prepare input
    const input = {
      name: form.name,
      logo_url: logoPreview.value || form.logo_url || null,
      industry: form.industry || null,
      website_url: form.website_url || null,
      order: form.order ?? 0,
      is_active: form.is_active ?? true
    }

    // Create client
    const newClient = await clientsStore.createClient(input)

    showSuccess('Client created successfully')

    // Redirect to list
    await router.push('/clients')
  } catch (error: any) {
    showError(error.message || 'Failed to save client')
  } finally {
    isSubmitting.value = false
  }
}

// Lifecycle
onMounted(() => {
  breadcrumbStore.setBreadcrumb([
    { title: 'Home', path: '/' },
    { title: 'Clients', path: '/clients' },
    { title: 'Create Client', path: '/clients/create' }
  ])
})
</script>

<style scoped>
.image-input-wrapper {
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #f5f5f5;
}
</style>
