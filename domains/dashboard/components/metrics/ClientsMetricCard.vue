<template>
  <MetricCard
    icon="ki-duotone ki-profile-user"
    label="Clients"
    :value="metrics?.total || 0"
    color="warning"
    :trend-value="`${metrics?.recentCount || 0} this month`"
    :trend-label="`${metrics?.byIndustry?.length || 0} industries`"
    trend-color="info"
  >
    <div class="d-flex justify-content-between text-gray-600 fs-7">
      <span>Active: {{ metrics?.active || 0 }}</span>
      <span>{{ topIndustry }}</span>
    </div>
  </MetricCard>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ClientsMetrics } from '../../types/content';

interface Props {
  metrics?: ClientsMetrics;
}

const props = defineProps<Props>();

const topIndustry = computed(() => {
  if (!props.metrics?.byIndustry || props.metrics.byIndustry.length === 0) {
    return 'N/A';
  }
  const top = props.metrics.byIndustry[0];
  return `${top.industry}: ${top.count}`;
});
</script>
