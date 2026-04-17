<template>
  <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
    <div class="d-flex flex-column flex-column-fluid">
      <div id="kt_app_content" class="app-content flex-column-fluid">
        <div id="kt_app_content_container" class="app-container container-fluid">

          <form class="gn-form" novalidate @submit.prevent="handleSubmit">
            <!-- Hero -->
            <header class="gn-form__hero">
              <div class="gn-form__hero-icon" aria-hidden="true">
                <GIcon name="sparkles" :size="32" />
              </div>
              <div class="gn-form__hero-body">
                <span class="gn-form__eyebrow">New testimonial</span>
                <h1 class="gn-form__title">{{ form.name || 'Untitled testimonial' }}</h1>
                <p class="gn-form__subtitle">
                  Capture a quote from a client and share it on the public site.
                </p>
              </div>
              <div class="gn-form__hero-actions">
                <NuxtLink to="/testimonials" class="gn-form__btn gn-form__btn--secondary">
                  Cancel
                </NuxtLink>
                <button
                  type="submit"
                  class="gn-form__btn gn-form__btn--primary"
                  :disabled="!isFormValid || isSubmitting"
                >
                  <span v-if="!isSubmitting">Create testimonial</span>
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
                    <h3 class="gn-form__card-title">Quote</h3>
                    <p class="gn-form__card-hint">What did the client say? Keep it punchy.</p>
                  </header>

                  <div class="gn-form__field">
                    <label class="gn-form__label" for="testimonial-content">
                      Quote <span class="gn-form__required">*</span>
                    </label>
                    <textarea
                      id="testimonial-content"
                      v-model="form.content"
                      rows="5"
                      class="gn-form__textarea"
                      :class="{ 'gn-form__input--error': errors.content }"
                      placeholder="“Gamma Neutral unblocked our roadmap in weeks. Outstanding partnership.”"
                      @input="clearError('content')"
                    />
                    <div class="gn-form__char-row">
                      <span v-if="errors.content" class="gn-form__helper gn-form__helper--error">
                        {{ errors.content }}
                      </span>
                      <span v-else class="gn-form__helper">Keep it under 500 characters for best display.</span>
                      <span class="gn-form__char-count" :class="{ 'gn-form__char-count--warn': contentTooLong }">
                        {{ form.content.length }} / 500
                      </span>
                    </div>
                  </div>

                  <div class="gn-form__field">
                    <label class="gn-form__label">Rating</label>
                    <div class="gn-form__rating">
                      <button
                        v-for="star in 5"
                        :key="star"
                        type="button"
                        class="gn-form__star"
                        :class="{ 'gn-form__star--active': (form.rating ?? 5) >= star }"
                        :aria-label="`${star} star${star > 1 ? 's' : ''}`"
                        @click="form.rating = star"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </button>
                      <span class="gn-form__rating-label">{{ ratingLabel }}</span>
                    </div>
                  </div>
                </section>

                <section class="gn-form__card">
                  <header class="gn-form__card-header">
                    <h3 class="gn-form__card-title">Author</h3>
                    <p class="gn-form__card-hint">Who said it, and where do they work?</p>
                  </header>

                  <div class="gn-form__grid">
                    <div class="gn-form__field gn-form__field--full">
                      <label class="gn-form__label" for="testimonial-name">
                        Full name <span class="gn-form__required">*</span>
                      </label>
                      <input
                        id="testimonial-name"
                        v-model="form.name"
                        type="text"
                        class="gn-form__input"
                        :class="{ 'gn-form__input--error': errors.name }"
                        placeholder="e.g. Aisha Johnson"
                        @input="clearError('name')"
                      />
                      <span v-if="errors.name" class="gn-form__helper gn-form__helper--error">
                        {{ errors.name }}
                      </span>
                    </div>

                    <div class="gn-form__field">
                      <label class="gn-form__label" for="testimonial-position">Position</label>
                      <input
                        id="testimonial-position"
                        v-model="form.position"
                        type="text"
                        class="gn-form__input"
                        placeholder="e.g. Head of Data"
                      />
                    </div>

                    <div class="gn-form__field">
                      <label class="gn-form__label" for="testimonial-company">Company</label>
                      <input
                        id="testimonial-company"
                        v-model="form.company"
                        type="text"
                        class="gn-form__input"
                        placeholder="e.g. Acme Corporation"
                      />
                    </div>
                  </div>
                </section>
              </div>

              <!-- Sidebar -->
              <aside class="gn-form__aside">
                <section class="gn-form__card">
                  <header class="gn-form__card-header">
                    <h3 class="gn-form__card-title">Photo</h3>
                    <p class="gn-form__card-hint">Square portrait works best.</p>
                  </header>

                  <div class="gn-form__photo-area">
                    <div v-if="imagePreview" class="gn-form__photo-preview">
                      <img :src="imagePreview" alt="Author" />
                      <button
                        type="button"
                        class="gn-form__photo-remove"
                        title="Remove photo"
                        @click="handleImageRemove"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                        </svg>
                      </button>
                    </div>

                    <label v-else class="gn-form__photo-drop">
                      <input
                        ref="fileInput"
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        class="gn-form__photo-input"
                        @change="handleFileInput"
                      />
                      <span class="gn-form__photo-icon">
                        <GIcon name="image-plus" :size="28" />
                      </span>
                      <span class="gn-form__photo-title">Upload photo</span>
                      <span class="gn-form__photo-hint">PNG or JPG — up to 2MB</span>
                    </label>
                  </div>
                </section>

                <section class="gn-form__card">
                  <header class="gn-form__card-header">
                    <h3 class="gn-form__card-title">Publishing</h3>
                  </header>
                  <label class="gn-form__toggle">
                    <input
                      v-model="form.is_active"
                      type="checkbox"
                      class="gn-form__toggle-input"
                    />
                    <span class="gn-form__toggle-track">
                      <span class="gn-form__toggle-thumb" />
                    </span>
                    <span class="gn-form__toggle-body">
                      <span class="gn-form__toggle-title">
                        {{ form.is_active ? 'Active' : 'Inactive' }}
                      </span>
                      <span class="gn-form__toggle-hint">
                        {{ form.is_active ? 'Visible on the public site' : 'Hidden from the public site' }}
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
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTestimonialsStore } from '../stores/useTestimonialsStore'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import type { TestimonialFormData } from '../types'
import GIcon from '~/components/icons/GIcon.vue'

