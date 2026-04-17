<template>
  <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
    <div class="d-flex flex-column flex-column-fluid">
      <div id="kt_app_content" class="app-content flex-column-fluid">
        <div id="kt_app_content_container" class="app-container container-fluid">

          <div v-if="loading" class="gn-form" style="pointer-events:none">
            <div class="gn-skeleton__hero">
              <div class="gn-skeleton__icon gn-skeleton__pulse" />
              <div style="flex:1;display:flex;flex-direction:column;gap:0.6rem">
                <div class="gn-skeleton__line gn-skeleton__pulse" style="width:120px;height:12px" />
                <div class="gn-skeleton__line gn-skeleton__pulse" style="width:260px;height:28px" />
                <div class="gn-skeleton__line gn-skeleton__pulse" style="width:220px;height:14px" />
              </div>
              <div style="display:flex;gap:0.5rem">
                <div class="gn-skeleton__btn gn-skeleton__pulse" />
                <div class="gn-skeleton__btn gn-skeleton__pulse" />
                <div class="gn-skeleton__btn gn-skeleton__pulse" style="width:110px" />
              </div>
            </div>
            <div class="gn-skeleton__card">
              <div style="display:flex;justify-content:space-between;margin-bottom:1.25rem">
                <div class="gn-skeleton__line gn-skeleton__pulse" style="width:100px;height:13px" />
                <div class="gn-skeleton__line gn-skeleton__pulse" style="width:160px;height:34px;border-radius:10px" />
              </div>
              <div style="display:flex;flex-direction:column;gap:1.1rem">
                <div v-for="i in 4" :key="i" style="display:flex;flex-direction:column;gap:0.4rem">
                  <div class="gn-skeleton__line gn-skeleton__pulse" style="width:80px;height:11px" />
                  <div class="gn-skeleton__line gn-skeleton__pulse" style="height:42px;border-radius:12px" />
                </div>
              </div>
            </div>
            <div class="gn-skeleton__card">
              <div class="gn-skeleton__line gn-skeleton__pulse" style="width:90px;height:13px;margin-bottom:1rem" />
              <div v-for="i in 3" :key="i" class="gn-skeleton__line gn-skeleton__pulse" style="height:56px;border-radius:12px;margin-bottom:0.5rem" />
            </div>
          </div>

          <div v-else-if="processStep" class="gn-form">
            <!-- Hero -->
            <header class="gn-form__hero">
              <div class="gn-form__hero-icon">
                <GIcon :name="form.icon || 'circle-dot'" :size="42" />
              </div>
              <div class="gn-form__hero-body">
                <span class="gn-form__eyebrow">Edit process step</span>
                <h1 class="gn-form__title">{{ currentForm.title || processStep.title }}</h1>
                <p class="gn-form__subtitle">Step {{ processStep.step_number }} of the consulting methodology.</p>
              </div>
              <div class="gn-form__hero-actions">
                <button type="button" class="gn-form__btn gn-form__btn--danger-ghost" @click="handleDelete" :disabled="saving">
                  <GIcon name="trash-2" :size="16" /> Delete
                </button>
                <NuxtLink to="/process-steps" class="gn-form__btn gn-form__btn--ghost">Cancel</NuxtLink>
                <button type="button" class="gn-form__btn gn-form__btn--primary" :disabled="saving" @click="saveStep">
                  <GIcon name="check" :size="16" />
                  {{ saving ? 'Saving…' : 'Save changes' }}
                </button>
              </div>
            </header>

            <!-- Step details card -->
            <section class="gn-form__card">
              <div class="gn-form__card-header">
                <h3 class="gn-form__card-title">Step details</h3>
                <LocaleToggle v-model="locale" />
              </div>

              <div class="gn-form__fields">
                <div class="gn-form__field">
                  <label class="gn-form__label">Title <span class="gn-form__locale-badge">{{ locale.toUpperCase() }}</span></label>
                  <input v-model="currentForm.title" type="text" class="gn-form__input" placeholder="e.g. Discovery" />
                </div>

                <div class="gn-form__field">
                  <label class="gn-form__label">Short description <span class="gn-form__locale-badge">{{ locale.toUpperCase() }}</span></label>
                  <input v-model="currentForm.short_description" type="text" class="gn-form__input" placeholder="Brief summary of this step" maxlength="300" />
                </div>

                <div class="gn-form__field">
                  <label class="gn-form__label">Description <span class="gn-form__locale-badge">{{ locale.toUpperCase() }}</span></label>
                  <textarea v-model="currentForm.description" class="gn-form__textarea" rows="4" placeholder="Detailed description of this process step" />
                </div>

                <div class="gn-form__field">
                  <label class="gn-form__label">Icon</label>
                  <IconPicker v-model="form.icon" placeholder="Pick an icon" />
                </div>

                <div class="gn-form__field">
                  <label class="gn-form__label">Status</label>
                  <label style="display:flex;align-items:center;gap:0.75rem;cursor:pointer;padding:0.5rem 0">
                    <input v-model="form.is_active" type="checkbox" style="width:18px;height:18px;accent-color:#7c3aed" />
                    <span style="font-size:0.9rem;font-weight:500">{{ form.is_active ? 'Active — visible on public site' : 'Inactive — hidden' }}</span>
                  </label>
                </div>
              </div>
            </section>

            <!-- Sub-items -->
            <section class="gn-form__card">
              <div class="gn-form__card-header">
                <div>
                  <h3 class="gn-form__card-title" style="margin-bottom:0.15rem">
                    Sub-items
                    <span v-if="items.length" class="gn-form__locale-badge">{{ items.length }}</span>
                  </h3>
                  <p style="margin:0;font-size:0.8rem;color:var(--gn-text-muted)">Detailed deliverables within this step</p>
                </div>
                <button type="button" class="gn-form__btn gn-form__btn--ghost" style="padding:0.45rem 0.9rem;font-size:0.8rem" @click="addItem">
                  <GIcon name="plus" :size="14" /> Add
                </button>
              </div>

              <div v-if="items.length === 0" style="text-align:center;padding:1.5rem;color:var(--gn-text-muted);font-size:0.88rem">
                No sub-items yet. Click "Add" to create one.
              </div>

              <draggable v-else v-model="items" item-key="_key" handle=".gn-form__drag-handle" ghost-class="gn-form__feature-row--ghost" class="gn-form__fields" style="margin-top:0.75rem" @end="handleItemReorder">
                <template #item="{ element: item, index: idx }">
                  <div class="gn-form__feature-row">
                    <div class="gn-form__drag-handle"><GIcon name="grip-vertical" :size="16" /></div>
                    <div style="flex:1;display:flex;flex-direction:column;gap:0.5rem">
                      <input v-model="item.title" type="text" class="gn-form__input" :placeholder="`Item ${idx + 1} title`" />
                      <input v-model="item.description" type="text" class="gn-form__input" placeholder="Description (optional)" style="font-size:0.86rem" />
                    </div>
                    <div style="display:flex;flex-direction:column;gap:0.3rem">
                      <button type="button" class="gn-form__icon-action" title="Save" @click="saveItem(item)" :disabled="!item.title?.trim()"><GIcon name="check" :size="14" /></button>
                      <button type="button" class="gn-form__icon-action gn-form__icon-action--danger" title="Delete" @click="removeItem(item, idx)"><GIcon name="trash-2" :size="14" /></button>
                    </div>
                  </div>
                </template>
              </draggable>
            </section>
          </div>

          <div v-else class="gn-form__empty">
            <h3>Process step not found</h3>
            <NuxtLink to="/process-steps" class="gn-form__btn gn-form__btn--primary">Back to process steps</NuxtLink>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import Swal from 'sweetalert2'
