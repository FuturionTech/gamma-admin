<template>
  <MetricCard
    icon="ki-duotone ki-questionnaire-tablet"
    label="FAQs"
    :value="metrics?.total || 0"
    color="secondary"
    :trend-value="`${metrics?.recentCount || 0} this month`"
    :trend-label="`${metrics?.byCategory?.length || 0} categories`"
    trend-color="info"
  >
    <div class="d-flex justify-content-between text-gray-600 fs-7">
      <span>Active: {{ metrics?.active || 0 }}</span>
      <span>{{ topCategory }}</span>
    </div>
  </MetricCard>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { FAQsMetrics } from '../../types/content';

interface Props {
  metrics?: FAQsMetrics;
}

const props = defineProps<Props>();

const topCategory = computed(() => {
  if (!props.metrics?.byCategory || props.metrics.byCategory.length === 0) {
    return 'N/A';
  }
  const top = props.metrics.byCategory[0];
  return `${top.category}: ${top.count}`;
});
</script>
