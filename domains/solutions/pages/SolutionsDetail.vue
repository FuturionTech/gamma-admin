<template>
  <!-- Page Header -->
  <PageHeader
    :title="solution ? solution.title : 'Loading...'"
    subtitle="Solution details"
  />

  <!-- Loading State -->
  <SolutionsDetailSkeleton v-if="solutionsStore.isLoading" />

  <!-- Error State -->
  <div
    v-else-if="solutionsStore.hasError"
    class="alert alert-danger d-flex align-items-center p-5"
  >
    <i class="ki-duotone ki-shield-cross fs-2hx text-danger me-4">
      <span class="path1"></span>
      <span class="path2"></span>
      <span class="path3"></span>
    </i>
    <div class="d-flex flex-column">
      <h4 class="mb-1 text-dark">An error occurred</h4>
      <span>{{ solutionsStore.error }}</span>
    </div>
  </div>

  <!-- Solution Details -->
  <div v-else-if="solution" class="row g-5 g-xl-8">
    <!-- Main Details Column -->
    <div class="col-xl-8">
      <!-- Hero Image Card -->
      <div v-if="solution.hero_image_url" class="card mb-5 mb-xl-8">
        <div class="card-body p-0">
          <img
            :src="solution.hero_image_url"
            :alt="solution.title"
            class="w-100 rounded"
            style="max-height: 400px; object-fit: cover;"
          />
        </div>
      </div>

      <!-- Basic Information Card -->
      <div class="card mb-5 mb-xl-8">
        <div class="card-header border-0 pt-5">
          <h3 class="card-title align-items-start flex-column">
            <span class="card-label fw-bold fs-3 mb-1">
              Basic Information
            </span>
          </h3>
          <div class="card-toolbar">
            <NuxtLink
              :to="`/solutions/${solution.id}/edit`"
              class="btn btn-sm btn-light-primary"
            >
              <i class="ki-duotone ki-pencil fs-3">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              Edit
            </NuxtLink>
          </div>
        </div>

        <div class="card-body py-3">
          <!-- Icon with Color -->
          <div class="mb-7" v-if="solution.icon">
            <label class="fw-bold fs-6 mb-2">Icon</label>
            <div class="d-flex align-items-center gap-4">
              <div
                class="symbol symbol-50px"
                :style="getIconColorStyle(solution)"
              >
                <img :src="solution.icon" :alt="solution.title" />
              </div>
              <div v-if="solution.icon_color" class="d-flex align-items-center gap-2">
                <span class="fw-semibold">Color:</span>
                <div
                  class="border border-gray-300 rounded"
                  style="width: 32px; height: 32px;"
                  :style="{ backgroundColor: solution.icon_color }"
                ></div>
                <code class="bg-light px-2 py-1 rounded">{{ solution.icon_color }}</code>
              </div>
            </div>
          </div>

          <!-- Title -->
          <div class="mb-7">
            <label class="fw-bold fs-6 mb-2">Title</label>
            <div class="fs-4 text-gray-800">{{ solution.title }}</div>
          </div>

          <!-- Subtitle -->
          <div class="mb-7" v-if="solution.subtitle">
            <label class="fw-bold fs-6 mb-2">Subtitle</label>
            <div class="fs-5 text-gray-700">{{ solution.subtitle }}</div>
          </div>

          <!-- Description -->
          <div class="mb-7" v-if="solution.description">
            <label class="fw-bold fs-6 mb-2">Description</label>
            <div class="text-gray-700 fs-6" style="white-space: pre-wrap;">{{ solution.description }}</div>
          </div>

          <!-- Slug -->
          <div class="mb-7">
            <label class="fw-bold fs-6 mb-2">Slug</label>
            <div class="text-gray-700">
              <code class="bg-light p-2 rounded">{{ solution.slug }}</code>
            </div>
          </div>
        </div>
      </div>

      <!-- Features Card -->
      <div class="card mb-5 mb-xl-8">
        <div class="card-header border-0 pt-5">
          <h3 class="card-title align-items-start flex-column">
            <span class="card-label fw-bold fs-3 mb-1">
              Features
            </span>
            <span class="text-muted mt-1 fw-semibold fs-7">
              {{ getFeatureCount(solution) }} feature(s)
            </span>
          </h3>
          <div class="card-toolbar">
            <NuxtLink
              :to="`/solutions/${solution.id}/features`"
              class="btn btn-sm btn-light-primary"
            >
              <i class="ki-duotone ki-setting-2 fs-3">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              Manage Features
            </NuxtLink>
          </div>
        </div>

        <div class="card-body py-3">
          <!-- Features List -->
          <div v-if="solution.features && solution.features.length > 0">
            <div
              v-for="feature in solution.features"
              :key="feature.id"
              class="d-flex align-items-start gap-4 mb-5 pb-5 border-bottom border-gray-200"
            >
              <div v-if="feature.icon" class="symbol symbol-50px">
                <img :src="feature.icon" :alt="feature.title" />
              </div>
              <div class="flex-grow-1">
                <h4 class="fw-bold text-gray-800 mb-2">{{ feature.title }}</h4>
                <p v-if="feature.description" class="text-gray-600 mb-0">
                  {{ feature.description }}
                </p>
              </div>
            </div>
          </div>
          <!-- Empty State -->
          <div v-else class="text-center py-10">
            <i class="ki-duotone ki-information-5 fs-5x text-muted mb-5">
              <span class="path1"></span>
              <span class="path2"></span>
              <span class="path3"></span>
            </i>
            <p class="text-muted fs-6 mb-5">No features added yet</p>
            <NuxtLink
              :to="`/solutions/${solution.id}/features`"
              class="btn btn-sm btn-primary"
            >
              Add First Feature
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Benefits Card -->
      <div class="card mb-5 mb-xl-8">
        <div class="card-header border-0 pt-5">
          <h3 class="card-title align-items-start flex-column">
            <span class="card-label fw-bold fs-3 mb-1">
              Benefits
            </span>
            <span class="text-muted mt-1 fw-semibold fs-7">
              {{ getBenefitCount(solution) }} benefit(s)
            </span>
          </h3>
          <div class="card-toolbar">
            <NuxtLink
              :to="`/solutions/${solution.id}/benefits`"
              class="btn btn-sm btn-light-success"
            >
              <i class="ki-duotone ki-setting-2 fs-3">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              Manage Benefits
            </NuxtLink>
          </div>
        </div>

        <div class="card-body py-3">
          <!-- Benefits List -->
          <div v-if="solution.benefits && solution.benefits.length > 0">
            <div
              v-for="benefit in solution.benefits"
              :key="benefit.id"
              class="d-flex align-items-start gap-4 mb-5 pb-5 border-bottom border-gray-200"
            >
              <div v-if="benefit.icon" class="symbol symbol-50px">
                <img :src="benefit.icon" :alt="benefit.title" />
              </div>
              <div class="flex-grow-1">
                <h4 class="fw-bold text-gray-800 mb-2">{{ benefit.title }}</h4>
                <p v-if="benefit.description" class="text-gray-600 mb-0">
                  {{ benefit.description }}
                </p>
              </div>
            </div>
          </div>
          <!-- Empty State -->
          <div v-else class="text-center py-10">
            <i class="ki-duotone ki-information-5 fs-5x text-muted mb-5">
              <span class="path1"></span>
              <span class="path2"></span>
              <span class="path3"></span>
            </i>
            <p class="text-muted fs-6 mb-5">No benefits added yet</p>
            <NuxtLink
              :to="`/solutions/${solution.id}/benefits`"
              class="btn btn-sm btn-success"
            >
              Add First Benefit
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Sidebar Column -->
    <div class="col-xl-4">
      <!-- Settings Card -->
      <div class="card mb-5 mb-xl-8">
        <div class="card-header border-0 pt-5">
          <h3 class="card-title align-items-start flex-column">
            <span class="card-label fw-bold fs-3 mb-1">
              Settings
            </span>
          </h3>
        </div>

        <div class="card-body py-3">
          <!-- Status -->
          <div class="mb-7">
            <label class="fw-bold fs-6 mb-2">Status</label>
            <div>
              <span
                class="badge badge-lg"
                :class="getStatusBadgeClass(solution.is_active)"
              >
                {{ getStatusText(solution.is_active) }}
              </span>
            </div>
          </div>

          <!-- Order -->
          <div class="mb-7">
            <label class="fw-bold fs-6 mb-2">Order</label>
            <div class="text-gray-800">{{ solution.order }}</div>
          </div>

          <!-- Application -->
          <div class="mb-7" v-if="solution.application">
            <label class="fw-bold fs-6 mb-2">Application</label>
            <div class="text-gray-800">{{ solution.application.name }}</div>
          </div>

          <!-- Created At -->
          <div class="mb-7">
            <label class="fw-bold fs-6 mb-2">Created At</label>
            <div class="text-gray-700">
              {{ formatDateTime(solution.created_at) }}
            </div>
            <div class="text-muted fs-7">
              {{ formatRelativeDate(solution.created_at) }}
            </div>
          </div>

          <!-- Updated At -->
          <div class="mb-7">
            <label class="fw-bold fs-6 mb-2">Updated At</label>
            <div class="text-gray-700">
              {{ formatDateTime(solution.updated_at) }}
            </div>
            <div class="text-muted fs-7">
              {{ formatRelativeDate(solution.updated_at) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Actions Card -->
      <div class="card">
        <div class="card-header border-0 pt-5">
          <h3 class="card-title align-items-start flex-column">
            <span class="card-label fw-bold fs-3 mb-1">
              Actions
            </span>
          </h3>
        </div>

        <div class="card-body py-3">
          <div class="d-flex flex-column gap-3">
            <!-- Edit -->
            <NuxtLink
              :to="`/solutions/${solution.id}/edit`"
              class="btn btn-light-primary"
            >
              <i class="ki-duotone ki-pencil fs-3">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              Edit
            </NuxtLink>

            <!-- Manage Features -->
            <NuxtLink
              :to="`/solutions/${solution.id}/features`"
              class="btn btn-light-info"
            >
              <i class="ki-duotone ki-star fs-3">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              Manage Features
            </NuxtLink>

            <!-- Manage Benefits -->
            <NuxtLink
              :to="`/solutions/${solution.id}/benefits`"
              class="btn btn-light-success"
            >
              <i class="ki-duotone ki-medal-star fs-3">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
                <span class="path4"></span>
              </i>
              Manage Benefits
            </NuxtLink>

            <!-- Toggle Status -->
            <button
              type="button"
              class="btn"
              :class="solution.is_active ? 'btn-light-warning' : 'btn-light-success'"
              @click="handleToggleStatus"
            >
              <i class="ki-duotone ki-toggle-on fs-3">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              {{ solution.is_active ? 'Deactivate' : 'Activate' }}
            </button>

            <!-- Duplicate -->
            <button
              type="button"
              class="btn btn-light-info"
              @click="handleDuplicate"
            >
              <i class="ki-duotone ki-copy fs-3">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              Duplicate
            </button>

            <!-- Delete -->
            <button
              type="button"
              class="btn btn-light-danger"
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

            <!-- Back to List -->
            <NuxtLink
              to="/solutions"
              class="btn btn-light"
            >
              <i class="ki-duotone ki-arrow-left fs-3">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              Back to List
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Not Found State -->
  <div v-else class="alert alert-warning d-flex align-items-center p-5">
    <i class="ki-duotone ki-information-5 fs-2hx text-warning me-4">
      <span class="path1"></span>
      <span class="path2"></span>
      <span class="path3"></span>
    </i>
    <div class="d-flex flex-column">
      <h4 class="mb-1 text-dark">Solution not found</h4>
      <span>The solution you are looking for does not exist or has been deleted.</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useSolutionsStore } from '../stores/useSolutionsStore'
import { useSolutionFormatters } from '../composables/useSolutionFormatters'
import { useSolutionActions } from '../composables/useSolutionActions'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import SolutionsDetailSkeleton from '../components/SolutionsDetailSkeleton.vue'

definePageMeta({
  layout: 'default',
  middleware: ['auth']
})

const solutionsStore = useSolutionsStore()
const breadcrumbStore = useBreadcrumbStore()
const route = useRoute()
const router = useRouter()

const {
  formatDateTime,
  formatRelativeDate,
  getStatusBadgeClass,
  getStatusText,
  getFeatureCount,
  getBenefitCount,
  getIconColorStyle
} = useSolutionFormatters()

const {
  confirmAndDeleteSolution,
  toggleSolutionStatus,
  duplicateSolution
} = useSolutionActions()

const solutionId = computed(() => route.params.id as string)
const solution = computed(() => solutionsStore.currentSolution)

// Handlers
const handleToggleStatus = async () => {
  if (!solution.value) return

  const success = await toggleSolutionStatus(solution.value)
  if (success) {
    // Refresh the solution data
    await solutionsStore.fetchSolutionById(solutionId.value)
  }
}

const handleDuplicate = async () => {
  if (!solution.value) return

  const success = await duplicateSolution(solution.value)
  if (success) {
    // Redirect to solutions list
    await router.push('/solutions')
  }
}

const handleDelete = async () => {
  if (!solution.value) return

  const deleted = await confirmAndDeleteSolution(solution.value)
  if (deleted) {
    await router.push('/solutions')
  }
}

// Lifecycle
onMounted(async () => {
  // Fetch solution
  try {
    await solutionsStore.fetchSolutionById(solutionId.value)

    if (solution.value) {
      breadcrumbStore.setBreadcrumb([
        { title: 'Home', path: '/' },
        { title: 'Solutions', path: '/solutions' },
        { title: solution.value.title, path: `/solutions/${solutionId.value}` }
      ])
    }
  } catch (error) {
  }
})
</script>
