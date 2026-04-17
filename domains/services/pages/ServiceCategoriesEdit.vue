<template>
  <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
    <div class="d-flex flex-column flex-column-fluid">
      <div id="kt_app_content" class="app-content flex-column-fluid">
        <div id="kt_app_content_container" class="app-container container-fluid">

          <div v-if="store.isLoading && !category" class="gn-form__shimmer" />

          <form v-else-if="category" class="gn-form" @submit.prevent="submit">
            <header class="gn-form__hero">
              <div class="gn-form__hero-icon">
                <GIcon name="folder" :size="42" />
              </div>
              <div class="gn-form__hero-body">
                <span class="gn-form__eyebrow">Edit category</span>
                <h1 class="gn-form__title">{{ form.name || category.name }}</h1>
              </div>
              <div class="gn-form__hero-actions">
                <button type="button" class="gn-form__btn gn-form__btn--danger-ghost" @click="handleDelete" :disabled="isSubmitting">
                  <GIcon name="trash-2" :size="16" />
                  Delete
                </button>
                <NuxtLink to="/services/categories" class="gn-form__btn gn-form__btn--ghost">Cancel</NuxtLink>
                <button type="submit" class="gn-form__btn gn-form__btn--primary" :disabled="isSubmitting || !hasChanges">
                  <GIcon name="check" :size="16" />
                  {{ isSubmitting ? 'Saving…' : 'Save changes' }}
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
                    required
                    maxlength="255"
                  />
                </div>
              </div>
            </section>
          </form>

          <div v-else class="gn-form__empty">
            <h3>Category not found</h3>
            <NuxtLink to="/services/categories" class="gn-form__btn gn-form__btn--primary">Back to categories</NuxtLink>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, onMounted, watch } from 'vue'
import Swal from 'sweetalert2'
import { useServiceCategoriesStore } from '../stores/useServiceCategoriesStore'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import GIcon from '~/components/icons/GIcon.vue'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const router = useRouter()
const store = useServiceCategoriesStore()
const breadcrumbStore = useBreadcrumbStore()

const categoryId = computed(() => route.params.id as string)
const category = computed(() => store.currentCategory)

const form = reactive({ name: '' })
const isSubmitting = ref(false)
const hasChanges = computed(() => category.value != null && form.name.trim() !== category.value.name && form.name.trim().length > 0)

watch(category, (v) => {
  if (!v) return
  form.name = v.name
  breadcrumbStore.setBreadcrumb([
    { title: 'Dashboard', path: '/' },
    { title: 'Services', path: '/services' },
    { title: 'Categories', path: '/services/categories' },
    { title: v.name, path: `/services/categories/${v.id}/edit` },
  ])
}, { immediate: true })

const submit = async () => {
  if (!hasChanges.value || !category.value) return
  isSubmitting.value = true
  try {
    await store.updateCategory(category.value.id, { name: form.name.trim() })
    await Swal.fire({ title: 'Saved', icon: 'success', timer: 1800, showConfirmButton: false })
    router.push('/services/categories')
  } catch (err: any) {
    await Swal.fire({ title: 'Failed', text: err.message, icon: 'error' })
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = async () => {
  if (!category.value) return
  const result = await Swal.fire({
    title: 'Delete?',
    html: `Delete "<strong>${category.value.name}</strong>"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    confirmButtonText: 'Yes, delete',
  })
  if (!result.isConfirmed) return
  try {
    await store.deleteCategory(category.value.id)
    await Swal.fire({ title: 'Deleted', icon: 'success', timer: 1800, showConfirmButton: false })
    router.push('/services/categories')
  } catch (err: any) {
    await Swal.fire({ title: 'Failed', text: err.message, icon: 'error' })
  }
}

onMounted(async () => {
  try {
    await store.fetchCategory(categoryId.value)
  } catch (err) {
    console.error('[ServiceCategoriesEdit] fetch failed', err)
  }
})
</script>
