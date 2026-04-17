<template>
  <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
    <div class="d-flex flex-column flex-column-fluid">
      <div id="kt_app_content" class="app-content flex-column-fluid">
        <div id="kt_app_content_container" class="app-container container-fluid">
          <form class="gn-form" @submit.prevent="submit">
            <header class="gn-form__hero">
              <div class="gn-form__hero-icon"><GIcon name="folder-plus" :size="42" /></div>
              <div class="gn-form__hero-body">
                <span class="gn-form__eyebrow">New category</span>
                <h1 class="gn-form__title">{{ form.name || 'Untitled category' }}</h1>
                <p class="gn-form__subtitle">Group FAQs into a focused taxonomy.</p>
              </div>
              <div class="gn-form__hero-actions">
                <NuxtLink to="/faqs/categories" class="gn-form__btn gn-form__btn--ghost">Cancel</NuxtLink>
                <button type="submit" class="gn-form__btn gn-form__btn--primary" :disabled="submitting">
                  <GIcon name="check" :size="16" /> {{ submitting ? 'Saving…' : 'Create category' }}
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
                  <input v-model="form.name" type="text" class="gn-form__input" placeholder="e.g. Pricing" required maxlength="255" autofocus />
                  <span class="gn-form__helper">Shown in dropdowns and on the public site.</span>
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
import { reactive, ref, onMounted } from 'vue'
import { gql } from '@apollo/client/core'
import Swal from 'sweetalert2'
import { useFaqCategoriesStore } from '../stores/useFaqCategoriesStore'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import GIcon from '~/components/icons/GIcon.vue'
import LocaleToggle from '~/components/LocaleToggle.vue'

const CREATE_FAQ_CAT = gql`mutation($input: CreateFaqCategoryInput!) { createFaqCategory(input: $input) { id name slug } }`

definePageMeta({ middleware: 'auth' })
const router = useRouter()
const store = useFaqCategoriesStore()
const locale = ref<'en' | 'fr'>('en')
const form = reactive({ name: '' })
const submitting = ref(false)

const submit = async () => {
  if (!form.name.trim()) return
  submitting.value = true
  try {
    await useApi().mutate(CREATE_FAQ_CAT, {
      variables: { input: { name: form.name.trim() } },
      locale: locale.value,
    })
    await Swal.fire({ title: 'Created', text: `Category created (${locale.value.toUpperCase()})`, icon: 'success', timer: 1500, showConfirmButton: false })
    router.push('/faqs/categories')
  } catch (err: any) { await Swal.fire({ title: 'Failed', text: err.message, icon: 'error' }) }
  finally { submitting.value = false }
}

onMounted(() => {
  useBreadcrumbStore().setBreadcrumb([{ title: 'Dashboard', path: '/' }, { title: 'FAQs', path: '/faqs' }, { title: 'Categories', path: '/faqs/categories' }, { title: 'New', path: '/faqs/categories/create' }])
})
</script>
