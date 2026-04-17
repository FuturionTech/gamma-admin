<template>
  <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
    <div class="d-flex flex-column flex-column-fluid">
      <div id="kt_app_content" class="app-content flex-column-fluid">
        <div id="kt_app_content_container" class="app-container container-fluid">

          <div class="gn-categories">
            <!-- Hero -->
            <header class="gn-categories__hero">
              <div class="gn-categories__hero-icon">
                <GIcon name="folder-tree" :size="42" />
              </div>
              <div class="gn-categories__hero-body">
                <span class="gn-categories__eyebrow">Certification taxonomy</span>
                <h1 class="gn-categories__title">Categories</h1>
                <p class="gn-categories__subtitle">
                  Organize certifications into meaningful groups that power filters on the public site.
                </p>
              </div>
              <div class="gn-categories__hero-actions">
                <NuxtLink to="/certifications" class="gn-categories__btn gn-categories__btn--ghost">
                  <GIcon name="arrow-left" :size="16" />
                  Certifications
                </NuxtLink>
                <NuxtLink to="/certifications/categories/create" class="gn-categories__btn gn-categories__btn--primary">
                  <GIcon name="plus" :size="16" />
                  New category
                </NuxtLink>
              </div>
            </header>

            <!-- Loading -->
            <div v-if="categoriesStore.isLoading && categories.length === 0" class="gn-categories__shimmer" />

            <!-- Empty -->
            <div
              v-else-if="!categoriesStore.isLoading && categories.length === 0"
              class="gn-categories__empty"
            >
              <div class="gn-categories__empty-icon">
                <GIcon name="folder-plus" :size="42" />
              </div>
              <h3>No categories yet</h3>
              <p>Create your first category to start grouping certifications.</p>
              <NuxtLink to="/certifications/categories/create" class="gn-categories__btn gn-categories__btn--primary">
                <GIcon name="plus" :size="16" />
                Create first category
              </NuxtLink>
            </div>

            <!-- Table -->
            <section v-else class="gn-categories__card">
              <div class="gn-categories__card-header">
                <div>
                  <h3 class="gn-categories__card-title">All categories</h3>
                  <p class="gn-categories__card-hint">
                    {{ categories.length }} {{ categories.length === 1 ? 'category' : 'categories' }}
                  </p>
                </div>
              </div>

              <div class="gn-categories__table">
                <div class="gn-categories__thead">
                  <div class="gn-categories__th gn-categories__th--name">Name</div>
                  <div class="gn-categories__th gn-categories__th--count">Usage</div>
                  <div class="gn-categories__th gn-categories__th--date">Updated</div>
                  <div class="gn-categories__th gn-categories__th--actions">Actions</div>
                </div>

                <div
                  v-for="category in sortedCategories"
                  :key="category.id"
                  class="gn-categories__tr"
                >
                  <div class="gn-categories__td gn-categories__td--name">
                    <div class="gn-categories__tile">
                      <GIcon name="folder" :size="18" />
                    </div>
                    <NuxtLink
                      :to="`/certifications/categories/${category.id}/edit`"
                      class="gn-categories__name"
                    >
                      {{ category.name }}
                    </NuxtLink>
                  </div>
                  <div class="gn-categories__td gn-categories__td--count">
                    <span class="gn-categories__count-chip">
                      <GIcon name="certificate" :size="13" />
                      {{ category.certifications_count ?? 0 }}
                    </span>
                  </div>
                  <div class="gn-categories__td gn-categories__td--date">
                    {{ formatDate(category.updated_at) }}
                  </div>
                  <div class="gn-categories__td gn-categories__td--actions">
                    <NuxtLink
                      :to="`/certifications/categories/${category.id}/edit`"
                      class="gn-categories__icon-btn"
                      title="Edit"
                    >
                      <GIcon name="edit" :size="15" />
                    </NuxtLink>
                    <button
                      type="button"
                      class="gn-categories__icon-btn gn-categories__icon-btn--danger"
                      title="Delete"
                      @click="handleDelete(category)"
                    >
                      <GIcon name="trash-2" :size="15" />
                    </button>
                  </div>
                </div>
              </div>
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
import { useCertificationCategoriesStore } from '../stores/useCertificationCategoriesStore'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import GIcon from '~/components/icons/GIcon.vue'
import type { CertificationCategory } from '../types'

