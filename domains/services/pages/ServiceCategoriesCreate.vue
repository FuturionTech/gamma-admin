<template>
  <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
    <div class="d-flex flex-column flex-column-fluid">
      <div id="kt_app_content" class="app-content flex-column-fluid">
        <div id="kt_app_content_container" class="app-container container-fluid">

          <form class="gn-form" @submit.prevent="submit">
            <header class="gn-form__hero">
              <div class="gn-form__hero-icon">
                <GIcon name="folder-plus" :size="42" />
              </div>
              <div class="gn-form__hero-body">
                <span class="gn-form__eyebrow">New category</span>
                <h1 class="gn-form__title">{{ form.name || 'Untitled category' }}</h1>
                <p class="gn-form__subtitle">Group services into a focused taxonomy.</p>
              </div>
              <div class="gn-form__hero-actions">
                <NuxtLink to="/services/categories" class="gn-form__btn gn-form__btn--ghost">Cancel</NuxtLink>
                <button type="submit" class="gn-form__btn gn-form__btn--primary" :disabled="isSubmitting">
                  <GIcon name="check" :size="16" />
                  {{ isSubmitting ? 'Saving…' : 'Create category' }}
                </button>
              </div>
            </header>

            <section class="gn-form__card">
              <h3 class="gn-form__card-title">Details</h3>
              <div class="gn-form__fields">
                <div class="gn-form__field">
                  <label class="gn-form__label" for="cat-name">Name</label>
                  <input
                    id="cat-name"
                    v-model="form.name"
                    type="text"
                    class="gn-form__input"
                    placeholder="e.g. AI & Machine Learning"
                    required
                    maxlength="255"
                    autofocus
                  />
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
import Swal from 'sweetalert2'
import { useServiceCategoriesStore } from '../stores/useServiceCategoriesStore'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import GIcon from '~/components/icons/GIcon.vue'

definePageMeta({ middleware: 'auth' })

const router = useRouter()
const store = useServiceCategoriesStore()
const breadcrumbStore = useBreadcrumbStore()

const form = reactive({ name: '' })
const isSubmitting = ref(false)

const submit = async () => {
  if (!form.name.trim()) return
  isSubmitting.value = true
  try {
    await store.createCategory({ name: form.name.trim() })
    await Swal.fire({ title: 'Created', text: 'Category created', icon: 'success', timer: 1800, showConfirmButton: false })
    router.push('/services/categories')
  } catch (err: any) {
    await Swal.fire({ title: 'Failed', text: err.message, icon: 'error' })
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  breadcrumbStore.setBreadcrumb([
    { title: 'Dashboard', path: '/' },
    { title: 'Services', path: '/services' },
    { title: 'Categories', path: '/services/categories' },
    { title: 'New category', path: '/services/categories/create' },
  ])
})
</script>
