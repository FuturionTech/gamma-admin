<template>
  <MetricCard
    icon="ki-duotone ki-people"
    label="Team Members"
    :value="metrics?.total || 0"
    color="info"
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
import type { TeamMetrics } from '../../types/content';

interface Props {
  metrics?: TeamMetrics;
}

defineProps<Props>();
</script>
