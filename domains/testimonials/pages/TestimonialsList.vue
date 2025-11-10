<template>
  <!-- Page Header -->
  <PageHeader title="Testimonials" subtitle="Manage customer testimonials and reviews" />

  <!-- Statistics Cards -->
  <div class="row g-5 g-xl-8 mb-5 mb-xl-8" v-if="!testimonialsStore.isLoading">
    <div class="col-xl-3">
      <div class="card card-flush h-xl-100">
        <div class="card-body">
          <span class="svg-icon svg-icon-2tx svg-icon-primary">
            <i class="ki-duotone ki-message-text-2 fs-2tx text-primary">
              <span class="path1"></span>
              <span class="path2"></span>
              <span class="path3"></span>
            </i>
          </span>
          <div class="fw-bold fs-2 mt-5">
            {{ testimonialsStore.statistics.total }}
          </div>
          <div class="fw-semibold text-muted">
            Total Testimonials
          </div>
        </div>
      </div>
    </div>

    <div class="col-xl-3">
      <div class="card card-flush h-xl-100">
        <div class="card-body">
          <span class="svg-icon svg-icon-2tx svg-icon-success">
            <i class="ki-duotone ki-check-circle fs-2tx text-success">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
          </span>
          <div class="fw-bold fs-2 mt-5">
            {{ testimonialsStore.statistics.active }}
          </div>
          <div class="fw-semibold text-muted">
            Active Testimonials
          </div>
        </div>
      </div>
    </div>

    <div class="col-xl-3">
      <div class="card card-flush h-xl-100">
        <div class="card-body">
          <span class="svg-icon svg-icon-2tx svg-icon-warning">
            <i class="fa-solid fa-star fs-2tx text-warning"></i>
          </span>
          <div class="fw-bold fs-2 mt-5">
            {{ testimonialsStore.statistics.averageRating.toFixed(1) }}
          </div>
          <div class="fw-semibold text-muted">
            Average Rating
          </div>
        </div>
      </div>
    </div>

    <div class="col-xl-3">
      <div class="card card-flush h-xl-100">
        <div class="card-body">
          <span class="svg-icon svg-icon-2tx svg-icon-danger">
            <i class="ki-duotone ki-cross-circle fs-2tx text-danger">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
          </span>
          <div class="fw-bold fs-2 mt-5">
            {{ testimonialsStore.statistics.inactive }}
          </div>
          <div class="fw-semibold text-muted">
            Inactive Testimonials
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Statistics Skeleton -->
  <div class="row g-5 g-xl-8 mb-5 mb-xl-8" v-else>
    <div class="col-xl-3" v-for="i in 4" :key="i">
      <CardSkeleton :showIcon="true" :lines="0" :showActions="false" />
    </div>
  </div>

  <!-- Main Card -->
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        <!-- Search -->
        <div class="d-flex align-items-center position-relative my-1">
          <i class="ki-duotone ki-magnifier fs-3 position-absolute ms-5">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          <input
            type="text"
            v-model="searchQuery"
            @input="handleSearch"
            class="form-control form-control-solid w-250px ps-13"
            placeholder="Search by name, company..."
          />
        </div>
      </div>

      <div class="card-toolbar">
        <div class="d-flex justify-content-end gap-2" data-kt-customer-table-toolbar="base">
          <!-- Filter by Status -->
          <select
            v-model="statusFilter"
            @change="handleStatusFilter"
            class="form-select form-select-solid w-150px"
          >
            <option :value="null">All Statuses</option>
            <option :value="true">Active</option>
            <option :value="false">Inactive</option>
          </select>

          <!-- Filter by Rating -->
          <select
            v-model="ratingFilter"
            @change="handleRatingFilter"
            class="form-select form-select-solid w-150px"
          >
            <option :value="null">All Ratings</option>
            <option :value="5">5 stars</option>
            <option :value="4">4 stars</option>
            <option :value="3">3 stars</option>
            <option :value="2">2 stars</option>
            <option :value="1">1 star</option>
          </select>

          <!-- Export -->
          <button
            type="button"
            class="btn btn-light-primary"
            @click="handleExport"
          >
            <i class="ki-duotone ki-exit-up fs-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            Export
          </button>

          <!-- Create New -->
          <NuxtLink
            to="/testimonials/create"
            class="btn btn-primary"
          >
            <i class="ki-duotone ki-plus fs-2"></i>
            Create Testimonial
          </NuxtLink>
        </div>

        <!-- Bulk Delete -->
        <div
          class="d-flex justify-content-end align-items-center gap-2"
          data-kt-customer-table-toolbar="selected"
          v-if="selectedIds.length > 0"
        >
          <div class="fw-bold me-5">
            <span class="me-2">{{ selectedIds.length }}</span>
            selected
          </div>
          <button
            type="button"
            class="btn btn-danger"
            @click="handleBulkDelete"
          >
            Delete Selected
          </button>
        </div>
      </div>
    </div>

    <div class="card-body pt-0">
      <!-- Cards Grid -->
      <div class="row g-6 g-xl-9" v-if="!testimonialsStore.isLoading && testimonialsStore.hasTestimonials">
        <div
          v-for="testimonial in testimonialsStore.filteredTestimonials"
          :key="testimonial.id"
          class="col-md-6 col-xl-4"
        >
          <div class="card h-100">
            <!-- Checkbox -->
            <div class="card-header border-0 pt-5">
              <div class="form-check form-check-sm form-check-custom form-check-solid">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :checked="selectedIds.includes(testimonial.id)"
                  @change="toggleSelect(testimonial.id)"
                />
              </div>
              <div class="card-toolbar">
                <button
                  type="button"
                  class="btn btn-sm btn-icon btn-light btn-active-light-primary"
                  data-kt-menu-trigger="click"
                  data-kt-menu-placement="bottom-end"
                >
                  <i class="ki-duotone ki-dots-vertical fs-2">
                    <span class="path1"></span>
                    <span class="path2"></span>
                    <span class="path3"></span>
                  </i>
                </button>

                <div
                  class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-125px py-4"
                  data-kt-menu="true"
                >
                  <div class="menu-item px-3">
                    <NuxtLink
                      :to="`/testimonials/${testimonial.id}`"
                      class="menu-link px-3"
                    >
                      View
                    </NuxtLink>
                  </div>
                  <div class="menu-item px-3">
                    <NuxtLink
                      :to="`/testimonials/${testimonial.id}/edit`"
                      class="menu-link px-3"
                    >
                      Edit
                    </NuxtLink>
                  </div>
                  <div class="menu-item px-3">
                    <a
                      href="#"
                      class="menu-link px-3"
                      @click.prevent="handleToggleStatus(testimonial)"
                    >
                      {{ testimonial.is_active ? 'Deactivate' : 'Activate' }}
                    </a>
                  </div>
                  <div class="menu-item px-3">
                    <a
                      href="#"
                      class="menu-link px-3 text-danger"
                      @click.prevent="handleDelete(testimonial)"
                    >
                      Delete
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div class="card-body text-center pt-5">
              <!-- Quote Icon -->
              <i class="fa-solid fa-quote-right fs-3x text-gray-300 mb-5"></i>

              <!-- Content -->
              <div class="mb-7">
                <p class="text-gray-800 fw-normal fs-5 mb-4">
                  "{{ truncate(testimonial.content, 150) }}"
                </p>
              </div>

              <!-- Rating -->
              <div class="mb-5">
                <div class="rating">
                  <i
                    v-for="star in 5"
                    :key="star"
                    class="fa-solid fa-star fs-5"
                    :class="star <= testimonial.rating ? 'text-warning' : 'text-gray-300'"
                  ></i>
                </div>
              </div>

              <!-- Author -->
              <div class="d-flex align-items-center justify-content-center mb-3">
                <div class="me-3">
                  <div
                    v-if="testimonial.image_url"
                    class="symbol symbol-50px symbol-circle"
                  >
                    <img :src="testimonial.image_url" :alt="testimonial.name" />
                  </div>
                  <div
                    v-else
                    class="symbol symbol-50px symbol-circle"
                    :class="getAvatarColor(testimonial.name)"
                  >
                    <span class="symbol-label text-white fs-4">
                      {{ getInitials(testimonial.name) }}
                    </span>
                  </div>
                </div>
                <div class="text-start">
                  <div class="fw-bold text-gray-900 fs-6">{{ testimonial.name }}</div>
                  <div class="text-muted fs-7">
                    <span v-if="testimonial.position">{{ testimonial.position }}</span>
                    <span v-if="testimonial.position && testimonial.company"> · </span>
                    <span v-if="testimonial.company">{{ testimonial.company }}</span>
                  </div>
                </div>
              </div>

              <!-- Status Badge -->
              <div>
                <span
                  class="badge"
                  :class="getStatusBadgeClass(testimonial.is_active)"
                >
                  {{ getStatusText(testimonial.is_active) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading Skeleton -->
      <div class="row g-6 g-xl-9" v-else-if="testimonialsStore.isLoading">
        <div class="col-md-6 col-xl-4" v-for="i in 6" :key="i">
          <CardSkeleton :lines="5" :showActions="true" />
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!testimonialsStore.hasTestimonials"
        class="text-center py-20"
      >
        <i class="ki-duotone ki-folder-down fs-5x text-gray-400 mb-5">
          <span class="path1"></span>
          <span class="path2"></span>
        </i>
        <div class="fw-bold fs-3 text-gray-600 mb-2">
          No testimonials created yet
        </div>
        <div class="text-gray-500 mb-5">
          Create your first testimonial
        </div>
        <NuxtLink to="/testimonials/create" class="btn btn-primary">
          <i class="ki-duotone ki-plus fs-2"></i>
          Create Testimonial
        </NuxtLink>
      </div>

      <!-- Error State -->
      <div
        v-else-if="testimonialsStore.hasError"
        class="alert alert-danger d-flex align-items-center p-5"
      >
        <i class="ki-duotone ki-shield-cross fs-2hx text-danger me-4">
          <span class="path1"></span>
          <span class="path2"></span>
          <span class="path3"></span>
        </i>
        <div class="d-flex flex-column">
          <h4 class="mb-1 text-dark">An error occurred</h4>
          <span>{{ testimonialsStore.error }}</span>
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
import type { Testimonial } from '../types'

const testimonialsStore = useTestimonialsStore()
const breadcrumbStore = useBreadcrumbStore()

const {
  truncate,
  getStatusBadgeClass,
  getStatusText,
  getInitials,
  getAvatarColor
} = useTestimonialFormatters()

const {
  confirmAndDeleteTestimonial,
  toggleTestimonialStatus,
  bulkDeleteTestimonials,
  exportTestimonialsToCSV
} = useTestimonialActions()

// Search and filters
const searchQuery = ref('')
const statusFilter = ref<boolean | null>(null)
const ratingFilter = ref<number | null>(null)

// Selection
const selectedIds = ref<string[]>([])

const allSelected = computed(() => {
  return (
    testimonialsStore.filteredTestimonials.length > 0 &&
    selectedIds.value.length === testimonialsStore.filteredTestimonials.length
  )
})

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedIds.value = []
  } else {
    selectedIds.value = testimonialsStore.filteredTestimonials.map((t) => t.id)
  }
}

