<template>
  <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
    <div class="d-flex flex-column flex-column-fluid">
      <div id="kt_app_content" class="app-content flex-column-fluid">
        <div id="kt_app_content_container" class="app-container container-fluid">

          <div v-if="industriesStore.isLoading && !industry" class="gn-form__shimmer" />

          <form v-else-if="industry" class="gn-form" @submit.prevent="submit">
            <header class="gn-form__hero">
              <div class="gn-form__hero-icon" :style="heroStyle">
                <GIcon :name="form.icon || 'briefcase'" :size="42" />
              </div>
              <div class="gn-form__hero-body">
                <span class="gn-form__eyebrow">Edit industry</span>
                <h1 class="gn-form__title">{{ form.title || industry.title }}</h1>
                <p class="gn-form__subtitle">Update this industry sector's details.</p>
              </div>
              <div class="gn-form__hero-actions">
                <button type="button" class="gn-form__btn gn-form__btn--danger-ghost" @click="handleDelete" :disabled="isSubmitting">
                  <GIcon name="trash-2" :size="16" /> Delete
                </button>
                <NuxtLink to="/industries" class="gn-form__btn gn-form__btn--ghost">Cancel</NuxtLink>
                <button type="submit" class="gn-form__btn gn-form__btn--primary" :disabled="isSubmitting">
                  <GIcon name="check" :size="16" />
                  {{ isSubmitting ? 'Saving…' : 'Save changes' }}
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
                  <input id="ind-title" v-model="form.title" type="text" class="gn-form__input" placeholder="e.g. Banks & Financial Services" required maxlength="255" />
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

                <div class="gn-form__row">
                  <div class="gn-form__field">
                    <label class="gn-form__label" for="ind-color">Icon color</label>
                    <div style="display:flex;align-items:center;gap:0.75rem">
                      <input v-model="form.icon_color" type="color" style="width:40px;height:40px;border:0;padding:0;border-radius:10px;cursor:pointer" />
                      <input v-model="form.icon_color" type="text" class="gn-form__input" placeholder="#8b5cf6" style="flex:1" />
                    </div>
                  </div>

                  <div class="gn-form__field">
                    <label class="gn-form__label">Status</label>
                    <label style="display:flex;align-items:center;gap:0.75rem;cursor:pointer;padding:0.65rem 0">
                      <input v-model="form.is_active" type="checkbox" style="width:18px;height:18px;accent-color:#7c3aed" />
                      <span style="font-size:0.9rem;font-weight:500">{{ form.is_active ? 'Active — visible on public site' : 'Inactive — hidden from public site' }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </section>
          </form>

          <div v-else class="gn-form__empty">
            <h3>Industry not found</h3>
            <NuxtLink to="/industries" class="gn-form__btn gn-form__btn--primary">Back to industries</NuxtLink>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import Swal from 'sweetalert2'
import { useIndustriesStore } from '../stores/useIndustriesStore'
import { useIndustryActions } from '../composables/useIndustryActions'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import { useLocaleForm } from '~/composables/useLocaleForm'
import { GET_INDUSTRY } from '../graphql/queries'
import GIcon from '~/components/icons/GIcon.vue'
import IconPicker from '~/components/icons/IconPicker.vue'
import LocaleToggle from '~/components/LocaleToggle.vue'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const router = useRouter()
const industriesStore = useIndustriesStore()
const breadcrumbStore = useBreadcrumbStore()
const { confirmAndDeleteIndustry } = useIndustryActions()

const CATEGORIES = [
  { value: 'FINANCIAL_SERVICES', label: 'Financial Services' },
  { value: 'HEALTHCARE', label: 'Healthcare' },
  { value: 'GOVERNMENT', label: 'Government' },
  { value: 'EDUCATION', label: 'Education' },
  { value: 'MANUFACTURING', label: 'Manufacturing' },
  { value: 'RETAIL', label: 'Retail' },
  { value: 'NGO', label: 'NGO' },
]

const industryId = computed(() => route.params.id as string)
const industry = computed(() => industriesStore.currentIndustry)

const {
  locale,
  form,
  loadAll,
  loadTranslation,
  getSubmitPayload,
  fetchBothLocales,
} = useLocaleForm({
  translatableKeys: ['title', 'short_description', 'description'],
  defaults: {
    title: '',
    short_description: '',
    description: '',
    category: '',
    icon: '',
    icon_color: '',
    is_active: true,
  },
})

const isSubmitting = ref(false)

const heroStyle = computed(() => {
  const c = form.icon_color as string
  if (!c || c.length !== 7) return {}
  const r = parseInt(c.slice(1, 3), 16)
  const g = parseInt(c.slice(3, 5), 16)
  const b = parseInt(c.slice(5, 7), 16)
  return {
    background: `linear-gradient(135deg, rgba(${r},${g},${b},0.18) 0%, rgba(${r},${g},${b},0.28) 100%)`,
    borderColor: `rgba(${r},${g},${b},0.45)`,
    color: c,
  }
})

watch(
  industry,
  (value) => {
    if (!value) return
    breadcrumbStore.setBreadcrumb([
      { title: 'Dashboard', path: '/' },
      { title: 'Industries', path: '/industries' },
      { title: value.title, path: `/industries/${industryId.value}/edit` },
    ])
  },
  { immediate: true },
)

const submit = async () => {
  const payload = getSubmitPayload()
  if (!payload.title || !industry.value) return
  isSubmitting.value = true
  try {
    await industriesStore.updateIndustry(
      industryId.value,
      {
        title: (payload.title as string).trim(),
        short_description: (payload.short_description as string)?.trim() || null,
        description: (payload.description as string)?.trim() || null,
        category: (payload.category as string) || null,
        icon: (payload.icon as string) || null,
        icon_color: (payload.icon_color as string) || null,
        is_active: payload.is_active as boolean,
      },
      payload.locale,
    )
    await Swal.fire({ title: 'Saved', text: `Content saved (${payload.locale.toUpperCase()})`, icon: 'success', timer: 1800, showConfirmButton: false })
  } catch (err: any) {
    await Swal.fire({ title: 'Failed', text: err.message, icon: 'error' })
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = async () => {
  if (!industry.value) return
  const deleted = await confirmAndDeleteIndustry(industry.value)
  if (deleted) router.push('/industries')
}

onMounted(async () => {
  try {
    await industriesStore.fetchIndustry(industryId.value)

    if (industry.value) {
      await fetchBothLocales(
        GET_INDUSTRY,
        { id: industryId.value },
        (data: any) => data?.industry || null,
      )
    }
  } catch (err) {
    console.error('[IndustriesEdit] Failed to fetch', err)
  }
})
</script>
