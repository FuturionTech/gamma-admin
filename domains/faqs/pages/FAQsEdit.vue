<template>
  <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
    <div class="d-flex flex-column flex-column-fluid">
      <div id="kt_app_content" class="app-content flex-column-fluid">
        <div id="kt_app_content_container" class="app-container container-fluid">

          <!-- Skeleton -->
          <div v-if="loading" class="gn-form" style="pointer-events:none">
            <div class="gn-skeleton__hero">
              <div class="gn-skeleton__icon gn-skeleton__pulse" />
              <div style="flex:1;display:flex;flex-direction:column;gap:0.6rem">
                <div class="gn-skeleton__line gn-skeleton__pulse" style="width:70px;height:12px" />
                <div class="gn-skeleton__line gn-skeleton__pulse" style="width:300px;height:26px" />
                <div class="gn-skeleton__line gn-skeleton__pulse" style="width:200px;height:14px" />
              </div>
              <div style="display:flex;gap:0.5rem">
                <div class="gn-skeleton__btn gn-skeleton__pulse" />
                <div class="gn-skeleton__btn gn-skeleton__pulse" />
                <div class="gn-skeleton__btn gn-skeleton__pulse" style="width:100px" />
              </div>
            </div>
            <div class="gn-skeleton__card">
              <div style="display:flex;justify-content:space-between;margin-bottom:1.25rem">
                <div class="gn-skeleton__line gn-skeleton__pulse" style="width:90px;height:13px" />
                <div class="gn-skeleton__line gn-skeleton__pulse" style="width:160px;height:34px;border-radius:10px" />
              </div>
              <div v-for="i in 3" :key="i" style="display:flex;flex-direction:column;gap:0.4rem;margin-bottom:1.1rem">
                <div class="gn-skeleton__line gn-skeleton__pulse" style="width:70px;height:11px" />
                <div class="gn-skeleton__line gn-skeleton__pulse" :style="{ height: i === 2 ? '100px' : '42px', borderRadius: '12px' }" />
              </div>
            </div>
          </div>

          <!-- Content -->
          <form v-else-if="faq" class="gn-form" @submit.prevent="save">
            <header class="gn-form__hero">
              <div class="gn-form__hero-icon">
                <GIcon name="help-circle" :size="42" />
              </div>
              <div class="gn-form__hero-body">
                <span class="gn-form__eyebrow">Edit FAQ</span>
                <h1 class="gn-form__title">{{ currentForm.question || 'Untitled question' }}</h1>
                <p class="gn-form__subtitle">{{ faq.category || 'General' }} category</p>
              </div>
              <div class="gn-form__hero-actions">
                <button type="button" class="gn-form__btn gn-form__btn--danger-ghost" @click="handleDelete" :disabled="saving">
                  <GIcon name="trash-2" :size="16" /> Delete
                </button>
                <NuxtLink to="/faqs" class="gn-form__btn gn-form__btn--ghost">Cancel</NuxtLink>
                <button type="submit" class="gn-form__btn gn-form__btn--primary" :disabled="saving">
                  <GIcon name="check" :size="16" />
                  {{ saving ? 'Saving…' : 'Save changes' }}
                </button>
              </div>
            </header>

            <section class="gn-form__card">
              <div class="gn-form__card-header">
                <h3 class="gn-form__card-title">Question & Answer</h3>
                <LocaleToggle v-model="locale" />
              </div>

              <div class="gn-form__fields">
                <div class="gn-form__field">
                  <label class="gn-form__label">
                    Question <span class="gn-form__locale-badge">{{ locale.toUpperCase() }}</span>
                  </label>
                  <textarea v-model="currentForm.question" class="gn-form__textarea" rows="2" placeholder="Enter the frequently asked question" maxlength="300" />
                  <span class="gn-form__helper">{{ (currentForm.question || '').length }} / 300</span>
                </div>

                <div class="gn-form__field">
                  <label class="gn-form__label">
                    Answer <span class="gn-form__locale-badge">{{ locale.toUpperCase() }}</span>
                  </label>
                  <textarea v-model="currentForm.answer" class="gn-form__textarea" rows="6" placeholder="Enter the answer" maxlength="2000" />
                  <span class="gn-form__helper">{{ (currentForm.answer || '').length }} / 2000</span>
                </div>

                <div class="gn-form__row">
                  <div class="gn-form__field">
                    <label class="gn-form__label">Category</label>
                    <select v-model="faqCategoryId" class="gn-form__select">
                      <option value="">Select a category</option>
                      <option v-for="c in FAQ_CATEGORIES" :key="c.id" :value="c.id">{{ c.name }}</option>
                    </select>
                  </div>

                  <div class="gn-form__field">
                    <label class="gn-form__label">Status</label>
                    <label style="display:flex;align-items:center;gap:0.75rem;cursor:pointer;padding:0.65rem 0">
                      <input v-model="isActive" type="checkbox" style="width:18px;height:18px;accent-color:#7c3aed" />
                      <span style="font-size:0.9rem;font-weight:500">{{ isActive ? 'Active — visible on site' : 'Inactive — hidden' }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </section>
          </form>

          <div v-else class="gn-form__empty">
            <h3>FAQ not found</h3>
            <NuxtLink to="/faqs" class="gn-form__btn gn-form__btn--primary">Back to FAQs</NuxtLink>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import Swal from 'sweetalert2'
import { useFAQsStore } from '../stores/useFAQsStore'
import { useFAQActions } from '../composables/useFAQActions'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import { useFaqCategoriesStore } from '../stores/useFaqCategoriesStore'
import { GET_FAQ } from '../graphql/queries'
import { UPDATE_FAQ } from '../graphql/mutations'
import GIcon from '~/components/icons/GIcon.vue'
import LocaleToggle from '~/components/LocaleToggle.vue'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const router = useRouter()
const faqsStore = useFAQsStore()
const breadcrumbStore = useBreadcrumbStore()
const { confirmAndDeleteFAQ } = useFAQActions()
const faqCategoriesStore = useFaqCategoriesStore()
const FAQ_CATEGORIES = computed(() => faqCategoriesStore.sortedCategories)

const faqId = computed(() => route.params.id as string)
const faq = computed(() => faqsStore.currentFAQ)
const locale = ref<'en' | 'fr'>('en')
const saving = ref(false)
const loading = ref(true)

const formEN = reactive({ question: '', answer: '' })
const formFR = reactive({ question: '', answer: '' })
const faqCategoryId = ref('')
const isActive = ref(true)

const currentForm = computed(() => locale.value === 'fr' ? formFR : formEN)

const save = async () => {
  const t = currentForm.value
  if (!t.question?.trim() || !t.answer?.trim()) return
  saving.value = true
  try {
    await useApi().mutate(UPDATE_FAQ, {
      variables: {
        id: faqId.value,
        input: {
          question: t.question.trim(),
          answer: t.answer.trim(),
          faq_category_id: faqCategoryId.value || null,
          is_active: isActive.value,
        },
      },
      locale: locale.value,
    })
    await Swal.fire({ title: 'Saved', text: `FAQ saved (${locale.value.toUpperCase()})`, icon: 'success', timer: 1800, showConfirmButton: false })
  } catch (err: any) {
    await Swal.fire({ title: 'Failed', text: err.message, icon: 'error' })
  } finally { saving.value = false }
}

const handleDelete = async () => {
  if (!faq.value) return
  if (await confirmAndDeleteFAQ(faq.value)) router.push('/faqs')
}

watch(faq, (v) => {
  if (!v) return
  breadcrumbStore.setBreadcrumb([
    { title: 'Dashboard', path: '/' },
    { title: 'FAQs', path: '/faqs' },
    { title: v.question?.substring(0, 40) || 'Edit FAQ', path: `/faqs/${faqId.value}/edit` },
  ])
}, { immediate: true })

onMounted(async () => {
  loading.value = true
  try {
    await Promise.all([
      faqsStore.fetchFAQ(faqId.value),
      faqCategoriesStore.fetchCategories(),
    ])

    if (faq.value) {
      // Load EN
      const enData = await useApi().query<any>(GET_FAQ, { locale: 'en', fetchPolicy: 'no-cache' })
      const enFaq = (enData.faqs || []).find((f: any) => f.id === faqId.value)
      if (enFaq) {
        formEN.question = enFaq.question || ''
        formEN.answer = enFaq.answer || ''
        faqCategoryId.value = enFaq.faq_category_id || ''
        isActive.value = enFaq.is_active ?? true
      }

      // Load FR
      const frData = await useApi().query<any>(GET_FAQ, { locale: 'fr', fetchPolicy: 'no-cache' })
      const frFaq = (frData.faqs || []).find((f: any) => f.id === faqId.value)
      if (frFaq) {
        formFR.question = frFaq.question || ''
        formFR.answer = frFaq.answer || ''
      }
    }
  } catch (err) {
    console.error('[FAQsEdit] Failed to fetch', err)
  } finally { loading.value = false }
})
</script>
