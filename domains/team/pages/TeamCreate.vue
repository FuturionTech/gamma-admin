<template>
  <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
    <div class="d-flex flex-column flex-column-fluid">
      <div id="kt_app_content" class="app-content flex-column-fluid">
        <div id="kt_app_content_container" class="app-container container-fluid">

          <form class="gn-form" novalidate @submit.prevent="handleSubmit">
            <!-- Hero -->
            <header class="gn-form__hero">
              <div class="gn-form__hero-icon" aria-hidden="true">
                <GIcon name="user-plus" :size="32" />
              </div>
              <div class="gn-form__hero-body">
                <span class="gn-form__eyebrow">New team member</span>
                <h1 class="gn-form__title">{{ formData.name || 'Untitled team member' }}</h1>
                <p class="gn-form__subtitle">
                  {{ formData.role || 'Add a new person to the Gamma Neutral team' }}
                </p>
              </div>
              <div class="gn-form__hero-actions">
                <NuxtLink to="/team" class="gn-form__btn gn-form__btn--secondary">Cancel</NuxtLink>
                <button
                  type="submit"
                  class="gn-form__btn gn-form__btn--primary"
                  :disabled="isSubmitting"
                >
                  <span v-if="!isSubmitting">Create member</span>
                  <span v-else class="gn-form__btn-loading">
                    <span class="gn-form__spinner" />
                    Saving…
                  </span>
                </button>
              </div>
            </header>

            <div class="gn-form__layout">
              <!-- Main column -->
              <div class="gn-form__main">
                <section class="gn-form__card">
                  <header class="gn-form__card-header">
                    <h3 class="gn-form__card-title">Personal details</h3>
                    <p class="gn-form__card-hint">
                      Required for every team member shown on the public site.
                    </p>
                  </header>

                  <div class="gn-form__grid">
                    <div class="gn-form__field gn-form__field--full">
                      <label class="gn-form__label" for="team-name">
                        Full name <span class="gn-form__required">*</span>
                      </label>
                      <input
                        id="team-name"
                        v-model="formData.name"
                        type="text"
                        class="gn-form__input"
                        :class="{ 'gn-form__input--error': touched.name && errors.name }"
                        placeholder="e.g. Aisha Johnson"
                        @blur="validateField('name')"
                        @input="clearError('name')"
                      />
                      <span v-if="touched.name && errors.name" class="gn-form__helper gn-form__helper--error">
                        {{ errors.name }}
                      </span>
                    </div>

                    <div class="gn-form__field gn-form__field--full">
                      <label class="gn-form__label" for="team-role">Role / Position</label>
                      <input
                        id="team-role"
                        v-model="formData.role"
                        type="text"
                        class="gn-form__input"
                        placeholder="e.g. Chief Technology Officer"
                      />
                    </div>

                    <div class="gn-form__field">
                      <label class="gn-form__label" for="team-email">Email address</label>
                      <input
                        id="team-email"
                        v-model="formData.email"
                        type="email"
                        inputmode="email"
                        autocomplete="off"
                        class="gn-form__input"
                        :class="{ 'gn-form__input--error': touched.email && errors.email }"
                        placeholder="aisha@gammaneutral.com"
                        @blur="validateField('email')"
                        @input="clearError('email')"
                      />
                      <span v-if="touched.email && errors.email" class="gn-form__helper gn-form__helper--error">
                        {{ errors.email }}
                      </span>
                    </div>

                    <div class="gn-form__field">
                      <label class="gn-form__label" for="team-phone">Phone</label>
                      <input
                        id="team-phone"
                        v-model="formData.contact"
                        type="tel"
                        inputmode="tel"
                        autocomplete="off"
                        class="gn-form__input"
                        placeholder="+1 416 555 0123"
                      />
                    </div>

                    <div class="gn-form__field gn-form__field--full">
                      <label class="gn-form__label" for="team-bio">Biography</label>
                      <textarea
                        id="team-bio"
                        v-model="formData.biography"
                        rows="5"
                        class="gn-form__textarea"
                        placeholder="Share a short professional bio…"
                      />
                      <span class="gn-form__helper">
                        {{ formData.biography?.length || 0 }} characters
                      </span>
                    </div>
                  </div>
                </section>

                <section class="gn-form__card">
                  <header class="gn-form__card-header">
                    <h3 class="gn-form__card-title">Social presence</h3>
                    <p class="gn-form__card-hint">
                      Pick a platform to add a link. You can add or remove any at any time.
                    </p>
                  </header>

                  <SocialLinksManager
                    v-model="formData.socialLinks"
                    :platforms="teamStore.socialMediaPlatforms"
                  />
                </section>
              </div>

              <!-- Sidebar -->
              <aside class="gn-form__aside">
                <section class="gn-form__card">
                  <header class="gn-form__card-header">
                    <h3 class="gn-form__card-title">Profile picture</h3>
                    <p class="gn-form__card-hint">Square images work best (min. 400×400).</p>
                  </header>
                  <PhotoUpload
                    v-model="formData.profile_picture_url"
                    @fileSelected="handlePhotoSelected"
                  />
                </section>

                <section class="gn-form__card">
                  <header class="gn-form__card-header">
                    <h3 class="gn-form__card-title">Publishing</h3>
                  </header>
                  <label class="gn-form__toggle">
                    <input
                      v-model="formData.is_active"
                      type="checkbox"
                      class="gn-form__toggle-input"
                    />
                    <span class="gn-form__toggle-track">
                      <span class="gn-form__toggle-thumb" />
                    </span>
                    <span class="gn-form__toggle-body">
                      <span class="gn-form__toggle-title">
                        {{ formData.is_active ? 'Active' : 'Inactive' }}
                      </span>
                      <span class="gn-form__toggle-hint">
                        {{
                          formData.is_active
                            ? 'Visible on the public Gamma Neutral site'
                            : 'Hidden from the public site'
                        }}
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
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTeamStore } from '../stores/useTeamStore'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import type { TeamFormData } from '../types'
import GIcon from '~/components/icons/GIcon.vue'
import PhotoUpload from '../components/PhotoUpload.vue'
import SocialLinksManager from '../components/SocialLinksManager.vue'

