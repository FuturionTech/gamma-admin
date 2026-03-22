<template>
  <!-- Page Header -->
  <PageHeader
    :title="industry ? industry.title : 'Loading...'"
    subtitle="Industry details"
  />

  <!-- Loading State -->
  <div v-if="industriesStore.isLoading" class="card">
    <div class="card-body">
      <FormSkeleton :fields="6" :showActions="false" />
    </div>
  </div>

  <!-- Error State -->
  <div
    v-else-if="industriesStore.hasError"
    class="alert alert-danger d-flex align-items-center p-5"
  >
    <i class="ki-duotone ki-shield-cross fs-2hx text-danger me-4">
      <span class="path1"></span>
      <span class="path2"></span>
      <span class="path3"></span>
    </i>
    <div class="d-flex flex-column">
      <h4 class="mb-1 text-dark">An error occurred</h4>
      <span>{{ industriesStore.error }}</span>
    </div>
  </div>

  <!-- Industry Details -->
  <div v-else-if="industry" class="row g-5 g-xl-8">
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
                :to="`/industries/${industry.id}/edit`"
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
            <!-- Icon -->
            <div class="mb-7" v-if="industry.icon">
              <label class="fw-bold fs-6 mb-2">Icon</label>
              <div class="symbol symbol-150px mt-2">
                <img :src="industry.icon" :alt="industry.title" class="w-150px" />
              </div>
            </div>

            <!-- Title -->
            <div class="mb-7">
              <label class="fw-bold fs-6 mb-2">Title</label>
              <div class="fs-4 text-gray-800">{{ industry.title }}</div>
            </div>

            <!-- Short Description -->
            <div class="mb-7" v-if="industry.short_description">
              <label class="fw-bold fs-6 mb-2">Short Description</label>
              <div class="text-gray-700 fs-6">{{ industry.short_description }}</div>
            </div>

            <!-- Description -->
            <div class="mb-7" v-if="industry.description">
              <label class="fw-bold fs-6 mb-2">Description</label>
              <div class="text-gray-700 fs-6" style="white-space: pre-wrap;">{{ industry.description }}</div>
            </div>

            <!-- Category -->
            <div class="mb-7" v-if="industry.category">
              <label class="fw-bold fs-6 mb-2">Category</label>
              <div>
                <span
                  class="badge badge-lg"
                  :class="getCategoryBadgeClass(industry.category)"
                >
                  <i :class="getCategoryIcon(industry.category)" class="me-1"></i>
                  {{ formatCategory(industry.category) }}
                </span>
              </div>
            </div>

            <!-- Slug -->
            <div class="mb-7">
              <label class="fw-bold fs-6 mb-2">Slug</label>
              <div class="text-gray-700">
                <code class="bg-light p-2 rounded">{{ industry.slug }}</code>
              </div>
            </div>

            <!-- Icon Color -->
            <div class="mb-7" v-if="industry.icon_color">
              <label class="fw-bold fs-6 mb-2">Icon Color</label>
              <div class="d-flex align-items-center gap-2">
                <span
                  class="d-inline-block rounded-circle"
                  :style="{ backgroundColor: industry.icon_color, width: '24px', height: '24px' }"
                  v-if="industry.icon_color.startsWith('#')"
                ></span>
                <code class="bg-light p-2 rounded">{{ industry.icon_color }}</code>
              </div>
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
                  :class="getStatusBadgeClass(industry.is_active)"
                >
                  {{ getStatusText(industry.is_active) }}
                </span>
              </div>
            </div>

            <!-- Order -->
            <div class="mb-7">
              <label class="fw-bold fs-6 mb-2">Order</label>
              <div class="text-gray-800">{{ industry.order }}</div>
            </div>

            <!-- Created At -->
            <div class="mb-7">
              <label class="fw-bold fs-6 mb-2">Created At</label>
              <div class="text-gray-700">
                {{ formatDateTime(industry.created_at) }}
              </div>
              <div class="text-muted fs-7">
                {{ formatRelativeDate(industry.created_at) }}
              </div>
            </div>

            <!-- Updated At -->
            <div class="mb-7">
              <label class="fw-bold fs-6 mb-2">Updated At</label>
              <div class="text-gray-700">
                {{ formatDateTime(industry.updated_at) }}
              </div>
              <div class="text-muted fs-7">
                {{ formatRelativeDate(industry.updated_at) }}
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
                :to="`/industries/${industry.id}/edit`"
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
                :class="industry.is_active ? 'btn-light-warning' : 'btn-light-success'"
                @click="handleToggleStatus"
              >
                <i class="ki-duotone ki-toggle-on fs-3">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
                {{ industry.is_active ? 'Deactivate' : 'Activate' }}
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
                to="/industries"
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
import { useIndustriesStore } from '../stores/useIndustriesStore'
import { useIndustryFormatters } from '../composables/useIndustryFormatters'
import { useIndustryActions } from '../composables/useIndustryActions'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'

const industriesStore = useIndustriesStore()
const breadcrumbStore = useBreadcrumbStore()
const route = useRoute()
const router = useRouter()

const {
  formatDateTime,
  formatRelativeDate,
  getStatusBadgeClass,
  getStatusText,
  getCategoryBadgeClass,
  getCategoryIcon,
  formatCategory
} = useIndustryFormatters()

const {
  confirmAndDeleteIndustry,
  toggleIndustryStatus,
  duplicateIndustry
} = useIndustryActions()

const industryId = computed(() => route.params.id as string)
const industry = computed(() => industriesStore.currentIndustry)

// Handlers
const handleToggleStatus = async () => {
  if (!industry.value) return

  const success = await toggleIndustryStatus(industry.value)
  if (success) {
    // Refresh the industry data
    await industriesStore.fetchIndustry(industryId.value)
  }
}

const handleDuplicate = async () => {
  if (!industry.value) return

  const success = await duplicateIndustry(industry.value)
  if (success) {
    // Redirect to industries list
    await router.push('/industries')
  }
}

const handleDelete = async () => {
  if (!industry.value) return

  const deleted = await confirmAndDeleteIndustry(industry.value)
  if (deleted) {
    await router.push('/industries')
  }
}

// Lifecycle
onMounted(async () => {
  // Fetch industry
  try {
    await industriesStore.fetchIndustry(industryId.value)

    if (industry.value) {
      breadcrumbStore.setBreadcrumb([
        { title: 'Home', path: '/' },
        { title: 'Industries', path: '/industries' },
        { title: industry.value.title, path: `/industries/${industryId.value}` }
      ])
    }
  } catch (error) {
  }
})
</script>
