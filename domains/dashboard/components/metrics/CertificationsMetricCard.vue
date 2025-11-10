<template>
  <MetricCard
    icon="ki-duotone ki-medal-star"
    label="Certifications"
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
import type { CertificationsMetrics } from '../../types/content';

interface Props {
  metrics?: CertificationsMetrics;
}

defineProps<Props>();
</script>