import draggable from 'vuedraggable'
import { useProcessStepsStore } from '../stores/useProcessStepsStore'
import { useProcessStepFormatters } from '../composables/useProcessStepFormatters'
import { useProcessStepActions } from '../composables/useProcessStepActions'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import { GET_PROCESS_STEP } from '../graphql/queries'
import { UPDATE_PROCESS_STEP, CREATE_PROCESS_STEP_ITEM, UPDATE_PROCESS_STEP_ITEM, DELETE_PROCESS_STEP_ITEM } from '../graphql/mutations'
import GIcon from '~/components/icons/GIcon.vue'
import IconPicker from '~/components/icons/IconPicker.vue'
import LocaleToggle from '~/components/LocaleToggle.vue'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const router = useRouter()
const processStepsStore = useProcessStepsStore()
const breadcrumbStore = useBreadcrumbStore()
const { generateSlug } = useProcessStepFormatters()
const { confirmAndDeleteProcessStep } = useProcessStepActions()

const stepId = computed(() => route.params.id as string)
const processStep = computed(() => processStepsStore.currentProcessStep)
const locale = ref<'en' | 'fr'>('en')
const saving = ref(false)
const loading = ref(true)

const form = reactive({
  title: '',
  short_description: '',
  description: '',
  icon: '',
  is_active: true,
})

const formFr = reactive({
  title: '',
  short_description: '',
  description: '',
})

const currentForm = computed(() => locale.value === 'fr' ? formFr : form)

const loadFormData = (data: any, target: any) => {
  target.title = data.title || ''
  target.short_description = data.short_description || ''
  target.description = data.description || ''
}

