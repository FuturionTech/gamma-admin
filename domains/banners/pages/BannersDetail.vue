<template>
  <!-- Loading State -->
  <div v-if="isLoading" class="card">
      <div class="card-body">
        <div class="text-center py-20">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="bannersStore.hasError"
      class="alert alert-danger d-flex align-items-center p-5"
    >
      <i class="ki-duotone ki-shield-cross fs-2hx text-danger me-4">
        <span class="path1"></span>
        <span class="path2"></span>
        <span class="path3"></span>
      </i>
      <div class="d-flex flex-column">
        <h4 class="mb-1 text-dark">Error</h4>
        <span>{{ bannersStore.error }}</span>
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="banner">
      <!-- Header Card -->
      <div class="card mb-5">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start mb-5">
            <div class="flex-grow-1">
              <!-- Status Badge -->
              <div class="mb-3 d-flex gap-2">
                <span
                  class="badge"
                  :class="getStatusBadgeClass(banner.is_active)"
                >
                  {{ getStatusText(banner.is_active) }}
                </span>
                <span
                  class="badge"
                  :class="getOrderBadgeClass(banner.order)"
                >
                  Position #{{ banner.order + 1 }}
                </span>
                <span
                  class="badge"
                  :class="getCtaBadgeClass(banner.cta_text, banner.cta_url)"
                >
                  {{ getCtaStatusText(banner.cta_text, banner.cta_url) }}
                </span>
              </div>

              <!-- Title -->
              <h1 class="fw-bold text-gray-900 mb-3">
                {{ banner.title }}
              </h1>

              <!-- Subtitle -->
              <p v-if="banner.subtitle" class="text-gray-700 fs-4 mb-4">
                {{ banner.subtitle }}
              </p>

              <!-- Meta Info -->
              <div class="d-flex flex-wrap gap-5 text-gray-600">
                <div class="d-flex align-items-center">
                  <i class="ki-duotone ki-calendar fs-3 me-2">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                  <span>Created on {{ formatDate(banner.created_at) }}</span>
                </div>
                <div class="d-flex align-items-center">
                  <i class="ki-duotone ki-time fs-3 me-2">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                  <span>Updated on {{ formatDate(banner.updated_at) }}</span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="d-flex gap-2">
              <button
                type="button"
                class="btn btn-sm btn-light-primary"
                @click="handleToggleStatus"
              >
                <i class="ki-duotone ki-toggle-on fs-3">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
                {{ banner.is_active ? 'Deactivate' : 'Activate' }}
              </button>
              <NuxtLink
                :to="`/banners/${banner.id}/edit`"
                class="btn btn-sm btn-light-primary"
              >
                <i class="ki-duotone ki-pencil fs-3">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
                Edit
              </NuxtLink>
              <button
                type="button"
                class="btn btn-sm btn-light-danger"
                @click="handleDelete"
              >
                <i class="ki-duotone ki-trash fs-3">
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

      <!-- Banner Preview -->
      <div class="card mb-5">
        <div class="card-header">
          <h3 class="card-title">Banner Preview</h3>
        </div>
        <div class="card-body p-0">
          <div class="banner-preview-large position-relative" :style="bannerPreviewStyle">
            <div class="banner-overlay position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-white p-10">
              <div class="text-center">
                <h2 class="fw-bold display-3 mb-4 text-white text-shadow">
                  {{ banner.title }}
                </h2>
                <p v-if="banner.subtitle" class="fs-2 text-white text-shadow mb-6">
                  {{ banner.subtitle }}
                </p>
                <button
                  v-if="hasCta(banner.cta_text, banner.cta_url)"
                  class="btn btn-primary btn-lg"
                >
                  {{ banner.cta_text }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Details Card -->
      <div class="card mb-5">
        <div class="card-header">
          <h3 class="card-title">Banner Details</h3>
        </div>
        <div class="card-body">
          <div class="row g-5">
            <!-- Image Section -->
            <div class="col-lg-6">
              <h4 class="fw-bold mb-4">Background Image</h4>
              <div class="mb-3">
                <label class="text-gray-600 fw-semibold mb-2">Image URL:</label>
                <div class="bg-light-primary rounded p-3">
                  <code class="text-primary">
                    {{ banner.image_url || 'No image' }}
                  </code>
                </div>
              </div>
              <div v-if="banner.image_url">
                <img
                  :src="banner.image_url"
                  :alt="banner.title"
                  class="img-thumbnail w-100"
                  style="max-height: 300px; object-fit: cover;"
                />
              </div>
            </div>

            <!-- CTA Section -->
            <div class="col-lg-6">
              <h4 class="fw-bold mb-4">Call-to-Action (CTA)</h4>

              <div v-if="hasCta(banner.cta_text, banner.cta_url)">
                <div class="mb-4">
                  <label class="text-gray-600 fw-semibold mb-2">Button Text:</label>
                  <div class="bg-light-success rounded p-3">
                    <span class="fw-bold text-success">{{ banner.cta_text }}</span>
                  </div>
                </div>

                <div class="mb-4">
                  <label class="text-gray-600 fw-semibold mb-2">Button URL:</label>
                  <div class="bg-light-success rounded p-3">
                    <code class="text-success">{{ banner.cta_url }}</code>
                  </div>
                </div>

                <div class="alert alert-success d-flex align-items-center">
                  <i class="ki-duotone ki-check-circle fs-2hx text-success me-3">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                  <span>CTA active and configured</span>
                </div>
              </div>

              <div v-else>
                <div class="alert alert-light d-flex align-items-center">
                  <i class="ki-duotone ki-information fs-2hx text-gray-500 me-3">
                    <span class="path1"></span>
                    <span class="path2"></span>
                    <span class="path3"></span>
                  </i>
                  <span>No CTA configured for this banner</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Settings Card -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Settings</h3>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-row-bordered gy-5">
              <tbody>
                <tr>
                  <td class="fw-bold text-gray-700">ID</td>
                  <td class="text-gray-600">{{ banner.id }}</td>
                </tr>
                <tr>
                  <td class="fw-bold text-gray-700">Application</td>
                  <td class="text-gray-600">
                    <span v-if="banner.application">
                      {{ banner.application.name }} (ID: {{ banner.application.id }})
                    </span>
                    <span v-else>{{ banner.application_id }}</span>
                  </td>
                </tr>
                <tr>
                  <td class="fw-bold text-gray-700">Display Order</td>
                  <td>
                    <span class="badge" :class="getOrderBadgeClass(banner.order)">
                      Position #{{ banner.order + 1 }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td class="fw-bold text-gray-700">Status</td>
                  <td>
                    <span class="badge" :class="getStatusBadgeClass(banner.is_active)">
                      {{ getStatusText(banner.is_active) }}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td class="fw-bold text-gray-700">Created Date</td>
                  <td class="text-gray-600">{{ formatDateTime(banner.created_at) }}</td>
                </tr>
                <tr>
                  <td class="fw-bold text-gray-700">Last Modified</td>
                  <td class="text-gray-600">{{ formatDateTime(banner.updated_at) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Not Found State -->
    <div v-else class="card">
      <div class="card-body">
        <div class="alert alert-warning d-flex align-items-center">
          <i class="ki-duotone ki-information fs-2hx text-warning me-3">
            <span class="path1"></span>
            <span class="path2"></span>
            <span class="path3"></span>
          </i>
          <span>Banner not found</span>
        </div>
        <NuxtLink to="/banners" class="btn btn-primary">
          Back to List
        </NuxtLink>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBannersStore } from '../stores/useBannersStore'
import { useBannersActions } from '../composables/useBannersActions'
import { useBannersFormatters } from '../composables/useBannersFormatters'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import type { Banner } from '../types'

const route = useRoute()
const router = useRouter()
const bannersStore = useBannersStore()
const breadcrumbStore = useBreadcrumbStore()
const { confirmAndDeleteBanner, toggleBannerStatus } = useBannersActions()
const {
  formatDate,
  formatDateTime,
  getStatusBadgeClass,
  getStatusText,
  hasCta,
  getCtaBadgeClass,
  getCtaStatusText,
  formatImageUrl,
  getOrderBadgeClass
} = useBannersFormatters()

const bannerId = route.params.id as string

// State
const banner = ref<Banner | null>(null)
const isLoading = ref(true)

// Banner preview style
const bannerPreviewStyle = computed(() => ({
  backgroundImage: `url(${formatImageUrl(banner.value?.image_url)})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  minHeight: '400px'
}))

// Load banner
const loadBanner = async () => {
  isLoading.value = true
  try {
    const loadedBanner = await bannersStore.fetchBanner(bannerId)
    if (loadedBanner) {
      banner.value = loadedBanner

      // Update breadcrumb
      breadcrumbStore.setBreadcrumb([
        { title: 'Home', path: '/' },
        { title: 'Banners', path: '/banners' },
        { title: loadedBanner.title, path: `/banners/${bannerId}` }
      ])
    }
  } catch (error: any) {
    console.error('Error loading banner:', error)
  } finally {
    isLoading.value = false
  }
}

// Handle delete
const handleDelete = async () => {
  if (!banner.value) return

  const success = await confirmAndDeleteBanner(banner.value)
  if (success) {
    router.push('/banners')
  }
}

// Handle toggle status
const handleToggleStatus = async () => {
  if (!banner.value) return

  await toggleBannerStatus(banner.value)
  await loadBanner() // Reload to get updated data
}

// Lifecycle
onMounted(() => {
  loadBanner()
})
</script>

<style scoped>
.banner-preview-large {
  border-radius: 0.475rem;
}

.banner-overlay {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3),
    rgba(0, 0, 0, 0.5)
  );
  border-radius: 0.475rem;
}

.text-shadow {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}
</style>
