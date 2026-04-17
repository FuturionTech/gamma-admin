<template>
  <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
    <div class="d-flex flex-column flex-column-fluid">
      <div id="kt_app_content" class="app-content flex-column-fluid">
        <div id="kt_app_content_container" class="app-container container-fluid">
          <div v-if="store.isLoading && !category" class="gn-form__shimmer" />
          <form v-else-if="category" class="gn-form" @submit.prevent="submit">
            <header class="gn-form__hero">
              <div class="gn-form__hero-icon"><GIcon name="folder" :size="42" /></div>
              <div class="gn-form__hero-body">
                <span class="gn-form__eyebrow">Edit category</span>
                <h1 class="gn-form__title">{{ localeName || category?.name || 'Untitled' }}</h1>
              </div>
              <div class="gn-form__hero-actions">
                <button type="button" class="gn-form__btn gn-form__btn--danger-ghost" @click="handleDelete" :disabled="submitting"><GIcon name="trash-2" :size="16" /> Delete</button>
                <NuxtLink to="/faqs/categories" class="gn-form__btn gn-form__btn--ghost">Cancel</NuxtLink>
                <button type="submit" class="gn-form__btn gn-form__btn--primary" :disabled="submitting || !hasChanges">
                  <GIcon name="check" :size="16" /> {{ submitting ? 'Saving…' : 'Save changes' }}
                </button>
              </div>
            </header>
            <section class="gn-form__card">
              <div class="gn-form__card-header">
                <h3 class="gn-form__card-title">Details</h3>
                <LocaleToggle v-model="locale" />
              </div>
              <div class="gn-form__fields">
                <div class="gn-form__field">
                  <label class="gn-form__label">Name <span class="gn-form__locale-badge">{{ locale.toUpperCase() }}</span></label>
                  <input v-model="localeName" type="text" class="gn-form__input" required maxlength="255" />
                </div>
              </div>
            </section>
          </form>
          <div v-else class="gn-form__empty">
            <h3>Category not found</h3>
            <NuxtLink to="/faqs/categories" class="gn-form__btn gn-form__btn--primary">Back to categories</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, onMounted, watch } from 'vue'
import { gql } from '@apollo/client/core'
import Swal from 'sweetalert2'
import { useFaqCategoriesStore } from '../stores/useFaqCategoriesStore'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import GIcon from '~/components/icons/GIcon.vue'
import LocaleToggle from '~/components/LocaleToggle.vue'

const GET_FAQ_CATS = gql`query { faqCategories { id name slug } }`
const UPDATE_FAQ_CAT = gql`mutation($id: ID!, $input: UpdateFaqCategoryInput!) { updateFaqCategory(id: $id, input: $input) { id name slug } }`

definePageMeta({ middleware: 'auth' })
const route = useRoute()
const router = useRouter()
const store = useFaqCategoriesStore()
const categoryId = computed(() => route.params.id as string)
const category = computed(() => store.currentCategory)
const locale = ref<'en' | 'fr'>('en')
const nameEN = ref('')
const nameFR = ref('')
const localeName = computed({
  get: () => locale.value === 'fr' ? nameFR.value : nameEN.value,
  set: (v: string) => { if (locale.value === 'fr') nameFR.value = v; else nameEN.value = v },
})
const submitting = ref(false)
const hasChanges = computed(() => localeName.value.trim().length > 0)

watch(category, (v) => {
  if (!v) return
  useBreadcrumbStore().setBreadcrumb([{ title: 'Dashboard', path: '/' }, { title: 'FAQs', path: '/faqs' }, { title: 'Categories', path: '/faqs/categories' }, { title: v.name, path: `/faqs/categories/${v.id}/edit` }])
}, { immediate: true })

const submit = async () => {
  if (!localeName.value.trim() || !category.value) return
  submitting.value = true
  try {
    await useApi().mutate(UPDATE_FAQ_CAT, {
      variables: { id: category.value.id, input: { name: localeName.value.trim() } },
      locale: locale.value,
    })
    await Swal.fire({ title: 'Saved', text: `Category saved (${locale.value.toUpperCase()})`, icon: 'success', timer: 1500, showConfirmButton: false })
    router.push('/faqs/categories')
  } catch (err: any) { await Swal.fire({ title: 'Failed', text: err.message, icon: 'error' }) }
  finally { submitting.value = false }
}

const handleDelete = async () => {
  if (!category.value) return
  const r = await Swal.fire({ title: 'Delete?', html: `Delete "<strong>${category.value.name}</strong>"?`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#dc2626', confirmButtonText: 'Delete' })
  if (!r.isConfirmed) return
  try { await store.deleteCategory(category.value.id); router.push('/faqs/categories') }
  catch (err: any) { await Swal.fire({ title: 'Failed', text: err.message, icon: 'error' }) }
}

onMounted(async () => {
  await store.fetchCategory(categoryId.value)
  const api = useApi()
  const enData = await api.query<any>(GET_FAQ_CATS, { locale: 'en', fetchPolicy: 'no-cache' })
  const frData = await api.query<any>(GET_FAQ_CATS, { locale: 'fr', fetchPolicy: 'no-cache' })
  const enCat = (enData.faqCategories || []).find((c: any) => c.id === categoryId.value)
  const frCat = (frData.faqCategories || []).find((c: any) => c.id === categoryId.value)
  nameEN.value = enCat?.name || ''
  nameFR.value = frCat?.name || ''
})
</script>
