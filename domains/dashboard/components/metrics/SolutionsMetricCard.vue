<template>
  <MetricCard
    icon="ki-duotone ki-abstract-26"
    label="Solutions"
    :value="metrics?.total || 0"
    color="success"
    :trend-value="`${metrics?.totalFeatures || 0} features`"
    :trend-label="`${metrics?.totalBenefits || 0} benefits`"
    trend-color="info"
  >
    <div class="d-flex justify-content-between text-gray-600 fs-7">
      <span>Active: {{ metrics?.active || 0 }}</span>
      <span>Inactive: {{ metrics?.inactive || 0 }}</span>
    </div>
  </MetricCard>
</template>

<script setup lang="ts">
import type { SolutionsMetrics } from '../../types/content';

interface Props {
  metrics?: SolutionsMetrics;
}

defineProps<Props>();
</script>
