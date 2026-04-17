<template>
  <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
    <div class="d-flex flex-column flex-column-fluid">
      <div id="kt_app_content" class="app-content flex-column-fluid">
        <div id="kt_app_content_container" class="app-container container-fluid">

          <form class="gn-form" @submit.prevent="submit">
            <header class="gn-form__hero">
              <div class="gn-form__hero-icon">
                <GIcon :name="form.icon || 'briefcase'" :size="42" />
              </div>
              <div class="gn-form__hero-body">
                <span class="gn-form__eyebrow">New industry</span>
                <h1 class="gn-form__title">{{ form.title || 'Untitled industry' }}</h1>
                <p class="gn-form__subtitle">Define an industry sector for the public site.</p>
              </div>
              <div class="gn-form__hero-actions">
                <NuxtLink to="/industries" class="gn-form__btn gn-form__btn--ghost">Cancel</NuxtLink>
                <button type="submit" class="gn-form__btn gn-form__btn--primary" :disabled="isSubmitting">
                  <GIcon name="check" :size="16" />
                  {{ isSubmitting ? 'Saving…' : 'Create industry' }}
                </button>
              </div>
            </header>

            <section class="gn-form__card">
              <div class="gn-form__card-header">
                <h3 class="gn-form__card-title">Industry details</h3>
                <LocaleToggle v-model="locale" />
              </div>

              <div class="gn-form__fields">
                <div class="gn-form__field">
                  <label class="gn-form__label" for="ind-title">
                    Title <span class="gn-form__locale-badge">{{ locale.toUpperCase() }}</span>
                  </label>
                  <input id="ind-title" v-model="form.title" type="text" class="gn-form__input" placeholder="e.g. Banks & Financial Services" required maxlength="255" autofocus />
                </div>

                <div class="gn-form__field">
                  <label class="gn-form__label" for="ind-short">
                    Short description <span class="gn-form__locale-badge">{{ locale.toUpperCase() }}</span>
                  </label>
                  <input id="ind-short" v-model="form.short_description" type="text" class="gn-form__input" placeholder="One-sentence summary" maxlength="300" />
                </div>

                <div class="gn-form__field">
                  <label class="gn-form__label" for="ind-desc">
                    Description <span class="gn-form__locale-badge">{{ locale.toUpperCase() }}</span>
                  </label>
                  <textarea id="ind-desc" v-model="form.description" class="gn-form__textarea" rows="5" placeholder="Full description of what this industry covers" />
                </div>

                <div class="gn-form__row">
                  <div class="gn-form__field">
                    <label class="gn-form__label" for="ind-category">Category</label>
                    <select id="ind-category" v-model="form.category" class="gn-form__select">
                      <option value="">Select a category</option>
                      <option v-for="cat in CATEGORIES" :key="cat.value" :value="cat.value">{{ cat.label }}</option>
                    </select>
                  </div>

                  <div class="gn-form__field">
                    <label class="gn-form__label" for="ind-icon">Icon</label>
                    <IconPicker v-model="form.icon" placeholder="Pick an icon" />
                  </div>
                </div>

                <div class="gn-form__field">
                  <label class="gn-form__label" for="ind-color">Icon color</label>
                  <div style="display:flex;align-items:center;gap:0.75rem;max-width:280px">
                    <input v-model="form.icon_color" type="color" style="width:40px;height:40px;border:0;padding:0;border-radius:10px;cursor:pointer" />
                    <input v-model="form.icon_color" type="text" class="gn-form__input" placeholder="#8b5cf6" style="flex:1" />
                  </div>
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
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { useIndustriesStore } from '../stores/useIndustriesStore'
import { useIndustryFormatters } from '../composables/useIndustryFormatters'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import { useLocaleForm } from '~/composables/useLocaleForm'
import GIcon from '~/components/icons/GIcon.vue'
import IconPicker from '~/components/icons/IconPicker.vue'
import LocaleToggle from '~/components/LocaleToggle.vue'

definePageMeta({ middleware: 'auth' })

const router = useRouter()
const industriesStore = useIndustriesStore()
const breadcrumbStore = useBreadcrumbStore()
const { generateSlug } = useIndustryFormatters()

const CATEGORIES = [
  { value: 'FINANCIAL_SERVICES', label: 'Financial Services' },
  { value: 'HEALTHCARE', label: 'Healthcare' },
  { value: 'GOVERNMENT', label: 'Government' },
  { value: 'EDUCATION', label: 'Education' },
  { value: 'MANUFACTURING', label: 'Manufacturing' },
  { value: 'RETAIL', label: 'Retail' },
  { value: 'NGO', label: 'NGO' },
]

const { locale, form, getSubmitPayload } = useLocaleForm({
  translatableKeys: ['title', 'short_description', 'description'],
  defaults: {
    title: '',
    short_description: '',
    description: '',
    category: '',
    icon: '',
    icon_color: '#8b5cf6',
  },
})

const isSubmitting = ref(false)

const submit = async () => {
  const payload = getSubmitPayload()
  if (!payload.title) return
  isSubmitting.value = true
  try {
    await industriesStore.createIndustry(
      {
        title: (payload.title as string).trim(),
        short_description: (payload.short_description as string)?.trim() || null,
        description: (payload.description as string)?.trim() || null,
        category: (payload.category as string) || null,
        icon: (payload.icon as string) || null,
        icon_color: (payload.icon_color as string) || null,
        slug: generateSlug(payload.title as string),
        is_active: true,
      },
      payload.locale,
    )
    await Swal.fire({ title: 'Created', text: `Industry created (${payload.locale.toUpperCase()})`, icon: 'success', timer: 1800, showConfirmButton: false })
    router.push('/industries')
  } catch (err: any) {
    await Swal.fire({ title: 'Failed', text: err.message, icon: 'error' })
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  breadcrumbStore.setBreadcrumb([
    { title: 'Dashboard', path: '/' },
    { title: 'Industries', path: '/industries' },
    { title: 'New industry', path: '/industries/create' },
  ])
})
</script>
