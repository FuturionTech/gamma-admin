<template>
  <!-- Page Header -->
  <PageHeader title="New Banner" subtitle="Create a new hero banner for your homepage" />

  <div class="row g-5">
      <!-- Form Card -->
      <div class="col-lg-8">
        <div class="card">
          <div class="card-body">
            <form @submit.prevent="handleSubmit">
              <!-- Section 1: Content -->
              <div class="mb-10">
                <h3 class="fw-bold mb-5">Content</h3>

                <!-- Title -->
                <div class="mb-5">
                  <label class="form-label required">Main Title</label>
                  <input
                    type="text"
                    v-model="formData.title"
                    class="form-control form-control-solid"
                    :class="{ 'is-invalid': errors.title }"
                    placeholder="e.g., Transform your business with AI"
                    maxlength="100"
                  />
                  <div class="form-text">
                    {{ formData.title?.length || 0 }} / 100 characters
                  </div>
                  <div v-if="errors.title" class="invalid-feedback">
                    {{ errors.title }}
                  </div>
                </div>

                <!-- Subtitle -->
                <div class="mb-5">
                  <label class="form-label">Subtitle</label>
                  <textarea
                    v-model="formData.subtitle"
                    class="form-control form-control-solid"
                    :class="{ 'is-invalid': errors.subtitle }"
                    rows="2"
                    maxlength="200"
                    placeholder="A descriptive subtitle (optional)"
                  ></textarea>
                  <div class="form-text">
                    {{ formData.subtitle?.length || 0 }} / 200 characters
                  </div>
                  <div v-if="errors.subtitle" class="invalid-feedback">
                    {{ errors.subtitle }}
                  </div>
                </div>
              </div>

              <div class="separator my-10"></div>

              <!-- Section 2: Image -->
              <div class="mb-10">
                <h3 class="fw-bold mb-5">Background Image</h3>

                <!-- Image URL -->
                <div class="mb-5">
                  <label class="form-label">Image URL</label>
                  <input
                    type="text"
                    v-model="formData.image_url"
                    class="form-control form-control-solid"
                    :class="{ 'is-invalid': errors.image_url }"
                    placeholder="https://example.com/image.jpg"
                  />
                  <div class="form-text">
                    Banner background image (recommended: 1920x1080px minimum)
                  </div>
                  <div v-if="errors.image_url" class="invalid-feedback">
                    {{ errors.image_url }}
                  </div>
                </div>

                <!-- Image Upload (Future feature) -->
                <div class="mb-5">
                  <label class="form-label">Or upload an image</label>
                  <input
                    type="file"
                    @change="handleImageUpload"
                    class="form-control form-control-solid"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                  />
                  <div class="form-text">
                    Accepted formats: JPG, PNG, WebP (max 5 MB)
                  </div>
                </div>
              </div>

              <div class="separator my-10"></div>

              <!-- Section 3: CTA (Call-to-Action) -->
              <div class="mb-10">
                <h3 class="fw-bold mb-5">Call-to-Action (CTA)</h3>

                <!-- Enable CTA Toggle -->
                <div class="mb-5">
                  <div class="form-check form-switch form-check-custom form-check-solid">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="ctaEnabled"
                      id="ctaEnabledSwitch"
                    />
                    <label class="form-check-label" for="ctaEnabledSwitch">
                      Enable CTA Button
                    </label>
                  </div>
                </div>

                <!-- CTA Fields (shown when enabled) -->
                <div v-if="ctaEnabled">
                  <!-- CTA Text -->
                  <div class="mb-5">
                    <label class="form-label required">Button Text</label>
                    <input
                      type="text"
                      v-model="formData.cta_text"
                      class="form-control form-control-solid"
                      :class="{ 'is-invalid': errors.cta_text }"
                      placeholder="e.g., Get Started, Learn More..."
                    />
                    <div v-if="errors.cta_text" class="invalid-feedback">
                      {{ errors.cta_text }}
                    </div>
                  </div>

                  <!-- CTA URL -->
                  <div class="mb-5">
                    <label class="form-label required">Button URL</label>
                    <input
                      type="text"
                      v-model="formData.cta_url"
                      class="form-control form-control-solid"
                      :class="{ 'is-invalid': errors.cta_url }"
                      placeholder="e.g., /contact, https://example.com/demo"
                    />
                    <div class="form-text">
                      Absolute or relative URL
                    </div>
                    <div v-if="errors.cta_url" class="invalid-feedback">
                      {{ errors.cta_url }}
                    </div>
                  </div>
                </div>
              </div>

              <div class="separator my-10"></div>

              <!-- Section 4: Settings -->
              <div class="mb-10">
                <h3 class="fw-bold mb-5">Settings</h3>

                <!-- Order -->
                <div class="mb-5">
                  <label class="form-label">Display Order</label>
                  <input
                    type="number"
                    v-model.number="formData.order"
                    class="form-control form-control-solid"
                    min="0"
                    placeholder="0"
                  />
                  <div class="form-text">
                    Position in carousel (0 = first banner)
                  </div>
                </div>

                <!-- Active Status -->
                <div class="mb-5">
                  <div class="form-check form-switch form-check-custom form-check-solid">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="formData.is_active"
                      id="isActiveSwitch"
                    />
                    <label class="form-check-label" for="isActiveSwitch">
                      Activate this banner
                    </label>
                  </div>
                  <div class="form-text">
                    Only active banners are displayed on the website
                  </div>
                </div>
              </div>

              <!-- Form Actions -->
              <div class="d-flex justify-content-end gap-3">
                <NuxtLink to="/banners" class="btn btn-light">
                  Cancel
                </NuxtLink>
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="isSubmitting"
                >
                  <span v-if="!isSubmitting">
                    <i class="ki-duotone ki-check fs-2"></i>
                    Create Banner
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
      </div>

      <!-- Preview Card -->
      <div class="col-lg-4">
        <div class="card sticky-top" style="top: 20px;">
          <div class="card-header">
            <h3 class="card-title">Banner Preview</h3>
          </div>
          <div class="card-body p-0">
            <!-- Banner Preview -->
            <div class="banner-preview-container position-relative" :style="bannerPreviewStyle">
              <div class="banner-overlay-preview position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-white p-6">
                <div class="text-center">
                  <h2 class="fw-bold fs-1 mb-3 text-white text-shadow">
                    {{ formData.title || 'Banner Title' }}
                  </h2>
                  <p v-if="formData.subtitle" class="fs-4 text-white text-shadow mb-4">
                    {{ formData.subtitle }}
                  </p>
                  <button v-if="ctaEnabled && formData.cta_text" class="btn btn-primary btn-lg">
                    {{ formData.cta_text }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Preview Info -->
            <div class="p-5">
              <div class="d-flex flex-column gap-3">
                <div class="d-flex justify-content-between">
                  <span class="text-gray-600">Status:</span>
                  <span class="badge" :class="formData.is_active ? 'badge-success' : 'badge-secondary'">
                    {{ formData.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </div>
                <div class="d-flex justify-content-between">
                  <span class="text-gray-600">CTA:</span>
                  <span class="badge" :class="ctaEnabled ? 'badge-primary' : 'badge-light'">
                    {{ ctaEnabled ? 'Enabled' : 'Disabled' }}
                  </span>
                </div>
                <div class="d-flex justify-content-between">
                  <span class="text-gray-600">Order:</span>
                  <span class="badge badge-light-primary">
                    #{{ (formData.order ?? 0) + 1 }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useBannersStore } from '../stores/useBannersStore'
import { useBannersActions } from '../composables/useBannersActions'
import { useBannersFormatters } from '../composables/useBannersFormatters'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import type { BannerFormData } from '../types'

const router = useRouter()
const bannersStore = useBannersStore()
const breadcrumbStore = useBreadcrumbStore()
const { uploadBannerImage } = useBannersActions()
const { isValidUrl, validateImageDimensions, formatImageUrl } = useBannersFormatters()
const { showSuccess, showError } = useNotification()

// Form state
const formData = reactive<BannerFormData>({
  application_id: '1', // Default application ID
  title: '',
  subtitle: null,
  image_url: null,
  cta_text: null,
  cta_url: null,
  order: null,
  is_active: true,
  imageFile: null
})

const ctaEnabled = ref(false)
const isSubmitting = ref(false)
const errors = reactive<Record<string, string>>({})

// Banner preview style
const bannerPreviewStyle = computed(() => ({
  backgroundImage: `url(${formatImageUrl(formData.image_url)})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  minHeight: '300px'
}))

// Validation
const validateForm = (): boolean => {
  // Clear previous errors
  Object.keys(errors).forEach(key => delete errors[key])

  let isValid = true

  // Title is required
  if (!formData.title?.trim()) {
    errors.title = 'Title is required'
    isValid = false
  } else if (formData.title.length > 100) {
    errors.title = 'Title cannot exceed 100 characters'
    isValid = false
  }

  // Subtitle validation
  if (formData.subtitle && formData.subtitle.length > 200) {
    errors.subtitle = 'Subtitle cannot exceed 200 characters'
    isValid = false
  }

  // Image URL validation
  if (formData.image_url && !isValidUrl(formData.image_url)) {
    errors.image_url = 'Invalid image URL'
    isValid = false
  }

  // CTA validation
  if (ctaEnabled.value) {
    if (!formData.cta_text?.trim()) {
      errors.cta_text = 'CTA text is required'
      isValid = false
    }

    if (!formData.cta_url?.trim()) {
      errors.cta_url = 'CTA URL is required'
      isValid = false
    }
  }

  return isValid
}

// Handle image upload
const handleImageUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  try {
    // Validate dimensions
    const validation = await validateImageDimensions(file)
    if (!validation.valid) {
      showError(validation.message || 'Invalid image')
      return
    }

    // Upload image
    const imageUrl = await uploadBannerImage(file)
    if (imageUrl) {
      formData.image_url = imageUrl
      formData.imageFile = file
      showSuccess('Image uploaded successfully')
    }
  } catch (error: any) {
    showError(error.message || 'Failed to upload image')
  }
}

// Handle form submit
const handleSubmit = async () => {
  if (!validateForm()) {
    showError('Please correct the form errors')
    return
  }

  isSubmitting.value = true

  try {
    // Clear CTA fields if not enabled
    if (!ctaEnabled.value) {
      formData.cta_text = null
      formData.cta_url = null
    }

    const input = {
      application_id: formData.application_id,
      title: formData.title,
      subtitle: formData.subtitle,
      image_url: formData.image_url,
      cta_text: formData.cta_text,
      cta_url: formData.cta_url,
      order: formData.order,
      is_active: formData.is_active
    }

    await bannersStore.createBanner(input)

    showSuccess('Banner created successfully')
    router.push('/banners')
  } catch (error: any) {
    showError(error.message || 'Failed to create banner')
  } finally {
    isSubmitting.value = false
  }
}

// Lifecycle
onMounted(() => {
  breadcrumbStore.setBreadcrumb([
    { title: 'Home', path: '/' },
    { title: 'Banners', path: '/banners' },
    { title: 'New Banner', path: '/banners/create' }
  ])
})
</script>

<style scoped>
.banner-preview-container {
  border-radius: 0.475rem 0.475rem 0 0;
}

.banner-overlay-preview {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3),
    rgba(0, 0, 0, 0.5)
  );
}

.text-shadow {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}

.sticky-top {
  position: sticky;
  z-index: 1020;
}
</style>
