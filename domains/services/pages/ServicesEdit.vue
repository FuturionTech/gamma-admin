<template>
  <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
    <div class="d-flex flex-column flex-column-fluid">
      <div id="kt_app_content" class="app-content flex-column-fluid">
        <div id="kt_app_content_container" class="app-container container-fluid">

          <div v-if="loading" class="gn-form" style="pointer-events:none">
            <!-- Skeleton hero -->
            <div class="gn-skeleton__hero">
              <div class="gn-skeleton__icon gn-skeleton__pulse" />
              <div style="flex:1;display:flex;flex-direction:column;gap:0.6rem">
                <div class="gn-skeleton__line gn-skeleton__pulse" style="width:90px;height:12px" />
                <div class="gn-skeleton__line gn-skeleton__pulse" style="width:320px;height:28px" />
                <div class="gn-skeleton__line gn-skeleton__pulse" style="width:260px;height:14px" />
              </div>
              <div style="display:flex;gap:0.5rem">
                <div class="gn-skeleton__btn gn-skeleton__pulse" />
                <div class="gn-skeleton__btn gn-skeleton__pulse" />
                <div class="gn-skeleton__btn gn-skeleton__pulse" style="width:100px" />
              </div>
            </div>
            <!-- Skeleton toolbar -->
            <div style="display:flex;justify-content:space-between;align-items:center">
              <div class="gn-skeleton__line gn-skeleton__pulse" style="width:160px;height:34px;border-radius:10px" />
              <div style="display:flex;gap:0.3rem">
                <div v-for="i in 8" :key="i" class="gn-skeleton__pill gn-skeleton__pulse" />
              </div>
            </div>
            <!-- Skeleton card -->
            <div class="gn-skeleton__card">
              <div class="gn-skeleton__line gn-skeleton__pulse" style="width:140px;height:13px;margin-bottom:1.25rem" />
              <div style="display:flex;flex-direction:column;gap:1.1rem">
                <div v-for="i in 4" :key="i" style="display:flex;flex-direction:column;gap:0.4rem">
                  <div class="gn-skeleton__line gn-skeleton__pulse" style="width:80px;height:11px" />
                  <div class="gn-skeleton__line gn-skeleton__pulse" style="height:42px;border-radius:12px" />
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="serviceLoaded" class="gn-form">
            <!-- Hero header -->
            <header class="gn-form__hero">
              <div class="gn-form__hero-icon">
                <GIcon :name="shared.icon || 'layers'" :size="42" />
              </div>
              <div class="gn-form__hero-body">
                <span class="gn-form__eyebrow">Edit service</span>
                <h1 class="gn-form__title">{{ t.title || 'Untitled service' }}</h1>
                <p class="gn-form__subtitle">Full page editor — every section of the public service page.</p>
              </div>
              <div class="gn-form__hero-actions">
                <button type="button" class="gn-form__btn gn-form__btn--danger-ghost" @click="handleDelete" :disabled="saving">
                  <GIcon name="trash-2" :size="16" /> Delete
                </button>
                <NuxtLink to="/services" class="gn-form__btn gn-form__btn--ghost">Back</NuxtLink>
                <button type="button" class="gn-form__btn gn-form__btn--primary" :disabled="saving" @click="saveAllText">
                  <GIcon name="check" :size="16" />
                  {{ saving ? 'Saving…' : 'Save all' }}
                </button>
              </div>
            </header>

            <!-- Locale + section nav -->
            <div class="gn-editor__toolbar">
              <LocaleToggle v-model="locale" />
              <div class="gn-editor__section-nav">
                <button v-for="s in SECTIONS" :key="s.key" type="button" class="gn-editor__nav-pill" :class="{ 'gn-editor__nav-pill--active': activeSection === s.key }" @click="switchSection(s.key)">
                  {{ s.short }}
                </button>
                <button type="button" class="gn-editor__nav-pill" :class="{ 'gn-editor__nav-pill--active': activeSection === 'features' }" @click="switchSection('features')">
                  Features
                </button>
              </div>
            </div>

            <!-- Active section -->
            <template v-for="s in SECTIONS" :key="s.key">
              <section v-if="activeSection === s.key" class="gn-form__card">
                <div class="gn-form__card-header">
                  <div>
                    <h3 class="gn-form__card-title" style="margin-bottom:0.15rem">{{ s.title }}</h3>
                    <p v-if="s.hint" style="margin:0;font-size:0.8rem;color:var(--gn-text-muted)">{{ s.hint }}</p>
                  </div>
                </div>

                <div class="gn-form__fields" style="margin-top:1rem">
                  <template v-for="field in s.fields" :key="field.key">
                    <div class="gn-form__field">
                      <label class="gn-form__label">
                        {{ field.label }}
                        <span v-if="field.translatable" class="gn-form__locale-badge">{{ locale.toUpperCase() }}</span>
                      </label>
                      <!-- Translatable textarea -->
                      <textarea v-if="field.type === 'textarea' && field.translatable" v-model="translations[locale][field.key]" class="gn-form__textarea" :rows="field.rows || 3" :placeholder="field.placeholder" />
                      <!-- Shared select -->
                      <select v-else-if="field.type === 'select'" v-model="shared[field.key]" class="gn-form__select">
                        <option value="">Select</option>
                        <option v-for="o in field.options" :key="o.value" :value="o.value">{{ o.label }}</option>
                      </select>
                      <!-- Shared icon picker -->
                      <IconPicker v-else-if="field.type === 'icon'" v-model="shared[field.key]" :placeholder="field.placeholder" />
                      <!-- Translatable text input -->
                      <input v-else-if="field.translatable" v-model="translations[locale][field.key]" type="text" class="gn-form__input" :placeholder="field.placeholder" />
                      <!-- Shared text input -->
                      <input v-else v-model="shared[field.key]" type="text" class="gn-form__input" :placeholder="field.placeholder" />
                    </div>
                  </template>
                </div>
              </section>
            </template>

            <!-- Features -->
            <section v-if="activeSection === 'features'" class="gn-form__card">
              <div class="gn-form__card-header">
                <div>
                  <h3 class="gn-form__card-title" style="margin-bottom:0.15rem">Features <span v-if="features.length" class="gn-form__locale-badge">{{ features.length }}</span></h3>
                  <p style="margin:0;font-size:0.8rem;color:var(--gn-text-muted)">Capabilities shown on the service cards</p>
                </div>
                <button type="button" class="gn-form__btn gn-form__btn--ghost" style="padding:0.45rem 0.9rem;font-size:0.8rem" @click="addFeature">
                  <GIcon name="plus" :size="14" /> Add
                </button>
              </div>

              <div v-if="features.length === 0" style="text-align:center;padding:1.5rem;color:var(--gn-text-muted);font-size:0.88rem">
                No features yet. Click "Add" to create one.
              </div>

              <draggable v-else v-model="features" item-key="_key" handle=".gn-form__drag-handle" ghost-class="gn-form__feature-row--ghost" class="gn-form__fields" style="margin-top:0.75rem" @end="handleReorder">
                <template #item="{ element: feat, index: idx }">
                  <div class="gn-form__feature-row">
                    <div class="gn-form__drag-handle"><GIcon name="grip-vertical" :size="16" /></div>
                    <div style="flex:1;display:flex;flex-direction:column;gap:0.5rem">
                      <input v-model="feat.title" type="text" class="gn-form__input" :placeholder="`Feature ${idx + 1}`" />
                      <input v-model="feat.description" type="text" class="gn-form__input" placeholder="Description (optional)" style="font-size:0.86rem" />
                    </div>
                    <div style="display:flex;flex-direction:column;gap:0.3rem">
                      <button type="button" class="gn-form__icon-action" title="Save" @click="saveFeature(feat)" :disabled="!feat.title?.trim()"><GIcon name="check" :size="14" /></button>
                      <button type="button" class="gn-form__icon-action gn-form__icon-action--danger" title="Delete" @click="removeFeature(feat, idx)"><GIcon name="trash-2" :size="14" /></button>
                    </div>
                  </div>
                </template>
              </draggable>
            </section>
          </div>

          <div v-else class="gn-form__empty">
            <h3>Service not found</h3>
            <NuxtLink to="/services" class="gn-form__btn gn-form__btn--primary">Back to services</NuxtLink>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import Swal from 'sweetalert2'