definePageMeta({ middleware: 'auth' })

const testimonialsStore = useTestimonialsStore()
const breadcrumbStore = useBreadcrumbStore()
const router = useRouter()
const { showSuccess, showError } = useNotification()

const form = reactive<TestimonialFormData>({
  name: '',
  content: '',
  image_url: null,
  position: null,
  company: null,
  rating: 5,
  order: 0,
  is_active: true,
  imageFile: null,
})

const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)
const imagePreview = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

const contentTooLong = computed(() => form.content.length > 500)

const ratingLabels: Record<number, string> = {
  1: '1 star',
  2: '2 stars',
  3: '3 stars',
  4: '4 stars',
  5: '5 stars — excellent',
}
const ratingLabel = computed(() => ratingLabels[form.rating ?? 5] ?? '')

const isFormValid = computed(() => {
  return (
    form.name.trim() !== '' &&
    form.content.trim() !== '' &&
    !contentTooLong.value &&
    Object.keys(errors.value).length === 0
  )
})

const clearError = (field: string) => {
  delete errors.value[field]
}

const validateForm = (): boolean => {
  errors.value = {}

  if (!form.name.trim()) {
    errors.value.name = 'Name is required'
  } else if (form.name.length > 255) {
    errors.value.name = 'Name cannot exceed 255 characters'
  }

  if (!form.content.trim()) {
    errors.value.content = 'Quote is required'
  } else if (form.content.length > 500) {
    errors.value.content = 'Quote cannot exceed 500 characters'
  }

  return Object.keys(errors.value).length === 0
}

const handleFileInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  handleImageChange(file)
}

const handleImageChange = (file: File) => {
  const validTypes = ['image/png', 'image/jpeg', 'image/jpg']
  if (!validTypes.includes(file.type)) {
    showError('Invalid file type. Use PNG or JPG.')
    return
  }
  const maxSize = 2 * 1024 * 1024
  if (file.size > maxSize) {
    showError('File too large. Max size: 2MB.')
    return
  }

  form.imageFile = file
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = (e.target?.result as string) ?? ''
  }
  reader.readAsDataURL(file)
}

