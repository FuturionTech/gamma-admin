<template>
  <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
    <div class="d-flex flex-column flex-column-fluid">
      <div id="kt_app_content" class="app-content flex-column-fluid">
        <div id="kt_app_content_container" class="app-container container-fluid">

          <!-- Loading -->
          <div v-if="contactRequestsStore.isLoading && !contactRequest" class="gn-detail__shimmer" />

          <!-- Error -->
          <div v-else-if="contactRequestsStore.hasError" class="gn-detail__error" role="alert">
            <span class="gn-detail__error-icon" v-html="alertIcon" />
            <div>
              <h4>An error occurred</h4>
              <span>{{ contactRequestsStore.error }}</span>
            </div>
          </div>

          <!-- Not found -->
          <div v-else-if="!contactRequest" class="gn-detail__empty">
            <span class="gn-detail__empty-icon" v-html="alertIcon" />
            <h3>Request not found</h3>
            <p>This contact request may have been deleted or the link is invalid.</p>
            <NuxtLink to="/contact-requests" class="gn-detail__btn gn-detail__btn--primary">
              <span class="gn-detail__btn-icon" v-html="backIcon" />
              Back to requests
            </NuxtLink>
          </div>

          <!-- Content -->
          <div v-else class="gn-detail">
            <!-- Hero -->
            <header class="gn-detail__hero">
              <div class="gn-detail__hero-icon">
                <GIcon name="inbox" :size="42" />
              </div>
              <div class="gn-detail__hero-body">
                <span class="gn-detail__eyebrow">Contact request</span>
                <h1 class="gn-detail__title">{{ fullName }}</h1>
                <p v-if="contactRequest.subject" class="gn-detail__subtitle">
                  {{ contactRequest.subject }}
                </p>
                <p v-else class="gn-detail__subtitle gn-detail__muted">
                  No subject provided
                </p>
                <div class="gn-detail__meta">
                  <span
                    class="gn-detail__chip"
                    :class="statusChipClass"
                  >
                    <span class="gn-detail__chip-dot" />
                    {{ statusLabel }}
                  </span>
                  <span class="gn-detail__chip gn-detail__chip--muted">
                    <GIcon name="clock" :size="12" />
                    {{ formatRelativeTime(contactRequest.created_at) }}
                  </span>
                  <span class="gn-detail__chip gn-detail__chip--muted">
                    <GIcon name="calendar" :size="12" />
                    {{ formatDate(contactRequest.created_at) }}
                  </span>
                </div>
              </div>
              <div class="gn-detail__hero-actions">
                <NuxtLink to="/contact-requests" class="gn-detail__btn gn-detail__btn--ghost">
                  <span class="gn-detail__btn-icon" v-html="backIcon" />
                  Back
                </NuxtLink>
              </div>
            </header>

            <div class="gn-detail__grid">
              <!-- Main column -->
              <div class="gn-detail__main">
                <!-- Contact information -->
                <section class="gn-detail__card">
                  <h3 class="gn-detail__card-title">Contact</h3>
                  <dl class="gn-detail__list">
                    <div class="gn-detail__row">
                      <dt>Full name</dt>
                      <dd>{{ fullName }}</dd>
                    </div>
                    <div class="gn-detail__row">
                      <dt>Email</dt>
                      <dd>
                        <div class="gn-detail__inline">
                          <a :href="`mailto:${contactRequest.email}`" class="gn-detail__link">
                            {{ contactRequest.email }}
                          </a>
                          <button
                            type="button"
                            class="gn-detail__icon-btn"
                            title="Copy email"
                            @click="handleCopyEmail(contactRequest.email)"
                          >
                            <GIcon name="copy" :size="14" />
                          </button>
                        </div>
                      </dd>
                    </div>
                    <div v-if="contactRequest.phone" class="gn-detail__row">
                      <dt>Phone</dt>
                      <dd>
                        <a :href="`tel:${contactRequest.phone}`" class="gn-detail__link">
                          {{ formatPhone(contactRequest.phone) }}
                        </a>
                      </dd>
                    </div>
                  </dl>
                </section>

                <!-- Message -->
                <section class="gn-detail__card">
                  <h3 class="gn-detail__card-title">Message</h3>
                  <div v-if="contactRequest.subject" class="gn-detail__subject">
                    {{ contactRequest.subject }}
                  </div>
                  <div class="gn-detail__message">
                    <p>{{ contactRequest.message }}</p>
                  </div>
                </section>

                <!-- Timeline -->
                <section class="gn-detail__card">
                  <h3 class="gn-detail__card-title">Timeline</h3>
                  <dl class="gn-detail__list">
                    <div class="gn-detail__row">
                      <dt>Submitted</dt>
                      <dd>
                        <div>{{ formatDate(contactRequest.created_at) }}</div>
                        <div class="gn-detail__small gn-detail__muted">
                          {{ formatRelativeTime(contactRequest.created_at) }}
                        </div>
                      </dd>
                    </div>
                    <div
                      v-if="contactRequest.updated_at !== contactRequest.created_at"
                      class="gn-detail__row"
                    >
                      <dt>Last updated</dt>
                      <dd>
                        <div>{{ formatDate(contactRequest.updated_at) }}</div>
                        <div class="gn-detail__small gn-detail__muted">
                          {{ formatRelativeTime(contactRequest.updated_at) }}
                        </div>
                      </dd>
                    </div>
                  </dl>
                </section>
              </div>

              <!-- Sidebar -->
              <aside class="gn-detail__aside">
                <!-- Status -->
                <section class="gn-detail__card">
                  <h3 class="gn-detail__card-title">Status</h3>
                  <div class="gn-detail__status-current">
                    <span class="gn-detail__status-label">Current</span>
                    <span class="gn-detail__chip" :class="statusChipClass">
                      <span class="gn-detail__chip-dot" />
                      {{ statusLabel }}
                    </span>
                  </div>

                  <div v-if="availableStatuses.length" class="gn-detail__status-picker">
                    <span class="gn-detail__status-label">Change to</span>
                    <div class="gn-detail__status-options">
                      <button
                        v-for="status in availableStatuses"
                        :key="status"
                        type="button"
                        class="gn-detail__status-option"
                        :class="statusOptionClass(status)"
                        @click="handleStatusUpdate(status)"
                      >
                        <span class="gn-detail__status-option-dot" />
                        {{ getStatusLabel(status) }}
                      </button>
                    </div>
                  </div>
                  <p v-else class="gn-detail__empty-text">
                    This request is in its final state.
                  </p>
                </section>

                <!-- Actions -->
                <section class="gn-detail__card">
                  <h3 class="gn-detail__card-title">Actions</h3>
                  <div class="gn-detail__actions">
                    <button
                      type="button"
                      class="gn-detail__action"
                      @click="handleCopyEmail(contactRequest.email)"
                    >
                      <span class="gn-detail__action-icon">
                        <GIcon name="copy" :size="18" />
                      </span>
                      <span>
                        <span class="gn-detail__action-title">Copy email</span>
                        <span class="gn-detail__action-hint">Paste into your mail client</span>
                      </span>
                    </button>

                    <a
                      v-if="contactRequest.phone"
                      :href="`tel:${contactRequest.phone}`"
                      class="gn-detail__action gn-detail__action--success"
                    >
                      <span class="gn-detail__action-icon">
                        <GIcon name="phone" :size="18" />
                      </span>
                      <span>
                        <span class="gn-detail__action-title">Call</span>
                        <span class="gn-detail__action-hint">{{ formatPhone(contactRequest.phone) }}</span>
                      </span>
                    </a>

                    <button
                      type="button"
                      class="gn-detail__action gn-detail__action--danger"
                      @click="handleDelete"
                    >
                      <span class="gn-detail__action-icon">
                        <GIcon name="trash-2" :size="18" />
                      </span>
                      <span>
                        <span class="gn-detail__action-title">Delete</span>
                        <span class="gn-detail__action-hint">Remove permanently</span>
                      </span>
                    </button>
                  </div>
                </section>

                <NuxtLink to="/contact-requests" class="gn-detail__back">
                  <span v-html="backIcon" />
                  Back to requests
                </NuxtLink>
              </aside>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useContactRequestsStore } from '../stores/useContactRequestsStore'
