<template>
  <div class="alert alert-info d-flex align-items-center">
    <i class="ki-duotone ki-information-3 fs-2tx text-info me-4">
      <span class="path1"></span>
      <span class="path2"></span>
      <span class="path3"></span>
    </i>
    <div class="flex-grow-1">
      <div class="fw-bold">Devises Supportées</div>
      <div class="fs-7 text-gray-600">
        <span class="badge badge-light-primary me-2">FCFA (XOF)</span>
        <span class="badge badge-light-success me-2">Dollar US ($)</span>
      </div>
      <div class="fs-7 text-gray-500 mt-1">
        Taux de change: 1 USD ≈ {{ exchangeRate }} FCFA
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CURRENCY_CONFIG } from '../utils/currency';

// Calculate approximate exchange rate (1 USD to FCFA)
const exchangeRate = computed(() => {
  const usdRate = CURRENCY_CONFIG.USD.exchangeRate;
  return Math.round(1 / usdRate).toLocaleString('fr-FR');
});
</script>

<style scoped>
.alert {
  border-radius: 0.475rem;
  border: 1px solid rgba(0, 158, 247, 0.25);
  background-color: rgba(0, 158, 247, 0.1);
}
</style>