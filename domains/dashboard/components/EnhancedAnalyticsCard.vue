<template>
  <div class="card card-flush h-xl-100">
    <div class="card-header pt-7">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bold text-gray-800">{{ title }}</span>
        <span class="text-gray-500 mt-1 fw-semibold fs-6">{{ subtitle }}</span>
      </h3>
    </div>
    <div class="card-body pt-6">
      <!-- Main Metric -->
      <div class="d-flex align-items-center mb-7">
        <div class="symbol symbol-45px me-5">
          <i :class="`${icon} fs-2x text-${color}`">
            <span class="path1"></span>
            <span class="path2"></span>
            <span class="path3"></span>
          </i>
        </div>
        <div class="flex-grow-1">
          <span class="fs-2x fw-bold text-gray-900 me-2">
            {{ formatMetric(mainMetric) }}
          </span>
          <span v-if="growthPercentage !== null" :class="`badge badge-light-${growthColor} fs-base`">
            <i :class="`ki-duotone ki-arrow-${growthDirection} fs-5 text-${growthColor} me-1`">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            {{ Math.abs(growthPercentage).toFixed(1) }}%
          </span>
        </div>
      </div>
      
      <!-- Secondary Metrics -->
      <div v-if="secondaryMetrics && secondaryMetrics.length > 0" class="mb-4">
        <div v-for="metric in secondaryMetrics" :key="metric.label" 
             class="d-flex justify-content-between text-gray-500 fs-6 fw-semibold mb-2">
          <span>{{ metric.label }}</span>
          <span>{{ formatMetric(metric.value, metric.type) }}</span>
        </div>
      </div>
      
      <!-- Distribution Chart (if provided) -->
      <div v-if="distributionData && distributionData.length > 0" class="mt-4">
        <h6 class="text-gray-700 fw-bold mb-3">Distribution</h6>
        <div class="row">
          <div v-for="item in distributionData.slice(0, 3)" :key="item.label" 
               class="col-4 text-center mb-3">
            <div class="fs-6 fw-bold text-gray-800">{{ item.percentage.toFixed(1) }}%</div>
            <div class="text-gray-500 fs-7">{{ item.label }}</div>
            <div class="progress h-3px mt-1">
              <div class="progress-bar" 
                   :style="`width: ${item.percentage}%; background-color: ${item.color || '#009ef7'}`">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatCurrency as formatCurrencyUtil } from '../utils/currency';

interface SecondaryMetric {
  label: string;
  value: number | string;
  type?: 'currency' | 'percentage' | 'number';
}

interface DistributionItem {
  label: string;
  value: number;
  percentage: number;
  color?: string;
}

interface Props {
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  mainMetric: number | string;
  growthPercentage?: number | null;
  secondaryMetrics?: SecondaryMetric[];
  distributionData?: DistributionItem[];
}

const props = withDefaults(defineProps<Props>(), {
  growthPercentage: null,
  secondaryMetrics: () => [],
  distributionData: () => []
});

// Computed properties
const growthColor = computed(() => {
  if (props.growthPercentage === null) return 'secondary';
  return props.growthPercentage >= 0 ? 'success' : 'danger';
});

const growthDirection = computed(() => {
  if (props.growthPercentage === null) return 'right';
  return props.growthPercentage >= 0 ? 'up' : 'down';
});

// Format different types of metrics
const formatMetric = (value: number | string, type?: string): string => {
  if (typeof value === 'string') return value;
  
  switch (type) {
    case 'currency':
      return formatCurrencyUtil(value, 'XOF');
    
    case 'percentage':
      return `${value.toFixed(1)}%`;
    
    case 'number':
    default:
      if (value >= 1000000) {
        return (value / 1000000).toFixed(1) + 'M';
      } else if (value >= 1000) {
        return (value / 1000).toFixed(1) + 'K';
      }
      return value.toString();
  }
};
</script>

<style scoped>
.progress {
  height: 3px;
  border-radius: 3px;
}

.progress-bar {
  border-radius: 3px;
}
</style>