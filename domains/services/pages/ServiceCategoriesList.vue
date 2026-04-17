<template>
  <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
    <div class="d-flex flex-column flex-column-fluid">
      <div id="kt_app_content" class="app-content flex-column-fluid">
        <div id="kt_app_content_container" class="app-container container-fluid">

          <div class="gn-categories">
            <header class="gn-categories__hero">
              <div class="gn-categories__hero-icon">
                <GIcon name="folder-tree" :size="42" />
              </div>
              <div class="gn-categories__hero-body">
                <span class="gn-categories__eyebrow">Service taxonomy</span>
                <h1 class="gn-categories__title">Categories</h1>
                <p class="gn-categories__subtitle">
                  Organize services into categories that power filters and navigation on the public site.
                </p>
              </div>
              <div class="gn-categories__hero-actions">
                <NuxtLink to="/services" class="gn-categories__btn gn-categories__btn--ghost">
                  <GIcon name="arrow-left" :size="16" />
                  Services
                </NuxtLink>
                <NuxtLink to="/services/categories/create" class="gn-categories__btn gn-categories__btn--primary">
                  <GIcon name="plus" :size="16" />
                  New category
                </NuxtLink>
              </div>
            </header>

            <div v-if="store.isLoading && categories.length === 0" class="gn-categories__shimmer" />

            <div v-else-if="!store.isLoading && categories.length === 0" class="gn-form__empty">
              <GIcon name="folder-plus" :size="42" />
              <h3>No categories yet</h3>
              <p>Create your first category to start grouping services.</p>
              <NuxtLink to="/services/categories/create" class="gn-categories__btn gn-categories__btn--primary">
                <GIcon name="plus" :size="16" />
                Create first category
              </NuxtLink>
            </div>

            <section v-else class="gn-form__card">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.25rem">
                <div>
                  <h3 class="gn-form__card-title" style="margin-bottom:0.2rem">All categories</h3>
                  <p style="margin:0;font-size:0.82rem;color:var(--gn-text-muted)">
                    {{ categories.length }} {{ categories.length === 1 ? 'category' : 'categories' }}
                  </p>
                </div>
              </div>

              <table class="table align-middle table-row-dashed fs-6 gy-5" style="width:100%">
                <thead>
                  <tr class="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                    <th>Name</th>
                    <th>Slug</th>
                    <th>Updated</th>
                    <th class="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody class="fw-semibold text-gray-600">
                  <tr v-for="cat in sortedCategories" :key="cat.id">
                    <td>
                      <NuxtLink
                        :to="`/services/categories/${cat.id}/edit`"
                        class="text-gray-800 fw-bold text-hover-primary d-block"
                      >
                        {{ cat.name }}
                      </NuxtLink>
                    </td>
                    <td><code class="text-gray-600">{{ cat.slug }}</code></td>
                    <td class="text-gray-500">{{ formatDate(cat.updated_at) }}</td>
                    <td class="text-end">
                      <NuxtLink
                        :to="`/services/categories/${cat.id}/edit`"
                        class="btn btn-sm btn-icon btn-light btn-active-light-primary me-2"
                        title="Edit"
                      >
                        <GIcon name="edit" :size="15" />
                      </NuxtLink>
                      <button
                        type="button"
                        class="btn btn-sm btn-icon btn-light btn-active-light-danger"
                        title="Delete"
                        @click="handleDelete(cat)"
                      >
                        <GIcon name="trash-2" :size="15" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import Swal from 'sweetalert2'
import { useServiceCategoriesStore, type ServiceCategory } from '../stores/useServiceCategoriesStore'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import GIcon from '~/components/icons/GIcon.vue'

definePageMeta({ middleware: 'auth' })

const store = useServiceCategoriesStore()
const breadcrumbStore = useBreadcrumbStore()

const categories = computed(() => store.categories)
const sortedCategories = computed(() => store.sortedCategories)
const formatDate = (iso: string) => dayjs(iso).format('MMM D, YYYY')

const handleDelete = async (cat: ServiceCategory) => {
  const result = await Swal.fire({
    title: 'Delete category?',
    html: `Delete "<strong>${cat.name}</strong>"? This cannot be undone.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    confirmButtonText: 'Yes, delete',
  })
  if (!result.isConfirmed) return
  try {
    await store.deleteCategory(cat.id)
    await Swal.fire({ title: 'Deleted', icon: 'success', timer: 1800, showConfirmButton: false })
  } catch (err: any) {
    await Swal.fire({ title: 'Failed', text: err.message, icon: 'error' })
  }
}

onMounted(async () => {
  breadcrumbStore.setBreadcrumb([
    { title: 'Dashboard', path: '/' },
    { title: 'Services', path: '/services' },
    { title: 'Categories', path: '/services/categories' },
  ])
  await store.fetchCategories()
})
</script>
