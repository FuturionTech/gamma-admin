<template>
  <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
    <div class="d-flex flex-column flex-column-fluid">
      <div id="kt_app_content" class="app-content flex-column-fluid">
        <div id="kt_app_content_container" class="app-container container-fluid">

          <form class="gn-form" novalidate @submit.prevent="handleSubmit">
            <!-- Hero -->
            <header class="gn-form__hero">
              <div class="gn-form__hero-icon" aria-hidden="true">
                <GIcon name="briefcase" :size="32" />
              </div>
              <div class="gn-form__hero-body">
                <span class="gn-form__eyebrow">New job position</span>
                <h1 class="gn-form__title">{{ form.title || 'Untitled position' }}</h1>
                <p class="gn-form__subtitle">
                  {{ form.department || 'Post a role and let the world know Gamma Neutral is hiring.' }}
                </p>
              </div>
              <div class="gn-form__hero-actions">
                <NuxtLink to="/careers/positions" class="gn-form__btn gn-form__btn--secondary">
                  Cancel
                </NuxtLink>
                <button
                  type="submit"
                  class="gn-form__btn gn-form__btn--primary"
                  :disabled="isSubmitting"
                >
                  <span v-if="!isSubmitting">Create position</span>
                  <span v-else class="gn-form__btn-loading">
                    <span class="gn-form__spinner" />
                    Creating…
                  </span>
                </button>
              </div>
            </header>

            <div class="gn-form__layout">
              <!-- Main column -->
              <div class="gn-form__main">
                <!-- Role overview -->
                <section class="gn-form__card">
                  <header class="gn-form__card-header">
                    <h3 class="gn-form__card-title">Role overview</h3>
                    <p class="gn-form__card-hint">The basics candidates see first.</p>
                  </header>

                  <div class="gn-form__grid">
                    <div class="gn-form__field gn-form__field--full">
                      <label class="gn-form__label" for="job-title">
                        Job title <span class="gn-form__required">*</span>
                      </label>
                      <input
                        id="job-title"
                        v-model="form.title"
                        type="text"
                        class="gn-form__input"
                        :class="{ 'gn-form__input--error': errors.title }"
                        placeholder="e.g. Senior Data Engineer"
                        @input="clearError('title')"
                      />
                      <span v-if="errors.title" class="gn-form__helper gn-form__helper--error">
                        {{ errors.title }}
                      </span>
                    </div>

                    <div class="gn-form__field">
                      <label class="gn-form__label" for="job-department">Department</label>
                      <select
                        id="job-department"
                        v-model="form.department"
                        class="gn-form__select"
                      >
                        <option :value="null">Select a department</option>
                        <option v-for="dept in DEPARTMENTS" :key="dept" :value="dept">
                          {{ dept }}
                        </option>
                      </select>
                    </div>

                    <div class="gn-form__field">
                      <label class="gn-form__label" for="job-location">Location</label>
                      <div class="gn-form__input-group">
                        <span class="gn-form__input-icon">
                          <GIcon name="map-pin" :size="18" />
                        </span>
                        <input
                          id="job-location"
                          v-model="form.location"
                          type="text"
                          class="gn-form__input gn-form__input--with-icon"
                          placeholder="e.g. Toronto, Canada"
                        />
                      </div>
                    </div>

                    <div class="gn-form__field">
                      <label class="gn-form__label">Contract type <span class="gn-form__required">*</span></label>
                      <div class="gn-form__segmented" role="tablist">
                        <button
                          v-for="option in contractOptions"
                          :key="option.value"
                          type="button"
                          role="tab"
                          :aria-selected="form.job_type === option.value"
                          class="gn-form__segmented-tab"
                          :class="{ 'gn-form__segmented-tab--active': form.job_type === option.value }"
                          @click="form.job_type = option.value"
                        >
                          {{ option.label }}
                        </button>
                      </div>
                    </div>

                    <div class="gn-form__field">
                      <label class="gn-form__label">Work mode</label>
                      <label class="gn-form__toggle gn-form__toggle--inline">
                        <input
                          v-model="form.is_remote"
                          type="checkbox"
                          class="gn-form__toggle-input"
                        />
                        <span class="gn-form__toggle-track">
                          <span class="gn-form__toggle-thumb" />
                        </span>
                        <span class="gn-form__toggle-body">
                          <span class="gn-form__toggle-title">
                            {{ form.is_remote ? 'Remote-friendly' : 'On-site' }}
                          </span>
                          <span class="gn-form__toggle-hint">
                            {{
                              form.is_remote
                                ? 'Candidates can work from anywhere'
                                : 'Candidates must work from the office'
                            }}
                          </span>
                        </span>
                      </label>
                    </div>

                    <div class="gn-form__field">
                      <label class="gn-form__label" for="job-experience">Experience required</label>
                      <input
                        id="job-experience"
                        v-model="form.experience_required"
                        type="text"
                        class="gn-form__input"
                        placeholder="e.g. 5+ years"
                      />
                    </div>

                    <div class="gn-form__field">
                      <label class="gn-form__label" for="job-salary">Salary range</label>
                      <div class="gn-form__input-group">
                        <span class="gn-form__input-prefix">CA$</span>
                        <input
                          id="job-salary"
                          v-model="form.salary_range"
                          type="text"
                          class="gn-form__input gn-form__input--with-prefix"
                          placeholder="85K–120K"
                        />
                      </div>
                      <span class="gn-form__helper">Canadian dollars. Leave blank to hide on the public listing.</span>
                    </div>
                  </div>
                </section>

                <!-- Pitch -->
                <section class="gn-form__card">
                  <header class="gn-form__card-header">
                    <h3 class="gn-form__card-title">About the role</h3>
                    <p class="gn-form__card-hint">What will this person do, and why does it matter?</p>
                  </header>

                  <div class="gn-form__field">
                    <label class="gn-form__label" for="job-summary">
                      Summary <span class="gn-form__required">*</span>
                    </label>
                    <textarea
                      id="job-summary"
                      v-model="form.summary"
                      rows="3"
                      maxlength="300"
                      class="gn-form__textarea"
                      :class="{ 'gn-form__input--error': errors.summary }"
                      placeholder="One-paragraph pitch shown on the careers page preview."
                      @input="clearError('summary')"
                    />
                    <div class="gn-form__char-row">
                      <span v-if="errors.summary" class="gn-form__helper gn-form__helper--error">
                        {{ errors.summary }}
                      </span>
                      <span v-else class="gn-form__helper">Visible in the careers grid.</span>
                      <span class="gn-form__char-count" :class="{ 'gn-form__char-count--warn': summaryTooLong }">
                        {{ form.summary?.length ?? 0 }} / 300
                      </span>
                    </div>
                  </div>

                  <div class="gn-form__field">
                    <label class="gn-form__label" for="job-description">
                      Full description <span class="gn-form__required">*</span>
                    </label>
                    <textarea
                      id="job-description"
                      v-model="form.description"
                      rows="8"
                      class="gn-form__textarea"
                      :class="{ 'gn-form__input--error': errors.description }"
                      placeholder="Describe the team, the mission, the tools, the day-to-day…"
                      @input="clearError('description')"
                    />
                    <span v-if="errors.description" class="gn-form__helper gn-form__helper--error">
                      {{ errors.description }}
                    </span>
                    <span v-else class="gn-form__helper">Supports plain text. Will be rendered on the public listing.</span>
                  </div>
                </section>

                <!-- Responsibilities & requirements -->
                <section class="gn-form__card">
                  <header class="gn-form__card-header">
                    <h3 class="gn-form__card-title">Responsibilities &amp; requirements</h3>
                    <p class="gn-form__card-hint">Be specific — candidates self-select based on these lists.</p>
                  </header>

                  <ArrayManager
                    v-model="form.responsibilities"
                    label="Responsibilities"
                    description="Day-to-day tasks and ownership areas."
                    placeholder="e.g. Own the data ingestion pipeline"
                    add-button-text="Add responsibility"
                    :required="true"
                    :min-items="3"
                    :error="errors.responsibilities"
                  />

                  <ArrayManager
                    v-model="form.requirements"
                    label="Required qualifications"
                    description="Must-haves — skills, certifications, years of experience."
                    placeholder="e.g. 5+ years in production data engineering"
                    add-button-text="Add requirement"
                    :required="true"
                    :min-items="3"
                    :error="errors.requirements"
                  />

                  <ArrayManager
                    v-model="form.nice_to_have"
                    label="Nice to have"
                    description="Bonus skills that boost a candidate's profile."
                    placeholder="e.g. Experience with dbt"
                    add-button-text="Add bonus skill"
                    :required="false"
                  />
                </section>

                <!-- Benefits & skills -->
                <section class="gn-form__card">
                  <header class="gn-form__card-header">
                    <h3 class="gn-form__card-title">Benefits &amp; tech stack</h3>
                    <p class="gn-form__card-hint">Optional but recommended — these are the biggest conversion drivers.</p>
                  </header>

                  <ArrayManager
                    v-model="form.benefits"
                    label="Benefits"
                    description="Perks offered to the successful candidate."
                    placeholder="e.g. Extended health &amp; dental coverage"
                    add-button-text="Add benefit"
                    :required="false"
                  />

                  <ArrayManager
                    v-model="form.skills"
                    label="Tech stack &amp; skills"
                    description="Tools, frameworks, and languages the team uses."
                    placeholder="e.g. Python, Snowflake, Airflow"
                    add-button-text="Add skill"
                    :required="false"
                  />
                </section>
              </div>

              <!-- Sidebar -->
              <aside class="gn-form__aside">
                <section class="gn-form__card">
                  <header class="gn-form__card-header">
                    <h3 class="gn-form__card-title">Publishing</h3>
                  </header>

                  <div class="gn-form__field">
                    <label class="gn-form__label">Status</label>
                    <div class="gn-form__status">
                      <button
                        v-for="option in statusOptions"
                        :key="option.value"
                        type="button"
                        class="gn-form__status-option"
                        :class="{
                          'gn-form__status-option--active': form.status === option.value,
                          [`gn-form__status-option--${option.tone}`]: form.status === option.value,
                        }"
                        @click="form.status = option.value"
                      >
                        <span class="gn-form__status-dot" />
                        <span>
                          <span class="gn-form__status-title">{{ option.label }}</span>
                          <span class="gn-form__status-hint">{{ option.hint }}</span>
                        </span>
                      </button>
                    </div>
                  </div>

                  <div class="gn-form__field">
                    <label class="gn-form__label" for="job-posted-date">Publication date</label>
                    <input
                      id="job-posted-date"
                      v-model="form.posted_date"
                      type="date"
                      :max="today"
                      class="gn-form__input"
                      :class="{ 'gn-form__input--error': errors.posted_date }"
                      @change="clearError('posted_date')"
                    />
                    <span v-if="errors.posted_date" class="gn-form__helper gn-form__helper--error">
                      {{ errors.posted_date }}
                    </span>
                    <span v-else class="gn-form__helper">Defaults to today.</span>
                  </div>
                </section>
              </aside>
            </div>
          </form>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCareersStore } from '../stores/useCareersStore'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import { DEPARTMENTS, JobType, JobStatus } from '../types'