const toggleSelect = (id: string) => {
  const index = selectedIds.value.indexOf(id)
  if (index > -1) {
    selectedIds.value.splice(index, 1)
  } else {
    selectedIds.value.push(id)
  }
}

// Handlers
const handleSearch = async () => {
  await testimonialsStore.debouncedSearch(searchQuery.value)
}

const handleStatusFilter = async () => {
  await testimonialsStore.applyStatusFilter(statusFilter.value)
}

const handleRatingFilter = async () => {
  await testimonialsStore.applyRatingFilter(ratingFilter.value)
}

const handleDelete = async (testimonial: Testimonial) => {
  await confirmAndDeleteTestimonial(testimonial)
}

const handleToggleStatus = async (testimonial: Testimonial) => {
  await toggleTestimonialStatus(testimonial)
}

const handleBulkDelete = async () => {
  const success = await bulkDeleteTestimonials(selectedIds.value)
  if (success) {
    selectedIds.value = []
  }
}

const handleExport = () => {
  exportTestimonialsToCSV()
}

// Lifecycle
onMounted(async () => {
  breadcrumbStore.setBreadcrumb([
    { title: 'Home', path: '/' },
    { title: 'Testimonials', path: '/testimonials' }
  ])

  await testimonialsStore.initialize()
})
</script>
