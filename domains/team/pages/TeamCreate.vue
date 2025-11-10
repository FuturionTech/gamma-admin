<template>
  <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
    <div class="d-flex flex-column flex-column-fluid">
      <div id="kt_app_content" class="app-content flex-column-fluid">
        <div id="kt_app_content_container" class="app-container container-fluid">
          <form @submit.prevent="handleSubmit">
            <div class="row g-5">
              <!-- Main Form Card -->
              <div class="col-xl-8">
                <div class="card mb-5">
                  <div class="card-header">
                    <h3 class="card-title">Basic Information</h3>
                  </div>
                  <div class="card-body">
                    <!-- Name -->
                    <div class="mb-5">
                      <label class="form-label required">Full Name</label>
                      <input
                        v-model="formData.name"
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': errors.name }"
                        placeholder="Enter full name"
                        required
                      />
                      <div v-if="errors.name" class="invalid-feedback">
                        {{ errors.name }}
                      </div>
                    </div>

                    <!-- Role -->
                    <div class="mb-5">
                      <label class="form-label">Role / Position</label>
                      <input
                        v-model="formData.role"
                        type="text"
                        class="form-control"
                        placeholder="e.g. CEO, CTO, Developer"
                      />
                    </div>

                    <!-- Email -->
                    <div class="mb-5">
                      <label class="form-label">Email Address</label>
                      <input
                        v-model="formData.email"
                        type="email"
                        class="form-control"
                        :class="{ 'is-invalid': errors.email }"
                        placeholder="email@example.com"
                      />
                      <div v-if="errors.email" class="invalid-feedback">
                        {{ errors.email }}
                      </div>
                    </div>

                    <!-- Contact -->
                    <div class="mb-5">
                      <label class="form-label">Phone Number</label>
                      <input
                        v-model="formData.contact"
                        type="tel"
                        class="form-control"
                        placeholder="+1 234 567 8900"
                      />
                    </div>

                    <!-- Biography -->
                    <div class="mb-5">
                      <label class="form-label">Biography</label>
                      <textarea
                        v-model="formData.biography"
                        class="form-control"
                        rows="5"
                        placeholder="Enter a brief biography..."
                      ></textarea>
                      <div class="form-text">
                        {{ formData.biography?.length || 0 }} characters
                      </div>
                    </div>

                    <!-- Order -->
                    <div class="mb-5">
                      <label class="form-label">Display Order</label>
                      <input
                        v-model.number="formData.order"
                        type="number"
                        class="form-control"
                        min="0"
                        placeholder="0"
                      />
                      <div class="form-text">
                        Display order (lower numbers appear first)
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Social Links Card -->
                <div class="card">
                  <div class="card-header">
                    <h3 class="card-title">Social Links</h3>
                  </div>
                  <div class="card-body">
                    <SocialLinksManager
                      v-model="formData.socialLinks"
                      :platforms="teamStore.socialMediaPlatforms"
                    />
                  </div>
                </div>
              </div>

              <!-- Sidebar -->
              <div class="col-xl-4">
                <!-- Photo Upload Card -->
                <div class="card mb-5">
                  <div class="card-header">
                    <h3 class="card-title">Profile Picture</h3>
                  </div>
                  <div class="card-body">
                    <PhotoUpload
                      v-model="formData.profile_picture_url"
                      @fileSelected="handlePhotoSelected"
                    />
                  </div>
                </div>

                <!-- Settings Card -->
                <div class="card">
                  <div class="card-header">
                    <h3 class="card-title">Settings</h3>
                  </div>
                  <div class="card-body">
                    <!-- Active Status -->
                    <div class="form-check form-switch form-check-custom form-check-solid">
                      <input
                        v-model="formData.is_active"
                        class="form-check-input"
                        type="checkbox"
                        id="is_active"
                      />
                      <label class="form-check-label" for="is_active">
                        Active Member
                      </label>
                    </div>
                    <div class="form-text mt-2">
                      Enable or disable this team member on the website
                    </div>
                  </div>
                </div>

                <!-- Actions Card -->
                <div class="card mt-5">
                  <div class="card-body d-flex flex-column gap-3">
                    <button
                      type="submit"
                      class="btn btn-primary w-100"
                      :disabled="isSubmitting"
                    >
                      <span v-if="!isSubmitting">
                        <i class="ki-duotone ki-check fs-2"></i>
                        Create Team Member
                      </span>
                      <span v-else>
                        <span class="spinner-border spinner-border-sm me-2"></span>
                        Saving...
                      </span>
                    </button>

                    <NuxtLink
                      to="/team/list"
                      class="btn btn-light w-100"
                    >
                      <i class="ki-duotone ki-cross fs-2">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                      Cancel
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTeamStore } from '../stores/useTeamStore'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import type { TeamFormData } from '../types'

const router = useRouter()
const teamStore = useTeamStore()
const breadcrumbStore = useBreadcrumbStore()
const { showSuccess, showError } = useNotification()

const isSubmitting = ref(false)
const errors = reactive<Record<string, string>>({})

const formData = reactive<TeamFormData>({
  name: '',
  role: null,
  email: null,
  contact: null,
  biography: null,
  profile_picture_url: null,
  order: 0,
  is_active: true,
  socialLinks: []
})

const handlePhotoSelected = (file: File | null) => {
  // Store the file for upload
  formData.profilePictureFile = file
}

const validateForm = (): boolean => {
  // Reset errors
  Object.keys(errors).forEach(key => delete errors[key])

  let isValid = true

  // Name is required
  if (!formData.name || formData.name.trim() === '') {
    errors.name = 'Name is required'
    isValid = false
  }

  // Email validation
  if (formData.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      errors.email = 'Invalid email format'
      isValid = false
    }
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    showError('Please correct the form errors')
    return
  }

  isSubmitting.value = true

  try {
    // TODO: Handle file upload if profilePictureFile exists
    // For now, we'll use the profile_picture_url directly

    const input = {
      name: formData.name,
      role: formData.role,
      email: formData.email,
      contact: formData.contact,
      biography: formData.biography,
      profile_picture_url: formData.profile_picture_url,
      order: formData.order,
      is_active: formData.is_active
    }

    await teamStore.createTeam(input)

    showSuccess('Team member created successfully')
    router.push('/team/list')
  } catch (error: any) {
    console.error('Error creating team member:', error)
    showError(error.message || 'Failed to create team member')
  } finally {
    isSubmitting.value = false
  }
}

// Lifecycle
onMounted(async () => {
  breadcrumbStore.setBreadcrumb([
    { title: 'Home', path: '/' },
    { title: 'Team', path: '/team/list' },
    { title: 'Create Team Member', path: '/team/create' }
  ])

  // Fetch social media platforms if not loaded
  if (teamStore.socialMediaPlatforms.length === 0) {
    await teamStore.fetchSocialMediaPlatforms()
  }
})
</script>
