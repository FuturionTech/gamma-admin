<template>
  <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
    <div class="d-flex flex-column flex-column-fluid">
      <div id="kt_app_content" class="app-content flex-column-fluid">
        <div id="kt_app_content_container" class="app-container container-fluid">

          <!-- Loading -->
          <div v-if="servicesStore.isLoading && !service" class="gn-detail__shimmer" />

          <!-- Error -->
          <div v-else-if="servicesStore.hasError" class="gn-detail__error" role="alert">
            <GIcon name="alert-circle" :size="22" />
            <div>
              <h4>An error occurred</h4>
              <span>{{ servicesStore.error }}</span>
            </div>
          </div>

          <!-- Not found -->
          <div v-else-if="!service" class="gn-detail__empty">
            <GIcon name="layers" :size="42" />
            <h3>Service not found</h3>
            <p>This service may have been deleted or the link is invalid.</p>
            <NuxtLink to="/services" class="gn-detail__btn gn-detail__btn--primary">Back to services</NuxtLink>
          </div>

          <!-- Content -->
          <div v-else class="gn-detail">
            <!-- Hero -->
            <header class="gn-detail__hero">
              <div class="gn-detail__hero-icon" :style="heroIconStyle">
                <GIcon :name="service.icon || 'layers'" :size="42" />
              </div>
              <div class="gn-detail__hero-body">
                <span class="gn-detail__eyebrow">{{ service.category || 'Service' }}</span>
                <h1 class="gn-detail__title">{{ service.title }}</h1>
                <p v-if="service.short_description" class="gn-detail__subtitle">
                  {{ service.short_description }}
                </p>
                <div class="gn-detail__meta">
                  <span
                    class="gn-detail__chip"
                    :class="service.is_active ? 'gn-detail__chip--success' : 'gn-detail__chip--muted'"
                  >
                    <span class="gn-detail__chip-dot" />
                    {{ service.is_active ? 'Active' : 'Inactive' }}
                  </span>
                  <span v-if="service.category" class="gn-detail__chip gn-detail__chip--muted">
                    <GIcon name="tag" :size="12" />
                    {{ service.category }}
                  </span>
                  <span class="gn-detail__chip gn-detail__chip--muted">
                    <GIcon name="clock" :size="12" />
                    Updated {{ formatRelativeDate(service.updated_at) }}
                  </span>
                </div>
              </div>
              <div class="gn-detail__hero-actions">
                <NuxtLink
                  :to="`/services/${service.id}/edit`"
                  class="gn-detail__btn gn-detail__btn--primary"
                >
                  <GIcon name="edit" :size="16" />
                  Edit
                </NuxtLink>
              </div>
            </header>

            <div class="gn-detail__grid">
              <!-- Main column -->
              <div class="gn-detail__main">
                <section v-if="service.description" class="gn-detail__card">
                  <h3 class="gn-detail__card-title">About</h3>
                  <p class="gn-detail__body-text">{{ service.description }}</p>
                </section>

                <section class="gn-detail__card">
                  <h3 class="gn-detail__card-title">Details</h3>
                  <dl class="gn-detail__list">
                    <div class="gn-detail__row">
                      <dt>Slug</dt>
                      <dd><code>{{ service.slug }}</code></dd>
                    </div>
                    <div v-if="service.category" class="gn-detail__row">
                      <dt>Category</dt>
                      <dd>{{ service.category }}</dd>
                    </div>
                    <div class="gn-detail__row">
                      <dt>Icon</dt>
                      <dd v-if="service.icon"><code>{{ service.icon }}</code></dd>
                      <dd v-else class="gn-detail__muted">No icon set</dd>
                    </div>
                    <div v-if="service.icon_color" class="gn-detail__row">
                      <dt>Icon color</dt>
                      <dd class="gn-detail__color-row">
                        <span class="gn-detail__swatch" :style="{ background: service.icon_color }" />
                        <code>{{ service.icon_color }}</code>
                      </dd>
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
                        <div>{{ formatDateTime(service.created_at) }}</div>
                        <div class="gn-detail__muted gn-detail__small">
                          {{ formatRelativeDate(service.created_at) }}
                        </div>
                      </dd>
                    </div>
                    <div class="gn-detail__row">
                      <dt>Updated</dt>
                      <dd>
                        <div>{{ formatDateTime(service.updated_at) }}</div>
                        <div class="gn-detail__muted gn-detail__small">
                          {{ formatRelativeDate(service.updated_at) }}
                        </div>
                      </dd>
                    </div>
                  </dl>
                </section>

                <section class="gn-detail__card">
                  <h3 class="gn-detail__card-title">Actions</h3>
                  <div class="gn-detail__actions">
                    <NuxtLink
                      :to="`/services/${service.id}/edit`"
                      class="gn-detail__action gn-detail__action--primary"
                    >
                      <span class="gn-detail__action-icon"><GIcon name="edit" :size="18" /></span>
                      <span>
                        <span class="gn-detail__action-title">Edit</span>
                        <span class="gn-detail__action-hint">Update details</span>
                      </span>
                    </NuxtLink>
                    <button
                      type="button"
                      class="gn-detail__action gn-detail__action--danger"
                      @click="handleDelete"
                    >
                      <span class="gn-detail__action-icon"><GIcon name="trash-2" :size="18" /></span>
                      <span>
                        <span class="gn-detail__action-title">Delete</span>
                        <span class="gn-detail__action-hint">Remove permanently</span>
                      </span>
                    </button>
                  </div>
                </section>

                <NuxtLink to="/services" class="gn-detail__back">
                  <GIcon name="arrow-left" :size="16" />
                  Back to services
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
import { useServicesStore } from '../stores/useServicesStore'
import { useServiceFormatters } from '../composables/useServiceFormatters'
import { useServiceActions } from '../composables/useServiceActions'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import GIcon from '~/components/icons/GIcon.vue'

