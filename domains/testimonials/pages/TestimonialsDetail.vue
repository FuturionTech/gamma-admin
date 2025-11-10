<template>
  <!-- Page Header -->
  <PageHeader title="Testimonial Details" />

  <!-- Loading State -->
  <div v-if="isLoading" class="card">
    <div class="card-body text-center py-20">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>

  <!-- Error State -->
  <div v-else-if="loadError" class="alert alert-danger d-flex align-items-center p-5">
    <i class="ki-duotone ki-shield-cross fs-2hx text-danger me-4">
      <span class="path1"></span>
      <span class="path2"></span>
      <span class="path3"></span>
    </i>
    <div class="d-flex flex-column">
      <h4 class="mb-1 text-dark">An error occurred</h4>
      <span>{{ loadError }}</span>
    </div>
  </div>

  <!-- Detail View -->
  <div v-else-if="testimonial" class="row g-5 g-xl-8">
    <!-- Main Content -->
    <div class="col-xl-8">
      <div class="card mb-5 mb-xl-8">
        <div class="card-body">
          <!-- Quote Icon -->
          <div class="text-center mb-7">
            <i class="fa-solid fa-quote-right fs-5x text-gray-300"></i>
          </div>

          <!-- Content -->
          <div class="mb-10">
            <blockquote class="blockquote text-center">
              <p class="fs-2 fw-semibold text-gray-800 mb-0">
                "{{ testimonial.content }}"
              </p>
            </blockquote>
          </div>

          <!-- Author Info -->
          <div class="d-flex align-items-center justify-content-center mb-7">
            <div class="me-5">
              <div
                v-if="testimonial.image_url"
                class="symbol symbol-100px symbol-circle"
              >
                <img :src="testimonial.image_url" :alt="testimonial.name" />
              </div>
              <div
                v-else
                class="symbol symbol-100px symbol-circle"
                :class="getAvatarColor(testimonial.name)"
              >
                <span class="symbol-label text-white fs-1">
                  {{ getInitials(testimonial.name) }}
                </span>
              </div>
            </div>
            <div class="text-start">
              <div class="fw-bold text-gray-900 fs-2 mb-2">{{ testimonial.name }}</div>
              <div class="text-muted fs-5 mb-3">
                <div v-if="testimonial.position">{{ testimonial.position }}</div>
                <div v-if="testimonial.company">{{ testimonial.company }}</div>
              </div>
              <!-- Rating -->
              <div class="rating">
                <i
                  v-for="star in 5"
                  :key="star"
                  class="fa-solid fa-star fs-3"
                  :class="star <= testimonial.rating ? 'text-warning' : 'text-gray-300'"
                ></i>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="d-flex justify-content-center gap-3">
            <NuxtLink
              :to="`/testimonials/${testimonial.id}/edit`"
              class="btn btn-primary"
            >
              <i class="ki-duotone ki-pencil fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              Edit
            </NuxtLink>
            <button
              type="button"
              class="btn btn-light-danger"
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

    <!-- Sidebar -->
    <div class="col-xl-4">
      <!-- Details Card -->
      <div class="card mb-5 mb-xl-8">
        <div class="card-header border-0">
          <div class="card-title">
            <h3 class="fw-bold m-0">Information</h3>
          </div>
        </div>
        <div class="card-body pt-0">
          <!-- Status -->
          <div class="mb-7">
            <div class="fw-semibold text-gray-600 mb-2">
              Status
            </div>
            <span
              class="badge badge-lg"
              :class="getStatusBadgeClass(testimonial.is_active)"
            >
              {{ getStatusText(testimonial.is_active) }}
            </span>
          </div>

          <!-- Rating -->
          <div class="mb-7">
            <div class="fw-semibold text-gray-600 mb-2">
              Rating
            </div>
            <div class="d-flex align-items-center">
              <div class="rating me-3">
                <i
                  v-for="star in 5"
                  :key="star"
                  class="fa-solid fa-star fs-4"
                  :class="star <= testimonial.rating ? 'text-warning' : 'text-gray-300'"
                ></i>
              </div>
              <span class="text-gray-800 fw-bold fs-5">{{ testimonial.rating }}/5</span>
            </div>
          </div>

          <!-- Order -->
          <div class="mb-7">
            <div class="fw-semibold text-gray-600 mb-2">
              Order
            </div>
            <span class="badge badge-light-primary badge-lg">{{ testimonial.order }}</span>
          </div>

          <!-- Created At -->
          <div class="mb-7">
            <div class="fw-semibold text-gray-600 mb-2">
              Created At
            </div>
            <div class="text-gray-800">{{ formatDate(testimonial.created_at) }}</div>
          </div>

          <!-- Updated At -->
          <div class="mb-7">
            <div class="fw-semibold text-gray-600 mb-2">
              Updated At
            </div>
            <div class="text-gray-800">{{ formatDate(testimonial.updated_at) }}</div>
          </div>

          <!-- Application -->
          <div v-if="testimonial.application" class="mb-7">
            <div class="fw-semibold text-gray-600 mb-2">
              Application
            </div>
            <div class="text-gray-800">{{ testimonial.application.name }}</div>
          </div>
        </div>
      </div>

      <!-- Quick Actions Card -->
      <div class="card">
        <div class="card-header border-0">
          <div class="card-title">
            <h3 class="fw-bold m-0">Quick Actions</h3>
          </div>
        </div>
        <div class="card-body pt-0">
          <div class="d-flex flex-column gap-3">
            <button
              type="button"
              class="btn btn-light-primary w-100 justify-content-start"
              @click="handleToggleStatus"
            >
              <i class="ki-duotone ki-toggle-off-circle fs-2 me-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              {{ testimonial.is_active ? 'Deactivate' : 'Activate' }}
            </button>
            <button
              type="button"
              class="btn btn-light-success w-100 justify-content-start"
              @click="handleDuplicate"
            >
              <i class="ki-duotone ki-copy fs-2 me-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              Duplicate
            </button>
            <NuxtLink
              to="/testimonials"
              class="btn btn-light w-100 justify-content-start"
            >
              <i class="ki-duotone ki-arrow-left fs-2 me-2">
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
import { ref, computed, onMounted } from 'vue'
import { useTestimonialsStore } from '../stores/useTestimonialsStore'
import { useTestimonialFormatters } from '../composables/useTestimonialFormatters'
import { useTestimonialActions } from '../composables/useTestimonialActions'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'

