<template>
  <MetricCard
    icon="ki-duotone ki-briefcase"
    label="Projects"
    :value="metrics?.total || 0"
    color="warning"
    :trend-value="`${metrics?.recentCount || 0} this month`"
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
import type { ProjectsMetrics } from '../../types/content';

interface Props {
  metrics?: ProjectsMetrics;
}

defineProps<Props>();
</script>