import draggable from 'vuedraggable'
import { useServicesStore } from '../stores/useServicesStore'
import { useServiceFormatters } from '../composables/useServiceFormatters'
import { useServiceActions } from '../composables/useServiceActions'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import { useServiceCategoriesStore } from '../stores/useServiceCategoriesStore'
import { GET_SERVICE } from '../graphql/queries'
import { CREATE_SERVICE_FEATURE, UPDATE_SERVICE_FEATURE, DELETE_SERVICE_FEATURE, SORT_SERVICE_FEATURES } from '../graphql/mutations'
import GIcon from '~/components/icons/GIcon.vue'
import IconPicker from '~/components/icons/IconPicker.vue'
import LocaleToggle from '~/components/LocaleToggle.vue'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const router = useRouter()
const servicesStore = useServicesStore()
const categoriesStore = useServiceCategoriesStore()
const breadcrumbStore = useBreadcrumbStore()
const { generateSlug } = useServiceFormatters()
const { confirmAndDeleteService } = useServiceActions()

const serviceId = computed(() => route.params.id as string)
const locale = ref<'en' | 'fr'>('en')
const saving = ref(false)
const loading = ref(true)
const serviceLoaded = ref(false)

// Map of nested GraphQL response paths to flat translation keys
const NESTED_MAP: Record<string, string> = {
  hero_tagline: 'hero.tagline', hero_headline: 'hero.headline', hero_subheadline: 'hero.subheadline',
  hero_cta_primary_label: 'hero.ctaPrimaryLabel', hero_cta_secondary_label: 'hero.ctaSecondaryLabel',
  challenge_title: 'challenge.title', challenge_description: 'challenge.description',
  delivery_title: 'howWeDeliver.title', delivery_description: 'howWeDeliver.description',
  capabilities_title: 'capabilities.title',
  use_cases_title: 'keyUseCases.title', use_cases_description: 'keyUseCases.description',
  approach_title: 'ourApproach.title', approach_description: 'ourApproach.description',
  industry_title: 'industryApplications.title', industry_description: 'industryApplications.description',
  technologies_title: 'technologies.title', technologies_description: 'technologies.description',
  business_impact_title: 'businessImpact.title', business_impact_description: 'businessImpact.description',
  differentiators_title: 'differentiators.title',
  closing_title: 'closing.title', closing_subtitle: 'closing.subtitle',
}

