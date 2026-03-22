<template>
  <div class="solutions-detail-skeleton">
    <!-- Header Skeleton -->
    <div class="d-flex justify-content-between align-items-center mb-5">
      <div>
        <div class="shimmer mb-3" style="height: 36px; width: 300px; border-radius: 4px;"></div>
        <div class="d-flex gap-3">
          <div class="shimmer" style="height: 24px; width: 100px; border-radius: 12px;"></div>
        </div>
      </div>
    </div>

    <div class="row g-5">
      <!-- Main Content Column -->
      <div class="col-xl-8">
        <!-- Hero Image Card Skeleton -->
        <div class="card mb-5">
          <div class="shimmer" style="height: 400px; border-radius: 8px;"></div>
        </div>

        <!-- Basic Information Card Skeleton -->
        <div class="card mb-5">
          <div class="card-header border-0 pt-5">
            <div class="shimmer" style="height: 24px; width: 180px;"></div>
          </div>
          <div class="card-body py-3">
            <div v-for="i in 4" :key="`basic-${i}`" class="mb-7">
              <div class="shimmer mb-2" style="height: 18px; width: 100px;"></div>
              <div class="shimmer" style="height: 24px; width: 70%;"></div>
            </div>
          </div>
        </div>

        <!-- Features Card Skeleton -->
        <div class="card mb-5">
          <div class="card-header border-0 pt-5">
            <div class="shimmer" style="height: 24px; width: 150px;"></div>
          </div>
          <div class="card-body py-3">
            <div v-for="i in 3" :key="`feature-${i}`" class="d-flex gap-4 mb-5">
              <div class="shimmer" style="height: 48px; width: 48px; border-radius: 8px;"></div>
              <div class="flex-grow-1">
                <div class="shimmer mb-2" style="height: 20px; width: 200px;"></div>
                <div class="shimmer" style="height: 14px; width: 100%;"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Benefits Card Skeleton -->
        <div class="card">
          <div class="card-header border-0 pt-5">
            <div class="shimmer" style="height: 24px; width: 120px;"></div>
          </div>
          <div class="card-body py-3">
            <div v-for="i in 3" :key="`benefit-${i}`" class="d-flex gap-4 mb-5">
              <div class="shimmer" style="height: 48px; width: 48px; border-radius: 8px;"></div>
              <div class="flex-grow-1">
                <div class="shimmer mb-2" style="height: 20px; width: 200px;"></div>
                <div class="shimmer" style="height: 14px; width: 100%;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar Column -->
      <div class="col-xl-4">
        <!-- Settings Card Skeleton -->
        <div class="card mb-5">
          <div class="card-header border-0 pt-5">
            <div class="shimmer" style="height: 24px; width: 100px;"></div>
          </div>
          <div class="card-body py-3">
            <div v-for="i in 5" :key="`setting-${i}`" class="mb-7">
              <div class="shimmer mb-2" style="height: 14px; width: 80px;"></div>
              <div class="shimmer" style="height: 20px; width: 150px;"></div>
            </div>
          </div>
        </div>

        <!-- Actions Card Skeleton -->
        <div class="card">
          <div class="card-header border-0 pt-5">
            <div class="shimmer" style="height: 24px; width: 80px;"></div>
          </div>
          <div class="card-body py-3">
            <div v-for="i in 5" :key="`action-${i}`" class="mb-3">
              <div class="shimmer" style="height: 44px; width: 100%; border-radius: 6px;"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shimmer {
  background: linear-gradient(90deg,
    rgba(240, 240, 240, 0.4) 25%,
    rgba(240, 240, 240, 0.8) 37%,
    rgba(240, 240, 240, 0.4) 63%
  );
  background-size: 400% 100%;
  animation: shimmer-wave 1.8s ease-in-out infinite;
}

@keyframes shimmer-wave {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .shimmer {
    animation: none;
    background: rgba(240, 240, 240, 0.6);
  }
}
</style>
