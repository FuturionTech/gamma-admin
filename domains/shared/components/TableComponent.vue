<template>
  <div class="card card-flush">
    <div class="card-header align-items-center py-5 gap-2 gap-md-5">
      <div class="card-title">
        <div class="d-flex align-items-center position-relative my-1">
          <i class="ki-duotone ki-magnifier fs-3 position-absolute ms-4">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          <input
              v-model="searchTerm"
              @input="debouncedFetch"
              type="text"
              class="form-control form-control-solid w-250px ps-12"
              :placeholder="searchPlaceholder"
          />
        </div>
      </div>
      <div class="card-toolbar flex-row-fluid justify-content-end gap-5">
        <div v-if="filters" class="w-100 mw-150px">
          <slot name="filters"></slot>
        </div>
        <button
            v-if="selectedItems.length > 0 && bulkDeleteEnabled"
            @click="bulkDeleteActionHandler"
            class="btn btn-danger"
        >
          {{ bulkDeleteLabel }} ({{ selectedItems.length }})
        </button>
        <slot name="toolbar"></slot>
      </div>
    </div>
    <div class="card-body pt-0">
      <table class="table align-middle table-row-dashed fs-6 gy-5" :id="tableId">
        <thead>
        <tr class="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
          <th class="w-10px pe-2">
            <div class="form-check form-check-sm form-check-custom form-check-solid me-3">
              <input
                  class="form-check-input"
                  type="checkbox"
                  @change="toggleSelectAll"
                  :checked="isAllSelected"
              />
            </div>
          </th>
          <th v-for="header in headers" :key="header.key" :class="header.class">
            {{ header.label }}
          </th>
          <th v-if="actions" class="text-end min-w-100px">Actions</th>
        </tr>
        </thead>
        <tbody class="fw-semibold text-gray-600">
        <!-- Shimmer Placeholder Rows -->
        <template v-if="loading">
          <tr v-for="n in 10" :key="'shimmer-'+n">
            <td>
              <div class="form-check form-check-sm form-check-custom form-check-solid">
                <div class="shimmer-placeholder" style="width: 20px; height: 20px;"></div>
              </div>
            </td>
            <td
                v-for="header in headers"
                :key="'shimmer-cell-'+n+'-'+header.key"
                :class="header.class"
            >
              <div class="shimmer-placeholder" style="width: 100%; height: 20px;"></div>
            </td>
            <td v-if="actions" class="text-end">
              <div
                  class="shimmer-placeholder"
                  style="width: 50px; height: 20px; margin-left: auto;"
              ></div>
            </td>
          </tr>
        </template>

        <!-- Data Rows -->
        <template v-else>
          <tr v-for="item in items" :key="item.id">
            <td>
              <div class="form-check form-check-sm form-check-custom form-check-solid">
                <input
                    class="form-check-input"
                    type="checkbox"
                    :value="item.id"
                    v-model="selectedItems"
                />
              </div>
            </td>
            <slot name="row" :item="item"></slot>
            <td v-if="actions" class="text-end">
              <slot name="actions" :item="item" :deleteItem="deleteItem"></slot>
            </td>
          </tr>
          <tr v-if="items.length === 0">
            <td :colspan="colspan" class="text-center py-4">Aucune donnée trouvée.</td>
          </tr>
        </template>
        </tbody>
      </table>
      <div class="row">
        <div
            v-if="itemsPerPageOptions"
            class="col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start dt-toolbar"
        >
          <div>
            <select
                v-model.number="itemsPerPage"
                @change="changeItemsPerPage"
                class="form-select form-select-solid form-select-sm"
                :aria-controls="tableId"
            >
              <option v-for="option in itemsPerPageOptions" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
            <label></label>
          </div>
        </div>
        <div
            class="col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end"
        >
          <nav v-if="paginator">
            <ul class="pagination">
              <li :class="['page-item', { disabled: paginator.currentPage === 1 }]">
                <button
                    class="page-link"
                    @click="goToPage(paginator.currentPage - 1)"
                    aria-label="Précédent"
                >
                  Précédent
                </button>
              </li>
              <li
                  v-for="page in paginationRange"
                  :key="page"
                  :class="[
                  'page-item',
                  { active: paginator.currentPage === page },
                  { disabled: page === '...' },
                ]"
              >
                <button v-if="page !== '...'" class="page-link" @click="goToPage(page)">
                  {{ page }}
                </button>
                <span v-else class="page-link">...</span>
              </li>
              <li
                  :class="['page-item', { disabled: paginator.currentPage === paginator.lastPage }]"
              >
                <button
                    class="page-link"
                    @click="goToPage(paginator.currentPage + 1)"
                    aria-label="Suivant"
                >
                  Suivant
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div v-if="error" class="d-flex justify-content-center align-items-center mt-4">
        <span class="text-danger">{{ error }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, nextTick, onMounted, ref, watch} from 'vue';