const ALL_KEYS = [
  'title', 'short_description', 'description', 'meta_title', 'meta_description', 'meta_keywords',
  ...Object.keys(NESTED_MAP),
]

const mkEmpty = () => Object.fromEntries(ALL_KEYS.map(k => [k, '']))

const translations = reactive<Record<string, Record<string, string>>>({ en: mkEmpty(), fr: mkEmpty() })
const shared = reactive<Record<string, any>>({ category: '', icon: '', icon_color: '', is_active: true })

const t = computed(() => translations[locale.value])

const extractFromResponse = (data: any, key: string): string => {
  if (data[key] != null) return String(data[key])
  const path = NESTED_MAP[key]
  if (!path) return ''
  let val: any = data
  for (const p of path.split('.')) { val = val?.[p]; if (val == null) return '' }
  return String(val)
}

const loadLocaleData = (loc: string, data: any) => {
  if (!data) return
  const t = translations[loc]
  ALL_KEYS.forEach(k => { t[k] = extractFromResponse(data, k) })
  if (loc === 'en') {
    shared.category = data.category || ''
    shared.icon = data.icon || ''
    shared.icon_color = data.icon_color || ''
    shared.is_active = data.is_active ?? true
  }
}

// Sections config
const SERVICE_CATEGORIES = computed(() =>
  categoriesStore.sortedCategories.map(c => ({ value: c.slug, label: c.name }))
)