import type { CreateJobPositionInput } from '../types'
import GIcon from '~/components/icons/GIcon.vue'
import ArrayManager from '../components/ArrayManager.vue'

definePageMeta({ middleware: 'auth' })

const router = useRouter()
const careersStore = useCareersStore()
const breadcrumbStore = useBreadcrumbStore()
const { showSuccess, showError } = useNotification()

const form = ref<CreateJobPositionInput>({
  title: '',
  department: null,
  location: null,
  job_type: JobType.FULL_TIME,
  is_remote: false,
  salary_range: null,
  experience_required: null,
  summary: '',
  description: '',
  responsibilities: [],
  requirements: [],
  nice_to_have: [],
  benefits: [],
  skills: [],
  posted_date: new Date().toISOString().split('T')[0],
  status: JobStatus.ACTIVE,
})

const errors = ref<Record<string, string>>({})
const isSubmitting = ref(false)

const today = computed(() => new Date().toISOString().split('T')[0])
const summaryTooLong = computed(() => (form.value.summary?.length ?? 0) > 300)

const contractOptions = [
  { value: JobType.FULL_TIME, label: 'Full-time' },
  { value: JobType.PART_TIME, label: 'Part-time' },
  { value: JobType.CONTRACT, label: 'Contract' },
]

const statusOptions = [
  {
    value: JobStatus.ACTIVE,
    label: 'Active',
    hint: 'Visible on the public careers page',
    tone: 'success',
  },
  {
    value: JobStatus.CLOSED,
    label: 'Closed',
    hint: 'Hidden and no longer accepting applicants',
    tone: 'muted',
  },
]

