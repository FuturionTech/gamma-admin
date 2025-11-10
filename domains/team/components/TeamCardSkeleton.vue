<template>
  <div class="card h-100">
    <div class="card-body d-flex flex-column">
      <!-- Profile Picture Skeleton -->
      <div class="text-center mb-5">
        <div class="skeleton skeleton-circle mx-auto mb-5" style="width: 100px; height: 100px;"></div>
        <div class="skeleton skeleton-text mx-auto mb-2" style="width: 60%;"></div>
        <div class="skeleton skeleton-text mx-auto mb-3" style="width: 40%;"></div>
        <div class="skeleton skeleton-badge mx-auto" style="width: 60px;"></div>
      </div>

      <!-- Contact Info Skeleton -->
      <div class="mb-5 flex-grow-1">
        <div class="d-flex align-items-center mb-3">
          <div class="skeleton skeleton-icon me-2"></div>
          <div class="skeleton skeleton-text flex-grow-1"></div>
        </div>
        <div class="d-flex align-items-center mb-3">
          <div class="skeleton skeleton-icon me-2"></div>
          <div class="skeleton skeleton-text flex-grow-1"></div>
        </div>
        <div class="skeleton skeleton-text mt-4"></div>
        <div class="skeleton skeleton-text mt-2"></div>
      </div>

      <!-- Actions Skeleton -->
      <div class="d-flex justify-content-between pt-4 border-top">
        <div class="skeleton skeleton-button" style="width: 45%;"></div>
        <div class="skeleton skeleton-button" style="width: 45%;"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
}

.skeleton-circle {
  border-radius: 50%;
}

.skeleton-text {
  height: 16px;
  margin-bottom: 8px;
}

.skeleton-badge {
  height: 24px;
}

.skeleton-icon {
  width: 24px;
  height: 24px;
}

.skeleton-button {
  height: 32px;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
