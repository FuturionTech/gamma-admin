<template>
  <!-- Page Header -->
  <PageHeader title="Edit Solution" />

    <!-- Loading State -->
    <div v-if="isLoading" class="card">
      <div class="card-body text-center py-20">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>

    <!-- Edit Form -->
    <div v-else-if="formData" class="card">
      <!-- Tabs Navigation -->
      <div class="card-header border-0">
        <div class="card-title">
          <ul class="nav nav-tabs nav-line-tabs nav-stretch fs-6 border-0 fw-bold" role="tablist">
            <li class="nav-item" role="presentation">
              <a
                class="nav-link"
                :class="{ active: activeTab === 'basic' }"
                @click.prevent="activeTab = 'basic'"
              >
                <i class="ki-duotone ki-note-2 fs-2 me-2">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
                Basic Information
              </a>
            </li>
            <li class="nav-item" role="presentation">
              <a
                class="nav-link"
                :class="{ active: activeTab === 'visuals' }"
                @click.prevent="activeTab = 'visuals'"
              >
                <i class="ki-duotone ki-picture fs-2 me-2">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
                Visuals
              </a>
            </li>
            <li class="nav-item" role="presentation">
              <a
                class="nav-link"
                :class="{ active: activeTab === 'settings' }"
                @click.prevent="activeTab = 'settings'"
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

        <!-- Quick Actions -->
        <div class="card-toolbar">
          <div class="d-flex gap-2">
            <NuxtLink
              :to="`/solutions/${solutionId}/features`"
              class="btn btn-sm btn-light-primary"
            >
              <i class="ki-duotone ki-star fs-3">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              Manage Features
            </NuxtLink>
            <NuxtLink
              :to="`/solutions/${solutionId}/benefits`"
              class="btn btn-sm btn-light-success"
            >
              <i class="ki-duotone ki-medal-star fs-3">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              Manage Benefits
            </NuxtLink>
          </div>
        </div>
      </div>

      <div class="card-body">
        <!-- Form -->
        <form @submit.prevent="handleSubmit">
          <!-- Basic Info Tab -->
          <div v-show="activeTab === 'basic'">
            <SolutionFormBasicInfo
              :formData="formData"
              :errors="errors"
              @update:formData="formData = $event"
            />
          </div>

          <!-- Visuals Tab -->
          <div v-show="activeTab === 'visuals'">
            <SolutionFormVisuals
              :formData="formData"
              :errors="errors"
            />
          </div>

          <!-- Settings Tab -->
          <div v-show="activeTab === 'settings'">
            <SolutionFormSettings
              :formData="formData"
              :errors="errors"
            />
          </div>

          <!-- Form Actions -->
          <div class="d-flex justify-content-end gap-3 mt-10 pt-10 border-top">
            <NuxtLink
              to="/solutions"
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

    <!-- Error State -->
    <div v-else class="card">
      <div class="card-body text-center py-20">
        <i class="ki-duotone ki-cross-circle fs-5x text-danger mb-5">
          <span class="path1"></span>
          <span class="path2"></span>
        </i>
        <div class="fw-bold fs-3 text-gray-600 mb-2">
          Solution not found
        </div>
        <NuxtLink to="/solutions" class="btn btn-primary mt-5">
          Back to Solutions
        </NuxtLink>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useSolutionsStore } from '../stores/useSolutionsStore'
import type { SolutionFormData } from '../types'
import SolutionFormBasicInfo from '../components/SolutionFormBasicInfo.vue'
import SolutionFormVisuals from '../components/SolutionFormVisuals.vue'
import SolutionFormSettings from '../components/SolutionFormSettings.vue'

definePageMeta({
  layout: 'default',
  middleware: ['auth']
})

const route = useRoute()
const router = useRouter()
const solutionsStore = useSolutionsStore()
const { showSuccess, showError } = useNotification()

const solutionId = computed(() => route.params.id as string)

const formData = ref<SolutionFormData | null>(null)
const errors = ref<Record<string, string>>({})
const activeTab = ref<'basic' | 'visuals' | 'settings'>('basic')
const isLoading = ref(true)
const isSubmitting = ref(false)

const isFormValid = computed(() => {
  return formData.value?.title && formData.value.title.trim().length > 0
})

const loadSolution = async () => {
  isLoading.value = true
  try {
    const solution = await solutionsStore.fetchSolutionById(solutionId.value)
    if (solution) {
      formData.value = {
        application_id: solution.application_id,
        title: solution.title,
        subtitle: solution.subtitle,
        description: solution.description,
        slug: solution.slug,
        icon: solution.icon,
        icon_color: solution.icon_color,
        hero_image_url: solution.hero_image_url,
        order: solution.order,
        is_active: solution.is_active
      }
    }
  } catch (error: any) {
    console.error('Error loading solution:', error)
    showError(error.message || 'Failed to load solution')
  } finally {
    isLoading.value = false
  }
}

const validateForm = (): boolean => {
  errors.value = {}

  if (!formData.value?.title || formData.value.title.trim().length === 0) {
    errors.value.title = 'Title is required'
    return false
  }

  return true
}

const handleSubmit = async () => {
  if (!validateForm() || !formData.value) {
    activeTab.value = 'basic'
    return
  }

  isSubmitting.value = true

  try {
    await solutionsStore.updateSolution(solutionId.value, formData.value)
    showSuccess('Solution updated successfully')
    router.push('/solutions')
  } catch (error: any) {
    console.error('Error updating solution:', error)
    showError(error.message || 'Failed to update solution')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  loadSolution()
})
</script>
