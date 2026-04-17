<template>
  <!-- Loading State -->
  <div v-if="processStepsStore.isLoading" class="card">
    <div class="card-body">
      <FormSkeleton :fields="6" :showActions="false" />
    </div>
  </div>

  <!-- Error State -->
  <div
    v-else-if="processStepsStore.hasError"
    class="alert alert-danger d-flex align-items-center p-5"
  >
    <i class="ki-duotone ki-shield-cross fs-2hx text-danger me-4">
      <span class="path1"></span>
      <span class="path2"></span>
      <span class="path3"></span>
    </i>
    <div class="d-flex flex-column">
      <h4 class="mb-1 text-dark">An error occurred</h4>
      <span>{{ processStepsStore.error }}</span>
    </div>
  </div>

  <!-- Process Step Details -->
  <div v-else-if="processStep" class="row g-5 g-xl-8">
    <!-- Main Details Card -->
    <div class="col-xl-8">
      <div class="card mb-5 mb-xl-8">
        <div class="card-header border-0 pt-5">
          <h3 class="card-title align-items-start flex-column">
            <span class="card-label fw-bold fs-3 mb-1">
              Basic Information
            </span>
          </h3>
          <div class="card-toolbar">
            <NuxtLink
              :to="`/process-steps/${processStep.id}/edit`"
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
          <!-- Step Number + Icon -->
          <div class="mb-7 d-flex align-items-center gap-4">
            <div>
              <label class="fw-bold fs-6 mb-2 d-block">Step Number</label>
              <span class="badge badge-lg badge-light-primary fw-bold fs-3">
                {{ formatStepNumber(processStep.step_number) }}
              </span>
            </div>
            <div v-if="processStep.icon">
              <label class="fw-bold fs-6 mb-2 d-block">Icon</label>
              <span
                class="symbol symbol-50px"
              >
                <span
                  class="symbol-label"
                  :style="processStep.icon_color ? `background-color: ${processStep.icon_color}15;` : ''"
                >
                  <i
                    :class="processStep.icon"
                    class="fs-1"
                    :style="processStep.icon_color ? `color: ${processStep.icon_color};` : ''"
                  ></i>
                </span>
              </span>
            </div>
          </div>

          <!-- Title -->
          <div class="mb-7">
            <label class="fw-bold fs-6 mb-2">Title</label>
            <div class="fs-4 text-gray-800">{{ processStep.title }}</div>
          </div>

          <!-- Short Description -->
          <div class="mb-7" v-if="processStep.short_description">
            <label class="fw-bold fs-6 mb-2">Short Description</label>
            <div class="text-gray-700 fs-6">{{ processStep.short_description }}</div>
          </div>

          <!-- Description -->
          <div class="mb-7" v-if="processStep.description">
            <label class="fw-bold fs-6 mb-2">Description</label>
            <div class="text-gray-700 fs-6" style="white-space: pre-wrap;">{{ processStep.description }}</div>
          </div>

          <!-- Slug -->
          <div class="mb-7">
            <label class="fw-bold fs-6 mb-2">Slug</label>
            <div class="text-gray-700">
              <code class="bg-light p-2 rounded">{{ processStep.slug }}</code>
            </div>
          </div>

          <!-- Icon Color -->
          <div class="mb-7" v-if="processStep.icon_color">
            <label class="fw-bold fs-6 mb-2">Icon Color</label>
            <div class="d-flex align-items-center gap-2">
              <span
                class="d-inline-block rounded"
                style="width: 24px; height: 24px;"
                :style="`background-color: ${processStep.icon_color};`"
              ></span>
              <code class="bg-light p-1 rounded">{{ processStep.icon_color }}</code>
            </div>
          </div>
        </div>
      </div>

      <!-- Items Card -->
      <div class="card mb-5 mb-xl-8">
        <div class="card-header border-0 pt-5">
          <h3 class="card-title align-items-start flex-column">
            <span class="card-label fw-bold fs-3 mb-1">Sub-Items</span>
            <span class="text-muted mt-1 fw-semibold fs-7">
              {{ processStep.items?.length || 0 }} item(s)
            </span>
          </h3>
          <div class="card-toolbar">
            <NuxtLink
              :to="`/process-steps/${processStep.id}/edit`"
              class="btn btn-sm btn-light-primary"
            >
              <i class="ki-duotone ki-pencil fs-3">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              Manage Items
            </NuxtLink>
          </div>
        </div>

        <div class="card-body py-3">
          <div v-if="processStep.items && processStep.items.length > 0">
            <div
              v-for="item in sortedItems"
              :key="item.id"
              class="d-flex align-items-start border rounded p-4 mb-3"
            >
              <div v-if="item.icon" class="me-4 mt-1">
                <span class="symbol symbol-40px">
                  <span class="symbol-label bg-light">
                    <i :class="item.icon" class="fs-2 text-gray-600"></i>
                  </span>
                </span>
              </div>
              <div class="flex-grow-1">
                <div class="d-flex align-items-center mb-1">
                  <span class="badge badge-light-primary badge-sm me-2">{{ item.order }}</span>
                  <span class="fw-bold text-gray-800 fs-6">{{ item.title }}</span>
                </div>
                <div class="text-gray-600 fs-7" v-if="item.description">
                  {{ item.description }}
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-10">
            <i class="ki-duotone ki-notepad fs-3x text-gray-400 mb-3">
              <span class="path1"></span>
              <span class="path2"></span>
              <span class="path3"></span>
              <span class="path4"></span>
              <span class="path5"></span>
            </i>
            <div class="text-gray-500 fs-6 mb-3">
              No items yet
            </div>
            <NuxtLink
              :to="`/process-steps/${processStep.id}/edit`"
              class="btn btn-sm btn-primary"
            >
              Add Items
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Sidebar -->
    <div class="col-xl-4">
      <!-- Status & Settings Card -->
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
                :class="getStatusBadgeClass(processStep.is_active)"
              >
                {{ getStatusText(processStep.is_active) }}
              </span>
            </div>
          </div>

          <!-- Created At -->
          <div class="mb-7">
            <label class="fw-bold fs-6 mb-2">Created At</label>
            <div class="text-gray-700">
              {{ formatDateTime(processStep.created_at) }}
            </div>
            <div class="text-muted fs-7">
              {{ formatRelativeDate(processStep.created_at) }}
            </div>
          </div>

          <!-- Updated At -->
          <div class="mb-7">
            <label class="fw-bold fs-6 mb-2">Updated At</label>
            <div class="text-gray-700">
              {{ formatDateTime(processStep.updated_at) }}
            </div>
            <div class="text-muted fs-7">
              {{ formatRelativeDate(processStep.updated_at) }}
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
              :to="`/process-steps/${processStep.id}/edit`"
              class="btn btn-light-primary"
            >
              <i class="ki-duotone ki-pencil fs-3">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              Edit
            </NuxtLink>

            <!-- Toggle Status -->
            <button
              type="button"
              class="btn"
              :class="processStep.is_active ? 'btn-light-warning' : 'btn-light-success'"
              @click="handleToggleStatus"
            >
              <i class="ki-duotone ki-toggle-on fs-3">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              {{ processStep.is_active ? 'Deactivate' : 'Activate' }}
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
              to="/process-steps"
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
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useProcessStepsStore } from '../stores/useProcessStepsStore'
import { useProcessStepFormatters } from '../composables/useProcessStepFormatters'
import { useProcessStepActions } from '../composables/useProcessStepActions'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'

