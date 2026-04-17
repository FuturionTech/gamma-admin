<template>
  <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
    <div class="d-flex flex-column flex-column-fluid">
      <div id="kt_app_content" class="app-content flex-column-fluid">
        <div id="kt_app_content_container" class="app-container container-fluid">
          <div v-if="store.isLoading && !framework" class="gn-form__shimmer" />
          <form v-else-if="framework" class="gn-form" @submit.prevent="submit">
            <header class="gn-form__hero">
              <div class="gn-form__hero-icon"><GIcon name="shield-check" :size="42" /></div>
              <div class="gn-form__hero-body">
                <span class="gn-form__eyebrow">Edit framework</span>
                <h1 class="gn-form__title">{{ form.name || framework.name }}</h1>
              </div>
              <div class="gn-form__hero-actions">
                <button type="button" class="gn-form__btn gn-form__btn--danger-ghost" @click="handleDelete" :disabled="submitting"><GIcon name="trash-2" :size="16" /> Delete</button>
                <NuxtLink to="/compliance" class="gn-form__btn gn-form__btn--ghost">Cancel</NuxtLink>
                <button type="submit" class="gn-form__btn gn-form__btn--primary" :disabled="submitting">
                  <GIcon name="check" :size="16" /> {{ submitting ? 'Saving…' : 'Save' }}
                </button>
              </div>
            </header>
            <section class="gn-form__card">
              <h3 class="gn-form__card-title">Details</h3>
              <div class="gn-form__fields">
                <div class="gn-form__field">
                  <label class="gn-form__label">Name</label>
                  <input v-model="form.name" type="text" class="gn-form__input" required maxlength="255" />
                </div>
                <div class="gn-form__field">
                  <label class="gn-form__label">Description (optional)</label>
                  <input v-model="form.description" type="text" class="gn-form__input" maxlength="500" />
                </div>
                <div class="gn-form__field">
                  <label class="gn-form__label">Status</label>
                  <label style="display:flex;align-items:center;gap:0.75rem;cursor:pointer;padding:0.5rem 0">
                    <input v-model="form.is_active" type="checkbox" style="width:18px;height:18px;accent-color:#7c3aed" />
                    <span style="font-size:0.9rem;font-weight:500">{{ form.is_active ? 'Active — shown on site' : 'Inactive — hidden' }}</span>
                  </label>
                </div>
              </div>
            </section>
          </form>
          <div v-else class="gn-form__empty">
            <h3>Framework not found</h3>
            <NuxtLink to="/compliance" class="gn-form__btn gn-form__btn--primary">Back</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, onMounted, watch } from 'vue'
import Swal from 'sweetalert2'
import { useComplianceStore } from '../stores/useComplianceStore'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import GIcon from '~/components/icons/GIcon.vue'

definePageMeta({ middleware: 'auth' })
const route = useRoute()
const router = useRouter()
const store = useComplianceStore()
const fwId = computed(() => route.params.id as string)
const framework = computed(() => store.currentFramework)
const form = reactive({ name: '', description: '', is_active: true })
const submitting = ref(false)

watch(framework, (v) => {
  if (!v) return
  form.name = v.name
  form.description = v.description || ''
  form.is_active = v.is_active
  useBreadcrumbStore().setBreadcrumb([{ title: 'Dashboard', path: '/' }, { title: 'Compliance', path: '/compliance' }, { title: v.name, path: `/compliance/${v.id}/edit` }])
}, { immediate: true })

const submit = async () => {
  if (!form.name.trim() || !framework.value) return
  submitting.value = true
  try {
    await store.update(framework.value.id, { name: form.name.trim(), description: form.description?.trim() || null, is_active: form.is_active })
    await Swal.fire({ title: 'Saved', icon: 'success', timer: 1500, showConfirmButton: false })
    router.push('/compliance')
  } catch (err: any) { await Swal.fire({ title: 'Failed', text: err.message, icon: 'error' }) }
  finally { submitting.value = false }
}

const handleDelete = async () => {
  if (!framework.value) return
  const r = await Swal.fire({ title: 'Delete?', html: `Delete "<strong>${framework.value.name}</strong>"?`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#dc2626', confirmButtonText: 'Delete' })
  if (!r.isConfirmed) return
  try { await store.remove(framework.value.id); router.push('/compliance') }
  catch (err: any) { await Swal.fire({ title: 'Failed', text: err.message, icon: 'error' }) }
}

onMounted(async () => { await store.fetchOne(fwId.value) })
</script>
