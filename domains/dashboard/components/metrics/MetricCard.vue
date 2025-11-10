<template>
  <div class="card border-top border-3" :class="`border-${color}`">
    <div class="card-body">
      <div class="d-flex align-items-center mb-3">
        <i :class="`${icon} fs-2x text-${color}`"></i>
        <div class="ms-3 flex-grow-1">
          <div class="fs-2hx fw-bold text-gray-900">{{ formatValue }}</div>
          <div class="text-gray-600 fs-6">{{ label }}</div>
        </div>
      </div>

      <!-- Secondary metrics -->
      <div v-if="$slots.default" class="mb-3">
        <slot />
      </div>

      <!-- Trend indicator -->
      <div class="d-flex align-items-center">
        <span :class="`badge badge-light-${trendColor} fs-7`">
          <i v-if="showTrendIcon" :class="trendIcon" class="fs-6 me-1"></i>
          {{ trendValue }}
        </span>
        <span class="text-muted ms-2 fs-7">{{ trendLabel }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  icon: string;
  label: string;
  value: number | string;
  color?: string;
  trendValue?: string;
  trendLabel?: string;
  trendColor?: string;
  showTrendIcon?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
  trendValue: '',
  trendLabel: '',
  trendColor: 'success',
  showTrendIcon: true,
});

const formatValue = computed(() => {
  if (typeof props.value === 'number') {
    return props.value.toLocaleString();
  }
  return props.value;
});

const trendIcon = computed(() => {
  if (props.trendColor === 'success') {
    return 'ki-duotone ki-arrow-up fs-6';
  } else if (props.trendColor === 'danger') {
    return 'ki-duotone ki-arrow-down fs-6';
  }
  return 'ki-duotone ki-minus fs-6';
});
</script>
