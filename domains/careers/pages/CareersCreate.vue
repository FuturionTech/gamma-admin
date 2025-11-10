<template>
  <!-- Page Header -->
  <PageHeader
    title="New Job Position"
    subtitle="Create a new career opportunity"
  />

  <!-- Loading State -->
  <div v-if="isSubmitting" class="text-center py-20">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>

  <!-- Form -->
  <form v-else @submit.prevent="handleSubmit">
    <!-- Section 1: Basic Information -->
    <div class="card card-flush mb-5">
      <div class="card-header">
        <h3 class="card-title">Basic Information</h3>
      </div>
      <div class="card-body pt-0">
        <div class="row">
          <!-- Job Title -->
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

          <!-- Department -->
          <div class="col-lg-6 mb-5">
            <label class="form-label">Department</label>
            <select
              v-model="form.department"
              class="form-select"
              :class="{ 'is-invalid': errors.department }"
            >
              <option :value="null">Select a department</option>
              <option v-for="dept in DEPARTMENTS" :key="dept" :value="dept">
                {{ dept }}
              </option>
            </select>
            <div v-if="errors.department" class="invalid-feedback">
              {{ errors.department }}
            </div>
          </div>

          <!-- Location -->
          <div class="col-lg-4 mb-5">
            <label class="form-label">Location</label>
            <input
              type="text"
              v-model="form.location"
              class="form-control"
              :class="{ 'is-invalid': errors.location }"
              placeholder="e.g. Paris, France"
            />
            <div v-if="errors.location" class="invalid-feedback">
              {{ errors.location }}
            </div>
          </div>

          <!-- Job Type -->
          <div class="col-lg-4 mb-5">
            <label class="form-label required">Contract Type</label>
            <select
              v-model="form.job_type"
              class="form-select"
              :class="{ 'is-invalid': errors.job_type }"
            >
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
            </select>
            <div v-if="errors.job_type" class="invalid-feedback">
              {{ errors.job_type }}
            </div>
          </div>

          <!-- Remote -->
          <div class="col-lg-4 mb-5">
            <label class="form-label">Work Mode</label>
            <div class="form-check form-switch mt-3">
              <input
                class="form-check-input"
                type="checkbox"
                v-model="form.is_remote"
                id="isRemoteSwitch"
              />
              <label class="form-check-label" for="isRemoteSwitch">
                Remote Position
              </label>
            </div>
          </div>

          <!-- Salary Range -->
          <div class="col-lg-6 mb-5">
            <label class="form-label">Salary Range</label>
            <input
              type="text"
              v-model="form.salary_range"
              class="form-control"
              :class="{ 'is-invalid': errors.salary_range }"
              placeholder="e.g. 60K-80K EUR"
            />
            <div v-if="errors.salary_range" class="invalid-feedback">
              {{ errors.salary_range }}
            </div>
            <div class="form-text">Suggested format: XX-XX EUR/USD</div>
          </div>

          <!-- Experience Required -->
          <div class="col-lg-6 mb-5">
            <label class="form-label">Experience Required</label>
            <input
              type="text"
              v-model="form.experience_required"
              class="form-control"
              :class="{ 'is-invalid': errors.experience_required }"
              placeholder="e.g. 5+ years"
            />
            <div v-if="errors.experience_required" class="invalid-feedback">
              {{ errors.experience_required }}
            </div>
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
        <!-- Summary -->
        <div class="mb-5">
          <label class="form-label required">Summary</label>
          <textarea
            v-model="form.summary"
            class="form-control"
            :class="{ 'is-invalid': errors.summary }"
            rows="3"
            maxlength="300"
            placeholder="Short summary of the position (max 300 characters)"
            @input="errors.summary = ''"
          ></textarea>
          <div v-if="errors.summary" class="invalid-feedback">
            {{ errors.summary }}
          </div>
          <div class="form-text">
            {{ form.summary?.length || 0 }} / 300 characters
          </div>
        </div>

        <!-- Description -->
        <div class="mb-5">
          <label class="form-label required">Full Description</label>
          <textarea
            v-model="form.description"
            class="form-control"
            :class="{ 'is-invalid': errors.description }"
            rows="8"
            placeholder="Detailed job description..."
            @input="errors.description = ''"
          ></textarea>
          <div v-if="errors.description" class="invalid-feedback">
            {{ errors.description }}
          </div>
          <div class="form-text">You can use rich text</div>
        </div>
      </div>
    </div>

    <!-- Section 3: Requirements -->
    <div class="card card-flush mb-5">
      <div class="card-header">
        <h3 class="card-title">Requirements</h3>
      </div>
      <div class="card-body pt-0">
        <!-- Responsibilities -->
        <ArrayManager
          v-model="form.responsibilities"
          label="Responsibilities"
          description="List the main responsibilities of the position"
          placeholder="e.g. Develop and maintain AI features"
          add-button-text="Add Responsibility"
          :required="true"
          :min-items="3"
          :error="errors.responsibilities"
        />

        <!-- Requirements -->
        <ArrayManager
          v-model="form.requirements"
          label="Required Qualifications"
          description="Mandatory skills and qualifications"
          placeholder="e.g. Proficiency in Python and TensorFlow"
          add-button-text="Add Requirement"
          :required="true"
          :min-items="3"
          :error="errors.requirements"
        />

        <!-- Nice to Have -->
        <ArrayManager
          v-model="form.nice_to_have"
          label="Nice to Have"
          description="Desired but not mandatory skills"
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
        <!-- Benefits -->
        <ArrayManager
          v-model="form.benefits"
          label="Benefits"
          description="Benefits offered by the company"
          placeholder="e.g. Comprehensive health insurance"
          add-button-text="Add Benefit"
          :required="false"
        />

        <!-- Skills -->
        <ArrayManager
          v-model="form.skills"
          label="Technical Skills"
          description="Technologies and tools associated with the position"
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
          <!-- Posted Date -->
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
            <div class="form-text">Date when the position is published</div>
          </div>

          <!-- Status -->
          <div class="col-lg-6 mb-5">
            <label class="form-label required">Status</label>
            <select
              v-model="form.status"
              class="form-select"
              :class="{ 'is-invalid': errors.status }"
            >
              <option value="ACTIVE">Active</option>
              <option value="CLOSED">Closed</option>
            </select>
            <div v-if="errors.status" class="invalid-feedback">
              {{ errors.status }}
            </div>
            <div class="form-text">
              Only active positions are publicly visible
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Actions -->
    <div class="d-flex justify-content-end gap-3">
      <NuxtLink to="/careers/positions" class="btn btn-light">
        Cancel
      </NuxtLink>
      <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
        <span v-if="isSubmitting">
          <span
            class="spinner-border spinner-border-sm me-2"
            role="status"
          ></span>
          Creating...
        </span>
        <span v-else> Create Position </span>
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCareersStore } from "../stores/useCareersStore";
import { useBreadcrumbStore } from "~/domains/shared/stores/breadcrumbStore";
import { DEPARTMENTS, JobType, JobStatus } from "../types";
import type { CreateJobPositionInput } from "../types";