const handleImageRemove = () => {
  form.image_url = null
  form.imageFile = null
  imagePreview.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleSubmit = async () => {
  if (!validateForm()) {
    showError('Please fix the form errors')
    return
  }

  isSubmitting.value = true

  try {
    const imageBase64 = imagePreview.value?.startsWith('data:image') ? imagePreview.value : null

    const input: Record<string, unknown> = {
      name: form.name,
      content: form.content,
      position: form.position || null,
      company: form.company || null,
      rating: form.rating ?? 5,
      order: form.order ?? 0,
      is_active: form.is_active ?? true,
    }

    if (imageBase64) {
      input.image = imageBase64
    } else if (form.image_url) {
      input.image_url = form.image_url
    }

    await testimonialsStore.createTestimonial(input)
    showSuccess('Testimonial created successfully')
    router.push('/testimonials')
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create testimonial'
    showError(message)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  breadcrumbStore.setBreadcrumb([
    { title: 'Dashboard', path: '/' },
    { title: 'Testimonials', path: '/testimonials' },
    { title: 'New testimonial', path: '/testimonials/create' },
  ])
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

/* Fields */
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
.gn-form__textarea {
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

.gn-form__textarea {
  resize: vertical;
  min-height: 130px;
}

.gn-form__input:focus,
.gn-form__textarea:focus {
  outline: none;
  border-color: rgba(139, 92, 246, 0.55);
  background: rgba(139, 92, 246, 0.04);
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
}

.gn-form__input--error {
  border-color: rgba(220, 38, 38, 0.5);
  background: rgba(220, 38, 38, 0.04);
}

.gn-form__input::placeholder,
.gn-form__textarea::placeholder {
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

.gn-form__char-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.gn-form__char-count {
  font-size: 0.72rem;
  font-weight: 500;
  color: rgba(15, 23, 42, 0.45);
  font-variant-numeric: tabular-nums;
}

.gn-form__char-count--warn {
  color: #dc2626;
  font-weight: 600;
}

/* Rating stars */
.gn-form__rating {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.gn-form__star {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 0;
  background: transparent;
  color: rgba(15, 23, 42, 0.15);
  cursor: pointer;
  transition: color 0.2s ease, transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  border-radius: 10px;
}

.gn-form__star svg {
  width: 26px;
  height: 26px;
}

.gn-form__star:hover {
  transform: translateY(-1px);
}

.gn-form__star--active {
  color: #f59e0b;
}

.gn-form__rating-label {
  margin-left: 0.5rem;
  font-size: 0.82rem;
  font-weight: 500;
  color: rgba(15, 23, 42, 0.55);
}

/* Photo upload */
.gn-form__photo-area {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.gn-form__photo-preview {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1 / 1;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.02);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 16px;
}

.gn-form__photo-preview img {
  max-width: 100%;
  max-height: 100%;
  border-radius: 12px;
  object-fit: cover;
}

.gn-form__photo-remove {
  position: absolute;
  top: 0.6rem;
  right: 0.6rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  background: rgba(220, 38, 38, 0.1);
  color: #dc2626;
  border-radius: 10px;
  cursor: pointer;
}

.gn-form__photo-remove svg {
  width: 16px;
  height: 16px;
}

.gn-form__photo-remove:hover {
  background: rgba(220, 38, 38, 0.18);
}

.gn-form__photo-drop {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  aspect-ratio: 1 / 1;
  padding: 1.5rem;
  background: rgba(15, 23, 42, 0.02);
  border: 1.5px dashed rgba(15, 23, 42, 0.14);
  border-radius: 16px;
  cursor: pointer;
  text-align: center;
  transition: border-color 0.25s ease, background 0.25s ease;
}

.gn-form__photo-drop:hover {
  border-color: rgba(139, 92, 246, 0.5);
  background: rgba(139, 92, 246, 0.04);
}

.gn-form__photo-input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.gn-form__photo-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: rgba(139, 92, 246, 0.1);
  color: #7c3aed;
  margin-bottom: 0.3rem;
}

.gn-form__photo-title {
  font-size: 0.92rem;
  font-weight: 600;
  color: #0f172a;
}

.gn-form__photo-hint {
  font-size: 0.76rem;
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
html[data-bs-theme='dark'] .gn-form__textarea {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.1);
  color: #f5f5f7;
}

html[data-bs-theme='dark'] .gn-form__input:focus,
html[data-bs-theme='dark'] .gn-form__textarea:focus {
  border-color: rgba(167, 139, 250, 0.6);
  background: rgba(167, 139, 250, 0.06);
}

html[data-bs-theme='dark'] .gn-form__input::placeholder,
html[data-bs-theme='dark'] .gn-form__textarea::placeholder {
  color: rgba(245, 245, 247, 0.35);
}

html[data-bs-theme='dark'] .gn-form__helper {
  color: rgba(245, 245, 247, 0.5);
}

html[data-bs-theme='dark'] .gn-form__char-count {
  color: rgba(245, 245, 247, 0.45);
}

html[data-bs-theme='dark'] .gn-form__star {
  color: rgba(255, 255, 255, 0.18);
}

html[data-bs-theme='dark'] .gn-form__star--active {
  color: #fbbf24;
}

html[data-bs-theme='dark'] .gn-form__rating-label {
  color: rgba(245, 245, 247, 0.55);
}

html[data-bs-theme='dark'] .gn-form__photo-preview,
html[data-bs-theme='dark'] .gn-form__photo-drop {
  background: rgba(255, 255, 255, 0.02);
  border-color: rgba(255, 255, 255, 0.12);
}

html[data-bs-theme='dark'] .gn-form__photo-drop:hover {
  border-color: rgba(167, 139, 250, 0.5);
  background: rgba(167, 139, 250, 0.06);
}

html[data-bs-theme='dark'] .gn-form__photo-icon {
  background: rgba(167, 139, 250, 0.18);
  color: #c4b5fd;
}

html[data-bs-theme='dark'] .gn-form__photo-title {
  color: #f5f5f7;
}

html[data-bs-theme='dark'] .gn-form__photo-hint {
  color: rgba(245, 245, 247, 0.5);
}

html[data-bs-theme='dark'] .gn-form__photo-remove {
  background: rgba(248, 113, 113, 0.16);
  color: #fca5a5;
}

html[data-bs-theme='dark'] .gn-form__photo-remove:hover {
  background: rgba(248, 113, 113, 0.24);
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
