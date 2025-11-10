<template>
  <!-- Page Header -->
  <PageHeader
    title="Contact Request Details"
    subtitle="View and manage contact request"
  />

    <!-- Loading State -->
    <div v-if="contactRequestsStore.isLoading" class="card">
      <div class="card-body">
        <CardSkeleton :lines="10" :showIcon="false" :showActions="false" />
      </div>
    </div>

    <!-- Contact Request Details -->
    <div v-else-if="contactRequest" class="row g-5 g-xl-8">
      <!-- Main Info Card -->
      <div class="col-xl-8">
        <div class="card card-flush">
          <div class="card-header">
            <h3 class="card-title">Request Information</h3>
            <div class="card-toolbar">
              <span
                class="badge badge-lg"
                :class="getStatusBadgeClass(contactRequest.status)"
              >
                <i :class="getStatusIcon(contactRequest.status)" class="me-1"></i>
                {{ getStatusLabel(contactRequest.status) }}
              </span>
            </div>
          </div>

          <div class="card-body pt-0">
            <!-- Contact Information -->
            <div class="mb-10">
              <h4 class="fs-5 fw-bold mb-5">Contact Information</h4>

              <div class="row mb-5">
                <div class="col-md-6">
                  <div class="mb-5">
                    <label class="form-label fw-bold text-muted">First Name</label>
                    <div class="fs-6 text-gray-800">{{ contactRequest.first_name }}</div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-5">
                    <label class="form-label fw-bold text-muted">Last Name</label>
                    <div class="fs-6 text-gray-800">{{ contactRequest.last_name }}</div>
                  </div>
                </div>
              </div>

              <div class="row mb-5">
                <div class="col-md-6">
                  <div class="mb-5">
                    <label class="form-label fw-bold text-muted">Email</label>
                    <div class="fs-6 text-gray-800">
                      <a :href="`mailto:${contactRequest.email}`" class="text-hover-primary">
                        {{ contactRequest.email }}
                      </a>
                      <button
                        @click="handleCopyEmail(contactRequest.email)"
                        class="btn btn-sm btn-icon btn-light-primary ms-2"
                        title="Copy email"
                      >
                        <i class="bi bi-clipboard"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="col-md-6" v-if="contactRequest.phone">
                  <div class="mb-5">
                    <label class="form-label fw-bold text-muted">Phone</label>
                    <div class="fs-6 text-gray-800">
                      <a :href="`tel:${contactRequest.phone}`" class="text-hover-primary">
                        {{ formatPhone(contactRequest.phone) }}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Subject and Message -->
            <div class="separator separator-dashed my-8"></div>

            <div class="mb-10">
              <h4 class="fs-5 fw-bold mb-5">Request Details</h4>

              <div class="mb-7" v-if="contactRequest.subject">
                <label class="form-label fw-bold text-muted">Subject</label>
                <div class="fs-5 text-gray-800 fw-semibold">{{ contactRequest.subject }}</div>
              </div>

              <div class="mb-5">
                <label class="form-label fw-bold text-muted">Message</label>
                <div class="card bg-light-info">
                  <div class="card-body">
                    <p class="text-gray-800 fs-6 mb-0" style="white-space: pre-wrap;">{{ contactRequest.message }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Metadata -->
            <div class="separator separator-dashed my-8"></div>

            <div class="row">
              <div class="col-md-6">
                <div class="mb-5">
                  <label class="form-label fw-bold text-muted">Submitted At</label>
                  <div class="fs-6 text-gray-800">
                    {{ formatDate(contactRequest.created_at) }}
                    <span class="text-muted ms-2">({{ formatRelativeTime(contactRequest.created_at) }})</span>
                  </div>
                </div>
              </div>
              <div class="col-md-6" v-if="contactRequest.updated_at !== contactRequest.created_at">
                <div class="mb-5">
                  <label class="form-label fw-bold text-muted">Last Updated</label>
                  <div class="fs-6 text-gray-800">
                    {{ formatDate(contactRequest.updated_at) }}
                    <span class="text-muted ms-2">({{ formatRelativeTime(contactRequest.updated_at) }})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions Sidebar -->
      <div class="col-xl-4">
        <!-- Status Management Card -->
        <div class="card card-flush mb-5">
          <div class="card-header">
            <h3 class="card-title">Status Management</h3>
          </div>
          <div class="card-body pt-0">
            <div class="mb-5">
              <label class="form-label fw-bold">Current Status</label>
              <div>
                <span
                  class="badge badge-lg"
                  :class="getStatusBadgeClass(contactRequest.status)"
                >
                  <i :class="getStatusIcon(contactRequest.status)" class="me-1"></i>
                  {{ getStatusLabel(contactRequest.status) }}
                </span>
              </div>
            </div>

            <div class="separator separator-dashed my-5"></div>

            <div class="mb-5">
              <label class="form-label fw-bold">Change Status</label>
              <select
                v-model="selectedStatus"
                class="form-select form-select-solid"
              >
                <option :value="contactRequest.status">Select new status</option>
                <option
                  v-for="status in availableStatuses"
                  :key="status"
                  :value="status"
                >
                  {{ getStatusLabel(status) }}
                </option>
              </select>
            </div>

            <button
              @click="handleStatusUpdate"
              class="btn btn-primary w-100"
              :disabled="selectedStatus === contactRequest.status"
            >
              <i class="bi bi-check-circle me-2"></i>
              Update Status
            </button>
          </div>
        </div>

        <!-- Quick Actions Card -->
        <div class="card card-flush mb-5">
          <div class="card-header">
            <h3 class="card-title">Quick Actions</h3>
          </div>
          <div class="card-body pt-0">
            <a
              :href="`mailto:${contactRequest.email}?subject=Re: ${contactRequest.subject || 'Your contact request'}`"
              class="btn btn-light-primary w-100 mb-3"
              target="_blank"
            >
              <i class="bi bi-envelope me-2"></i>
              Reply by Email
            </a>

            <button
              @click="handleCopyEmail(contactRequest.email)"
              class="btn btn-light-info w-100 mb-3"
            >
              <i class="bi bi-clipboard me-2"></i>
              Copy Email
            </button>

            <a
              v-if="contactRequest.phone"
              :href="`tel:${contactRequest.phone}`"
              class="btn btn-light-success w-100 mb-3"
            >
              <i class="bi bi-telephone me-2"></i>
              Call Phone
            </a>

            <div class="separator separator-dashed my-5"></div>

            <button
              @click="handleDelete"
              class="btn btn-light-danger w-100"
            >
              <i class="bi bi-trash me-2"></i>
              Delete
            </button>
          </div>
        </div>

        <!-- Navigation Card -->
        <div class="card card-flush">
          <div class="card-body pt-5">
            <NuxtLink
              to="/contact-requests"
              class="btn btn-light w-100"
            >
              <i class="bi bi-arrow-left me-2"></i>
              Back to List
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="contactRequestsStore.hasError" class="card">
      <div class="card-body">
        <div class="alert alert-danger d-flex align-items-center p-5">
          <i class="ki-duotone ki-shield-cross fs-2hx text-danger me-4">
            <span class="path1"></span>
            <span class="path2"></span>
            <span class="path3"></span>
          </i>
          <div class="d-flex flex-column">
            <h4 class="mb-1 text-dark">An error occurred</h4>
            <span>{{ contactRequestsStore.error }}</span>
          </div>
        </div>
        <NuxtLink to="/contact-requests" class="btn btn-light mt-5">
          <i class="bi bi-arrow-left me-2"></i>
          Back to List
        </NuxtLink>
      </div>
    </div>

    <!-- Not Found State -->
    <div v-else class="card">
      <div class="card-body text-center py-20">
        <i class="bi bi-exclamation-triangle fs-5x text-warning mb-5"></i>
        <div class="fw-bold fs-3 text-gray-600 mb-2">
          Contact request not found
        </div>
        <NuxtLink to="/contact-requests" class="btn btn-primary mt-5">
          <i class="bi bi-arrow-left me-2"></i>
          Back to List
        </NuxtLink>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useContactRequestsStore } from '../stores/useContactRequestsStore'