const clearError = (field: string) => {
  delete errors.value[field]
}

const validateForm = (): boolean => {
  errors.value = {}

  if (!form.value.title || form.value.title.trim() === '') {
    errors.value.title = 'Job title is required'
  }

  if (!form.value.summary || form.value.summary.trim() === '') {
    errors.value.summary = 'Summary is required'
  } else if (form.value.summary.length > 300) {
    errors.value.summary = 'Summary cannot exceed 300 characters'
  }

  if (!form.value.description || form.value.description.trim() === '') {
    errors.value.description = 'Description is required'
  }

  if (!form.value.posted_date) {
    errors.value.posted_date = 'Publication date is required'
  } else if (new Date(form.value.posted_date) > new Date()) {
    errors.value.posted_date = 'Publication date cannot be in the future'
  }

  if (!form.value.responsibilities || form.value.responsibilities.length < 3) {
    errors.value.responsibilities = 'At least 3 responsibilities are required'
  }

  if (!form.value.requirements || form.value.requirements.length < 3) {
    errors.value.requirements = 'At least 3 requirements are required'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    showError('Please fix the form errors')
    return
  }

  isSubmitting.value = true
  try {
    const jobPosition = await careersStore.createJobPosition(form.value)
    showSuccess('Job position created successfully')
    router.push(`/careers/positions/${jobPosition.id}`)
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create job position'
    showError(message)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  breadcrumbStore.setBreadcrumb([
    { title: 'Dashboard', path: '/' },
    { title: 'Job Positions', path: '/careers/positions' },
    { title: 'New position', path: '/careers/positions/create' },
  ])
})
</script>

