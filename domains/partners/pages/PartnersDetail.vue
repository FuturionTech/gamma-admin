<template>
  <!-- Page Header -->
  <PageHeader
    :title="partner ? partner.name : 'Loading...'"
    subtitle="Partner details"
  />

  <!-- Loading State with Shimmer -->
  <div v-if="partnersStore.isLoading" class="row g-5 g-xl-8">
    <!-- Main Details Card Skeleton -->
    <div class="col-xl-8">
      <div class="card mb-5 mb-xl-8">
        <div class="card-header border-0 pt-5">
          <div class="shimmer" style="height: 28px; width: 200px; border-radius: 4px;"></div>
          <div class="shimmer" style="height: 40px; width: 80px; border-radius: 6px;"></div>
        </div>
        <div class="card-body py-3">
          <!-- Logo Skeleton -->
          <div class="mb-7">
            <div class="shimmer mb-2" style="height: 18px; width: 80px;"></div>
            <div class="shimmer" style="height: 200px; width: 200px; border-radius: 8px;"></div>
          </div>
          <!-- Name Skeleton -->
          <div class="mb-7">
            <div class="shimmer mb-2" style="height: 18px; width: 100px;"></div>
            <div class="shimmer" style="height: 24px; width: 250px;"></div>
          </div>
          <!-- Website Skeleton -->
          <div class="mb-7">
            <div class="shimmer mb-2" style="height: 18px; width: 120px;"></div>
            <div class="shimmer" style="height: 20px; width: 200px;"></div>
          </div>
          <!-- Order Skeleton -->
          <div class="mb-7">
            <div class="shimmer mb-2" style="height: 18px; width: 100px;"></div>
            <div class="shimmer" style="height: 20px; width: 60px;"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sidebar Skeleton -->
    <div class="col-xl-4">
      <!-- Settings Card Skeleton -->
      <div class="card mb-5 mb-xl-8">
        <div class="card-header border-0 pt-5">
          <div class="shimmer" style="height: 28px; width: 120px; border-radius: 4px;"></div>
        </div>
        <div class="card-body py-3">
          <div v-for="i in 3" :key="i" class="mb-7">
            <div class="shimmer mb-2" style="height: 18px; width: 80px;"></div>
            <div class="shimmer" style="height: 20px; width: 120px;"></div>
          </div>
        </div>
      </div>

      <!-- Actions Card Skeleton -->
      <div class="card">
        <div class="card-header border-0 pt-5">
          <div class="shimmer" style="height: 28px; width: 100px; border-radius: 4px;"></div>
        </div>
        <div class="card-body py-3">
          <div class="d-flex flex-column gap-3">
            <div v-for="i in 5" :key="i" class="shimmer" style="height: 44px; border-radius: 6px;"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Error State -->
  <div
    v-else-if="partnersStore.hasError"
    class="alert alert-danger d-flex align-items-center p-5"
  >
    <i class="ki-duotone ki-shield-cross fs-2hx text-danger me-4">
      <span class="path1"></span>
      <span class="path2"></span>
      <span class="path3"></span>
    </i>
    <div class="d-flex flex-column">
      <h4 class="mb-1 text-dark">An error occurred</h4>
      <span>{{ partnersStore.error }}</span>
    </div>
  </div>

  <!-- Partner Details -->
  <div v-else-if="partner" class="row g-5 g-xl-8">
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
              :to="`/partners/${partner.id}/edit`"
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
          <!-- Logo -->
          <div class="mb-7" v-if="partner.logo_url">
            <label class="fw-bold fs-6 mb-2">Logo</label>
            <div class="mt-2">
              <img
                :src="partner.logo_url"
                :alt="partner.name"
                class="mw-100"
                style="max-height: 200px; object-fit: contain;"
              />
            </div>
          </div>

          <!-- Name -->
          <div class="mb-7">
            <label class="fw-bold fs-6 mb-2">Partner Name</label>
            <div class="fs-4 text-gray-800">{{ partner.name }}</div>
          </div>

          <!-- Website URL -->
          <div class="mb-7" v-if="partner.website_url">
            <label class="fw-bold fs-6 mb-2">Website</label>
            <div>
              <a
                :href="partner.website_url"
                target="_blank"
                rel="noopener noreferrer"
                class="text-primary text-hover-dark"
              >
                <i class="ki-duotone ki-global fs-2 me-2">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
                {{ formatWebsiteUrl(partner.website_url) }}
                <i class="ki-duotone ki-arrow-up-right fs-4 ms-1">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
              </a>
            </div>
          </div>

          <!-- Order -->
          <div class="mb-7">
            <label class="fw-bold fs-6 mb-2">Display Order</label>
            <div class="text-gray-800">{{ partner.order }}</div>
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
                :class="getStatusBadgeClass(partner.is_active)"
              >
                {{ getStatusText(partner.is_active) }}
              </span>
            </div>
          </div>

          <!-- Created At -->
          <div class="mb-7">
            <label class="fw-bold fs-6 mb-2">Created At</label>
            <div class="text-gray-700">
              {{ formatDateTime(partner.created_at) }}
            </div>
            <div class="text-muted fs-7">
              {{ formatRelativeDate(partner.created_at) }}
            </div>
          </div>

          <!-- Updated At -->
          <div class="mb-7">
            <label class="fw-bold fs-6 mb-2">Updated At</label>
            <div class="text-gray-700">
              {{ formatDateTime(partner.updated_at) }}
            </div>
            <div class="text-muted fs-7">
              {{ formatRelativeDate(partner.updated_at) }}
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
              :to="`/partners/${partner.id}/edit`"
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
              :class="partner.is_active ? 'btn-light-warning' : 'btn-light-success'"
              @click="handleToggleStatus"
            >
              <i class="ki-duotone ki-toggle-on fs-3">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              {{ partner.is_active ? 'Deactivate' : 'Activate' }}
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
              to="/partners"
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
import { usePartnersStore } from '../stores/usePartnersStore'
import { usePartnerFormatters } from '../composables/usePartnerFormatters'
import { usePartnerActions } from '../composables/usePartnerActions'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'

