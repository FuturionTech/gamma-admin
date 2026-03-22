<template>
  <div class="card border-top border-3 border-gray-300">
    <div class="card-body">
      <div class="d-flex align-items-center mb-3">
        <div class="shimmer shimmer-circle me-3" style="width: 48px; height: 48px;"></div>
        <div class="flex-grow-1">
          <div class="shimmer shimmer-text mb-2" style="height: 32px; width: 80px;"></div>
          <div class="shimmer shimmer-text" style="height: 18px; width: 120px;"></div>
        </div>
      </div>

      <!-- Secondary metrics -->
      <div class="mb-3">
        <div class="d-flex justify-content-between">
          <div class="shimmer shimmer-text" style="height: 14px; width: 60px;"></div>
          <div class="shimmer shimmer-text" style="height: 14px; width: 60px;"></div>
        </div>
      </div>

      <!-- Trend indicator -->
      <div class="d-flex align-items-center">
        <div class="shimmer shimmer-badge me-2" style="height: 24px; width: 80px;"></div>
        <div class="shimmer shimmer-text" style="height: 14px; width: 70px;"></div>
      </div>
    </div>
  </div>
</template>

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
  border-radius: 4px;
}

.shimmer-badge {
  border-radius: 12px;
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