<style scoped>
.gn-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: #0f172a;
}

/* Hero */
.gn-form__hero {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.5rem 1.75rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fc 100%);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 20px;
  box-shadow: 0 20px 48px -32px rgba(15, 23, 42, 0.15);
}

.gn-form__hero-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(167, 139, 250, 0.18) 0%, rgba(124, 58, 237, 0.24) 100%);
  border: 1px solid rgba(167, 139, 250, 0.38);
  color: #6d28d9;
  flex-shrink: 0;
  box-shadow: 0 12px 24px -14px rgba(124, 58, 237, 0.5);
}

.gn-form__hero-body {
  flex: 1;
  min-width: 0;
}

.gn-form__eyebrow {
  display: block;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #a78bfa;
  margin-bottom: 0.3rem;
}

.gn-form__title {
  margin: 0;
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  font-size: clamp(1.4rem, 2.2vw, 1.9rem);
  font-weight: 700;
  letter-spacing: -0.022em;
  line-height: 1.12;
  color: #0f172a;
}

.gn-form__subtitle {
  margin: 0.35rem 0 0;
  font-size: 0.92rem;
  color: rgba(15, 23, 42, 0.6);
  line-height: 1.5;
}

.gn-form__hero-actions {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-shrink: 0;
}

.gn-form__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.4rem;
  border: 0;
  border-radius: 12px;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition:
    transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    box-shadow 0.25s ease,
    background 0.25s ease,
    filter 0.25s ease;
}

