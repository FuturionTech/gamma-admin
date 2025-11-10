<template>
  <div class="certifications-view">
    <!-- Loading State -->
    <div v-if="isLoading">
      <PageHeader title="Certification" />
      <div class="card">
        <div class="card-body">
          <CardSkeleton :lines="10" :showActions="true" />
        </div>
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="certification">
      <!-- Page Header -->
      <PageHeader
        :title="certification.title"
        subtitle="Certification details"
      >
        <template #actions>
          <button
            type="button"
            class="btn btn-light-primary me-3"
            @click="handleDownload"
          >
            <i class="ki-duotone ki-file-down fs-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            Download
          </button>

          <NuxtLink
            :to="`/certifications/${certification.id}/edit`"
            class="btn btn-primary"
          >
            <i class="ki-duotone ki-notepad-edit fs-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            Edit
          </NuxtLink>
        </template>
      </PageHeader>

      <div class="row g-5 g-xl-8">
        <!-- Details Card -->
        <div class="col-xl-4">
          <div class="card card-flush h-xl-100">
            <div class="card-header">
              <h3 class="card-title">Details</h3>
            </div>

            <div class="card-body pt-0">
              <!-- Title -->
              <div class="mb-7">
                <div class="fw-bold text-gray-600 mb-2">Title</div>
                <div class="fw-bold fs-4">{{ certification.title }}</div>
              </div>

              <!-- Category -->
              <div class="mb-7">
                <div class="fw-bold text-gray-600 mb-2">Category</div>
                <span
                  v-if="certification.category"
                  class="badge badge-lg"
                  :class="getCategoryBadgeClass(certification.category.name)"
                >
                  {{ certification.category.name }}
                </span>
                <span v-else class="text-muted">—</span>
              </div>

              <!-- Issued Date -->
              <div class="mb-7">
                <div class="fw-bold text-gray-600 mb-2">Issue Date</div>
                <div v-if="certification.issued_date">
                  {{ formatDate(certification.issued_date) }}
                  <span class="text-muted ms-2">({{ getCertificationAge(certification.issued_date) }})</span>
                </div>
                <div v-else class="text-muted">—</div>
              </div>

              <!-- Status -->
              <div class="mb-7">
                <div class="fw-bold text-gray-600 mb-2">Status</div>
                <span
                  class="badge badge-lg"
                  :class="getStatusBadgeClass(certification.is_active)"
                >
                  {{ getStatusText(certification.is_active) }}
                </span>
              </div>

              <!-- Recent Badge -->
              <div class="mb-7" v-if="certification.issued_date && isRecent(certification.issued_date)">
                <span class="badge badge-light-success badge-lg">
                  <i class="ki-duotone ki-star fs-3">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                  Recent
                </span>
              </div>

              <!-- Created/Updated -->
              <div class="separator my-5"></div>

              <div class="mb-5">
                <div class="fw-bold text-gray-600 mb-2">Created At</div>
                <div class="text-gray-800">{{ formatDateTime(certification.created_at) }}</div>
              </div>

              <div>
                <div class="fw-bold text-gray-600 mb-2">Updated At</div>
                <div class="text-gray-800">{{ formatDateTime(certification.updated_at) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- File Preview Card -->
        <div class="col-xl-8">
          <div class="card card-flush h-xl-100">
            <div class="card-header">
              <h3 class="card-title">
                Preview
                <span class="ms-3 badge badge-light-primary">
                  {{ getFileExtension(certification.file_url) }}
                </span>
              </h3>
              <div class="card-toolbar">
                <a
                  :href="certification.file_url"
                  target="_blank"
                  class="btn btn-sm btn-light-primary"
                >
                  <i class="ki-duotone ki-arrow-up-right fs-2">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                  Open in new tab
                </a>
              </div>
            </div>

            <div class="card-body pt-0">
              <!-- PDF Preview -->
              <div v-if="getFileType(certification.file_url) === 'pdf'" class="pdf-preview">
                <iframe
                  :src="certification.file_url"
                  class="w-100 rounded border"
                  style="min-height: 800px;"
                  frameborder="0"
                >
                  Your browser does not support PDF display. Please download the file.
                </iframe>
              </div>

              <!-- Image Preview -->
              <div v-else class="image-preview text-center">
                <img
                  :src="certification.file_url"
                  :alt="certification.title"
                  class="img-fluid rounded border"
                  style="max-width: 100%;"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions Card -->
      <div class="card mt-5">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h4 class="mb-2">Actions</h4>
              <p class="text-muted mb-0">Manage this certification</p>
            </div>
            <div class="d-flex gap-3">
              <button
                type="button"
                class="btn btn-light"
                @click="handleToggleStatus"
              >
                <i
                  class="ki-duotone fs-2"
                  :class="certification.is_active ? 'ki-cross-circle' : 'ki-check-circle'"
                >
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
                {{ certification.is_active ? 'Deactivate' : 'Activate' }}
              </button>
              <button
                type="button"
                class="btn btn-danger"
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
    </div>

    <!-- Error State -->
    <div v-else>
      <PageHeader title="Certification" />
      <div class="alert alert-danger">
        <i class="ki-duotone ki-shield-cross fs-2hx text-danger me-4">
          <span class="path1"></span>
          <span class="path2"></span>
          <span class="path3"></span>
        </i>
        Certification not found
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCertificationsStore } from '../stores/useCertificationsStore'
import { useCertificationFormatters } from '../composables/useCertificationFormatters'
import { useCertificationActions } from '../composables/useCertificationActions'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import type { Certification } from '../types'

const certificationsStore = useCertificationsStore()
const breadcrumbStore = useBreadcrumbStore()
const router = useRouter()
const route = useRoute()

const {
  formatDate,
  formatDateTime,
  getStatusBadgeClass,
  getStatusText,
  getCategoryBadgeClass,
  getFileType,
  getFileExtension,
  getCertificationAge,
  isRecent
} = useCertificationFormatters()

const {
  confirmAndDeleteCertification,
  toggleCertificationStatus,
  downloadCertificationFile
} = useCertificationActions()

// Component state
const certification = ref<Certification | null>(null)
const isLoading = ref(true)

// Handlers
const handleDownload = () => {
  if (certification.value) {
    downloadCertificationFile(certification.value)
  }
}

const handleToggleStatus = async () => {
  if (certification.value) {
    await toggleCertificationStatus(certification.value)
    // Reload certification to get updated data
    const certId = route.params.id as string
    certification.value = await certificationsStore.fetchCertification(certId)
  }
}

const handleDelete = async () => {
  if (certification.value) {
    const deleted = await confirmAndDeleteCertification(certification.value)
    if (deleted) {
      router.push('/certifications')
    }
  }
}

// Lifecycle
onMounted(async () => {
  const certificationId = route.params.id as string

  try {
    isLoading.value = true

    // Load certification
    const cert = await certificationsStore.fetchCertification(certificationId)
    if (cert) {
      certification.value = cert
    }

    // Set breadcrumb
    breadcrumbStore.setBreadcrumb([
      { title: 'Home', path: '/' },
      { title: 'Certifications', path: '/certifications' },
      { title: cert?.title || 'Certification', path: `/certifications/${certificationId}` }
    ])
  } catch (error) {
    console.error('Error loading certification:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.pdf-preview iframe {
  display: block;
}

.image-preview img {
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}
</style>