import { useContactRequestFormatters } from '../composables/useContactRequestFormatters'
import { useContactRequestActions } from '../composables/useContactRequestActions'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import { ContactRequestStatus, STATUS_TRANSITIONS } from '../types'
import GIcon from '~/components/icons/GIcon.vue'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const router = useRouter()
const contactRequestsStore = useContactRequestsStore()
const breadcrumbStore = useBreadcrumbStore()

const {
  formatDate,
  formatRelativeTime,
  formatPhone,
  getStatusLabel,
} = useContactRequestFormatters()

const {
  confirmAndDeleteContactRequest,
  updateStatus,
  copyEmailToClipboard,
} = useContactRequestActions()

const contactRequest = computed(() => contactRequestsStore.currentContactRequest)

const fullName = computed(() => {
  if (!contactRequest.value) return ''
  return `${contactRequest.value.first_name} ${contactRequest.value.last_name}`.trim()
})

const statusLabel = computed(() => {
  if (!contactRequest.value) return ''
  return getStatusLabel(contactRequest.value.status)
})

const statusChipClass = computed(() => {
  if (!contactRequest.value) return 'gn-detail__chip--muted'
  return statusToneClass(contactRequest.value.status)
})

const availableStatuses = computed(() => {
  if (!contactRequest.value) return [] as ContactRequestStatus[]
  return [...(STATUS_TRANSITIONS[contactRequest.value.status] || [])]
})

