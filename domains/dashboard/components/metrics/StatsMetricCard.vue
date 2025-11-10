<template>
  <MetricCard
    icon="ki-duotone ki-chart-line"
    label="Statistics"
    :value="metrics?.total || 0"
    color="success"
    :trend-value="`${formatNumber(metrics?.totalValue || 0)} total value`"
    :trend-label="`${metrics?.active || 0} active`"
    trend-color="success"
  >
    <div class="d-flex justify-content-between text-gray-600 fs-7">
      <span>Active: {{ metrics?.active || 0 }}</span>
      <span>Inactive: {{ metrics?.inactive || 0 }}</span>
    </div>
  </MetricCard>
</template>

<script setup lang="ts">
import type { StatsMetrics } from '../../types/content';

interface Props {
  metrics?: StatsMetrics;
}

defineProps<Props>();

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};
</script>