.gn-form__btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.gn-form__btn--primary {
  background: linear-gradient(135deg, #a78bfa 0%, #7c3aed 55%, #6d28d9 100%);
  color: #ffffff;
  box-shadow: 0 16px 32px -14px rgba(124, 58, 237, 0.6);
}

.gn-form__btn--primary:hover:not(:disabled) {
  transform: translateY(-1px);
  filter: brightness(1.05);
  box-shadow: 0 22px 44px -16px rgba(124, 58, 237, 0.7);
}

.gn-form__btn--secondary {
  background: rgba(15, 23, 42, 0.05);
  color: rgba(15, 23, 42, 0.7);
}

.gn-form__btn--secondary:hover {
  background: rgba(15, 23, 42, 0.09);
  color: #0f172a;
}

.gn-form__btn-loading {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.gn-form__spinner {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #ffffff;
  animation: gn-spin 0.75s linear infinite;
}

@keyframes gn-spin {
  to { transform: rotate(360deg); }
}

/* Layout */
.gn-form__layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 1200px) {
  .gn-form__layout {
    grid-template-columns: minmax(0, 1.6fr) minmax(320px, 0.9fr);
  }
}

.gn-form__main,
.gn-form__aside {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Cards */
.gn-form__card {
  padding: 1.75rem;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.07);
  border-radius: 18px;
  box-shadow: 0 18px 40px -32px rgba(15, 23, 42, 0.14);
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}

.gn-form__card-header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.gn-form__card-title {
  margin: 0;
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: -0.012em;
  color: #0f172a;
}

.gn-form__card-hint {
  margin: 0;
  font-size: 0.8rem;
  color: rgba(15, 23, 42, 0.55);
  line-height: 1.45;
}

/* Fields */
.gn-form__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.1rem 1.25rem;
}

.gn-form__field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.gn-form__field--full {
  grid-column: 1 / -1;
}

.gn-form__label {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: rgba(15, 23, 42, 0.58);
}

.gn-form__required {
  color: #dc2626;
  margin-left: 0.15rem;
}

.gn-form__input,
.gn-form__textarea,
.gn-form__select {
  width: 100%;
  padding: 0.85rem 1rem;
  background: rgba(15, 23, 42, 0.02);
  border: 1px solid rgba(15, 23, 42, 0.1);
  border-radius: 14px;
  font-family: inherit;
  font-size: 0.92rem;
  font-weight: 500;
  color: #0f172a;
  line-height: 1.5;
  transition:
    border-color 0.25s ease,
    background 0.25s ease,
    box-shadow 0.25s ease;
}

.gn-form__select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='rgb(15 23 42 / 0.5)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 18px;
  padding-right: 2.5rem;
}

.gn-form__textarea {
  resize: vertical;
  min-height: 110px;
}

.gn-form__input:focus,
.gn-form__textarea:focus,
.gn-form__select:focus {
  outline: none;
  border-color: rgba(139, 92, 246, 0.55);
  background: rgba(139, 92, 246, 0.04);
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
}

.gn-form__input--error {
  border-color: rgba(220, 38, 38, 0.5);
  background: rgba(220, 38, 38, 0.04);
}

.gn-form__input::placeholder,
.gn-form__textarea::placeholder {
  color: rgba(15, 23, 42, 0.35);
  font-weight: 400;
}

.gn-form__helper {
  font-size: 0.76rem;
  color: rgba(15, 23, 42, 0.5);
  line-height: 1.45;
}

.gn-form__helper--error {
  color: #dc2626;
  font-weight: 500;
}

.gn-form__char-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.gn-form__char-count {
  font-size: 0.72rem;
  font-weight: 500;
  color: rgba(15, 23, 42, 0.45);
  font-variant-numeric: tabular-nums;
}

.gn-form__char-count--warn {
  color: #dc2626;
  font-weight: 600;
}

/* Input with icon / prefix */
.gn-form__input-group {
  position: relative;
}

.gn-form__input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  color: rgba(15, 23, 42, 0.5);
  pointer-events: none;
}

.gn-form__input-prefix {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  color: rgba(15, 23, 42, 0.55);
  font-weight: 600;
  font-size: 0.88rem;
  pointer-events: none;
  letter-spacing: 0.02em;
}

.gn-form__input--with-icon {
  padding-left: 2.6rem;
}

.gn-form__input--with-prefix {
  padding-left: 3.1rem;
}

.gn-form__input-group:focus-within .gn-form__input-icon,
.gn-form__input-group:focus-within .gn-form__input-prefix {
  color: #7c3aed;
}

/* Segmented contract type */
.gn-form__segmented {
  display: inline-flex;
  gap: 0.3rem;
  padding: 4px;
  background: rgba(15, 23, 42, 0.04);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 12px;
}

