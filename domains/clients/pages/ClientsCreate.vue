<template>
  <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
    <div class="d-flex flex-column flex-column-fluid">
      <div id="kt_app_content" class="app-content flex-column-fluid">
        <div id="kt_app_content_container" class="app-container container-fluid">

          <form class="gn-form" novalidate @submit.prevent="handleSubmit">
            <!-- Hero -->
            <header class="gn-form__hero">
              <div class="gn-form__hero-icon" aria-hidden="true">
                <GIcon name="user-check" :size="32" />
              </div>
              <div class="gn-form__hero-body">
                <span class="gn-form__eyebrow">New client</span>
                <h1 class="gn-form__title">{{ form.name || 'Untitled client' }}</h1>
                <p class="gn-form__subtitle">
                  Add a company Gamma Neutral has worked with. Showcased in the client carousel.
                </p>
              </div>
              <div class="gn-form__hero-actions">
                <NuxtLink to="/clients" class="gn-form__btn gn-form__btn--secondary">
                  Cancel
                </NuxtLink>
                <button
                  type="submit"
                  class="gn-form__btn gn-form__btn--primary"
                  :disabled="hasErrors || isSubmitting"
                >
                  <span v-if="!isSubmitting">Create client</span>
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
                    <h3 class="gn-form__card-title">Company details</h3>
                    <p class="gn-form__card-hint">Shown next to the logo on the public site.</p>
                  </header>

                  <div class="gn-form__field">
                    <label class="gn-form__label" for="client-name">
                      Client name <span class="gn-form__required">*</span>
                    </label>
                    <input
                      id="client-name"
                      v-model="form.name"
                      type="text"
                      class="gn-form__input"
                      :class="{ 'gn-form__input--error': touched.name && errors.name }"
                      placeholder="e.g. Acme Corporation"
                      @blur="validateField('name')"
                      @input="clearError('name')"
                    />
                    <span
                      v-if="touched.name && errors.name"
                      class="gn-form__helper gn-form__helper--error"
                    >
                      {{ errors.name }}
                    </span>
                  </div>

                  <div class="gn-form__field">
                    <label class="gn-form__label" for="client-industry">Industry</label>
                    <select
                      id="client-industry"
                      v-model="form.industry"
                      class="gn-form__select"
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
                    <span class="gn-form__helper">
                      Optional. Helps group clients by sector on the public site.
                    </span>
                  </div>

                  <div class="gn-form__field">
                    <label class="gn-form__label" for="client-url">Website</label>
                    <div class="gn-form__input-group">
                      <span class="gn-form__input-icon">
                        <GIcon name="globe" :size="18" />
                      </span>
                      <input
                        id="client-url"
                        v-model="form.website_url"
                        type="url"
                        class="gn-form__input gn-form__input--with-icon"
                        :class="{ 'gn-form__input--error': touched.website_url && errors.website_url }"
                        placeholder="https://example.com"
                        @blur="validateField('website_url')"
                        @input="clearError('website_url')"
                      />
                    </div>
                    <span
                      v-if="touched.website_url && errors.website_url"
                      class="gn-form__helper gn-form__helper--error"
                    >
                      {{ errors.website_url }}
                    </span>
                    <span v-else class="gn-form__helper">Optional. The client's public website.</span>
                  </div>
                </section>
              </div>

              <!-- Sidebar -->
              <aside class="gn-form__aside">
                <section class="gn-form__card">
                  <header class="gn-form__card-header">
                    <h3 class="gn-form__card-title">Logo</h3>
                    <p class="gn-form__card-hint">PNG or SVG with a transparent background works best.</p>
                  </header>

                  <div class="gn-form__logo-area">
                    <div
                      v-if="logoPreview"
                      class="gn-form__logo-preview"
                    >
                      <img :src="logoPreview" alt="Client logo" />
                      <button
                        type="button"
                        class="gn-form__logo-remove"
                        title="Remove logo"
                        @click="handleLogoRemove"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                        </svg>
                      </button>
                    </div>

                    <label v-else class="gn-form__logo-drop">
                      <input
                        ref="fileInput"
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                        class="gn-form__logo-input"
                        @change="handleLogoChange"
                      />
                      <span class="gn-form__logo-icon">
                        <GIcon name="image-plus" :size="28" />
                      </span>
                      <span class="gn-form__logo-title">Upload logo</span>
                      <span class="gn-form__logo-hint">PNG, SVG or JPG — up to 2MB</span>
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
import { useClientsStore } from '../stores/useClientsStore'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import type { ClientFormData } from '../types'
import { INDUSTRIES } from '../types'
import GIcon from '~/components/icons/GIcon.vue'

definePageMeta({ middleware: 'auth' })

const clientsStore = useClientsStore()
const breadcrumbStore = useBreadcrumbStore()
const router = useRouter()
const { showSuccess, showError } = useNotification()

const form = reactive<ClientFormData>({
  name: '',
  logo_url: null,
  industry: null,
  website_url: null,
  order: 0,
  is_active: true,
  logoFile: null,
})

const errors = ref<Record<string, string>>({})
const touched = ref<Record<string, boolean>>({})
const isSubmitting = ref(false)
const logoPreview = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