const statusToneClass = (status: ContactRequestStatus): string => {
  switch (status) {
    case ContactRequestStatus.NEW:
      return 'gn-detail__chip--danger'
    case ContactRequestStatus.IN_PROGRESS:
      return 'gn-detail__chip--warning'
    case ContactRequestStatus.RESOLVED:
      return 'gn-detail__chip--success'
    default:
      return 'gn-detail__chip--muted'
  }
}

const statusOptionClass = (status: ContactRequestStatus): string => {
  switch (status) {
    case ContactRequestStatus.NEW:
      return 'gn-detail__status-option--danger'
    case ContactRequestStatus.IN_PROGRESS:
      return 'gn-detail__status-option--warning'
    case ContactRequestStatus.RESOLVED:
      return 'gn-detail__status-option--success'
    default:
      return ''
  }
}

const handleStatusUpdate = async (status: ContactRequestStatus) => {
  if (!contactRequest.value || status === contactRequest.value.status) return
  const success = await updateStatus(contactRequest.value.id, status)
  if (success) {
    await contactRequestsStore.fetchContactRequest(contactRequest.value.id)
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

const alertIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>`
const backIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>`

watch(
  contactRequest,
  (value) => {
    if (!value) return
    breadcrumbStore.setBreadcrumb([
      { title: 'Dashboard', path: '/' },
      { title: 'Contact Requests', path: '/contact-requests' },
      { title: `${value.first_name} ${value.last_name}`, path: `/contact-requests/${value.id}` },
    ])
  },
  { immediate: true },
)

onMounted(async () => {
  const id = route.params.id as string
  if (!id) {
    router.push('/contact-requests')
    return
  }

  try {
    await contactRequestsStore.fetchContactRequest(id)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[ContactRequestDetail] Failed to fetch', error)
  }
})
</script>

<style scoped>
.gn-detail {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: #0f172a;
}

.gn-detail__shimmer {
  height: 360px;
  border-radius: 20px;
  background: linear-gradient(
    90deg,
    rgba(15, 23, 42, 0.04) 0%,
    rgba(15, 23, 42, 0.08) 50%,
    rgba(15, 23, 42, 0.04) 100%
  );
  background-size: 200% 100%;
  animation: gn-shimmer 1.6s ease-in-out infinite;
}

@keyframes gn-shimmer {
  to {
    background-position: -200% 0;
  }
}

.gn-detail__error,
.gn-detail__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 3rem 2rem;
  text-align: center;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.07);
  border-radius: 18px;
  box-shadow: 0 18px 40px -32px rgba(15, 23, 42, 0.14);
}

.gn-detail__error {
  background: rgba(248, 113, 113, 0.06);
  border-color: rgba(248, 113, 113, 0.2);
  color: #b91c1c;
  flex-direction: row;
  text-align: left;
}

