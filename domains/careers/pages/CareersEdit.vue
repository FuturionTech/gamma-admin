<template>
  <div class="careers-edit">
    <!-- Page Header -->
    <PageHeader
      :title="`Edit: ${careersStore.currentJobPosition?.title || ''}`"
      subtitle="Update job position details"
    />

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-20">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Form -->
    <form v-else-if="careersStore.currentJobPosition" @submit.prevent="handleSubmit">
          <!-- Section 1: Basic Information -->
          <div class="card card-flush mb-5">
            <div class="card-header">
              <h3 class="card-title">Basic Information</h3>
            </div>
            <div class="card-body pt-0">
              <div class="row">
                <div class="col-lg-6 mb-5">
                  <label class="form-label required">Job Title</label>
                  <input
                    type="text"
                    v-model="form.title"
                    class="form-control"
                    :class="{ 'is-invalid': errors.title }"
                    placeholder="e.g. Senior AI Engineer"
                    @input="errors.title = ''"
                  />
                  <div v-if="errors.title" class="invalid-feedback">
                    {{ errors.title }}
                  </div>
                </div>

                <div class="col-lg-6 mb-5">
                  <label class="form-label">Department</label>
                  <select v-model="form.department" class="form-select">
                    <option :value="null">Select a department</option>
                    <option v-for="dept in DEPARTMENTS" :key="dept" :value="dept">
                      {{ dept }}
                    </option>
                  </select>
                </div>

                <div class="col-lg-4 mb-5">
                  <label class="form-label">Location</label>
                  <input
                    type="text"
                    v-model="form.location"
                    class="form-control"
                    placeholder="e.g. Paris, France"
                  />
                </div>

                <div class="col-lg-4 mb-5">
                  <label class="form-label required">Contract Type</label>
                  <select v-model="form.job_type" class="form-select">
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="CONTRACT">Contract</option>
                  </select>
                </div>

                <div class="col-lg-4 mb-5">
                  <label class="form-label">Work Mode</label>
                  <div class="form-check form-switch mt-3">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      v-model="form.is_remote"
                      id="isRemoteSwitchEdit"
                    />
                    <label class="form-check-label" for="isRemoteSwitchEdit">
                      Remote Position
                    </label>
                  </div>
                </div>

                <div class="col-lg-6 mb-5">
                  <label class="form-label">Salary Range</label>
                  <input
                    type="text"
                    v-model="form.salary_range"
                    class="form-control"
                    placeholder="e.g. 60K-80K EUR"
                  />
                </div>

                <div class="col-lg-6 mb-5">
                  <label class="form-label">Experience Required</label>
                  <input
                    type="text"
                    v-model="form.experience_required"
                    class="form-control"
                    placeholder="e.g. 5+ years"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Section 2: Description -->
          <div class="card card-flush mb-5">
            <div class="card-header">
              <h3 class="card-title">Job Description</h3>
            </div>
            <div class="card-body pt-0">
              <div class="mb-5">
                <label class="form-label required">Summary</label>
                <textarea
                  v-model="form.summary"
                  class="form-control"
                  :class="{ 'is-invalid': errors.summary }"
                  rows="3"
                  maxlength="300"
                  @input="errors.summary = ''"
                ></textarea>
                <div v-if="errors.summary" class="invalid-feedback">
                  {{ errors.summary }}
                </div>
                <div class="form-text">{{ form.summary?.length || 0 }} / 300 characters</div>
              </div>

              <div class="mb-5">
                <label class="form-label required">Full Description</label>
                <textarea
                  v-model="form.description"
                  class="form-control"
                  :class="{ 'is-invalid': errors.description }"
                  rows="8"
                  @input="errors.description = ''"
                ></textarea>
                <div v-if="errors.description" class="invalid-feedback">
                  {{ errors.description }}
                </div>
              </div>
            </div>
          </div>

          <!-- Section 3: Requirements -->
          <div class="card card-flush mb-5">
            <div class="card-header">
              <h3 class="card-title">Requirements</h3>
            </div>
            <div class="card-body pt-0">
              <ArrayManager
                v-model="form.responsibilities"
                label="Responsibilities"
                placeholder="e.g. Develop and maintain AI features"
                add-button-text="Add Responsibility"
                :required="true"
                :min-items="3"
                :error="errors.responsibilities"
              />

              <ArrayManager
                v-model="form.requirements"
                label="Required Qualifications"
                placeholder="e.g. Proficiency in Python and TensorFlow"
                add-button-text="Add Requirement"
                :required="true"
                :min-items="3"
                :error="errors.requirements"
              />

              <ArrayManager
                v-model="form.nice_to_have"
                label="Nice to Have"
                placeholder="e.g. Experience with PyTorch"
                add-button-text="Add Bonus Skill"
                :required="false"
              />
            </div>
          </div>

          <!-- Section 4: Perks -->
          <div class="card card-flush mb-5">
            <div class="card-header">
              <h3 class="card-title">Benefits and Skills</h3>
            </div>
            <div class="card-body pt-0">
              <ArrayManager
                v-model="form.benefits"
                label="Benefits"
                placeholder="e.g. Comprehensive health insurance"
                add-button-text="Add Benefit"
                :required="false"
              />

              <ArrayManager
                v-model="form.skills"
                label="Technical Skills"
                placeholder="e.g. Python, Machine Learning, AWS"
                add-button-text="Add Skill"
                :required="false"
              />
            </div>
          </div>

          <!-- Section 5: Publication -->
          <div class="card card-flush mb-5">
            <div class="card-header">
              <h3 class="card-title">Publication</h3>
            </div>
            <div class="card-body pt-0">
              <div class="row">
                <div class="col-lg-6 mb-5">
                  <label class="form-label required">Publication Date</label>
                  <input
                    type="date"
                    v-model="form.posted_date"
                    class="form-control"
                    :class="{ 'is-invalid': errors.posted_date }"
                    :max="today"
                  />
                  <div v-if="errors.posted_date" class="invalid-feedback">
                    {{ errors.posted_date }}
                  </div>
                </div>

                <div class="col-lg-6 mb-5">
                  <label class="form-label required">Status</label>
                  <select v-model="form.status" class="form-select">
                    <option value="ACTIVE">Active</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="d-flex justify-content-end gap-3">
            <NuxtLink :to="`/careers/positions/${route.params.id}`" class="btn btn-light">
              Cancel
            </NuxtLink>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="isSubmitting"
            >
              <span v-if="isSubmitting">
                <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                Updating...
              </span>
              <span v-else>
                Save Changes
              </span>
            </button>
          </div>
        </form>

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
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import { DEPARTMENTS } from '../types'
import type { UpdateJobPositionInput } from '../types'

