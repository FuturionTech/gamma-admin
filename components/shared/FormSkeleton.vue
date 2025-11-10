<template>
  <div class="form-skeleton">
    <!-- Form fields -->
    <div v-for="i in fields" :key="i" class="mb-7">
      <!-- Label -->
      <div class="skeleton skeleton-label mb-2"></div>

      <!-- Input field -->
      <div class="skeleton skeleton-input"></div>

      <!-- Helper text (optional, shown randomly) -->
      <div v-if="i % 3 === 0" class="skeleton skeleton-helper mt-2"></div>
    </div>

    <!-- Action buttons -->
    <div v-if="showActions" class="d-flex gap-3 mt-10">
      <div class="skeleton skeleton-button-primary"></div>
      <div class="skeleton skeleton-button-secondary"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  fields: {
    type: Number,
    default: 5
  },
  showActions: {
    type: Boolean,
    default: true
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

.skeleton-label {
  height: 18px;
  width: 120px;
}

.skeleton-input {
  height: 44px;
  width: 100%;
  border-radius: 6px;
}

.skeleton-helper {
  height: 14px;
  width: 200px;
}

.skeleton-button-primary {
  height: 44px;
  width: 140px;
  border-radius: 6px;
}

.skeleton-button-secondary {
  height: 44px;
  width: 100px;
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