.gn-detail__error h4,
.gn-detail__empty h3 {
  margin: 0 0 0.25rem;
  font-size: 1.1rem;
  font-weight: 700;
}

.gn-detail__error-icon,
.gn-detail__empty-icon {
  display: inline-flex;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  color: rgba(15, 23, 42, 0.5);
}

.gn-detail__error-icon {
  width: 22px;
  height: 22px;
  color: #b91c1c;
}

.gn-detail__error-icon :deep(svg),
.gn-detail__empty-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.gn-detail__empty p {
  margin: 0 0 1rem;
  color: rgba(15, 23, 42, 0.55);
  max-width: 360px;
}

/* Hero */
.gn-detail__hero {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem 2.25rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fc 100%);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 22px;
  box-shadow: 0 24px 56px -36px rgba(15, 23, 42, 0.18);
}

.gn-detail__hero-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 84px;
  height: 84px;
  border-radius: 22px;
  background: linear-gradient(135deg, rgba(167, 139, 250, 0.18) 0%, rgba(124, 58, 237, 0.26) 100%);
  border: 1px solid rgba(167, 139, 250, 0.4);
  color: #6d28d9;
  flex-shrink: 0;
  box-shadow: 0 14px 32px -16px rgba(124, 58, 237, 0.55);
}

.gn-detail__hero-body {
  flex: 1;
  min-width: 0;
}

.gn-detail__eyebrow {
  display: block;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #a78bfa;
  margin-bottom: 0.35rem;
}

.gn-detail__title {
  margin: 0 0 0.5rem;
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  font-size: clamp(1.75rem, 2.4vw, 2.25rem);
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.12;
  color: #0f172a;
}

.gn-detail__subtitle {
  margin: 0 0 0.85rem;
  font-size: 1rem;
  color: rgba(15, 23, 42, 0.68);
  line-height: 1.5;
  max-width: 720px;
}

.gn-detail__meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.gn-detail__chip {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.8rem;
  background: rgba(15, 23, 42, 0.05);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 999px;
  font-size: 0.74rem;
  font-weight: 600;
  color: rgba(15, 23, 42, 0.65);
  letter-spacing: 0.005em;
}

.gn-detail__chip :deep(svg) {
  width: 12px;
  height: 12px;
}

.gn-detail__chip--success {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.25);
  color: #047857;
}

.gn-detail__chip--success .gn-detail__chip-dot {
  background: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.25);
}

.gn-detail__chip--warning {
  background: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.25);
  color: #b45309;
}

.gn-detail__chip--warning .gn-detail__chip-dot {
  background: #f59e0b;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.25);
}

.gn-detail__chip--danger {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.25);
  color: #b91c1c;
}

.gn-detail__chip--danger .gn-detail__chip-dot {
  background: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.25);
}

.gn-detail__chip--muted .gn-detail__chip-dot {
  background: rgba(15, 23, 42, 0.35);
}

.gn-detail__chip-dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  flex-shrink: 0;
}

.gn-detail__hero-actions {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-shrink: 0;
}

.gn-detail__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.4rem;
  border-radius: 12px;
  border: 0;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition:
    transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    box-shadow 0.25s ease,
    filter 0.25s ease,
    background 0.25s ease,
    border-color 0.25s ease,
    color 0.25s ease;
}

.gn-detail__btn--primary {
  background: linear-gradient(135deg, #a78bfa 0%, #7c3aed 55%, #6d28d9 100%);
  color: #ffffff;
  box-shadow: 0 16px 32px -14px rgba(124, 58, 237, 0.6);
}

.gn-detail__btn--primary:hover {
  transform: translateY(-1px);
  filter: brightness(1.05);
  box-shadow: 0 22px 44px -16px rgba(124, 58, 237, 0.7);
}

.gn-detail__btn--ghost {
  background: rgba(15, 23, 42, 0.05);
  color: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(15, 23, 42, 0.08);
}

.gn-detail__btn--ghost:hover {
  background: rgba(15, 23, 42, 0.08);
  color: #0f172a;
}

.gn-detail__btn-icon {
  display: inline-flex;
  width: 16px;
  height: 16px;
}

.gn-detail__btn-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

/* Grid */
.gn-detail__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 1200px) {
  .gn-detail__grid {
    grid-template-columns: minmax(0, 1.6fr) minmax(320px, 0.9fr);
  }
}