import { useContactRequestFormatters } from '../composables/useContactRequestFormatters'
import { useContactRequestActions } from '../composables/useContactRequestActions'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import { ContactRequestStatus, STATUS_TRANSITIONS } from '../types'

const route = useRoute()
const router = useRouter()
const contactRequestsStore = useContactRequestsStore()
const breadcrumbStore = useBreadcrumbStore()

const {
  formatDate,
  formatRelativeTime,
  formatPhone,
  getStatusBadgeClass,
  getStatusLabel,
  getStatusIcon
} = useContactRequestFormatters()

const {
  confirmAndDeleteContactRequest,
  updateStatus,
  copyEmailToClipboard
} = useContactRequestActions()

const selectedStatus = ref<ContactRequestStatus | null>(null)

const contactRequest = computed(() => contactRequestsStore.currentContactRequest)

const availableStatuses = computed(() => {
  if (!contactRequest.value) return []
  return STATUS_TRANSITIONS[contactRequest.value.status] || []
})

const handleStatusUpdate = async () => {
  if (!contactRequest.value || !selectedStatus.value || selectedStatus.value === contactRequest.value.status) {
    return
  }

  const success = await updateStatus(contactRequest.value.id, selectedStatus.value)
  if (success) {
    // Refresh the contact request data
    await contactRequestsStore.fetchContactRequest(contactRequest.value.id)
    selectedStatus.value = contactRequest.value.status
  }
}

const handleCopyEmail = async (email: string) => {
  await copyEmailToClipboard(email)
}

const handleDelete = async () => {
  if (!contactRequest.value) return

  const success = await confirmAndDeleteContactRequest(contactRequest.value)
  if (success) {
    router.push('/contact-requests')
  }
}

// Lifecycle
onMounted(async () => {
  const id = route.params.id as string

  if (!id) {
    router.push('/contact-requests')
    return
  }

  try {
    await contactRequestsStore.fetchContactRequest(id)

    if (contactRequest.value) {
      selectedStatus.value = contactRequest.value.status

      breadcrumbStore.setBreadcrumb([
        { title: 'Home', path: '/' },
        { title: 'Contact Requests', path: '/contact-requests' },
        { title: `#${contactRequest.value.id}`, path: `/contact-requests/${id}` }
      ])
    }
  } catch (error) {
    console.error('Failed to load contact request:', error)
  }
})
</script>
