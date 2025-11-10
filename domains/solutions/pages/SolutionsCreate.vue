<template>
  <!-- Page Header -->
  <PageHeader title="Create Solution" />

  <div class="card">
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
      </div>

      <div class="card-body">
        <!-- Loading State -->
        <div v-if="isSubmitting" class="text-center py-20">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <!-- Form -->
        <form v-else @submit.prevent="handleSubmit">
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
import { ref, reactive, computed } from 'vue'
import { useSolutionsStore } from '../stores/useSolutionsStore'
import type { SolutionFormData } from '../types'
import SolutionFormBasicInfo from '../components/SolutionFormBasicInfo.vue'
import SolutionFormVisuals from '../components/SolutionFormVisuals.vue'
import SolutionFormSettings from '../components/SolutionFormSettings.vue'

definePageMeta({
  layout: 'default',
  middleware: ['auth']
})

const solutionsStore = useSolutionsStore()
const router = useRouter()
const { showSuccess, showError } = useNotification()

const formData = reactive<SolutionFormData>({
  application_id: '1',
  title: '',
  subtitle: null,
  description: null,
  slug: null,
  icon: null,
  icon_color: '#3B82F6',
  hero_image_url: null,
  order: 0,
  is_active: true
})

const errors = ref<Record<string, string>>({})
const activeTab = ref<'basic' | 'visuals' | 'settings'>('basic')
const isSubmitting = ref(false)

const isFormValid = computed(() => {
  return formData.title.trim().length > 0
})

const validateForm = (): boolean => {
  errors.value = {}

  if (!formData.title || formData.title.trim().length === 0) {
    errors.value.title = 'Title is required'
    return false
  }

  return true
}

const handleSubmit = async () => {
  if (!validateForm()) {
    activeTab.value = 'basic'
    return
  }

  isSubmitting.value = true

  try {
    const solution = await solutionsStore.createSolution(formData)
    showSuccess('Solution created successfully')
    router.push('/solutions')
  } catch (error: any) {
    console.error('Error creating solution:', error)
    showError(error.message || 'Failed to create solution')
  } finally {
    isSubmitting.value = false
  }
}
</script>
