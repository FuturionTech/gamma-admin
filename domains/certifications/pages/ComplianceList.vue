<template>
  <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
    <div class="d-flex flex-column flex-column-fluid">
      <div id="kt_app_content" class="app-content flex-column-fluid">
        <div id="kt_app_content_container" class="app-container container-fluid">
          <div class="gn-categories">
            <header class="gn-categories__hero">
              <div class="gn-categories__hero-icon"><GIcon name="shield-check" :size="42" /></div>
              <div class="gn-categories__hero-body">
                <span class="gn-categories__eyebrow">Compliance</span>
                <h1 class="gn-categories__title">Compliance Frameworks</h1>
                <p class="gn-categories__subtitle">Manage the compliance badges shown on the public site.</p>
              </div>
              <div class="gn-categories__hero-actions">
                <NuxtLink to="/compliance/create" class="gn-categories__btn gn-categories__btn--primary"><GIcon name="plus" :size="16" /> Add framework</NuxtLink>
              </div>
            </header>

            <div v-if="store.isLoading && frameworks.length === 0" class="gn-form__shimmer" />
            <div v-else-if="frameworks.length === 0" class="gn-form__empty">
              <GIcon name="shield-check" :size="42" />
              <h3>No frameworks yet</h3>
              <p>Add your first compliance framework.</p>
              <NuxtLink to="/compliance/create" class="gn-categories__btn gn-categories__btn--primary"><GIcon name="plus" :size="16" /> Add</NuxtLink>
            </div>

            <section v-else class="gn-form__card">
              <div style="display:flex;justify-content:space-between;margin-bottom:1.25rem">
                <div>
                  <h3 class="gn-form__card-title" style="margin-bottom:0.2rem">All frameworks</h3>
                  <p style="margin:0;font-size:0.82rem;color:var(--gn-text-muted)">{{ frameworks.length }} frameworks</p>
                </div>
              </div>
              <table class="table align-middle table-row-dashed fs-6 gy-5" style="width:100%">
                <thead>
                  <tr class="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                    <th>Name</th><th>Status</th><th class="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody class="fw-semibold text-gray-600">
                  <tr v-for="fw in sortedFrameworks" :key="fw.id">
                    <td>
                      <NuxtLink :to="`/compliance/${fw.id}/edit`" class="text-gray-800 fw-bold text-hover-primary">{{ fw.name }}</NuxtLink>
                      <span v-if="fw.description" class="text-muted d-block fs-7">{{ fw.description }}</span>
                    </td>
                    <td><span class="badge" :class="fw.is_active ? 'badge-light-success' : 'badge-light-danger'">{{ fw.is_active ? 'Active' : 'Inactive' }}</span></td>
                    <td class="text-end">
                      <NuxtLink :to="`/compliance/${fw.id}/edit`" class="btn btn-sm btn-icon btn-light btn-active-light-primary me-2" title="Edit"><GIcon name="edit" :size="15" /></NuxtLink>
                      <button type="button" class="btn btn-sm btn-icon btn-light btn-active-light-danger" title="Delete" @click="handleDelete(fw)"><GIcon name="trash-2" :size="15" /></button>
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
import Swal from 'sweetalert2'
import { useComplianceStore, type ComplianceFramework } from '../stores/useComplianceStore'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import GIcon from '~/components/icons/GIcon.vue'

definePageMeta({ middleware: 'auth' })
const store = useComplianceStore()
const frameworks = computed(() => store.frameworks)
const sortedFrameworks = computed(() => store.sortedFrameworks)

const handleDelete = async (fw: ComplianceFramework) => {
  const r = await Swal.fire({ title: 'Delete?', html: `Delete "<strong>${fw.name}</strong>"?`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#dc2626', confirmButtonText: 'Delete' })
  if (!r.isConfirmed) return
  try { await store.remove(fw.id); await Swal.fire({ title: 'Deleted', icon: 'success', timer: 1500, showConfirmButton: false }) }
  catch (err: any) { await Swal.fire({ title: 'Failed', text: err.message, icon: 'error' }) }
}

onMounted(async () => {
  useBreadcrumbStore().setBreadcrumb([{ title: 'Dashboard', path: '/' }, { title: 'Compliance', path: '/compliance' }])
  await store.fetchAll()
})
</script>
