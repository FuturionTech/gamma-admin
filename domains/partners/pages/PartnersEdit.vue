<template>
  <!-- Page Header -->
  <PageHeader
    :title="partner ? 'Edit Partner' : 'Loading...'"
    :subtitle="partner?.name"
  />

  <!-- Loading State -->
  <div v-if="partnersStore.isLoading" class="card">
    <div class="card-body">
      <FormSkeleton :fields="5" :showActions="true" />
    </div>
  </div>

  <!-- Error State -->
  <div
    v-else-if="partnersStore.hasError"
    class="alert alert-danger d-flex align-items-center p-5"
  >
    <i class="ki-duotone ki-shield-cross fs-2hx text-danger me-4">
      <span class="path1"></span>
      <span class="path2"></span>
      <span class="path3"></span>
    </i>
    <div class="d-flex flex-column">
      <h4 class="mb-1 text-dark">An error occurred</h4>
      <span>{{ partnersStore.error }}</span>
    </div>
  </div>

  <!-- Form -->
  <div v-else-if="partner" class="card">
      <div class="card-header border-0">
        <div class="card-title">
          <h3>Edit Partner</h3>
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
        <!-- Form -->
        <form @submit.prevent="handleSubmit" :class="{ 'opacity-50 pe-none': isSubmitting }">
          <div class="row">
            <!-- Basic Information -->
            <div class="col-md-8">
              <div class="mb-10">
                <h3 class="mb-5">Basic Information</h3>

                <!-- Partner Name -->
                <div class="mb-7">
                  <label class="form-label required">Partner Name</label>
                  <input
                    type="text"
                    v-model="form.name"
                    class="form-control"
                    :class="{ 'is-invalid': errors.name }"
                    placeholder="Enter partner name"
                  />
                  <div v-if="errors.name" class="invalid-feedback">
                    {{ errors.name }}
                  </div>
                </div>

                <!-- Website URL -->
                <div class="mb-7">
                  <label class="form-label">Website URL</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="ki-duotone ki-global fs-2">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                    </span>
                    <input
                      type="url"
                      v-model="form.website_url"
                      class="form-control"
                      :class="{ 'is-invalid': errors.website_url }"
                      placeholder="https://example.com"
                    />
                    <div v-if="errors.website_url" class="invalid-feedback">
                      {{ errors.website_url }}
                    </div>
                  </div>
                  <div class="form-text">Partner's official website (optional)</div>
                </div>

                <!-- Display Order -->
                <div class="mb-7">
                  <label class="form-label">Display Order</label>
                  <input
                    type="number"
                    v-model.number="form.order"
                    class="form-control"
                    :class="{ 'is-invalid': errors.order }"
                    min="0"
                    placeholder="0"
                  />
                  <div v-if="errors.order" class="invalid-feedback">
                    {{ errors.order }}
                  </div>
                  <div class="form-text">Display order (lower numbers appear first)</div>
                </div>

                <!-- Active Status -->
                <div class="mb-7">
                  <div class="form-check form-switch form-check-custom form-check-solid">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="form.is_active"
                      id="is_active"
                    />
                    <label class="form-check-label" for="is_active">
                      Active
                    </label>
                  </div>
                  <div class="form-text">Enable or disable this partner on the website</div>
                </div>
              </div>
            </div>

            <!-- Logo Upload -->
            <div class="col-md-4">
              <div class="mb-10">
                <h3 class="mb-5">Logo</h3>

                <div class="mb-7">
                  <label class="form-label required">Partner Logo</label>

                  <!-- Logo Preview -->
                  <div
                    v-if="logoPreview"
                    class="border border-dashed border-gray-300 rounded p-5 mb-5 text-center"
                  >
                    <img
                      :src="logoPreview"
                      alt="Logo Preview"
                      class="mw-100"
                      style="max-height: 200px; object-fit: contain;"
                    />
                  </div>

                  <!-- Upload Area -->
                  <div
                    v-else
                    class="border border-dashed border-gray-300 rounded p-10 text-center mb-5"
                  >
                    <i class="ki-duotone ki-file-up fs-3x text-primary mb-3">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                    <div class="text-gray-600 fw-semibold fs-6 mb-2">
                      Drop logo here or click to upload
                    </div>
                    <div class="text-muted fs-7">
                      PNG, SVG, JPG (max 2MB)
                    </div>
                  </div>

                  <!-- File Input -->
                  <input
                    ref="fileInput"
                    type="file"
                    class="form-control"
                    :class="{ 'is-invalid': errors.logo_url }"
                    accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                    @change="handleLogoChange"
                  />
                  <div v-if="errors.logo_url" class="invalid-feedback">
                    {{ errors.logo_url }}
                  </div>

                  <!-- Remove Button -->
                  <button
                    v-if="logoPreview"
                    type="button"
                    class="btn btn-light-danger btn-sm mt-3 w-100"
                    @click="handleLogoRemove"
                  >
                    <i class="ki-duotone ki-trash fs-2">
                      <span class="path1"></span>
                      <span class="path2"></span>
                      <span class="path3"></span>
                      <span class="path4"></span>
                      <span class="path5"></span>
                    </i>
                    Remove Logo
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="d-flex justify-content-end gap-3 pt-10 border-top">
            <NuxtLink
              to="/partners"
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
import { usePartnersStore } from '../stores/usePartnersStore'
import { usePartnerFormatters } from '../composables/usePartnerFormatters'
import { usePartnerActions } from '../composables/usePartnerActions'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import type { PartnerFormData, Partner } from '../types'

