<template>
  <div class="careers-detail">
    <!-- Loading State -->
    <div v-if="isLoading" class="card">
      <div class="card-body text-center py-20">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>

    <!-- Job Position Details -->
    <div v-else-if="job">
      <!-- Header with Actions -->
      <div class="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h1 class="fw-bold">{{ job.title }}</h1>
          <div class="d-flex gap-2 mt-2">
            <span class="badge" :class="getStatusBadgeClass(job.status)">
              {{ getStatusText(job.status) }}
            </span>
            <span class="badge" :class="getJobTypeBadgeClass(job.job_type)">
              {{ getJobTypeText(job.job_type) }}
            </span>
            <span v-if="job.is_remote" class="badge badge-light-success">
              Remote
            </span>
          </div>
        </div>

        <div class="d-flex gap-2">
          <NuxtLink
            :to="`/careers/positions/${job.id}/edit`"
            class="btn btn-light-primary"
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

      <!-- Info Cards -->
      <div class="row g-5 mb-5">
        <div class="col-md-3">
          <div class="card card-flush h-100">
            <div class="card-body">
              <div class="fw-bold text-gray-500 mb-2">Department</div>
              <div class="fw-bold fs-3">{{ job.department || '—' }}</div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card card-flush h-100">
            <div class="card-body">
              <div class="fw-bold text-gray-500 mb-2">Location</div>
              <div class="fw-bold fs-3">{{ job.location || '—' }}</div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card card-flush h-100">
            <div class="card-body">
              <div class="fw-bold text-gray-500 mb-2">Salary</div>
              <div class="fw-bold fs-3">{{ formatSalaryRange(job.salary_range) }}</div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card card-flush h-100">
            <div class="card-body">
              <div class="fw-bold text-gray-500 mb-2">Experience</div>
              <div class="fw-bold fs-3">{{ job.experience_required || '—' }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="row g-5">
        <!-- Left Column -->
        <div class="col-lg-8">
          <!-- Summary -->
          <div class="card mb-5">
            <div class="card-header">
              <h3 class="card-title">Summary</h3>
            </div>
            <div class="card-body">
              <p class="fs-5 text-gray-700">{{ job.summary }}</p>
            </div>
          </div>

          <!-- Description -->
          <div class="card mb-5">
            <div class="card-header">
              <h3 class="card-title">Description</h3>
            </div>
            <div class="card-body">
              <div class="text-gray-700" style="white-space: pre-wrap">{{ job.description }}</div>
            </div>
          </div>

          <!-- Responsibilities -->
          <div class="card mb-5" v-if="job.responsibilities && job.responsibilities.length > 0">
            <div class="card-header">
              <h3 class="card-title">Responsibilities</h3>
            </div>
            <div class="card-body">
              <ul class="list-unstyled">
                <li
                  v-for="(item, index) in job.responsibilities"
                  :key="index"
                  class="d-flex align-items-start mb-3"
                >
                  <i class="ki-duotone ki-check-circle fs-2 text-success me-3">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                  <span class="text-gray-700">{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Requirements -->
          <div class="card mb-5" v-if="job.requirements && job.requirements.length > 0">
            <div class="card-header">
              <h3 class="card-title">Required Qualifications</h3>
            </div>
            <div class="card-body">
              <ul class="list-unstyled">
                <li
                  v-for="(item, index) in job.requirements"
                  :key="index"
                  class="d-flex align-items-start mb-3"
                >
                  <i class="ki-duotone ki-shield-tick fs-2 text-primary me-3">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                  <span class="text-gray-700">{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Nice to Have -->
          <div class="card mb-5" v-if="job.nice_to_have && job.nice_to_have.length > 0">
            <div class="card-header">
              <h3 class="card-title">Nice to Have</h3>
            </div>
            <div class="card-body">
              <ul class="list-unstyled">
                <li
                  v-for="(item, index) in job.nice_to_have"
                  :key="index"
                  class="d-flex align-items-start mb-3"
                >
                  <i class="ki-duotone ki-star fs-2 text-warning me-3">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                  <span class="text-gray-700">{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Benefits -->
          <div class="card mb-5" v-if="job.benefits && job.benefits.length > 0">
            <div class="card-header">
              <h3 class="card-title">Benefits</h3>
            </div>
            <div class="card-body">
              <ul class="list-unstyled">
                <li
                  v-for="(item, index) in job.benefits"
                  :key="index"
                  class="d-flex align-items-start mb-3"
                >
                  <i class="ki-duotone ki-gift fs-2 text-info me-3">
                    <span class="path1"></span>
                    <span class="path2"></span>
                    <span class="path3"></span>
                  </i>
                  <span class="text-gray-700">{{ item }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Right Column - Sidebar -->
        <div class="col-lg-4">
          <!-- Publication Info -->
          <div class="card mb-5">
            <div class="card-header">
              <h3 class="card-title">Publication Information</h3>
            </div>
            <div class="card-body">
              <div class="mb-5">
                <div class="fw-bold text-gray-500 mb-2">Publication Date</div>
                <div class="text-gray-800">{{ formatDate(job.posted_date) }}</div>
                <div class="text-muted fs-7">{{ formatRelativeDate(job.posted_date) }}</div>
              </div>

              <div class="mb-5">
                <div class="fw-bold text-gray-500 mb-2">Status</div>
                <span class="badge badge-lg" :class="getStatusBadgeClass(job.status)">
                  {{ getStatusText(job.status) }}
                </span>
              </div>

              <div class="mb-5">
                <div class="fw-bold text-gray-500 mb-2">Contract Type</div>
                <span class="badge badge-lg" :class="getJobTypeBadgeClass(job.job_type)">
                  {{ getJobTypeText(job.job_type) }}
                </span>
              </div>

              <div class="mb-5">
                <div class="fw-bold text-gray-500 mb-2">Work Mode</div>
                <span class="badge badge-lg" :class="getRemoteBadgeClass(job.is_remote)">
                  {{ getRemoteText(job.is_remote) }}
                </span>
              </div>

              <div class="separator my-5"></div>

              <div class="mb-3">
                <div class="fw-bold text-gray-500 mb-2">Created On</div>
                <div class="text-gray-800 fs-7">{{ formatDate(job.created_at) }}</div>
              </div>

              <div>
                <div class="fw-bold text-gray-500 mb-2">Updated On</div>
                <div class="text-gray-800 fs-7">{{ formatDate(job.updated_at) }}</div>
              </div>
            </div>
          </div>

          <!-- Skills -->
          <div class="card mb-5" v-if="job.skills && job.skills.length > 0">
            <div class="card-header">
              <h3 class="card-title">Technical Skills</h3>
            </div>
            <div class="card-body">
              <div class="d-flex flex-wrap gap-2">
                <span
                  v-for="(skill, index) in job.skills"
                  :key="index"
                  class="badge badge-light-primary fs-7"
                >
                  {{ skill }}
                </span>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Quick Actions</h3>
            </div>
            <div class="card-body">
              <div class="d-flex flex-column gap-3">
                <button
                  type="button"
                  class="btn btn-light-primary w-100"
                  @click="handleToggleStatus"
                >
                  <i class="ki-duotone ki-toggle-on fs-2 me-2">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                  {{ job.status === 'ACTIVE' ? 'Close Position' : 'Open Position' }}
                </button>

                <NuxtLink
                  to="/careers/positions"
                  class="btn btn-light w-100"
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
    </div>

    <!-- Error State -->
    <div v-else class="alert alert-danger">
      <strong>Error:</strong> Unable to load job position
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCareersStore } from '../stores/useCareersStore'
import { useCareerFormatters } from '../composables/useCareerFormatters'
import { useCareerActions } from '../composables/useCareerActions'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'

const route = useRoute()
const router = useRouter()
const careersStore = useCareersStore()
const breadcrumbStore = useBreadcrumbStore()
const { showSuccess } = useNotification()

const {
  getStatusBadgeClass,
  getStatusText,
  getJobTypeBadgeClass,
  getJobTypeText,
  getRemoteBadgeClass,
  getRemoteText,
  formatDate,
  formatRelativeDate,
  formatSalaryRange
} = useCareerFormatters()

const { confirmAndDeleteJobPosition, toggleJobPositionStatus } = useCareerActions()

const isLoading = ref(true)

const job = computed(() => careersStore.currentJobPosition)

const handleDelete = async () => {
  if (job.value) {
    const success = await confirmAndDeleteJobPosition(job.value)
    if (success) {
      router.push('/careers/positions')
    }
  }
}

const handleToggleStatus = async () => {
  if (job.value) {
    await toggleJobPositionStatus(job.value)
  }
}

onMounted(async () => {
  try {
    const id = route.params.id as string
    const jobPosition = await careersStore.fetchJobPosition(id)

    if (jobPosition) {
      breadcrumbStore.setBreadcrumb([
        { title: 'Home', path: '/' },
        { title: 'Job Positions', path: '/careers/positions' },
        { title: jobPosition.title, path: `/careers/positions/${id}` }
      ])
    }
  } catch (error) {
    console.error('Error loading job position:', error)
  } finally {
    isLoading.value = false
  }
})
</script>
