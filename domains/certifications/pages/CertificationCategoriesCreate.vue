<template>
  <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
    <div class="d-flex flex-column flex-column-fluid">
      <div id="kt_app_content" class="app-content flex-column-fluid">
        <div id="kt_app_content_container" class="app-container container-fluid">

          <form class="gn-form" @submit.prevent="submit">
            <!-- Hero -->
            <header class="gn-form__hero">
              <div class="gn-form__hero-icon">
                <GIcon name="folder-plus" :size="42" />
              </div>
              <div class="gn-form__hero-body">
                <span class="gn-form__eyebrow">New category</span>
                <h1 class="gn-form__title">{{ form.name || 'Untitled category' }}</h1>
                <p class="gn-form__subtitle">
                  Group certifications into a focused taxonomy.
                </p>
              </div>
              <div class="gn-form__hero-actions">
                <NuxtLink to="/certifications/categories" class="gn-form__btn gn-form__btn--ghost">
                  Cancel
                </NuxtLink>
                <button type="submit" class="gn-form__btn gn-form__btn--primary" :disabled="isSubmitting">
                  <GIcon name="check" :size="16" />
                  {{ isSubmitting ? 'Saving…' : 'Create category' }}
                </button>
              </div>
            </header>

            <section class="gn-form__card">
              <h3 class="gn-form__card-title">Details</h3>

              <div class="gn-form__field">
                <label class="gn-form__label" for="category-name">Name</label>
                <input
                  id="category-name"
                  v-model="form.name"
                  type="text"
                  class="gn-form__input"
                  placeholder="e.g. Security & Compliance"
                  required
                  maxlength="255"
                  autofocus
                />
                <span class="gn-form__helper">Keep it short and meaningful — visitors will see it on the public site.</span>
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
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { useCertificationCategoriesStore } from '../stores/useCertificationCategoriesStore'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import GIcon from '~/components/icons/GIcon.vue'

definePageMeta({ middleware: 'auth' })

const router = useRouter()
const categoriesStore = useCertificationCategoriesStore()
const breadcrumbStore = useBreadcrumbStore()

const form = reactive({ name: '' })
const isSubmitting = ref(false)

const submit = async () => {
  if (!form.name.trim()) return
  isSubmitting.value = true
  try {
    await categoriesStore.createCategory({ name: form.name.trim() })
    await Swal.fire({
      title: 'Created',
      text: 'Category created successfully',
      icon: 'success',
      timer: 1800,
      showConfirmButton: false,
    })
    router.push('/certifications/categories')
  } catch (err: any) {
    await Swal.fire({
      title: 'Failed to create',
      text: err.message || 'Something went wrong',
      icon: 'error',
    })
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  breadcrumbStore.setBreadcrumb([
    { title: 'Dashboard', path: '/' },
    { title: 'Certifications', path: '/certifications' },
    { title: 'Categories', path: '/certifications/categories' },
    { title: 'New category', path: '/certifications/categories/create' },
  ])
})
</script>

<style scoped>
.gn-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: #0f172a;
}

.gn-form__hero {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem 2.25rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fc 100%);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 22px;
  box-shadow: 0 24px 56px -36px rgba(15, 23, 42, 0.18);
}

.gn-form__hero-icon {
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

.gn-form__hero-body {
  flex: 1;
  min-width: 0;
}

.gn-form__eyebrow {
  display: block;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #a78bfa;
  margin-bottom: 0.35rem;
}

.gn-form__title {
  margin: 0 0 0.5rem;
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  font-size: clamp(1.75rem, 2.4vw, 2.25rem);
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.12;
  color: #0f172a;
}

.gn-form__subtitle {
  margin: 0;
  font-size: 1rem;
  color: rgba(15, 23, 42, 0.68);
  max-width: 500px;
}

.gn-form__hero-actions {
  display: flex;
  gap: 0.65rem;
  flex-shrink: 0;
}

.gn-form__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.4rem;
  border-radius: 12px;
  border: 0;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition:
    transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    box-shadow 0.25s ease,
    filter 0.25s ease,
    background 0.25s ease,
    color 0.25s ease;
}

.gn-form__btn--primary {
  background: linear-gradient(135deg, #a78bfa 0%, #7c3aed 55%, #6d28d9 100%);
  color: #ffffff;
  box-shadow: 0 16px 32px -14px rgba(124, 58, 237, 0.6);
}

.gn-form__btn--primary:hover:not(:disabled) {
  transform: translateY(-1px);
  filter: brightness(1.05);
}

.gn-form__btn--primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.gn-form__btn--ghost {
  background: rgba(15, 23, 42, 0.05);
  color: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(15, 23, 42, 0.08);
}

.gn-form__btn--ghost:hover {
  background: rgba(15, 23, 42, 0.08);
  color: #0f172a;
}

.gn-form__card {
  padding: 1.75rem 2rem;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.07);
  border-radius: 18px;
  box-shadow: 0 18px 40px -32px rgba(15, 23, 42, 0.14);
  max-width: 680px;
}

.gn-form__card-title {
  margin: 0 0 1.25rem;
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: #a78bfa;
}

.gn-form__field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.gn-form__label {
  font-size: 0.82rem;
  font-weight: 600;
  color: rgba(15, 23, 42, 0.75);
  letter-spacing: 0.005em;
}

.gn-form__input {
  padding: 0.8rem 1rem;
  font-family: inherit;
  font-size: 0.95rem;
  color: #0f172a;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.12);
  border-radius: 12px;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.gn-form__input:focus {
  outline: 0;
  border-color: rgba(167, 139, 250, 0.7);
  box-shadow: 0 0 0 4px rgba(167, 139, 250, 0.14);
}

.gn-form__helper {
  font-size: 0.78rem;
  color: rgba(15, 23, 42, 0.5);
}
</style>

<style>
html[data-bs-theme='dark'] .gn-form {
  color: #f5f5f7;
}

html[data-bs-theme='dark'] .gn-form__hero {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%);
  border-color: rgba(255, 255, 255, 0.08);
}

html[data-bs-theme='dark'] .gn-form__hero-icon {
  background: linear-gradient(135deg, rgba(167, 139, 250, 0.22) 0%, rgba(124, 58, 237, 0.32) 100%);
  border-color: rgba(167, 139, 250, 0.45);
  color: #c4b5fd;
}

html[data-bs-theme='dark'] .gn-form__title {
  color: #f5f5f7;
}

html[data-bs-theme='dark'] .gn-form__subtitle {
  color: rgba(245, 245, 247, 0.7);
}

html[data-bs-theme='dark'] .gn-form__btn--ghost {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.1);
  color: rgba(245, 245, 247, 0.72);
}

html[data-bs-theme='dark'] .gn-form__btn--ghost:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #f5f5f7;
}

html[data-bs-theme='dark'] .gn-form__card {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.08);
}

html[data-bs-theme='dark'] .gn-form__label {
  color: rgba(245, 245, 247, 0.75);
}

html[data-bs-theme='dark'] .gn-form__input {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.1);
  color: #f5f5f7;
}

html[data-bs-theme='dark'] .gn-form__input::placeholder {
  color: rgba(245, 245, 247, 0.35);
}

html[data-bs-theme='dark'] .gn-form__input:focus {
  border-color: rgba(167, 139, 250, 0.6);
  box-shadow: 0 0 0 4px rgba(167, 139, 250, 0.12);
}

html[data-bs-theme='dark'] .gn-form__helper {
  color: rgba(245, 245, 247, 0.48);
}
</style>
