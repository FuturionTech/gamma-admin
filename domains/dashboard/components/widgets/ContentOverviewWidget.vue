<template>
  <div class="card card-flush h-xl-100">
    <div class="card-header pt-7">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bold text-gray-800">Content Overview</span>
        <span class="text-gray-500 mt-1 fw-semibold fs-6">Content distribution</span>
      </h3>
    </div>
    <div class="card-body pt-6">
      <!-- Loading State -->
      <div v-if="loading" class="d-flex flex-column gap-5">
        <div v-for="i in 5" :key="i" class="d-flex flex-stack">
          <div class="d-flex align-items-center me-5 flex-grow-1">
            <div class="shimmer shimmer-circle me-4" style="width: 40px; height: 40px;"></div>
            <div class="flex-grow-1">
              <div class="shimmer shimmer-text mb-2" style="height: 16px; width: 60%;"></div>
              <div class="shimmer shimmer-text" style="height: 14px; width: 40%;"></div>
            </div>
          </div>
          <div class="d-flex align-items-center">
            <div class="shimmer shimmer-text me-3" style="height: 20px; width: 40px;"></div>
            <div class="shimmer shimmer-bar" style="height: 6px; width: 100px;"></div>
          </div>
        </div>
      </div>

      <!-- Content Distribution -->
      <div v-else>
        <!-- Content Type Breakdown -->
        <div class="mb-7">
          <div v-for="(item, index) in distribution" :key="index" class="d-flex flex-stack mb-5">
            <div class="d-flex align-items-center me-5">
              <div class="symbol symbol-40px me-4">
                <span class="symbol-label" :style="`background-color: ${item.color}20`">
                  <i class="ki-duotone ki-abstract-26 fs-2" :style="`color: ${item.color}`">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                </span>
              </div>
              <div class="flex-grow-1">
                <span class="text-gray-800 fw-bold fs-6 d-block">{{ item.label }}</span>
                <span class="text-gray-500 fw-semibold fs-7">{{ item.value }} items</span>
              </div>
            </div>
            <div class="d-flex align-items-center">
              <span class="text-gray-800 fw-bold fs-4 me-3">{{ item.percentage.toFixed(1) }}%</span>
              <div class="progress h-6px w-100px bg-light">
                <div
                  class="progress-bar"
                  :style="`width: ${item.percentage}%; background-color: ${item.color}`"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Total Content Summary -->
        <div class="border-top border-gray-300 pt-5">
          <div class="d-flex justify-content-between align-items-center">
            <span class="text-gray-600 fw-semibold fs-6">Total content</span>
            <span class="text-gray-900 fw-bold fs-2">{{ totalContent }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ContentDistribution } from '../../types/content';

interface Props {
  distribution?: ContentDistribution[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  distribution: () => [],
  loading: false,
});

const totalContent = computed(() => {
  return props.distribution?.reduce((sum, item) => sum + item.value, 0) || 0;
});
</script>

<style scoped>
.shimmer {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer-loading 1.5s ease-in-out infinite;
  border-radius: 4px;
}

.shimmer-circle {
  border-radius: 50%;
}

.shimmer-text {
  height: 16px;
  border-radius: 4px;
}

.shimmer-bar {
  border-radius: 3px;
}

@keyframes shimmer-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .shimmer {
    animation: none;
  }
}
</style>