.gn-detail__main,
.gn-detail__aside {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Cards */
.gn-detail__card {
  padding: 1.75rem;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.07);
  border-radius: 18px;
  box-shadow: 0 18px 40px -32px rgba(15, 23, 42, 0.14);
}

.gn-detail__card-title {
  margin: 0 0 1rem;
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: #a78bfa;
}

/* Description list */
.gn-detail__list {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.gn-detail__row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.9rem;
  border-bottom: 1px dashed rgba(15, 23, 42, 0.1);
}

.gn-detail__row:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.gn-detail__row dt {
  font-size: 0.78rem;
  font-weight: 600;
  color: rgba(15, 23, 42, 0.55);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  flex-shrink: 0;
  padding-top: 0.1rem;
}

.gn-detail__row dd {
  margin: 0;
  text-align: right;
  font-size: 0.9rem;
  font-weight: 500;
  color: #0f172a;
  word-break: break-word;
}

.gn-detail__inline {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: flex-end;
}

.gn-detail__link {
  color: #6d28d9;
  text-decoration: none;
  transition: color 0.2s ease;
}

.gn-detail__link:hover {
  color: #5b21b6;
  text-decoration: underline;
}

.gn-detail__icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px solid rgba(15, 23, 42, 0.1);
  background: rgba(15, 23, 42, 0.03);
  border-radius: 8px;
  color: rgba(15, 23, 42, 0.55);
  cursor: pointer;
  transition: all 0.2s ease;
}

.gn-detail__icon-btn:hover {
  background: rgba(167, 139, 250, 0.12);
  color: #7c3aed;
  border-color: rgba(167, 139, 250, 0.3);
}

.gn-detail__small {
  font-size: 0.72rem;
  font-weight: 400;
}

.gn-detail__muted {
  color: rgba(15, 23, 42, 0.45);
}

/* Message */
.gn-detail__subject {
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  font-size: 1.05rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 0.75rem;
}

.gn-detail__message {
  padding: 1.25rem 1.5rem;
  background: rgba(167, 139, 250, 0.05);
  border: 1px solid rgba(167, 139, 250, 0.15);
  border-left: 3px solid #a78bfa;
  border-radius: 12px;
}

.gn-detail__message p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.7;
  color: rgba(15, 23, 42, 0.78);
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* Status picker */
.gn-detail__status-current {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 1.25rem;
  margin-bottom: 1.25rem;
  border-bottom: 1px dashed rgba(15, 23, 42, 0.1);
}

.gn-detail__status-label {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(15, 23, 42, 0.5);
}