const SECTIONS = computed(() => [
  { key: 'basic', title: 'Basic Information', short: 'Basic', hint: 'Title, description, and classification', fields: [
    { key: 'title', label: 'Title', translatable: true, placeholder: 'Service title' },
    { key: 'short_description', label: 'Short description', translatable: true, type: 'textarea', rows: 2, placeholder: 'One-liner for cards' },
    { key: 'description', label: 'Full description', translatable: true, type: 'textarea', rows: 4, placeholder: 'Detailed description' },
    { key: 'category', label: 'Category', type: 'select', options: SERVICE_CATEGORIES.value },
    { key: 'icon', label: 'Icon', type: 'icon', placeholder: 'Pick an icon' },
  ]},
  { key: 'hero', title: 'Hero Section', short: 'Hero', hint: 'Main banner at the top of the service page', fields: [
    { key: 'hero_tagline', label: 'Tagline', translatable: true, placeholder: 'e.g. Artificial Intelligence that Ships' },
    { key: 'hero_headline', label: 'Headline', translatable: true, placeholder: 'Main hero headline' },
    { key: 'hero_subheadline', label: 'Subheadline', translatable: true, type: 'textarea', rows: 3, placeholder: 'Supporting paragraph' },
    { key: 'hero_cta_primary_label', label: 'Primary CTA', translatable: true, placeholder: 'e.g. Start Your AI Initiative' },
    { key: 'hero_cta_secondary_label', label: 'Secondary CTA', translatable: true, placeholder: 'e.g. See Our Methodology' },
  ]},
  { key: 'challenge', title: 'Challenge', short: 'Challenge', hint: 'The problem this service solves', fields: [
    { key: 'challenge_title', label: 'Title', translatable: true },
    { key: 'challenge_description', label: 'Description', translatable: true, type: 'textarea', rows: 3 },
  ]},
  { key: 'delivery', title: 'How We Deliver', short: 'Delivery', hint: 'Our delivery approach for this service', fields: [
    { key: 'delivery_title', label: 'Title', translatable: true },
    { key: 'delivery_description', label: 'Description', translatable: true, type: 'textarea', rows: 3 },
  ]},
  { key: 'capabilities', title: 'Capabilities', short: 'Capabilities', fields: [
    { key: 'capabilities_title', label: 'Section title', translatable: true },
  ]},
  { key: 'usecases', title: 'Key Use Cases', short: 'Use Cases', fields: [
    { key: 'use_cases_title', label: 'Title', translatable: true },
    { key: 'use_cases_description', label: 'Description', translatable: true, type: 'textarea', rows: 2 },
  ]},
  { key: 'approach', title: 'Our Approach', short: 'Approach', hint: 'Step-by-step methodology', fields: [
    { key: 'approach_title', label: 'Title', translatable: true },
    { key: 'approach_description', label: 'Description', translatable: true, type: 'textarea', rows: 3 },
  ]},
  { key: 'industry', title: 'Industry Applications', short: 'Industries', hint: 'Sector-specific applications', fields: [
    { key: 'industry_title', label: 'Title', translatable: true },
    { key: 'industry_description', label: 'Description', translatable: true, type: 'textarea', rows: 3 },
  ]},
  { key: 'technologies', title: 'Technologies & Platforms', short: 'Tech', fields: [
    { key: 'technologies_title', label: 'Title', translatable: true },
    { key: 'technologies_description', label: 'Description', translatable: true, type: 'textarea', rows: 2 },
  ]},
  { key: 'impact', title: 'Business Impact', short: 'Impact', fields: [
    { key: 'business_impact_title', label: 'Title', translatable: true },
    { key: 'business_impact_description', label: 'Description', translatable: true, type: 'textarea', rows: 2 },
  ]},
  { key: 'differentiators', title: 'Differentiators', short: 'Why Us', fields: [
    { key: 'differentiators_title', label: 'Section title', translatable: true },
  ]},
  { key: 'closing', title: 'Closing CTA', short: 'Closing', hint: 'Final call-to-action at the bottom', fields: [
    { key: 'closing_title', label: 'Title', translatable: true },
    { key: 'closing_subtitle', label: 'Subtitle', translatable: true },
  ]},
  { key: 'seo', title: 'SEO / Meta', short: 'SEO', hint: 'Search engine metadata', fields: [
    { key: 'meta_title', label: 'Meta title', translatable: true, placeholder: 'Page title for search engines' },
    { key: 'meta_description', label: 'Meta description', translatable: true, type: 'textarea', rows: 2 },
    { key: 'meta_keywords', label: 'Keywords', translatable: true, placeholder: 'Comma-separated' },
  ]},
])

const activeSection = ref('basic')

const switchSection = (key: string) => {
  activeSection.value = key
}

// Features
interface FeatureItem { id?: string; _key: string; title: string; description: string }
const features = ref<FeatureItem[]>([])
let featureCounter = 0

const addFeature = () => { features.value.push({ _key: `new-${++featureCounter}`, title: '', description: '' }) }

const saveFeature = async (feat: FeatureItem) => {
  if (!feat.title?.trim()) return
  const api = useApi()
  try {
    if (feat.id) {
      await api.mutate<any>(UPDATE_SERVICE_FEATURE, { variables: { id: feat.id, input: { title: feat.title.trim(), description: feat.description?.trim() || null, locale: locale.value } }, locale: locale.value })
    } else {
      const data = await api.mutate<any>(CREATE_SERVICE_FEATURE, { variables: { serviceId: serviceId.value, input: { title: feat.title.trim(), description: feat.description?.trim() || null, locale: locale.value } }, locale: locale.value })
      feat.id = data.createServiceFeature.id
      feat._key = feat.id
    }
    await Swal.fire({ title: 'Saved', icon: 'success', timer: 1200, showConfirmButton: false })
  } catch (err: any) { await Swal.fire({ title: 'Failed', text: err.message, icon: 'error' }) }
}

