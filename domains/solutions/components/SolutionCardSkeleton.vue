<template>
  <div class="card card-flush h-100">
    <div class="card-body p-9">
      <!-- Image Skeleton -->
      <div class="skeleton skeleton-rect mb-5" style="height: 150px; width: 100%;"></div>

      <!-- Title Skeleton -->
      <div class="skeleton skeleton-text mb-3" style="width: 70%;"></div>
      <div class="skeleton skeleton-text mb-4" style="width: 50%;"></div>

      <!-- Description Skeleton -->
      <div class="skeleton skeleton-text mb-2" style="width: 100%;"></div>
      <div class="skeleton skeleton-text mb-5" style="width: 85%;"></div>

      <!-- Meta Skeleton -->
      <div class="d-flex gap-3 mb-4">
        <div class="skeleton skeleton-badge" style="width: 80px;"></div>
        <div class="skeleton skeleton-badge" style="width: 80px;"></div>
      </div>

      <!-- Actions Skeleton -->
      <div class="d-flex gap-2 mt-5 pt-5 border-top border-gray-300">
        <div class="skeleton skeleton-button flex-grow-1"></div>
        <div class="skeleton skeleton-button" style="width: 45px;"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}

.skeleton-text {
  height: 16px;
  margin-bottom: 8px;
}

.skeleton-rect {
  border-radius: 8px;
}

.skeleton-badge {
  height: 24px;
  border-radius: 12px;
}

.skeleton-button {
  height: 36px;
  border-radius: 6px;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