const partnersStore = usePartnersStore()
const breadcrumbStore = useBreadcrumbStore()
const route = useRoute()
const router = useRouter()
const { showSuccess, showError } = useNotification()
const { isValidUrl } = usePartnerFormatters()
const { confirmAndDeletePartner } = usePartnerActions()

const partnerId = computed(() => route.params.id as string)
const partner = computed(() => partnersStore.currentPartner)

// Form state
const form = reactive<PartnerFormData>({
  name: '',
  logo_url: null,
  website_url: null,
  order: 0,
  is_active: true,
  logoFile: null
})

const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)
const logoPreview = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

// Validation
const isFormValid = computed(() => {
  return (
    form.name.trim() !== '' &&
    logoPreview.value !== '' &&
    Object.keys(errors.value).length === 0
  )
})

const validateForm = (): boolean => {
  errors.value = {}

  if (!form.name.trim()) {
    errors.value.name = 'Partner name is required'
  } else if (form.name.length > 255) {
    errors.value.name = 'Partner name cannot exceed 255 characters'
  }

  if (!logoPreview.value) {
    errors.value.logo_url = 'Partner logo is required'
  }

  if (form.website_url && !isValidUrl(form.website_url)) {
    errors.value.website_url = 'Invalid website URL'
  }

  if (form.order !== null && form.order !== undefined && form.order < 0) {
    errors.value.order = 'Order must be a positive number'
  }

  return Object.keys(errors.value).length === 0
}

// Populate form with existing partner data
const populateForm = (partner: Partner) => {
  form.name = partner.name
  form.logo_url = partner.logo_url
  form.website_url = partner.website_url
  form.order = partner.order
  form.is_active = partner.is_active

  if (partner.logo_url) {
    logoPreview.value = partner.logo_url
  }
}

// Watch for partner changes
watch(
  () => partnersStore.currentPartner,
  (newPartner) => {
    if (newPartner) {
      populateForm(newPartner)
    }
  },
  { immediate: true }
)

// Handlers
const handleLogoChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // Validate file type
  const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml']
  if (!validTypes.includes(file.type)) {
    errors.value.logo_url = 'Invalid file type. Accepted formats: PNG, SVG, JPG'
    return
  }

  // Validate file size (max 2MB)
  const maxSize = 2 * 1024 * 1024 // 2MB
  if (file.size > maxSize) {
    errors.value.logo_url = 'File is too large. Maximum size: 2MB'
    return
  }

  form.logoFile = file

  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    logoPreview.value = e.target?.result as string
    delete errors.value.logo_url
  }
  reader.readAsDataURL(file)
}

const handleLogoRemove = () => {
  form.logo_url = null
  form.logoFile = null
  logoPreview.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleSubmit = async () => {
  if (!validateForm()) {
    showError('Please fix validation errors')
    return
  }

  isSubmitting.value = true

  try {
    // Prepare input
    const input = {
      name: form.name,
      logo_url: logoPreview.value || null,
      website_url: form.website_url || null,
      order: form.order ?? 0,
      is_active: form.is_active ?? true
    }

    // Update partner
    await partnersStore.updatePartner(partnerId.value, input)

    showSuccess('Partner updated successfully')

    // Redirect to list
    await router.push('/partners')
  } catch (error: any) {
    console.error('Error updating partner:', error)
    showError(error.message || 'Failed to save partner')
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = async () => {
  if (!partner.value) return

  const deleted = await confirmAndDeletePartner(partner.value)
  if (deleted) {
    await router.push('/partners')
  }
}

// Lifecycle
onMounted(async () => {
  // Fetch partner
  try {
    await partnersStore.fetchPartner(partnerId.value)

    if (partner.value) {
      breadcrumbStore.setBreadcrumb([
        { title: 'Home', path: '/' },
        { title: 'Partners', path: '/partners' },
        { title: partner.value.name, path: `/partners/${partnerId.value}/edit` }
      ])
    }
  } catch (error) {
    console.error('Error loading partner:', error)
  }
})
</script>
