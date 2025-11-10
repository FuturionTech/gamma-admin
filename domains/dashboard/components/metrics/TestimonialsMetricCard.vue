<template>
  <MetricCard
    icon="ki-duotone ki-message-text-2"
    label="Testimonials"
    :value="metrics?.total || 0"
    color="warning"
    :trend-value="`${averageRating} rating`"
    :trend-label="`${metrics?.active || 0} active`"
    trend-color="success"
  >
    <div class="d-flex justify-content-between text-gray-600 fs-7">
      <span>Active: {{ metrics?.active || 0 }}</span>
      <span>Avg rating: {{ averageRating }}/5</span>
    </div>
  </MetricCard>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { TestimonialsMetrics } from '../../types/content';

interface Props {
  metrics?: TestimonialsMetrics;
}

const props = defineProps<Props>();

const averageRating = computed(() => {
  return (props.metrics?.averageRating || 0).toFixed(1);
});
</script>
