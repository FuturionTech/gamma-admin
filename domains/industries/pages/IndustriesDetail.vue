<template>
  <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
    <div class="d-flex flex-column flex-column-fluid">
      <div id="kt_app_content" class="app-content flex-column-fluid">
        <div id="kt_app_content_container" class="app-container container-fluid">

          <!-- Loading -->
          <div v-if="industriesStore.isLoading && !industry" class="gn-detail__shimmer" />

          <!-- Error -->
          <div v-else-if="industriesStore.hasError" class="gn-detail__error" role="alert">
            <span class="gn-detail__error-icon" v-html="alertIcon" />
            <div>
              <h4>An error occurred</h4>
              <span>{{ industriesStore.error }}</span>
            </div>
          </div>

          <!-- Content -->
          <div v-else-if="industry" class="gn-detail">
            <!-- Hero -->
            <header class="gn-detail__hero">
              <div class="gn-detail__hero-icon" :style="heroIconStyle">
                <GIcon :name="industry.icon || 'briefcase'" :size="42" />
              </div>
              <div class="gn-detail__hero-body">
                <span class="gn-detail__eyebrow">{{ industry.category || 'Industry' }}</span>
                <h1 class="gn-detail__title">{{ industry.title }}</h1>
                <p v-if="industry.short_description" class="gn-detail__subtitle">
                  {{ industry.short_description }}
                </p>
                <div class="gn-detail__meta">
                  <span
                    class="gn-detail__chip"
                    :class="industry.is_active ? 'gn-detail__chip--success' : 'gn-detail__chip--muted'"
                  >
                    <span class="gn-detail__chip-dot" />
                    {{ industry.is_active ? 'Active' : 'Inactive' }}
                  </span>
                  <span class="gn-detail__chip gn-detail__chip--muted">
                    Order #{{ industry.order }}
                  </span>
                  <span class="gn-detail__chip gn-detail__chip--muted">
                    Updated {{ formatRelativeDate(industry.updated_at) }}
                  </span>
                </div>
              </div>
              <div class="gn-detail__hero-actions">
                <NuxtLink
                  :to="`/industries/${industry.id}/edit`"
                  class="gn-detail__btn gn-detail__btn--primary"
                >
                  <span class="gn-detail__btn-icon" v-html="pencilIcon" />
                  Edit
                </NuxtLink>
              </div>
            </header>

            <div class="gn-detail__grid">
              <!-- Main content column -->
              <div class="gn-detail__main">
                <section v-if="industry.description" class="gn-detail__card">
                  <h3 class="gn-detail__card-title">About</h3>
                  <p class="gn-detail__body-text">{{ industry.description }}</p>
                </section>

                <section class="gn-detail__card">
                  <h3 class="gn-detail__card-title">Details</h3>
                  <dl class="gn-detail__list">
                    <div class="gn-detail__row">
                      <dt>Slug</dt>
                      <dd><code>{{ industry.slug }}</code></dd>
                    </div>
                    <div v-if="industry.category" class="gn-detail__row">
                      <dt>Category</dt>
                      <dd>{{ formatCategory(industry.category) }}</dd>
                    </div>
                    <div class="gn-detail__row">
                      <dt>Icon</dt>
                      <dd v-if="industry.icon">
                        <code>{{ industry.icon }}</code>
                      </dd>
                      <dd v-else class="gn-detail__muted">No icon set</dd>
                    </div>
                    <div class="gn-detail__row">
                      <dt>Icon color</dt>
                      <dd v-if="industry.icon_color" class="gn-detail__color-row">
                        <span
                          class="gn-detail__swatch"
                          :style="{ background: industry.icon_color }"
                        />
                        <code>{{ industry.icon_color }}</code>
                      </dd>
                      <dd v-else class="gn-detail__muted">Default</dd>
                    </div>
                  </dl>
                </section>
              </div>

              <!-- Sidebar -->
              <aside class="gn-detail__aside">
                <section class="gn-detail__card">
                  <h3 class="gn-detail__card-title">Timeline</h3>
                  <dl class="gn-detail__list">
                    <div class="gn-detail__row">
                      <dt>Created</dt>
                      <dd>
                        <div>{{ formatDateTime(industry.created_at) }}</div>
                        <div class="gn-detail__muted gn-detail__small">
                          {{ formatRelativeDate(industry.created_at) }}
                        </div>
                      </dd>
                    </div>
                    <div class="gn-detail__row">
                      <dt>Updated</dt>
                      <dd>
                        <div>{{ formatDateTime(industry.updated_at) }}</div>
                        <div class="gn-detail__muted gn-detail__small">
                          {{ formatRelativeDate(industry.updated_at) }}
                        </div>
                      </dd>
                    </div>
                  </dl>
                </section>

                <section class="gn-detail__card">
                  <h3 class="gn-detail__card-title">Actions</h3>
                  <div class="gn-detail__actions">
                    <NuxtLink
                      :to="`/industries/${industry.id}/edit`"
                      class="gn-detail__action gn-detail__action--primary"
                    >
                      <span class="gn-detail__action-icon" v-html="pencilIcon" />
                      <span>
                        <span class="gn-detail__action-title">Edit</span>
                        <span class="gn-detail__action-hint">Update details</span>
                      </span>
                    </NuxtLink>
                    <button
                      type="button"
                      class="gn-detail__action"
                      :class="industry.is_active ? 'gn-detail__action--warning' : 'gn-detail__action--success'"
                      @click="handleToggleStatus"
                    >
                      <span class="gn-detail__action-icon" v-html="toggleIcon" />
                      <span>
                        <span class="gn-detail__action-title">
                          {{ industry.is_active ? 'Deactivate' : 'Activate' }}
                        </span>
                        <span class="gn-detail__action-hint">
                          {{ industry.is_active ? 'Hide from public site' : 'Show on public site' }}
                        </span>
                      </span>
                    </button>
                    <button
                      type="button"
                      class="gn-detail__action gn-detail__action--info"
                      @click="handleDuplicate"
                    >
                      <span class="gn-detail__action-icon" v-html="copyIcon" />
                      <span>
                        <span class="gn-detail__action-title">Duplicate</span>
                        <span class="gn-detail__action-hint">Create a copy</span>
                      </span>
                    </button>
                    <button
                      type="button"
                      class="gn-detail__action gn-detail__action--danger"
                      @click="handleDelete"
                    >
                      <span class="gn-detail__action-icon" v-html="trashIcon" />
                      <span>
                        <span class="gn-detail__action-title">Delete</span>
                        <span class="gn-detail__action-hint">Remove permanently</span>
                      </span>
                    </button>
                  </div>
                </section>

                <NuxtLink to="/industries" class="gn-detail__back">
                  <span v-html="backIcon" />
                  Back to industries
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
import { useIndustriesStore } from '../stores/useIndustriesStore'
import { useIndustryFormatters } from '../composables/useIndustryFormatters'
import { useIndustryActions } from '../composables/useIndustryActions'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import GIcon from '~/components/icons/GIcon.vue'