.gn-detail__status-picker {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.gn-detail__status-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.gn-detail__status-option {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 0.95rem;
  background: rgba(15, 23, 42, 0.025);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 10px;
  font-family: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  color: rgba(15, 23, 42, 0.7);
  text-align: left;
  cursor: pointer;
  transition:
    background 0.25s ease,
    border-color 0.25s ease,
    color 0.25s ease,
    transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.gn-detail__status-option:hover {
  transform: translateY(-1px);
}

.gn-detail__status-option-dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  flex-shrink: 0;
}

.gn-detail__status-option--success {
  color: #047857;
}

.gn-detail__status-option--success .gn-detail__status-option-dot {
  background: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
}

.gn-detail__status-option--success:hover {
  background: rgba(16, 185, 129, 0.08);
  border-color: rgba(16, 185, 129, 0.3);
}

.gn-detail__status-option--warning {
  color: #b45309;
}

.gn-detail__status-option--warning .gn-detail__status-option-dot {
  background: #f59e0b;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.2);
}

.gn-detail__status-option--warning:hover {
  background: rgba(245, 158, 11, 0.08);
  border-color: rgba(245, 158, 11, 0.3);
}

.gn-detail__status-option--danger {
  color: #b91c1c;
}

.gn-detail__status-option--danger .gn-detail__status-option-dot {
  background: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
}

.gn-detail__status-option--danger:hover {
  background: rgba(239, 68, 68, 0.08);
  border-color: rgba(239, 68, 68, 0.3);
}

.gn-detail__empty-text {
  margin: 0;
  font-size: 0.85rem;
  color: rgba(15, 23, 42, 0.5);
  font-style: italic;
}

/* Actions */
.gn-detail__actions {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.gn-detail__action {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 0.95rem 1rem;
  background: rgba(15, 23, 42, 0.025);
  border: 1px solid rgba(15, 23, 42, 0.07);
  border-radius: 12px;
  text-decoration: none;
  text-align: left;
  cursor: pointer;
  font-family: inherit;
  color: rgba(15, 23, 42, 0.7);
  transition:
    background 0.25s ease,
    border-color 0.25s ease,
    color 0.25s ease,
    transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.gn-detail__action:hover {
  transform: translateY(-1px);
}

.gn-detail__action-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(15, 23, 42, 0.06);
  color: inherit;
  flex-shrink: 0;
}

.gn-detail__action > span:last-child {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.gn-detail__action-title {
  font-size: 0.88rem;
  font-weight: 600;
  color: inherit;
}

.gn-detail__action-hint {
  font-size: 0.72rem;
  font-weight: 500;
  color: rgba(15, 23, 42, 0.5);
}

.gn-detail__action--success {
  color: #047857;
}

.gn-detail__action--success .gn-detail__action-icon {
  background: rgba(16, 185, 129, 0.14);
  color: #047857;
}

.gn-detail__action--success:hover {
  background: rgba(16, 185, 129, 0.08);
  border-color: rgba(16, 185, 129, 0.3);
}

.gn-detail__action--danger {
  color: #b91c1c;
}

.gn-detail__action--danger .gn-detail__action-icon {
  background: rgba(220, 38, 38, 0.12);
  color: #b91c1c;
}

.gn-detail__action--danger:hover {
  background: rgba(220, 38, 38, 0.08);
  border-color: rgba(220, 38, 38, 0.3);
}

.gn-detail__back {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding: 0.8rem 1rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: rgba(15, 23, 42, 0.55);
  text-decoration: none;
  border-radius: 12px;
  transition: background 0.25s ease, color 0.25s ease;
}

.gn-detail__back :deep(svg) {
  width: 16px;
  height: 16px;
}

.gn-detail__back:hover {
  color: #7c3aed;
  background: rgba(139, 92, 246, 0.06);
}
</style>

<style>
/* Dark theme */
html[data-bs-theme='dark'] .gn-detail {
  color: #f5f5f7;
}

html[data-bs-theme='dark'] .gn-detail__hero {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 28px 56px -32px rgba(0, 0, 0, 0.55);
}

html[data-bs-theme='dark'] .gn-detail__hero-icon {
  background: linear-gradient(135deg, rgba(167, 139, 250, 0.22) 0%, rgba(124, 58, 237, 0.32) 100%);
  border-color: rgba(167, 139, 250, 0.45);
  color: #c4b5fd;
}

html[data-bs-theme='dark'] .gn-detail__title {
  color: #f5f5f7;
}

html[data-bs-theme='dark'] .gn-detail__subtitle {
  color: rgba(245, 245, 247, 0.7);
}

html[data-bs-theme='dark'] .gn-detail__chip {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.1);
  color: rgba(245, 245, 247, 0.75);
}

html[data-bs-theme='dark'] .gn-detail__chip--success {
  background: rgba(16, 185, 129, 0.16);
  border-color: rgba(16, 185, 129, 0.35);
  color: #6ee7b7;
}

html[data-bs-theme='dark'] .gn-detail__chip--warning {
  background: rgba(245, 158, 11, 0.16);
  border-color: rgba(245, 158, 11, 0.35);
  color: #fbbf24;
}

html[data-bs-theme='dark'] .gn-detail__chip--danger {
  background: rgba(239, 68, 68, 0.16);
  border-color: rgba(239, 68, 68, 0.35);
  color: #fca5a5;
}

html[data-bs-theme='dark'] .gn-detail__chip--muted .gn-detail__chip-dot {
  background: rgba(245, 245, 247, 0.45);
}

html[data-bs-theme='dark'] .gn-detail__card {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 24px 48px -28px rgba(0, 0, 0, 0.5);
}

html[data-bs-theme='dark'] .gn-detail__error,
html[data-bs-theme='dark'] .gn-detail__empty {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.08);
}

html[data-bs-theme='dark'] .gn-detail__error {
  background: rgba(239, 68, 68, 0.08);
  border-color: rgba(239, 68, 68, 0.25);
  color: #fca5a5;
}

html[data-bs-theme='dark'] .gn-detail__row {
  border-bottom-color: rgba(255, 255, 255, 0.08);
}

html[data-bs-theme='dark'] .gn-detail__row dt {
  color: rgba(245, 245, 247, 0.5);
}

html[data-bs-theme='dark'] .gn-detail__row dd {
  color: #f5f5f7;
}

html[data-bs-theme='dark'] .gn-detail__muted {
  color: rgba(245, 245, 247, 0.45);
}

html[data-bs-theme='dark'] .gn-detail__link {
  color: #c4b5fd;
}

html[data-bs-theme='dark'] .gn-detail__link:hover {
  color: #ddd6fe;
}

html[data-bs-theme='dark'] .gn-detail__icon-btn {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.1);
  color: rgba(245, 245, 247, 0.55);
}