const router = useRouter();
const careersStore = useCareersStore();
const breadcrumbStore = useBreadcrumbStore();
const { showSuccess, showError } = useNotification();

// Form data
const form = ref<CreateJobPositionInput>({
  application_id: "1",
  title: "",
  department: null,
  location: null,
  job_type: JobType.FULL_TIME,
  is_remote: false,
  salary_range: null,
  experience_required: null,
  summary: "",
  description: "",
  responsibilities: [],
  requirements: [],
  nice_to_have: [],
  benefits: [],
  skills: [],
  posted_date: new Date().toISOString().split("T")[0],
  status: JobStatus.ACTIVE,
});

// Errors
const errors = ref<Record<string, string>>({});

// State
const isSubmitting = ref(false);

// Computed
const today = computed(() => new Date().toISOString().split("T")[0]);

// Validation
const validateForm = (): boolean => {
  errors.value = {};

  // Required fields
  if (!form.value.title || form.value.title.trim() === "") {
    errors.value.title = "Title is required";
  }

  if (!form.value.summary || form.value.summary.trim() === "") {
    errors.value.summary = "Summary is required";
  } else if (form.value.summary.length > 300) {
    errors.value.summary = "Summary cannot exceed 300 characters";
  }

  if (!form.value.description || form.value.description.trim() === "") {
    errors.value.description = "Description is required";
  }

  if (!form.value.posted_date) {
    errors.value.posted_date = "Publication date is required";
  } else if (new Date(form.value.posted_date) > new Date()) {
    errors.value.posted_date = "Publication date cannot be in the future";
  }

  // Array validations
  if (!form.value.responsibilities || form.value.responsibilities.length < 3) {
    errors.value.responsibilities = "At least 3 responsibilities are required";
  }

  if (!form.value.requirements || form.value.requirements.length < 3) {
    errors.value.requirements = "At least 3 requirements are required";
  }

  return Object.keys(errors.value).length === 0;
};

// Submit handler
const handleSubmit = async () => {
  if (!validateForm()) {
    showError("Please correct the form errors");
    return;
  }

  isSubmitting.value = true;

  try {
    const jobPosition = await careersStore.createJobPosition(form.value);
    showSuccess("Job position created successfully");
    router.push(`/careers/positions/${jobPosition.id}`);
  } catch (error: any) {
    console.error("Error creating job position:", error);
    showError(error.message || "Failed to create job position");
  } finally {
    isSubmitting.value = false;
  }
};

// Lifecycle
onMounted(() => {
  breadcrumbStore.setBreadcrumb([
    { title: "Home", path: "/" },
    { title: "Job Positions", path: "/careers/positions" },
    { title: "New Position", path: "/careers/positions/create" },
  ]);
});
</script>
