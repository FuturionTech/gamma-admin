<template>
  <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
    <div class="d-flex flex-column flex-column-fluid">
      <div id="kt_app_content" class="app-content flex-column-fluid">
        <div id="kt_app_content_container" class="app-container container-fluid">
          <form class="gn-form" @submit.prevent="submit">
            <header class="gn-form__hero">
              <div class="gn-form__hero-icon"><GIcon name="shield-plus" :size="42" /></div>
              <div class="gn-form__hero-body">
                <span class="gn-form__eyebrow">New framework</span>
                <h1 class="gn-form__title">{{ form.name || 'Untitled framework' }}</h1>
              </div>
              <div class="gn-form__hero-actions">
                <NuxtLink to="/compliance" class="gn-form__btn gn-form__btn--ghost">Cancel</NuxtLink>
                <button type="submit" class="gn-form__btn gn-form__btn--primary" :disabled="submitting">
                  <GIcon name="check" :size="16" /> {{ submitting ? 'Saving…' : 'Create' }}
                </button>
              </div>
            </header>
            <section class="gn-form__card">
              <h3 class="gn-form__card-title">Details</h3>
              <div class="gn-form__fields">
                <div class="gn-form__field">
                  <label class="gn-form__label">Name</label>
                  <input v-model="form.name" type="text" class="gn-form__input" placeholder="e.g. SOC 2" required maxlength="255" autofocus />
                </div>
                <div class="gn-form__field">
                  <label class="gn-form__label">Description (optional)</label>
                  <input v-model="form.description" type="text" class="gn-form__input" placeholder="Brief description" maxlength="500" />
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
import { useComplianceStore } from '../stores/useComplianceStore'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import GIcon from '~/components/icons/GIcon.vue'

definePageMeta({ middleware: 'auth' })
const router = useRouter()
const store = useComplianceStore()
const form = reactive({ name: '', description: '' })
const submitting = ref(false)

const submit = async () => {
  if (!form.name.trim()) return
  submitting.value = true
  try {
    await store.create({ name: form.name.trim(), description: form.description?.trim() || null })
    await Swal.fire({ title: 'Created', icon: 'success', timer: 1500, showConfirmButton: false })
    router.push('/compliance')
  } catch (err: any) { await Swal.fire({ title: 'Failed', text: err.message, icon: 'error' }) }
  finally { submitting.value = false }
}

onMounted(() => {
  useBreadcrumbStore().setBreadcrumb([{ title: 'Dashboard', path: '/' }, { title: 'Compliance', path: '/compliance' }, { title: 'New', path: '/compliance/create' }])
})
</script>