definePageMeta({ middleware: 'auth' })

const categoriesStore = useCertificationCategoriesStore()
const breadcrumbStore = useBreadcrumbStore()

const categories = computed(() => categoriesStore.categories)

const sortedCategories = computed(() =>
  [...categories.value].sort((a, b) => a.name.localeCompare(b.name))
)

const formatDate = (iso: string) => dayjs(iso).format('MMM D, YYYY')

const handleDelete = async (category: CertificationCategory) => {
  const used = category.certifications_count ?? 0
  if (used > 0) {
    await Swal.fire({
      title: 'Cannot delete',
      html: `"${category.name}" is still used by <strong>${used}</strong> certification${used === 1 ? '' : 's'}. Reassign them first.`,
      icon: 'warning',
    })
    return
  }

  const result = await Swal.fire({
    title: 'Delete category?',
    html: `Delete "<strong>${category.name}</strong>"? This cannot be undone.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    confirmButtonText: 'Yes, delete',
    cancelButtonText: 'Cancel',
  })

  if (!result.isConfirmed) return

  try {
    await categoriesStore.deleteCategory(category.id)
    await Swal.fire({
      title: 'Deleted',
      text: 'Category deleted successfully',
      icon: 'success',
      timer: 1800,
      showConfirmButton: false,
    })
  } catch (err: any) {
    await Swal.fire({
      title: 'Failed to delete',
      text: err.message || 'Something went wrong',
      icon: 'error',
    })
  }
}

onMounted(async () => {
  breadcrumbStore.setBreadcrumb([
    { title: 'Dashboard', path: '/' },
    { title: 'Certifications', path: '/certifications' },
    { title: 'Categories', path: '/certifications/categories' },
  ])
  await categoriesStore.fetchCategories()
})
</script>

<style scoped>
.gn-categories {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: #0f172a;
}

.gn-categories__shimmer {
  height: 260px;
  border-radius: 18px;
  background: linear-gradient(
    90deg,
    rgba(15, 23, 42, 0.04) 0%,
    rgba(15, 23, 42, 0.08) 50%,
    rgba(15, 23, 42, 0.04) 100%
  );
  background-size: 200% 100%;
  animation: gn-shimmer 1.6s ease-in-out infinite;
}

@keyframes gn-shimmer {
  to { background-position: -200% 0; }
}

/* Hero */
.gn-categories__hero {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem 2.25rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fc 100%);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 22px;
  box-shadow: 0 24px 56px -36px rgba(15, 23, 42, 0.18);
}

.gn-categories__hero-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 84px;
  height: 84px;
  border-radius: 22px;
  background: linear-gradient(135deg, rgba(167, 139, 250, 0.18) 0%, rgba(124, 58, 237, 0.26) 100%);
  border: 1px solid rgba(167, 139, 250, 0.4);
  color: #6d28d9;
  flex-shrink: 0;
  box-shadow: 0 14px 32px -16px rgba(124, 58, 237, 0.55);
}

.gn-categories__hero-body {
  flex: 1;
  min-width: 0;
}

.gn-categories__eyebrow {
  display: block;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #a78bfa;
  margin-bottom: 0.35rem;
}

.gn-categories__title {
  margin: 0 0 0.5rem;
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  font-size: clamp(1.75rem, 2.4vw, 2.25rem);
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.12;
  color: #0f172a;
}

.gn-categories__subtitle {
  margin: 0;
  font-size: 1rem;
  color: rgba(15, 23, 42, 0.68);
  line-height: 1.5;
  max-width: 560px;
}

.gn-categories__hero-actions {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-shrink: 0;
}

/* Buttons */
.gn-categories__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  border: 0;
  font-family: inherit;
  font-size: 0.88rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition:
    transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    box-shadow 0.25s ease,
    filter 0.25s ease,
    background 0.25s ease,
    border-color 0.25s ease,
    color 0.25s ease;
}

.gn-categories__btn--primary {
  background: linear-gradient(135deg, #a78bfa 0%, #7c3aed 55%, #6d28d9 100%);
  color: #ffffff;
  box-shadow: 0 16px 32px -14px rgba(124, 58, 237, 0.6);
}

.gn-categories__btn--primary:hover {
  transform: translateY(-1px);
  filter: brightness(1.05);
  box-shadow: 0 22px 44px -16px rgba(124, 58, 237, 0.7);
}

.gn-categories__btn--ghost {
  background: rgba(15, 23, 42, 0.05);
  color: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(15, 23, 42, 0.08);
}

.gn-categories__btn--ghost:hover {
  background: rgba(15, 23, 42, 0.08);
  color: #0f172a;
}

/* Card */
.gn-categories__card {
  padding: 1.75rem;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.07);
  border-radius: 18px;
  box-shadow: 0 18px 40px -32px rgba(15, 23, 42, 0.14);
}

.gn-categories__card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.gn-categories__card-title {
  margin: 0 0 0.2rem;
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: #a78bfa;
}

.gn-categories__card-hint {
  margin: 0;
  font-size: 0.82rem;
  color: rgba(15, 23, 42, 0.5);
}

/* Table */
.gn-categories__table {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.gn-categories__thead,
.gn-categories__tr {
  display: grid;
  grid-template-columns: minmax(0, 2.5fr) 120px 160px 120px;
  gap: 1rem;
  align-items: center;
  padding: 0.9rem 1rem;
}

.gn-categories__thead {
  border-bottom: 1px dashed rgba(15, 23, 42, 0.1);
  padding-bottom: 0.65rem;
  margin-bottom: 0.15rem;
}

.gn-categories__th {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(15, 23, 42, 0.5);
}

.gn-categories__th--count,
.gn-categories__th--date {
  text-align: left;
}

.gn-categories__th--actions {
  text-align: right;
}

.gn-categories__tr {
  border-radius: 12px;
  transition: background 0.2s ease;
}

.gn-categories__tr:hover {
  background: rgba(167, 139, 250, 0.05);
}

.gn-categories__td {
  min-width: 0;
}

.gn-categories__td--name {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  min-width: 0;
}

.gn-categories__tile {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(167, 139, 250, 0.14) 0%, rgba(124, 58, 237, 0.2) 100%);
  border: 1px solid rgba(167, 139, 250, 0.28);
  color: #6d28d9;
  flex-shrink: 0;
}

.gn-categories__name {
  font-size: 0.95rem;
  font-weight: 600;
  color: #0f172a;
  text-decoration: none;
  transition: color 0.2s ease;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gn-categories__name:hover {
  color: #7c3aed;
}

.gn-categories__count-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.75rem;
  background: rgba(15, 23, 42, 0.05);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 999px;
  font-size: 0.76rem;
  font-weight: 600;
  color: rgba(15, 23, 42, 0.65);
}

.gn-categories__count-chip :deep(svg) {
  width: 13px;
  height: 13px;
}

.gn-categories__td--date {
  font-size: 0.83rem;
  color: rgba(15, 23, 42, 0.6);
}

.gn-categories__td--actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.4rem;
}

.gn-categories__icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: 1px solid rgba(15, 23, 42, 0.1);
  background: rgba(15, 23, 42, 0.03);
  border-radius: 10px;
  color: rgba(15, 23, 42, 0.6);
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s ease;
}

.gn-categories__icon-btn:hover {
  background: rgba(167, 139, 250, 0.12);
  border-color: rgba(167, 139, 250, 0.3);
  color: #7c3aed;
}

.gn-categories__icon-btn--danger:hover {
  background: rgba(220, 38, 38, 0.08);
  border-color: rgba(220, 38, 38, 0.25);
  color: #b91c1c;
}

/* Empty state */
.gn-categories__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 3rem 2rem;
  text-align: center;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.07);
  border-radius: 18px;
  box-shadow: 0 18px 40px -32px rgba(15, 23, 42, 0.14);
}

.gn-categories__empty-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border-radius: 20px;
  background: rgba(167, 139, 250, 0.12);
  color: #7c3aed;
  margin-bottom: 0.5rem;
}

.gn-categories__empty h3 {
  margin: 0 0 0.25rem;
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}

.gn-categories__empty p {
  margin: 0 0 1.25rem;
  color: rgba(15, 23, 42, 0.55);
  max-width: 420px;
}

@media (max-width: 900px) {
  .gn-categories__thead,
  .gn-categories__tr {
    grid-template-columns: minmax(0, 1.8fr) 90px 110px;
  }
  .gn-categories__th--date,
  .gn-categories__td--date {
    display: none;
  }
}
</style>

<style>
/* Dark theme */
html[data-bs-theme='dark'] .gn-categories {
  color: #f5f5f7;
}

html[data-bs-theme='dark'] .gn-categories__hero {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 28px 56px -32px rgba(0, 0, 0, 0.55);
}

html[data-bs-theme='dark'] .gn-categories__hero-icon {
  background: linear-gradient(135deg, rgba(167, 139, 250, 0.22) 0%, rgba(124, 58, 237, 0.32) 100%);
  border-color: rgba(167, 139, 250, 0.45);
  color: #c4b5fd;
}

html[data-bs-theme='dark'] .gn-categories__title {
  color: #f5f5f7;
}

html[data-bs-theme='dark'] .gn-categories__subtitle {
  color: rgba(245, 245, 247, 0.7);
}

html[data-bs-theme='dark'] .gn-categories__btn--ghost {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.1);
  color: rgba(245, 245, 247, 0.72);
}

html[data-bs-theme='dark'] .gn-categories__btn--ghost:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #f5f5f7;
}

html[data-bs-theme='dark'] .gn-categories__card,
html[data-bs-theme='dark'] .gn-categories__empty {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 24px 48px -28px rgba(0, 0, 0, 0.5);
}

html[data-bs-theme='dark'] .gn-categories__empty h3 {
  color: #f5f5f7;
}

html[data-bs-theme='dark'] .gn-categories__empty p {
  color: rgba(245, 245, 247, 0.55);
}

html[data-bs-theme='dark'] .gn-categories__thead {
  border-bottom-color: rgba(255, 255, 255, 0.08);
}

html[data-bs-theme='dark'] .gn-categories__th {
  color: rgba(245, 245, 247, 0.5);
}

html[data-bs-theme='dark'] .gn-categories__tr:hover {
  background: rgba(167, 139, 250, 0.08);
}

html[data-bs-theme='dark'] .gn-categories__tile {
  background: linear-gradient(135deg, rgba(167, 139, 250, 0.2) 0%, rgba(124, 58, 237, 0.26) 100%);
  border-color: rgba(167, 139, 250, 0.35);
  color: #c4b5fd;
}

html[data-bs-theme='dark'] .gn-categories__name {
  color: #f5f5f7;
}

html[data-bs-theme='dark'] .gn-categories__name:hover {
  color: #c4b5fd;
}

html[data-bs-theme='dark'] .gn-categories__count-chip {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
  color: rgba(245, 245, 247, 0.72);
}

html[data-bs-theme='dark'] .gn-categories__td--date {
  color: rgba(245, 245, 247, 0.55);
}

html[data-bs-theme='dark'] .gn-categories__icon-btn {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.1);
  color: rgba(245, 245, 247, 0.6);
}

html[data-bs-theme='dark'] .gn-categories__icon-btn:hover {
  background: rgba(167, 139, 250, 0.18);
  border-color: rgba(167, 139, 250, 0.4);
  color: #c4b5fd;
}

html[data-bs-theme='dark'] .gn-categories__icon-btn--danger:hover {
  background: rgba(220, 38, 38, 0.16);
  border-color: rgba(220, 38, 38, 0.4);
  color: #fca5a5;
}
</style>
