<template>
  <div class="card card-flush h-xl-100">
    <div class="card-header pt-7">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bold text-gray-800">Geographic Distribution</span>
        <span class="text-gray-500 mt-1 fw-semibold fs-6">Visitors by country</span>
      </h3>
    </div>
    <div class="card-body pt-6">
      <div v-if="isLoading" class="d-flex justify-content-center py-10">
        <div class="spinner-border spinner-border-sm text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-else-if="topCountries && topCountries.length > 0">
        <!-- Top Countries List -->
        <div class="mb-6">
          <div v-for="(country, index) in topCountries.slice(0, 5)" :key="country.countryCode"
               class="d-flex align-items-center py-3">
            <!-- Country Flag -->
            <div class="symbol symbol-40px me-4">
              <span class="symbol-label bg-light">
                <i :class="`flag flag-${country.countryCode?.toLowerCase()}`" style="font-size: 20px;"></i>
              </span>
            </div>

            <!-- Country Info -->
            <div class="flex-grow-1">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <span class="text-gray-900 fw-bold fs-6">{{ country.countryName || 'Unknown' }}</span>
                  <div class="text-gray-500 fs-7">{{ country.count }} {{ country.count > 1 ? 'visitors' : 'visitor' }}</div>
                </div>
                <div class="text-end">
                  <span class="text-gray-900 fw-bold fs-6">{{ country.percentage.toFixed(1) }}%</span>
                  <div v-if="country.revenue" class="text-gray-500 fs-7">
                    {{ formatCurrency(country.revenue) }}
                  </div>
                </div>
              </div>

              <!-- Progress Bar -->
              <div class="progress h-5px mt-2">
                <div class="progress-bar bg-primary"
                     :style="`width: ${country.percentage}%`"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Summary Stats -->
        <div class="border border-gray-300 border-dashed rounded p-4">
          <div class="row text-center">
            <div class="col-4">
              <span class="fs-4 fw-bold text-gray-900">{{ totalCountries }}</span>
              <div class="text-gray-500 fs-7">Total Countries</div>
            </div>
            <div class="col-4">
              <span class="fs-4 fw-bold text-gray-900">{{ totalUsers }}</span>
              <div class="text-gray-500 fs-7">Visitors</div>
            </div>
            <div class="col-4">
              <span class="fs-4 fw-bold text-gray-900">{{ topCountryPercentage.toFixed(0) }}%</span>
              <div class="text-gray-500 fs-7">Top Country</div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-10">
        <div class="text-gray-500">No geographic data available</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CountryMetric } from '../types';

interface Props {
  topCountries?: CountryMetric[];
  isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  topCountries: () => [],
  isLoading: false
});

// Computed properties
const totalCountries = computed(() => {
  return props.topCountries?.length || 0;
});

const totalUsers = computed(() => {
  return props.topCountries?.reduce((sum, country) => sum + country.count, 0) || 0;
});

const topCountryPercentage = computed(() => {
  return props.topCountries && props.topCountries.length > 0 
    ? props.topCountries[0].percentage 
    : 0;
});

// Format currency - Default to FCFA
const formatCurrency = (amount: number, currency: string = 'XOF'): string => {
  const currencyConfig = {
    XOF: { locale: 'fr-CF', currency: 'XOF' }, // West African CFA Franc
    USD: { locale: 'en-US', currency: 'USD' }, // US Dollar  
    EUR: { locale: 'fr-FR', currency: 'EUR' }  // Euro
  };
  
  const config = currencyConfig[currency as keyof typeof currencyConfig] || currencyConfig.XOF;
  
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};
</script>

<style scoped>
/* Flag styles - you may need to include flag icons CSS */
.flag {
  width: 20px;
  height: 15px;
  background-size: cover;
  background-position: center;
  border-radius: 2px;
}

/* Fallback flag styles */
.flag::before {
  content: '🌍';
  font-size: 16px;
}

.progress {
  height: 5px;
  border-radius: 3px;
}

.progress-bar {
  border-radius: 3px;
}

.symbol-label {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>