.gn-form__segmented-tab {
  padding: 0.6rem 1rem;
  border: 0;
  background: transparent;
  color: rgba(15, 23, 42, 0.6);
  font-family: inherit;
  font-size: 0.84rem;
  font-weight: 600;
  border-radius: 9px;
  cursor: pointer;
  transition: background 0.25s ease, color 0.25s ease, box-shadow 0.25s ease;
}

.gn-form__segmented-tab:hover {
  color: #0f172a;
}

.gn-form__segmented-tab--active {
  background: linear-gradient(135deg, rgba(167, 139, 250, 0.2) 0%, rgba(124, 58, 237, 0.25) 100%);
  color: #6d28d9;
  box-shadow: 0 8px 18px -12px rgba(124, 58, 237, 0.5);
}

/* Status buttons */
.gn-form__status {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.gn-form__status-option {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 0.85rem 1rem;
  background: rgba(15, 23, 42, 0.025);
  border: 1px solid rgba(15, 23, 42, 0.07);
  border-radius: 12px;
  font-family: inherit;
  text-align: left;
  color: rgba(15, 23, 42, 0.7);
  cursor: pointer;
  transition: background 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
}

.gn-form__status-option:hover {
  transform: translateY(-1px);
}

.gn-form__status-option span {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.gn-form__status-title {
  font-size: 0.88rem;
  font-weight: 600;
}

.gn-form__status-hint {
  font-size: 0.72rem;
  color: rgba(15, 23, 42, 0.5);
}

.gn-form__status-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.25);
  flex-shrink: 0;
}

.gn-form__status-option--active {
  border-color: currentColor;
}

.gn-form__status-option--success {
  background: rgba(16, 185, 129, 0.08);
  color: #047857;
  border-color: rgba(16, 185, 129, 0.35);
}

.gn-form__status-option--success .gn-form__status-dot {
  background: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.25);
}

.gn-form__status-option--success .gn-form__status-hint {
  color: rgba(4, 120, 87, 0.65);
}

.gn-form__status-option--muted {
  background: rgba(15, 23, 42, 0.06);
  color: #475569;
  border-color: rgba(15, 23, 42, 0.2);
}

.gn-form__status-option--muted .gn-form__status-dot {
  background: #64748b;
}

/* Toggle */
.gn-form__toggle {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  cursor: pointer;
  user-select: none;
}

.gn-form__toggle--inline {
  padding: 0.6rem 0.25rem;
}

.gn-form__toggle-input {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
}

.gn-form__toggle-track {
  position: relative;
  display: inline-block;
  width: 42px;
  height: 24px;
  background: rgba(15, 23, 42, 0.12);
  border-radius: 999px;
  transition: background 0.3s ease;
  flex-shrink: 0;
}

.gn-form__toggle-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: 999px;
  background: #ffffff;
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.25);
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.gn-form__toggle-input:checked + .gn-form__toggle-track {
  background: linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%);
}

.gn-form__toggle-input:checked + .gn-form__toggle-track .gn-form__toggle-thumb {
  transform: translateX(18px);
}

.gn-form__toggle-body {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  flex: 1;
}

.gn-form__toggle-title {
  font-size: 0.88rem;
  font-weight: 600;
  color: #0f172a;
}

.gn-form__toggle-hint {
  font-size: 0.74rem;
  color: rgba(15, 23, 42, 0.55);
}

@media (max-width: 640px) {
  .gn-form__grid {
    grid-template-columns: 1fr;
  }
}
</style>

<style>
/* Dark theme */
html[data-bs-theme='dark'] .gn-form__hero {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 24px 48px -28px rgba(0, 0, 0, 0.55);
}

html[data-bs-theme='dark'] .gn-form__hero-icon {
  background: linear-gradient(135deg, rgba(167, 139, 250, 0.22) 0%, rgba(124, 58, 237, 0.3) 100%);
  border-color: rgba(167, 139, 250, 0.45);
  color: #c4b5fd;
}

html[data-bs-theme='dark'] .gn-form__title {
  color: #f5f5f7;
}

html[data-bs-theme='dark'] .gn-form__subtitle {
  color: rgba(245, 245, 247, 0.65);
}