html[data-bs-theme='dark'] .gn-detail__icon-btn:hover {
  background: rgba(167, 139, 250, 0.18);
  border-color: rgba(167, 139, 250, 0.4);
  color: #c4b5fd;
}

html[data-bs-theme='dark'] .gn-detail__btn--ghost {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.1);
  color: rgba(245, 245, 247, 0.72);
}

html[data-bs-theme='dark'] .gn-detail__btn--ghost:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #f5f5f7;
}

html[data-bs-theme='dark'] .gn-detail__subject {
  color: #f5f5f7;
}

html[data-bs-theme='dark'] .gn-detail__message {
  background: rgba(167, 139, 250, 0.08);
  border-color: rgba(167, 139, 250, 0.2);
  border-left-color: #a78bfa;
}

html[data-bs-theme='dark'] .gn-detail__message p {
  color: rgba(245, 245, 247, 0.78);
}

html[data-bs-theme='dark'] .gn-detail__status-current {
  border-bottom-color: rgba(255, 255, 255, 0.08);
}

html[data-bs-theme='dark'] .gn-detail__status-label {
  color: rgba(245, 245, 247, 0.5);
}

html[data-bs-theme='dark'] .gn-detail__status-option {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.08);
  color: rgba(245, 245, 247, 0.72);
}

html[data-bs-theme='dark'] .gn-detail__status-option--success {
  color: #6ee7b7;
}

html[data-bs-theme='dark'] .gn-detail__status-option--warning {
  color: #fbbf24;
}

html[data-bs-theme='dark'] .gn-detail__status-option--danger {
  color: #fca5a5;
}

html[data-bs-theme='dark'] .gn-detail__empty-text {
  color: rgba(245, 245, 247, 0.45);
}

html[data-bs-theme='dark'] .gn-detail__action {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.08);
  color: rgba(245, 245, 247, 0.72);
}

html[data-bs-theme='dark'] .gn-detail__action-icon {
  background: rgba(255, 255, 255, 0.06);
}

html[data-bs-theme='dark'] .gn-detail__action-hint {
  color: rgba(245, 245, 247, 0.45);
}

html[data-bs-theme='dark'] .gn-detail__action--success {
  color: #6ee7b7;
}

html[data-bs-theme='dark'] .gn-detail__action--success .gn-detail__action-icon {
  background: rgba(16, 185, 129, 0.18);
  color: #6ee7b7;
}

html[data-bs-theme='dark'] .gn-detail__action--danger {
  color: #fca5a5;
}

html[data-bs-theme='dark'] .gn-detail__action--danger .gn-detail__action-icon {
  background: rgba(220, 38, 38, 0.16);
  color: #fca5a5;
}

html[data-bs-theme='dark'] .gn-detail__back {
  color: rgba(245, 245, 247, 0.55);
}

html[data-bs-theme='dark'] .gn-detail__back:hover {
  color: #c4b5fd;
  background: rgba(167, 139, 250, 0.1);
}
</style>
