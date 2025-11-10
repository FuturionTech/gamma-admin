<template>
  <MetricCard
    icon="ki-duotone ki-suitcase"
    label="Career Opportunities"
    :value="metrics?.total || 0"
    color="info"
    :trend-value="`${metrics?.openPositions || 0} open positions`"
    :trend-label="`${metrics?.recentCount || 0} this month`"
    trend-color="success"
  >
    <div class="d-flex justify-content-between text-gray-600 fs-7">
      <span>Active: {{ metrics?.active || 0 }}</span>
      <span>Closed: {{ metrics?.inactive || 0 }}</span>
    </div>
  </MetricCard>
</template>

<script setup lang="ts">
import type { CareersMetrics } from '../../types/content';

interface Props {
  metrics?: CareersMetrics;
}

defineProps<Props>();
</script>
