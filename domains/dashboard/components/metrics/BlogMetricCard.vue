<template>
  <MetricCard
    icon="ki-duotone ki-book"
    label="Blog Posts"
    :value="metrics?.total || 0"
    color="danger"
    :trend-value="`${formatNumber(metrics?.totalViews || 0)} views`"
    :trend-label="`${metrics?.published || 0} published`"
    trend-color="success"
  >
    <div class="d-flex justify-content-between text-gray-600 fs-7">
      <span>Published: {{ metrics?.published || 0 }}</span>
      <span>Draft: {{ metrics?.draft || 0 }}</span>
    </div>
  </MetricCard>
</template>

<script setup lang="ts">
import type { BlogMetrics } from '../../types/content';

interface Props {
  metrics?: BlogMetrics;
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