html[data-bs-theme='dark'] .gn-form__btn--secondary {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(245, 245, 247, 0.8);
}

html[data-bs-theme='dark'] .gn-form__btn--secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

html[data-bs-theme='dark'] .gn-form__card {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 22px 48px -28px rgba(0, 0, 0, 0.55);
}

html[data-bs-theme='dark'] .gn-form__card-title {
  color: #f5f5f7;
}

html[data-bs-theme='dark'] .gn-form__card-hint {
  color: rgba(245, 245, 247, 0.55);
}

html[data-bs-theme='dark'] .gn-form__label {
  color: rgba(245, 245, 247, 0.55);
}

html[data-bs-theme='dark'] .gn-form__input,
html[data-bs-theme='dark'] .gn-form__textarea,
html[data-bs-theme='dark'] .gn-form__select {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.1);
  color: #f5f5f7;
}

html[data-bs-theme='dark'] .gn-form__select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='rgb(245 245 247 / 0.55)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
}

html[data-bs-theme='dark'] .gn-form__input:focus,
html[data-bs-theme='dark'] .gn-form__textarea:focus,
html[data-bs-theme='dark'] .gn-form__select:focus {
  border-color: rgba(167, 139, 250, 0.6);
  background: rgba(167, 139, 250, 0.06);
}

html[data-bs-theme='dark'] .gn-form__input::placeholder,
html[data-bs-theme='dark'] .gn-form__textarea::placeholder {
  color: rgba(245, 245, 247, 0.35);
}

html[data-bs-theme='dark'] .gn-form__helper {
  color: rgba(245, 245, 247, 0.5);
}

html[data-bs-theme='dark'] .gn-form__char-count {
  color: rgba(245, 245, 247, 0.45);
}

html[data-bs-theme='dark'] .gn-form__input-icon,
html[data-bs-theme='dark'] .gn-form__input-prefix {
  color: rgba(245, 245, 247, 0.55);
}

html[data-bs-theme='dark'] .gn-form__segmented {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.1);
}

html[data-bs-theme='dark'] .gn-form__segmented-tab {
  color: rgba(245, 245, 247, 0.6);
}

html[data-bs-theme='dark'] .gn-form__segmented-tab:hover {
  color: #ffffff;
}

html[data-bs-theme='dark'] .gn-form__segmented-tab--active {
  background: linear-gradient(135deg, rgba(167, 139, 250, 0.22) 0%, rgba(124, 58, 237, 0.3) 100%);
  color: #ddd6fe;
}

html[data-bs-theme='dark'] .gn-form__status-option {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.08);
  color: rgba(245, 245, 247, 0.72);
}

html[data-bs-theme='dark'] .gn-form__status-hint {
  color: rgba(245, 245, 247, 0.5);
}

html[data-bs-theme='dark'] .gn-form__status-option--success {
  background: rgba(16, 185, 129, 0.12);
  border-color: rgba(16, 185, 129, 0.35);
  color: #6ee7b7;
}

html[data-bs-theme='dark'] .gn-form__status-option--success .gn-form__status-hint {
  color: rgba(110, 231, 183, 0.65);
}

html[data-bs-theme='dark'] .gn-form__status-option--muted {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.15);
  color: rgba(245, 245, 247, 0.72);
}

html[data-bs-theme='dark'] .gn-form__toggle-track {
  background: rgba(255, 255, 255, 0.12);
}

html[data-bs-theme='dark'] .gn-form__toggle-title {
  color: #f5f5f7;
}

html[data-bs-theme='dark'] .gn-form__toggle-hint {
  color: rgba(245, 245, 247, 0.5);
}

/* ArrayManager — inherit theme inside cards */
html[data-bs-theme='dark'] .array-manager .form-label {
  color: rgba(245, 245, 247, 0.65);
}

html[data-bs-theme='dark'] .array-manager .text-muted {
  color: rgba(245, 245, 247, 0.5) !important;
}

html[data-bs-theme='dark'] .array-manager .form-control {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.1);
  color: #f5f5f7;
}

html[data-bs-theme='dark'] .array-manager .form-control::placeholder {
  color: rgba(245, 245, 247, 0.35);
}
</style>