const validateField = (field: keyof ClientFormData): boolean => {
  touched.value[field as string] = true

  if (field === 'name') {
    if (!form.name || form.name.trim() === '') {
      errors.value.name = 'Client name is required'
      return false
    }
    if (form.name.length > 255) {
      errors.value.name = 'Client name cannot exceed 255 characters'
      return false
    }
    delete errors.value.name
    return true
  }

  if (field === 'website_url') {
    if (form.website_url && !isValidUrl(form.website_url)) {
      errors.value.website_url = 'Enter a valid URL (e.g. https://example.com)'
      return false
    }
    delete errors.value.website_url
    return true
  }

  return true
}

const validateAll = (): boolean => {
  let valid = true
  const fieldsToValidate: Array<keyof ClientFormData> = ['name', 'website_url']
  for (const field of fieldsToValidate) {
    if (!validateField(field)) valid = false
  }
  return valid
}

const clearError = (field: string) => {
  delete errors.value[field]
}

const hasErrors = computed(() => Object.keys(errors.value).length > 0)

const handleLogoChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml']
  if (!validTypes.includes(file.type)) {
    errors.value.logo_url = 'Invalid file type. Accepted: PNG, SVG, JPG'
    return
  }
  const maxSize = 2 * 1024 * 1024
  if (file.size > maxSize) {
    errors.value.logo_url = 'File too large. Max size: 2MB'
    return
  }

  form.logoFile = file
  const reader = new FileReader()
  reader.onload = (e) => {
    logoPreview.value = (e.target?.result as string) ?? ''
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
  if (!validateAll()) {
    showError('Please fix the form errors')
    return
  }

  isSubmitting.value = true

  try {
    const logoBase64 = logoPreview.value?.startsWith('data:image') ? logoPreview.value : null

    const input: Record<string, unknown> = {
      name: form.name,
      industry: form.industry || null,
      website_url: form.website_url || null,
      order: form.order ?? 0,
      is_active: form.is_active ?? true,
    }

    if (logoBase64) {
      input.logo = logoBase64
    } else if (form.logo_url) {
      input.logo_url = form.logo_url
    }

    await clientsStore.createClient(input)
    showSuccess('Client created successfully')
    router.push('/clients')
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create client'
    showError(message)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  breadcrumbStore.setBreadcrumb([
    { title: 'Dashboard', path: '/' },
    { title: 'Clients', path: '/clients' },
    { title: 'New client', path: '/clients/create' },
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
.gn-form__field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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

.gn-form__input-group {
  position: relative;
}

.gn-form__input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  color: rgba(15, 23, 42, 0.5);
  pointer-events: none;
}

.gn-form__input--with-icon {
  padding-left: 2.6rem;
}

.gn-form__input-group:focus-within .gn-form__input-icon {
  color: #7c3aed;
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

/* Logo upload */
.gn-form__logo-area {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.gn-form__logo-preview {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 180px;
  padding: 1.5rem;
  background: rgba(15, 23, 42, 0.02);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 16px;
}

.gn-form__logo-preview img {
  max-width: 100%;
  max-height: 160px;
  object-fit: contain;
}

.gn-form__logo-remove {
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
  transition: background 0.2s ease;
}

.gn-form__logo-remove svg {
  width: 16px;
  height: 16px;
}

.gn-form__logo-remove:hover {
  background: rgba(220, 38, 38, 0.18);
}

.gn-form__logo-drop {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  min-height: 180px;
  padding: 1.5rem;
  background: rgba(15, 23, 42, 0.02);
  border: 1.5px dashed rgba(15, 23, 42, 0.14);
  border-radius: 16px;
  cursor: pointer;
  text-align: center;
  transition: border-color 0.25s ease, background 0.25s ease;
}

.gn-form__logo-drop:hover {
  border-color: rgba(139, 92, 246, 0.5);
  background: rgba(139, 92, 246, 0.04);
}

.gn-form__logo-input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.gn-form__logo-icon {
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

.gn-form__logo-title {
  font-size: 0.92rem;
  font-weight: 600;
  color: #0f172a;
}

.gn-form__logo-hint {
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

html[data-bs-theme='dark'] .gn-form__input-icon {
  color: rgba(245, 245, 247, 0.45);
}

html[data-bs-theme='dark'] .gn-form__helper {
  color: rgba(245, 245, 247, 0.5);
}

html[data-bs-theme='dark'] .gn-form__logo-preview,
html[data-bs-theme='dark'] .gn-form__logo-drop {
  background: rgba(255, 255, 255, 0.02);
  border-color: rgba(255, 255, 255, 0.12);
}

html[data-bs-theme='dark'] .gn-form__logo-drop:hover {
  border-color: rgba(167, 139, 250, 0.5);
  background: rgba(167, 139, 250, 0.06);
}

html[data-bs-theme='dark'] .gn-form__logo-icon {
  background: rgba(167, 139, 250, 0.18);
  color: #c4b5fd;
}

html[data-bs-theme='dark'] .gn-form__logo-title {
  color: #f5f5f7;
}

html[data-bs-theme='dark'] .gn-form__logo-hint {
  color: rgba(245, 245, 247, 0.5);
}

html[data-bs-theme='dark'] .gn-form__logo-remove {
  background: rgba(248, 113, 113, 0.16);
  color: #fca5a5;
}

html[data-bs-theme='dark'] .gn-form__logo-remove:hover {
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