// Items
interface ItemEntry { id?: string; _key: string; title: string; description: string }
const items = ref<ItemEntry[]>([])
let itemCounter = 0

const addItem = () => { items.value.push({ _key: `new-${++itemCounter}`, title: '', description: '' }) }

const saveItem = async (item: ItemEntry) => {
  if (!item.title?.trim()) return
  const api = useApi()
  try {
    if (item.id) {
      await api.mutate(UPDATE_PROCESS_STEP_ITEM, { variables: { id: item.id, input: { title: item.title.trim(), description: item.description?.trim() || null } }, locale: locale.value })
    } else {
      const data = await api.mutate<any>(CREATE_PROCESS_STEP_ITEM, { variables: { input: { process_step_id: stepId.value, title: item.title.trim(), description: item.description?.trim() || null } }, locale: locale.value })
      item.id = data.createProcessStepItem.id
      item._key = item.id
    }
    await Swal.fire({ title: 'Saved', icon: 'success', timer: 1200, showConfirmButton: false })
  } catch (err: any) { await Swal.fire({ title: 'Failed', text: err.message, icon: 'error' }) }
}

const removeItem = async (item: ItemEntry, idx: number) => {
  if (!item.id) { items.value.splice(idx, 1); return }
  const r = await Swal.fire({ title: 'Delete?', text: item.title, icon: 'warning', showCancelButton: true, confirmButtonColor: '#dc2626', confirmButtonText: 'Delete' })
  if (!r.isConfirmed) return
  try { await useApi().mutate(DELETE_PROCESS_STEP_ITEM, { variables: { id: item.id } }); items.value.splice(idx, 1) }
  catch (err: any) { await Swal.fire({ title: 'Failed', text: err.message, icon: 'error' }) }
}

const handleItemReorder = async () => {
  // Items don't have a dedicated sort mutation yet — silent for now
}

const reloadItems = async () => {
  try {
    const data = await useApi().query<any>(GET_PROCESS_STEP, { variables: { id: stepId.value }, locale: locale.value, fetchPolicy: 'no-cache' })
    items.value = (data.processStep?.items || []).map((i: any) => ({ id: i.id, _key: i.id, title: i.title || '', description: i.description || '' }))
  } catch { /* ignore */ }
}

watch(locale, () => { reloadItems() })

// Save step
const saveStep = async () => {
  const t = locale.value === 'fr' ? formFr : form
  if (!t.title?.trim()) return
  saving.value = true
  try {
    await useApi().mutate(UPDATE_PROCESS_STEP, {
      variables: {
        id: stepId.value,
        input: {
          title: t.title.trim(),
          short_description: t.short_description?.trim() || null,
          description: t.description?.trim() || null,
          icon: form.icon || null,
          slug: generateSlug(form.title || t.title),
          is_active: form.is_active,
        },
      },
      locale: locale.value,
    })
    await Swal.fire({ title: 'Saved', text: `Content saved (${locale.value.toUpperCase()})`, icon: 'success', timer: 1800, showConfirmButton: false })
  } catch (err: any) {
    await Swal.fire({ title: 'Failed', text: err.message, icon: 'error' })
  } finally { saving.value = false }
}

const handleDelete = async () => {
  if (!processStep.value) return
  if (await confirmAndDeleteProcessStep(processStep.value)) router.push('/process-steps')
}

watch(processStep, (v) => {
  if (!v) return
  breadcrumbStore.setBreadcrumb([
    { title: 'Dashboard', path: '/' },
    { title: 'Process Steps', path: '/process-steps' },
    { title: v.title, path: `/process-steps/${stepId.value}/edit` },
  ])
}, { immediate: true })

onMounted(async () => {
  loading.value = true
  try {
    await processStepsStore.fetchProcessStep(stepId.value)

    if (processStep.value) {
      const api = useApi()
      const enData = await api.query<any>(GET_PROCESS_STEP, { variables: { id: stepId.value }, locale: 'en', fetchPolicy: 'no-cache' })
      const frData = await api.query<any>(GET_PROCESS_STEP, { variables: { id: stepId.value }, locale: 'fr', fetchPolicy: 'no-cache' })

      if (enData.processStep) {
        loadFormData(enData.processStep, form)
        form.icon = enData.processStep.icon || ''
        form.is_active = enData.processStep.is_active ?? true
      }
      if (frData.processStep) {
        loadFormData(frData.processStep, formFr)
      }

      items.value = (enData.processStep?.items || []).map((i: any) => ({
        id: i.id, _key: i.id, title: i.title || '', description: i.description || '',
      }))
    }
  } catch (err) {
    console.error('[ProcessStepsEdit] Failed to fetch', err)
  } finally { loading.value = false }
})
</script>
