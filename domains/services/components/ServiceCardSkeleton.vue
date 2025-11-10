<template>
  <div class="card card-flush h-100">
    <div class="card-body p-9">
      <!-- Icon skeleton -->
      <div class="d-flex flex-center mb-5">
        <div class="skeleton skeleton-circle" style="width: 60px; height: 60px;"></div>
      </div>

      <!-- Category badge skeleton -->
      <div class="mb-3">
        <div class="skeleton skeleton-badge" style="width: 100px; height: 22px;"></div>
      </div>

      <!-- Title skeleton -->
      <div class="skeleton skeleton-text mb-3" style="height: 24px; width: 80%;"></div>

      <!-- Description skeletons -->
      <div class="mb-5">
        <div class="skeleton skeleton-text mb-2" style="height: 16px; width: 100%;"></div>
        <div class="skeleton skeleton-text mb-2" style="height: 16px; width: 100%;"></div>
        <div class="skeleton skeleton-text mb-2" style="height: 16px; width: 70%;"></div>
      </div>

      <!-- Meta info skeleton -->
      <div class="d-flex justify-content-between align-items-center mt-auto">
        <div class="skeleton skeleton-badge" style="width: 60px; height: 24px;"></div>
        <div class="skeleton skeleton-text" style="width: 60px; height: 16px;"></div>
      </div>

      <!-- Actions skeleton -->
      <div class="d-flex gap-2 mt-5 pt-5 border-top border-gray-300">
        <div class="skeleton skeleton-button flex-grow-1" style="height: 32px;"></div>
        <div class="skeleton skeleton-button" style="height: 32px; width: 40px;"></div>
      </div>
    </div>
  </div>
</template>

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

.skeleton-text,
.skeleton-badge,
.skeleton-button {
  display: inline-block;
}

.skeleton-button {
  border-radius: 6px;
}

.skeleton-badge {
  border-radius: 4px;
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