import Swal from 'sweetalert2';
import {useDebounceFn} from '@vueuse/core';

interface Header {
  key: string;
  label: string;
  class?: string;
}

interface Paginator {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
  hasMorePages: boolean;
}

interface BulkDeleteResponse {
  success: boolean;
  data?: any[];
  error?: string;
}

const props = defineProps<{
  headers: Header[];
  fetchData: (params: Record<string, any>) => Promise<{ items: any[]; paginator: Paginator }>;
  applicationId?: string | null; 
  actions?: boolean;
  tableId: string;
  searchPlaceholder?: string;
  filters?: boolean;
  bulkDeleteEnabled?: boolean;
  bulkDeleteAction?: (ids: string[]) => Promise<BulkDeleteResponse>;
  bulkDeleteLabel?: string;
  singleDeleteAction?: (id: string, name: string) => Promise<BulkDeleteResponse>;
  itemsPerPageOptions?: number[];
}>();

const searchTerm = ref('');
const itemsPerPage = ref<number>(props.itemsPerPageOptions ? props.itemsPerPageOptions[0] : 10);
const selectedItems = ref<string[]>([]);
const items = ref<any[]>([]);
const paginator = ref<Paginator | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const debouncedFetch = useDebounceFn(async () => {
  await fetchDataInternal();
}, 500);

const debouncedKTMenuInit = useDebounceFn(() => {
  if (typeof KTMenu !== 'undefined' && KTMenu.init) {
    KTMenu.init();
  }
}, 300);

const fetchDataInternal = async (page: number = 1) => {
  loading.value = true;
  error.value = null;
  try {
  
    const params: Record<string, any> = {
      page: page,
      limit: itemsPerPage.value,
      search: searchTerm.value,
      sortField: 'created_at',
      sortOrder: 'DESC',
    };

    if (props.applicationId) {
      params.application_id = props.applicationId;
    }

    const data = await props.fetchData(params);
    items.value = data.items;
    paginator.value = data.paginator;
    await nextTick();
    debouncedKTMenuInit();
  } catch (err: any) {
    error.value = err.message || 'Erreur lors du chargement des données.';
  } finally {
    loading.value = false;
  }
};

// Fetch data on component mount
onMounted(() => {
  fetchDataInternal();
});