definePageMeta({ middleware: 'auth' })

const router = useRouter()
const teamStore = useTeamStore()
const breadcrumbStore = useBreadcrumbStore()
const { showSuccess, showError } = useNotification()

const isSubmitting = ref(false)
const errors = reactive<Record<string, string>>({})
const touched = reactive<Record<string, boolean>>({})

const formData = reactive<TeamFormData>({
  name: '',
  role: null,
  email: null,
  contact: null,
  biography: null,
  profile_picture_url: null,
  order: 0,
  is_active: true,
  socialLinks: [],
})

const profilePictureFile = ref<File | null>(null)

const handlePhotoSelected = (file: File | null) => {
  profilePictureFile.value = file
}

const validateField = (field: string): boolean => {
  touched[field] = true

  if (field === 'name') {
    if (!formData.name || formData.name.trim() === '') {
      errors.name = 'Full name is required'
      return false
    }
    errors.name = ''
    return true
  }

  if (field === 'email') {
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        errors.email = 'Please enter a valid email address'
        return false
      }
    }
    errors.email = ''
    return true
  }

  return true
}

const clearError = (field: string) => {
  errors[field] = ''
}

const validateForm = (): boolean => {
  let valid = true
  if (!validateField('name')) valid = false
  if (!validateField('email')) valid = false
  return valid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    showError('Please correct the form errors')
    return
  }

  isSubmitting.value = true

  try {
    const profilePictureBase64 = formData.profile_picture_url?.startsWith('data:image')
      ? formData.profile_picture_url
      : null

    const input: Record<string, unknown> = {
      name: formData.name,
      role: formData.role,
      email: formData.email,
      contact: formData.contact,
      biography: formData.biography,
      is_active: formData.is_active,
    }

    if (profilePictureBase64) {
      input.profile_picture = profilePictureBase64
    } else if (formData.profile_picture_url) {
      input.profile_picture_url = formData.profile_picture_url
    }

    await teamStore.createTeam(input)
    showSuccess('Team member created successfully')
    router.push('/team')
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create team member'
    showError(message)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  breadcrumbStore.setBreadcrumb([
    { title: 'Dashboard', path: '/' },
    { title: 'Team', path: '/team' },
    { title: 'New member', path: '/team/create' },
  ])

  if (teamStore.socialMediaPlatforms.length === 0) {
    await teamStore.fetchSocialMediaPlatforms()
  }
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
  to {
    transform: rotate(360deg);
  }
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

/* Grid of fields */
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
  min-height: 120px;
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

.gn-form__toggle-input:focus-visible + .gn-form__toggle-track {
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.2);
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

  .gn-form__hero {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }

  .gn-form__hero-actions {
    width: 100%;
  }

  .gn-form__hero-actions .gn-form__btn {
    flex: 1;
    justify-content: center;
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