definePageMeta({ middleware: 'auth' })

const industriesStore = useIndustriesStore()
const breadcrumbStore = useBreadcrumbStore()
const route = useRoute()
const router = useRouter()

const {
  formatDateTime,
  formatRelativeDate,
  formatCategory,
} = useIndustryFormatters()

const {
  confirmAndDeleteIndustry,
  toggleIndustryStatus,
  duplicateIndustry,
} = useIndustryActions()

const industryId = computed(() => route.params.id as string)
const industry = computed(() => industriesStore.currentIndustry)

const heroIconStyle = computed(() => {
  if (!industry.value?.icon_color) return {}
  const color = industry.value.icon_color
  return {
    background: `linear-gradient(135deg, ${hexWithAlpha(color, 0.18)} 0%, ${hexWithAlpha(color, 0.28)} 100%)`,
    borderColor: hexWithAlpha(color, 0.45),
    color,
  }
})

const hexWithAlpha = (hex: string, alpha: number): string => {
  const trimmed = hex.replace('#', '')
  if (trimmed.length !== 6) return hex
  const r = parseInt(trimmed.slice(0, 2), 16)
  const g = parseInt(trimmed.slice(2, 4), 16)
  const b = parseInt(trimmed.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const alertIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>`
const pencilIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5Z"/></svg>`
const toggleIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="10" rx="5"/><circle cx="17" cy="12" r="3"/></svg>`
const copyIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`
const trashIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>`
const backIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>`

const handleToggleStatus = async () => {
  if (!industry.value) return
  const success = await toggleIndustryStatus(industry.value)
  if (success) {
    await industriesStore.fetchIndustry(industryId.value)
  }
}

const handleDuplicate = async () => {
  if (!industry.value) return
  const success = await duplicateIndustry(industry.value)
  if (success) {
    await router.push('/industries')
  }
}

const handleDelete = async () => {
  if (!industry.value) return
  const deleted = await confirmAndDeleteIndustry(industry.value)
  if (deleted) {
    await router.push('/industries')
  }
}

watch(
  industry,
  (value) => {
    if (!value) return
    breadcrumbStore.setBreadcrumb([
      { title: 'Dashboard', path: '/' },
      { title: 'Industries', path: '/industries' },
      { title: value.title, path: `/industries/${industryId.value}` },
    ])
  },
  { immediate: true },
)

onMounted(async () => {
  try {
    await industriesStore.fetchIndustry(industryId.value)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[IndustriesDetail] Failed to fetch industry', err)
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

.gn-detail__error {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: rgba(248, 113, 113, 0.08);
  border: 1px solid rgba(248, 113, 113, 0.25);
  border-radius: 16px;
  color: #b91c1c;
}

.gn-detail__error h4 {
  margin: 0 0 0.25rem;
  font-size: 1rem;
  font-weight: 700;
}

.gn-detail__error-icon {
  display: inline-flex;
  width: 22px;
  height: 22px;
  flex-shrink: 0;
}

.gn-detail__error-icon :deep(svg) {
  width: 100%;
  height: 100%;
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

.gn-detail__chip--success {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.25);
  color: #047857;
}

.gn-detail__chip--success .gn-detail__chip-dot {
  background: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.25);
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
    filter 0.25s ease;
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

.gn-detail__body-text {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.65;
  color: rgba(15, 23, 42, 0.72);
  white-space: pre-wrap;
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

.gn-detail__row code {
  display: inline-block;
  padding: 0.2rem 0.55rem;
  background: rgba(15, 23, 42, 0.05);
  border-radius: 6px;
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.78rem;
  color: #0f172a;
}

.gn-detail__small {
  font-size: 0.72rem;
  font-weight: 400;
}

.gn-detail__muted {
  color: rgba(15, 23, 42, 0.45);
}

.gn-detail__color-row {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.gn-detail__swatch {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 6px;
  border: 1px solid rgba(15, 23, 42, 0.15);
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

.gn-detail__action-icon :deep(svg) {
  width: 18px;
  height: 18px;
}

.gn-detail__action span {
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

.gn-detail__action--primary {
  background: linear-gradient(135deg, rgba(167, 139, 250, 0.12) 0%, rgba(124, 58, 237, 0.08) 100%);
  border-color: rgba(167, 139, 250, 0.3);
  color: #6d28d9;
}

.gn-detail__action--primary .gn-detail__action-icon {
  background: rgba(167, 139, 250, 0.18);
  color: #6d28d9;
}

.gn-detail__action--primary .gn-detail__action-hint {
  color: rgba(109, 40, 217, 0.6);
}

.gn-detail__action--primary:hover {
  background: linear-gradient(135deg, rgba(167, 139, 250, 0.2) 0%, rgba(124, 58, 237, 0.14) 100%);
  border-color: rgba(167, 139, 250, 0.5);
}

.gn-detail__action--warning {
  color: #b45309;
}

.gn-detail__action--warning .gn-detail__action-icon {
  background: rgba(245, 158, 11, 0.14);
  color: #b45309;
}

.gn-detail__action--warning:hover {
  background: rgba(245, 158, 11, 0.08);
  border-color: rgba(245, 158, 11, 0.3);
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

.gn-detail__action--info {
  color: #1d4ed8;
}

.gn-detail__action--info .gn-detail__action-icon {
  background: rgba(59, 130, 246, 0.14);
  color: #1d4ed8;
}

.gn-detail__action--info:hover {
  background: rgba(59, 130, 246, 0.08);
  border-color: rgba(59, 130, 246, 0.3);
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

html[data-bs-theme='dark'] .gn-detail__chip--muted .gn-detail__chip-dot {
  background: rgba(245, 245, 247, 0.45);
}

html[data-bs-theme='dark'] .gn-detail__card {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 24px 48px -28px rgba(0, 0, 0, 0.5);
}

html[data-bs-theme='dark'] .gn-detail__body-text {
  color: rgba(245, 245, 247, 0.72);
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

html[data-bs-theme='dark'] .gn-detail__row code {
  background: rgba(255, 255, 255, 0.06);
  color: #f5f5f7;
}

html[data-bs-theme='dark'] .gn-detail__muted {
  color: rgba(245, 245, 247, 0.45);
}

html[data-bs-theme='dark'] .gn-detail__swatch {
  border-color: rgba(255, 255, 255, 0.15);
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

html[data-bs-theme='dark'] .gn-detail__action--primary {
  background: linear-gradient(135deg, rgba(167, 139, 250, 0.18) 0%, rgba(124, 58, 237, 0.12) 100%);
  border-color: rgba(167, 139, 250, 0.35);
  color: #c4b5fd;
}

html[data-bs-theme='dark'] .gn-detail__action--primary .gn-detail__action-icon {
  background: rgba(167, 139, 250, 0.22);
  color: #c4b5fd;
}

html[data-bs-theme='dark'] .gn-detail__action--primary .gn-detail__action-hint {
  color: rgba(196, 181, 253, 0.6);
}

html[data-bs-theme='dark'] .gn-detail__action--warning {
  color: #fbbf24;
}

html[data-bs-theme='dark'] .gn-detail__action--warning .gn-detail__action-icon {
  background: rgba(251, 191, 36, 0.18);
  color: #fbbf24;
}

html[data-bs-theme='dark'] .gn-detail__action--success {
  color: #6ee7b7;
}

html[data-bs-theme='dark'] .gn-detail__action--success .gn-detail__action-icon {
  background: rgba(16, 185, 129, 0.18);
  color: #6ee7b7;
}

html[data-bs-theme='dark'] .gn-detail__action--info {
  color: #93c5fd;
}

html[data-bs-theme='dark'] .gn-detail__action--info .gn-detail__action-icon {
  background: rgba(59, 130, 246, 0.18);
  color: #93c5fd;
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