const route = useRoute()
const router = useRouter()
const careersStore = useCareersStore()
const breadcrumbStore = useBreadcrumbStore()
const { showSuccess, showError } = useNotification()

const isLoading = ref(true)
const isSubmitting = ref(false)
const errors = ref<Record<string, string>>({})

const form = ref<UpdateJobPositionInput>({
  title: '',
  department: null,
  location: null,
  job_type: null,
  is_remote: null,
  salary_range: null,
  experience_required: null,
  summary: '',
  description: '',
  responsibilities: [],
  requirements: [],
  nice_to_have: [],
  benefits: [],
  skills: [],
  posted_date: null,
  status: null
})

const today = computed(() => new Date().toISOString().split('T')[0])

const validateForm = (): boolean => {
  errors.value = {}

  if (!form.value.title || form.value.title.trim() === '') {
    errors.value.title = 'Title is required'
  }

  if (!form.value.summary || form.value.summary.trim() === '') {
    errors.value.summary = 'Summary is required'
  } else if (form.value.summary.length > 300) {
    errors.value.summary = 'Summary cannot exceed 300 characters'
  }

  if (!form.value.description || form.value.description.trim() === '') {
    errors.value.description = 'Description is required'
  }

  if (form.value.responsibilities && form.value.responsibilities.length < 3) {
    errors.value.responsibilities = 'At least 3 responsibilities are required'
  }

  if (form.value.requirements && form.value.requirements.length < 3) {
    errors.value.requirements = 'At least 3 requirements are required'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    showError('Please correct the form errors')
    return
  }

  isSubmitting.value = true

  try {
    const id = route.params.id as string
    await careersStore.updateJobPosition(id, form.value)
    showSuccess('Job position updated successfully')
    router.push(`/careers/positions/${id}`)
  } catch (error: any) {
    console.error('Error updating job position:', error)
    showError(error.message || 'Failed to update job position')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  try {
    const id = route.params.id as string
    const jobPosition = await careersStore.fetchJobPosition(id)

    if (jobPosition) {
      // Populate form with existing data
      form.value = {
        title: jobPosition.title,
        department: jobPosition.department,
        location: jobPosition.location,
        job_type: jobPosition.job_type,
        is_remote: jobPosition.is_remote,
        salary_range: jobPosition.salary_range,
        experience_required: jobPosition.experience_required,
        summary: jobPosition.summary,
        description: jobPosition.description,
        responsibilities: jobPosition.responsibilities || [],
        requirements: jobPosition.requirements || [],
        nice_to_have: jobPosition.nice_to_have || [],
        benefits: jobPosition.benefits || [],
        skills: jobPosition.skills || [],
        posted_date: jobPosition.posted_date?.split('T')[0] || null,
        status: jobPosition.status
      }

      breadcrumbStore.setBreadcrumb([
        { title: 'Home', path: '/' },
        { title: 'Job Positions', path: '/careers/positions' },
        { title: jobPosition.title, path: `/careers/positions/${id}` },
        { title: 'Edit', path: `/careers/positions/${id}/edit` }
      ])
    }
  } catch (error) {
    showError('Unable to load job position')
  } finally {
    isLoading.value = false
  }
})
</script>