const removeFeature = async (feat: FeatureItem, idx: number) => {
  if (!feat.id) { features.value.splice(idx, 1); return }
  const r = await Swal.fire({ title: 'Delete?', text: feat.title, icon: 'warning', showCancelButton: true, confirmButtonColor: '#dc2626', confirmButtonText: 'Delete' })
  if (!r.isConfirmed) return
  try { await useApi().mutate(DELETE_SERVICE_FEATURE, { variables: { id: feat.id } }); features.value.splice(idx, 1) }
  catch (err: any) { await Swal.fire({ title: 'Failed', text: err.message, icon: 'error' }) }
}

const handleReorder = async () => {
  const ids = features.value.filter(f => f.id).map(f => f.id!)
  if (ids.length < 2) return
  try { await useApi().mutate(SORT_SERVICE_FEATURES, { variables: { serviceId: serviceId.value, orderedIds: ids } }) }
  catch { /* silent */ }
}

const reloadFeatures = async () => {
  try {
    const data = await useApi().query<any>(GET_SERVICE, { variables: { id: serviceId.value }, locale: locale.value, fetchPolicy: 'no-cache' })
    features.value = (data.service?.features || []).map((f: any) => ({ id: f.id, _key: f.id, title: f.title || '', description: f.description || '' }))
  } catch { /* ignore */ }
}

watch(locale, () => { reloadFeatures() })

// Save all section text
const saveAllText = async () => {
  saving.value = true
  try {
    const t = translations[locale.value]
    const input: Record<string, any> = {
      locale: locale.value,
      category: shared.category || null,
      icon: shared.icon || null,
      icon_color: shared.icon_color || null,
      slug: generateSlug(t.title || ''),
      is_active: shared.is_active,
    }
    ALL_KEYS.forEach(k => { if (t[k]) input[k] = t[k] })
    await servicesStore.updateService(serviceId.value, input, locale.value)
    await Swal.fire({ title: 'Saved', text: `All text saved (${locale.value.toUpperCase()})`, icon: 'success', timer: 1800, showConfirmButton: false })
  } catch (err: any) {
    await Swal.fire({ title: 'Failed', text: err.message, icon: 'error' })
  } finally { saving.value = false }
}

const handleDelete = async () => {
  const svc = servicesStore.currentService
  if (!svc) return
  if (await confirmAndDeleteService(svc)) router.push('/services')
}

onMounted(async () => {
  loading.value = true
  try {
    await Promise.all([
      servicesStore.fetchService(serviceId.value),
      categoriesStore.fetchCategories(),
    ])

    const svc = servicesStore.currentService
    if (svc) {
      breadcrumbStore.setBreadcrumb([
        { title: 'Dashboard', path: '/' },
        { title: 'Services', path: '/services' },
        { title: svc.title, path: `/services/${serviceId.value}/edit` },
      ])

      const api = useApi()
      const enData = await api.query<any>(GET_SERVICE, { variables: { id: serviceId.value }, locale: 'en', fetchPolicy: 'no-cache' })
      const frData = await api.query<any>(GET_SERVICE, { variables: { id: serviceId.value }, locale: 'fr', fetchPolicy: 'no-cache' })
      loadLocaleData('en', enData.service)
      loadLocaleData('fr', frData.service)
      features.value = (enData.service?.features || []).map((f: any) => ({ id: f.id, _key: f.id, title: f.title || '', description: f.description || '' }))
      serviceLoaded.value = true
    }
  } catch (err) {
    console.error('[ServicesEdit] Failed to fetch', err)
  } finally {
    loading.value = false
  }
})
</script>

<style>
.gn-editor__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.gn-editor__section-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.gn-editor__nav-pill {
  padding: 0.35rem 0.75rem;
  border: 1px solid var(--gn-border);
  border-radius: 8px;
  background: transparent;
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--gn-text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.gn-editor__nav-pill:hover {
  border-color: rgba(167, 139, 250, 0.4);
  color: var(--gn-purple);
}

.gn-editor__nav-pill--active {
  background: rgba(167, 139, 250, 0.1);
  border-color: rgba(167, 139, 250, 0.4);
  color: var(--gn-purple);
}

html[data-bs-theme='dark'] .gn-editor__nav-pill--active {
  background: rgba(167, 139, 250, 0.16);
  color: #c4b5fd;
}

.gn-form__icon-action .lucide {
  width: 14px;
  height: 14px;
}
</style>