const toggleSelectAll = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.checked) {
    selectedItems.value = items.value.map(item => item.id);
  } else {
    selectedItems.value = [];
  }
};
const isAllSelected = computed(() => {
  return (
      selectedItems.value.length === (items.value?.length || 0) &&
      (items.value?.length || 0) > 0
  );
});
const goToPage = (page: number) => {
  if (!paginator.value) return;
  if (page < 1 || page > paginator.value.lastPage) return;
  fetchDataInternal(page);
};
const changeItemsPerPage = () => {
  fetchDataInternal(1);
};
const paginationRange = computed(() => {
  if (!paginator.value) return [];
  const range = [];
  const total = paginator.value.lastPage;
  const current = paginator.value.currentPage;
  const delta = 2;
  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);
  range.push(1);
  if (left > 2) range.push('...');
  for (let i = left; i <= right; i++) range.push(i);
  if (right < total - 1) range.push('...');
  if (total > 1) range.push(total);
  return range;
});
const bulkDeleteActionHandler = async () => {
  if (!props.bulkDeleteAction) return;
  const result = await Swal.fire({
    text: `Êtes-vous sûr de vouloir supprimer ${selectedItems.value.length} élément(s) sélectionné(s) ?`,
    icon: 'warning',
    showCancelButton: true,
    buttonsStyling: false,
    confirmButtonText: 'Oui, supprimer!',
    cancelButtonText: 'Non, annuler',
    customClass: {
      confirmButton: 'btn fw-bold btn-danger',
      cancelButton: 'btn fw-bold btn-active-light-primary',
    },
  });

  if (result.isConfirmed) {
    const response = await props.bulkDeleteAction(selectedItems.value);
    if (response.success) {
      await Swal.fire({
        text: `Les éléments sélectionnés ont été supprimés!`,
        icon: 'success',
        buttonsStyling: false,
        confirmButtonText: 'Ok, compris!',
        customClass: {
          confirmButton: 'btn fw-bold btn-primary',
        },
      });
      selectedItems.value = [];
      await fetchDataInternal(paginator.value?.currentPage || 1);
    } else {
      await Swal.fire({
        text: response.error || 'Erreur lors de la suppression.',
        icon: 'error',
        buttonsStyling: false,
        confirmButtonText: 'Ok, compris!',
        customClass: {
          confirmButton: 'btn fw-bold btn-primary',
        },
      });
    }
  }
};
const deleteItem = async (id: string, name: string) => {
  if (!props.singleDeleteAction) return;
  const result = await Swal.fire({
    text: `Êtes-vous sûr de vouloir supprimer ${name} ?`,
    icon: 'warning',
    showCancelButton: true,
    buttonsStyling: false,
    confirmButtonText: 'Oui, supprimer!',
    cancelButtonText: 'Non, annuler',
    customClass: {
      confirmButton: 'btn fw-bold btn-danger',
      cancelButton: 'btn fw-bold btn-active-light-primary',
    },
  });

  if (result.isConfirmed) {
    const response = await props.singleDeleteAction(id, name);
    if (response.success) {
      await Swal.fire({
        text: `${name} a été supprimé!`,
        icon: 'success',
        buttonsStyling: false,
        confirmButtonText: 'Ok, compris!',
        customClass: {
          confirmButton: 'btn fw-bold btn-primary',
        },
      });
      await fetchDataInternal(paginator.value?.currentPage || 1);
    } else {
      await Swal.fire({
        text: response.error || 'Erreur lors de la suppression.',
        icon: 'error',
        buttonsStyling: false,
        confirmButtonText: 'Ok, compris!',
        customClass: {
          confirmButton: 'btn fw-bold btn-primary',
        },
      });
    }
  }
};
const colspan = computed(() => {
  return props.headers.length + (props.actions ? 1 : 0) + 1; // +1 for the selection checkbox
});
watch([searchTerm, itemsPerPage], () => { debouncedFetch(); });
</script>

<style scoped>
/* Shimmer Effect Styles */
.shimmer-placeholder {
  position: relative;
  overflow: hidden;
  background-color: #f6f7f8; /* Light gray background */
}

.shimmer-placeholder::before {
  content: '';
  position: absolute;
  top: 0;
  left: -150px;
  width: 150px;
  height: 100%;
  background: linear-gradient(
      to right,
      rgba(246, 247, 248, 0) 0%,
      rgba(246, 247, 248, 0.8) 50%,
      rgba(246, 247, 248, 0) 100%
  );
  animation: shimmer 1s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(300%);
  }
}
</style>