const partnersStore = usePartnersStore()
const breadcrumbStore = useBreadcrumbStore()
const route = useRoute()
const router = useRouter()

const {
  formatDateTime,
  formatRelativeDate,
  formatWebsiteUrl,
  getStatusBadgeClass,
  getStatusText
} = usePartnerFormatters()

const {
  confirmAndDeletePartner,
  togglePartnerStatus,
  duplicatePartner
} = usePartnerActions()

const partnerId = computed(() => route.params.id as string)
const partner = computed(() => partnersStore.currentPartner)

// Handlers
const handleToggleStatus = async () => {
  if (!partner.value) return

  const success = await togglePartnerStatus(partner.value)
  if (success) {
    // Refresh the partner data
    await partnersStore.fetchPartner(partnerId.value)
  }
}

const handleDuplicate = async () => {
  if (!partner.value) return

  const success = await duplicatePartner(partner.value)
  if (success) {
    // Redirect to partners list
    await router.push('/partners')
  }
}

const handleDelete = async () => {
  if (!partner.value) return

  const deleted = await confirmAndDeletePartner(partner.value)
  if (deleted) {
    await router.push('/partners')
  }
}

// Lifecycle
onMounted(async () => {
  // Fetch partner
  try {
    await partnersStore.fetchPartner(partnerId.value)

    if (partner.value) {
      breadcrumbStore.setBreadcrumb([
        { title: 'Home', path: '/' },
        { title: 'Partners', path: '/partners' },
        { title: partner.value.name, path: `/partners/${partnerId.value}` }
      ])
    }
  } catch (error) {
  }
})
</script>

<style scoped>
.shimmer {
  background: linear-gradient(90deg,
    rgba(240, 240, 240, 0.4) 25%,
    rgba(240, 240, 240, 0.8) 37%,
    rgba(240, 240, 240, 0.4) 63%
  );
  background-size: 400% 100%;
  animation: shimmer-wave 1.8s ease-in-out infinite;
}

@keyframes shimmer-wave {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
</style>