const processStepsStore = useProcessStepsStore()
const breadcrumbStore = useBreadcrumbStore()
const route = useRoute()
const router = useRouter()

const {
  formatDateTime,
  formatRelativeDate,
  getStatusBadgeClass,
  getStatusText,
  formatStepNumber
} = useProcessStepFormatters()

const {
  confirmAndDeleteProcessStep,
  toggleProcessStepStatus
} = useProcessStepActions()

const processStepId = computed(() => route.params.id as string)
const processStep = computed(() => processStepsStore.currentProcessStep)

const sortedItems = computed(() => {
  if (!processStep.value?.items) return []
  return [...processStep.value.items].sort((a, b) => a.order - b.order)
})

// Handlers
const handleToggleStatus = async () => {
  if (!processStep.value) return

  const success = await toggleProcessStepStatus(processStep.value)
  if (success) {
    await processStepsStore.fetchProcessStep(processStepId.value)
  }
}

const handleDelete = async () => {
  if (!processStep.value) return

  const deleted = await confirmAndDeleteProcessStep(processStep.value)
  if (deleted) {
    await router.push('/process-steps')
  }
}

// Lifecycle
onMounted(async () => {
  try {
    await processStepsStore.fetchProcessStep(processStepId.value)

    if (processStep.value) {
      breadcrumbStore.setBreadcrumb([
        { title: 'Home', path: '/' },
        { title: 'Process Steps', path: '/process-steps' },
        { title: processStep.value.title, path: `/process-steps/${processStepId.value}` }
      ])
    }
  } catch (error) {
  }
})
</script>