const route = useRoute()
const router = useRouter()
const testimonialsStore = useTestimonialsStore()
const breadcrumbStore = useBreadcrumbStore()

const {
  formatDate,
  getStatusBadgeClass,
  getStatusText,
  getInitials,
  getAvatarColor
} = useTestimonialFormatters()

const {
  confirmAndDeleteTestimonial,
  toggleTestimonialStatus,
  duplicateTestimonial
} = useTestimonialActions()

const testimonialId = computed(() => route.params.id as string)

const isLoading = ref(true)
const loadError = ref('')
const testimonial = computed(() => testimonialsStore.currentTestimonial)

// Load testimonial
const loadTestimonial = async () => {
  isLoading.value = true
  loadError.value = ''

  try {
    const result = await testimonialsStore.fetchTestimonial(testimonialId.value)

    if (result) {
      // Update breadcrumb
      breadcrumbStore.setBreadcrumb([
        { title: 'Home', path: '/' },
        { title: 'Testimonials', path: '/testimonials' },
        { title: result.name, path: `/testimonials/${result.id}` }
      ])
    }
  } catch (error: any) {
    console.error('Error loading testimonial:', error)
    loadError.value = error.message || 'Failed to load testimonial'
  } finally {
    isLoading.value = false
  }
}

// Handlers
const handleDelete = async () => {
  if (!testimonial.value) return

  const success = await confirmAndDeleteTestimonial(testimonial.value)
  if (success) {
    await router.push('/testimonials')
  }
}

const handleToggleStatus = async () => {
  if (!testimonial.value) return
  await toggleTestimonialStatus(testimonial.value)
}

const handleDuplicate = async () => {
  if (!testimonial.value) return
  const success = await duplicateTestimonial(testimonial.value)
  if (success) {
    await router.push('/testimonials')
  }
}

// Lifecycle
onMounted(async () => {
  await loadTestimonial()
})
</script>
