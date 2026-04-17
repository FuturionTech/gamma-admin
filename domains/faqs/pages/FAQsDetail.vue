<template>
  <!-- Page Header -->
  <PageHeader
    :title="faq ? faq.question : 'Loading...'"
    subtitle="FAQ details"
  />

  <!-- Loading Skeleton -->
  <div v-if="faqsStore.isLoading" class="row g-5 g-xl-8">
    <!-- Main Content Skeleton -->
    <div class="col-xl-8">
      <div class="card mb-5 mb-xl-8">
        <div class="card-header border-0 pt-5">
          <div class="shimmer" style="height: 24px; width: 180px; border-radius: 4px;"></div>
          <div class="shimmer" style="height: 36px; width: 80px; border-radius: 6px;"></div>
        </div>
        <div class="card-body py-3">
          <div class="mb-7">
            <div class="shimmer mb-2" style="height: 18px; width: 100px; border-radius: 4px;"></div>
            <div class="shimmer" style="height: 24px; width: 100%; border-radius: 4px;"></div>
          </div>
          <div class="mb-7">
            <div class="shimmer mb-2" style="height: 18px; width: 80px; border-radius: 4px;"></div>
            <div class="shimmer mb-2" style="height: 16px; width: 100%; border-radius: 4px;"></div>
            <div class="shimmer mb-2" style="height: 16px; width: 95%; border-radius: 4px;"></div>
            <div class="shimmer" style="height: 16px; width: 90%; border-radius: 4px;"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sidebar Skeleton -->
    <div class="col-xl-4">
      <div class="card mb-5 mb-xl-8">
        <div class="card-header border-0 pt-5">
          <div class="shimmer" style="height: 24px; width: 120px; border-radius: 4px;"></div>
        </div>
        <div class="card-body py-3">
          <div v-for="i in 4" :key="i" class="mb-7">
            <div class="shimmer mb-2" style="height: 18px; width: 90px; border-radius: 4px;"></div>
            <div class="shimmer" style="height: 20px; width: 140px; border-radius: 4px;"></div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header border-0 pt-5">
          <div class="shimmer" style="height: 24px; width: 100px; border-radius: 4px;"></div>
        </div>
        <div class="card-body py-3">
          <div class="shimmer mb-3" style="height: 40px; width: 100%; border-radius: 6px;"></div>
          <div class="shimmer mb-3" style="height: 40px; width: 100%; border-radius: 6px;"></div>
          <div class="shimmer" style="height: 40px; width: 100%; border-radius: 6px;"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Error State -->
  <div
    v-else-if="faqsStore.hasError"
    class="alert alert-danger d-flex align-items-center p-5"
  >
    <i class="ki-duotone ki-shield-cross fs-2hx text-danger me-4">
      <span class="path1"></span>
      <span class="path2"></span>
      <span class="path3"></span>
    </i>
    <div class="d-flex flex-column">
      <h4 class="mb-1 text-dark">An error occurred</h4>
      <span>{{ faqsStore.error }}</span>
    </div>
  </div>

  <!-- FAQ Details -->
  <div v-else-if="faq" class="row g-5 g-xl-8">
    <!-- Main Details Card -->
    <div class="col-xl-8">
      <div class="card mb-5 mb-xl-8">
        <div class="card-header border-0 pt-5">
          <h3 class="card-title align-items-start flex-column">
            <span class="card-label fw-bold fs-3 mb-1">
              Question & Answer
            </span>
          </h3>
          <div class="card-toolbar">
            <NuxtLink
              :to="`/faqs/${faq.id}/edit`"
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
          <!-- Question -->
          <div class="mb-7">
            <label class="fw-bold fs-6 mb-2">Question</label>
            <div class="fs-4 text-gray-800 fw-semibold">{{ faq.question }}</div>
          </div>

          <!-- Answer -->
          <div class="mb-7">
            <label class="fw-bold fs-6 mb-2">Answer</label>
            <div class="text-gray-700 fs-6" v-html="sanitizeHtml(faq.answer)"></div>
          </div>

          <!-- Category -->
          <div class="mb-7">
            <label class="fw-bold fs-6 mb-2">Category</label>
            <div>
              <span
                v-if="faq.category"
                class="badge badge-lg"
                :class="getCategoryBadgeClass(faq.category)"
              >
                {{ faq.category }}
              </span>
              <span v-else class="text-muted">No category assigned</span>
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
                :class="getStatusBadgeClass(faq.is_active)"
              >
                {{ getStatusText(faq.is_active) }}
              </span>
            </div>
          </div>

          <!-- Created At -->
          <div class="mb-7">
            <label class="fw-bold fs-6 mb-2">Created At</label>
            <div class="text-gray-700">
              {{ formatDateTime(faq.created_at) }}
            </div>
          </div>

          <!-- Updated At -->
          <div class="mb-7">
            <label class="fw-bold fs-6 mb-2">Updated At</label>
            <div class="text-gray-700">
              {{ formatDateTime(faq.updated_at) }}
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
              :to="`/faqs/${faq.id}/edit`"
              class="btn btn-light-primary"
            >
              <i class="ki-duotone ki-pencil fs-3">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              Edit FAQ
            </NuxtLink>

            <!-- Toggle Status -->
            <button
              type="button"
              class="btn"
              :class="faq.is_active ? 'btn-light-warning' : 'btn-light-success'"
              @click="handleToggleStatus"
            >
              <i class="ki-duotone ki-toggle-on fs-3">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              {{ faq.is_active ? 'Deactivate' : 'Activate' }}
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
              to="/faqs"
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
import { useFAQsStore } from '../stores/useFAQsStore'
import { useFAQFormatters } from '../composables/useFAQFormatters'
import { useFAQActions } from '../composables/useFAQActions'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import { useSanitize } from '~/composables/useSanitize'

const { sanitizeHtml } = useSanitize()
const faqsStore = useFAQsStore()
const breadcrumbStore = useBreadcrumbStore()
const route = useRoute()
const router = useRouter()

const {
  formatDateTime,
  getStatusBadgeClass,
  getStatusText,
  getCategoryBadgeClass
} = useFAQFormatters()

const {
  confirmAndDeleteFAQ,
  toggleFAQStatus
} = useFAQActions()

const faqId = computed(() => route.params.id as string)
const faq = computed(() => faqsStore.currentFAQ)

// Handlers
const handleToggleStatus = async () => {
  if (!faq.value) return

  const success = await toggleFAQStatus(faq.value)
  if (success) {
    // Refresh the FAQ data
    await faqsStore.fetchFAQ(faqId.value)
  }
}

const handleDelete = async () => {
  if (!faq.value) return

  const deleted = await confirmAndDeleteFAQ(faq.value)
  if (deleted) {
    await router.push('/faqs')
  }
}

// Lifecycle
onMounted(async () => {
  // Fetch FAQ
  try {
    await faqsStore.fetchFAQ(faqId.value)

    if (faq.value) {
      breadcrumbStore.setBreadcrumb([
        { title: 'Home', path: '/' },
        { title: 'FAQs', path: '/faqs' },
        { title: faq.value.question, path: `/faqs/${faqId.value}` }
      ])
    }
  } catch {
    // Error handled by store
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
