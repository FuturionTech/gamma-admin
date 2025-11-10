<template>
  <MetricCard
    icon="ki-duotone ki-setting-2"
    label="Services"
    :value="metrics?.total || 0"
    color="primary"
    :trend-value="`${metrics?.recentCount || 0} this month`"
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
import type { ServicesMetrics } from '../../types/content';

interface Props {
  metrics?: ServicesMetrics;
}

defineProps<Props>();
</script>
