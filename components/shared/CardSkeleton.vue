<template>
  <div class="card card-flush h-100">
    <div class="card-body p-9">
      <!-- Icon/Image skeleton -->
      <div class="d-flex flex-center mb-5" v-if="showIcon">
        <div class="skeleton skeleton-circle" style="width: 60px; height: 60px;"></div>
      </div>

      <!-- Title skeleton -->
      <div class="skeleton skeleton-text mb-3" style="height: 24px; width: 70%;"></div>

      <!-- Description skeletons -->
      <div v-if="lines > 0" class="mb-3">
        <div
          v-for="i in lines"
          :key="i"
          class="skeleton skeleton-text mb-2"
          :style="{ height: '16px', width: i === lines ? '85%' : '100%' }"
        ></div>
      </div>

      <!-- Action buttons skeleton (optional) -->
      <div v-if="showActions" class="d-flex gap-2 mt-5">
        <div class="skeleton skeleton-button" style="height: 38px; width: 80px;"></div>
        <div class="skeleton skeleton-button" style="height: 38px; width: 80px;"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  showIcon: {
    type: Boolean,
    default: true
  },
  lines: {
    type: Number,
    default: 3
  },
  showActions: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border-radius: 4px;
}

.skeleton-circle {
  border-radius: 50%;
}

.skeleton-text {
  margin: 0;
}

.skeleton-button {
  border-radius: 6px;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton {
    animation: none;
  }
}
</style>
