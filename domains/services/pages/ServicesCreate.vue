<template>
  <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
    <div class="d-flex flex-column flex-column-fluid">
      <div id="kt_app_content" class="app-content flex-column-fluid">
        <div id="kt_app_content_container" class="app-container container-fluid">

          <form class="gn-form" @submit.prevent="submit">
            <header class="gn-form__hero">
              <div class="gn-form__hero-icon">
                <GIcon :name="form.icon || 'layers'" :size="42" />
              </div>
              <div class="gn-form__hero-body">
                <span class="gn-form__eyebrow">New service</span>
                <h1 class="gn-form__title">{{ form.title || 'Untitled service' }}</h1>
                <p class="gn-form__subtitle">
                  Define a consulting service that will appear on the public site.
                </p>
              </div>
              <div class="gn-form__hero-actions">
                <NuxtLink to="/services" class="gn-form__btn gn-form__btn--ghost">Cancel</NuxtLink>
                <button type="submit" class="gn-form__btn gn-form__btn--primary" :disabled="isSubmitting">
                  <GIcon name="check" :size="16" />
                  {{ isSubmitting ? 'Saving…' : 'Create service' }}
                </button>
              </div>
            </header>

            <section class="gn-form__card">
              <div class="gn-form__card-header">
                <h3 class="gn-form__card-title">Service details</h3>
                <LocaleToggle v-model="locale" />
              </div>

              <div class="gn-form__fields">
                <div class="gn-form__field">
                  <label class="gn-form__label" for="svc-title">
                    Title
                    <span class="gn-form__locale-badge">{{ locale.toUpperCase() }}</span>
                  </label>
                  <input
                    id="svc-title"
                    v-model="form.title"
                    type="text"
                    class="gn-form__input"
                    placeholder="e.g. AI & Intelligent Systems"
                    required
                    maxlength="255"
                    autofocus
                  />
                </div>

                <div class="gn-form__field">
                  <label class="gn-form__label" for="svc-short">
                    Short description
                    <span class="gn-form__locale-badge">{{ locale.toUpperCase() }}</span>
                  </label>
                  <textarea
                    id="svc-short"
                    v-model="form.short_description"
                    class="gn-form__textarea"
                    rows="2"
                    placeholder="One-liner shown on service cards"
                    maxlength="300"
                  />
                  <span class="gn-form__helper">{{ (form.short_description || '').length }} / 300</span>
                </div>

                <div class="gn-form__row">
                  <div class="gn-form__field">
                    <label class="gn-form__label" for="svc-category">Category</label>
                    <select id="svc-category" v-model="form.category" class="gn-form__select">
                      <option value="">Select a category</option>
                      <option v-for="cat in SERVICE_CATEGORIES" :key="cat.value" :value="cat.value">
                        {{ cat.label }}
                      </option>
                    </select>
                  </div>

                  <div class="gn-form__field">
                    <label class="gn-form__label" for="svc-icon">Icon</label>
                    <IconPicker v-model="form.icon" placeholder="Pick an icon" />
                  </div>
                </div>

                <div class="gn-form__field">
                  <label class="gn-form__label" for="svc-desc">
                    Full description
                    <span class="gn-form__locale-badge">{{ locale.toUpperCase() }}</span>
                  </label>
                  <textarea
                    id="svc-desc"
                    v-model="form.description"
                    class="gn-form__textarea"
                    rows="5"
                    placeholder="Detailed description shown on the service detail page"
                  />
                </div>
              </div>
            </section>
          </form>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { useServicesStore } from '../stores/useServicesStore'
import { useServiceFormatters } from '../composables/useServiceFormatters'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import { useServiceCategoriesStore } from '../stores/useServiceCategoriesStore'
import { useLocaleForm } from '~/composables/useLocaleForm'
import GIcon from '~/components/icons/GIcon.vue'
import IconPicker from '~/components/icons/IconPicker.vue'
import LocaleToggle from '~/components/LocaleToggle.vue'

definePageMeta({ middleware: 'auth' })

const router = useRouter()
const servicesStore = useServicesStore()
const categoriesStore = useServiceCategoriesStore()
const breadcrumbStore = useBreadcrumbStore()
const { generateSlug } = useServiceFormatters()

const SERVICE_CATEGORIES = computed(() =>
  categoriesStore.sortedCategories.map((c) => ({ value: c.slug, label: c.name }))
)

const { locale, form, setLocale, getSubmitPayload } = useLocaleForm({
  translatableKeys: ['title', 'short_description', 'description'],
  defaults: {
    title: '',
    short_description: '',
    description: '',
    category: '',
    icon: '',
  },
})

const isSubmitting = ref(false)

const submit = async () => {
  const payload = getSubmitPayload()
  if (!payload.title?.trim()) return
  isSubmitting.value = true
  try {
    await servicesStore.createService({
      title: payload.title.trim(),
      short_description: (payload.short_description as string)?.trim() || null,
      description: (payload.description as string)?.trim() || null,
      category: (payload.category as string) || null,
      icon: (payload.icon as string) || null,
      slug: generateSlug(payload.title),
      is_active: true,
      locale: payload.locale,
    } as any)
    await Swal.fire({
      title: 'Created',
      text: `Service created (${payload.locale.toUpperCase()})`,
      icon: 'success',
      timer: 1800,
      showConfirmButton: false,
    })
    router.push('/services')
  } catch (err: any) {
    await Swal.fire({
      title: 'Failed to create',
      text: err.message || 'Something went wrong',
      icon: 'error',
    })
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  breadcrumbStore.setBreadcrumb([
    { title: 'Dashboard', path: '/' },
    { title: 'Services', path: '/services' },
    { title: 'New service', path: '/services/create' },
  ])
  await categoriesStore.fetchCategories()
})
</script>