definePageMeta({ middleware: 'auth' })

const servicesStore = useServicesStore()
const breadcrumbStore = useBreadcrumbStore()
const route = useRoute()
const router = useRouter()

const {
  formatDateTime,
  formatRelativeDate,
} = useServiceFormatters()

const {
  confirmAndDeleteService,
} = useServiceActions()

const serviceId = computed(() => route.params.id as string)
const service = computed(() => servicesStore.currentService)

const heroIconStyle = computed(() => {
  if (!service.value?.icon_color) return {}
  const c = service.value.icon_color
  return {
    background: `linear-gradient(135deg, ${hexAlpha(c, 0.18)} 0%, ${hexAlpha(c, 0.28)} 100%)`,
    borderColor: hexAlpha(c, 0.45),
    color: c,
  }
})

const hexAlpha = (hex: string, alpha: number): string => {
  const t = hex.replace('#', '')
  if (t.length !== 6) return hex
  const r = parseInt(t.slice(0, 2), 16)
  const g = parseInt(t.slice(2, 4), 16)
  const b = parseInt(t.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const handleDelete = async () => {
  if (!service.value) return
  const deleted = await confirmAndDeleteService(service.value)
  if (deleted) {
    await router.push('/services')
  }
}

watch(
  service,
  (value) => {
    if (!value) return
    breadcrumbStore.setBreadcrumb([
      { title: 'Dashboard', path: '/' },
      { title: 'Services', path: '/services' },
      { title: value.title, path: `/services/${serviceId.value}` },
    ])
  },
  { immediate: true },
)

onMounted(async () => {
  try {
    await servicesStore.fetchService(serviceId.value)
  } catch (err) {
    console.error('[ServicesDetail] Failed to fetch service', err)
  }
})
</script>

<!-- All gn-detail__* styles provided globally by ~/assets/sass/gn-design.css -->
