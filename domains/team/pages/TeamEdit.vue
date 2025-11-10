<template>
  <!-- Page Header -->
  <PageHeader
    title="Edit Team Member"
    subtitle="Update team member information"
  />

  <!-- Loading State -->
  <div v-if="isLoading" class="row g-5">
    <!-- Main Form Skeleton -->
    <div class="col-xl-8">
      <div class="card mb-5">
        <div class="card-header">
          <h3 class="card-title">Basic Information</h3>
        </div>
        <div class="card-body">
          <FormSkeleton :fields="5" :showActions="false" />
        </div>
      </div>
    </div>

    <!-- Sidebar Skeleton -->
    <div class="col-xl-4">
      <div class="card mb-5">
        <div class="card-header">
          <h3 class="card-title">Photo</h3>
        </div>
        <div class="card-body">
          <FormSkeleton :fields="1" :showActions="false" />
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Settings</h3>
        </div>
        <div class="card-body">
          <FormSkeleton :fields="2" :showActions="true" />
        </div>
      </div>
    </div>
  </div>

  <!-- Form -->
  <form v-else-if="formData" @submit.prevent="handleSubmit">
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

          <!-- Metadata Card -->
          <div class="card mt-5" v-if="teamStore.currentTeam">
            <div class="card-header">
              <h3 class="card-title">Metadata</h3>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <span class="text-muted">Created At:</span>
                <div class="fw-bold">{{ formatDate(teamStore.currentTeam.created_at) }}</div>
              </div>
              <div>
                <span class="text-muted">Updated At:</span>
                <div class="fw-bold">{{ formatDate(teamStore.currentTeam.updated_at) }}</div>
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
                  Update Team Member
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

              <button
                type="button"
                class="btn btn-light-danger w-100"
                @click="handleDelete"
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
        </div>
      </div>
    </form>

  <!-- Error State -->
  <div v-else class="alert alert-danger">
    Failed to load team member
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTeamStore } from '../stores/useTeamStore'
import { useTeamActions } from '../composables/useTeamActions'
import { useTeamFormatters } from '../composables/useTeamFormatters'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import type { TeamFormData, Team } from '../types'

const router = useRouter()
const route = useRoute()
const teamStore = useTeamStore()
const breadcrumbStore = useBreadcrumbStore()
const { showSuccess, showError } = useNotification()
const { confirmAndDeleteTeam } = useTeamActions()
const { formatDate } = useTeamFormatters()

const teamId = route.params.id as string
const isLoading = ref(true)
const isSubmitting = ref(false)
const errors = reactive<Record<string, string>>({})

const formData = reactive<TeamFormData | null>(null)

const loadTeam = async () => {
  try {
    isLoading.value = true
    const team = await teamStore.fetchTeam(teamId)

    if (team) {
      Object.assign(formData || {}, {
        name: team.name,
        role: team.role,
        email: team.email,
        contact: team.contact,
        biography: team.biography,
        profile_picture_url: team.profile_picture_url,
        order: team.order,
        is_active: team.is_active,
        socialLinks: team.socialMediaLinks?.map(link => ({
          id: link.id,
          platform_id: link.platform_id,
          url: link.url
        })) || []
      })
    }
  } catch (error) {
    showError('Failed to load team member')
  } finally {
    isLoading.value = false
  }
}

const handlePhotoSelected = (file: File | null) => {
  // Store the file for upload
  if (formData) {
    formData.profilePictureFile = file
  }
}

const validateForm = (): boolean => {
  // Reset errors
  Object.keys(errors).forEach(key => delete errors[key])

  let isValid = true

  if (!formData) return false

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
  if (!validateForm() || !formData) {
    showError('Please correct the form errors')
    return
  }

  isSubmitting.value = true

  try {
    // TODO: Handle file upload if profilePictureFile exists

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

    await teamStore.updateTeam(teamId, input)

    showSuccess('Team member updated successfully')
    router.push('/team/list')
  } catch (error: any) {
    console.error('Error updating team member:', error)
    showError(error.message || 'Failed to update team member')
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = async () => {
  if (teamStore.currentTeam) {
    const deleted = await confirmAndDeleteTeam(teamStore.currentTeam)
    if (deleted) {
      router.push('/team/list')
    }
  }
}

// Lifecycle
onMounted(async () => {
  breadcrumbStore.setBreadcrumb([
    { title: 'Home', path: '/' },
    { title: 'Team', path: '/team/list' },
    { title: 'Edit Team Member', path: `/team/edit/${teamId}` }
  ])

  // Initialize formData
  Object.assign(formData || {}, {
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

  // Fetch social media platforms if not loaded
  if (teamStore.socialMediaPlatforms.length === 0) {
    await teamStore.fetchSocialMediaPlatforms()
  }

  await loadTeam()
})
</script>
