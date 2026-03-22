<template>
  <div class="team-detail-skeleton row g-5 g-xl-8">
    <!-- Main Content -->
    <div class="col-xl-8">
      <div class="card mb-5 mb-xl-8">
        <div class="card-body">
          <!-- Header with Avatar and Name -->
          <div class="d-flex align-items-center mb-7">
            <!-- Avatar -->
            <div class="shimmer symbol symbol-100px symbol-circle me-5"></div>

            <!-- Name and Role -->
            <div class="flex-grow-1">
              <div class="shimmer mb-3" style="height: 32px; width: 250px; border-radius: 4px;"></div>
              <div class="shimmer mb-2" style="height: 20px; width: 150px; border-radius: 4px;"></div>
              <div class="shimmer" style="height: 24px; width: 80px; border-radius: 12px;"></div>
            </div>
          </div>

          <!-- Contact Info Section -->
          <div class="mb-7">
            <div class="shimmer mb-4" style="height: 24px; width: 150px; border-radius: 4px;"></div>
            <div class="d-flex align-items-center mb-3">
              <div class="shimmer me-3" style="height: 20px; width: 20px; border-radius: 50%;"></div>
              <div class="shimmer" style="height: 16px; width: 200px; border-radius: 4px;"></div>
            </div>
            <div class="d-flex align-items-center mb-3">
              <div class="shimmer me-3" style="height: 20px; width: 20px; border-radius: 50%;"></div>
              <div class="shimmer" style="height: 16px; width: 150px; border-radius: 4px;"></div>
            </div>
          </div>

          <!-- Biography Section -->
          <div class="mb-7">
            <div class="shimmer mb-3" style="height: 24px; width: 120px; border-radius: 4px;"></div>
            <div class="shimmer mb-2" style="height: 14px; width: 100%; border-radius: 4px;"></div>
            <div class="shimmer mb-2" style="height: 14px; width: 95%; border-radius: 4px;"></div>
            <div class="shimmer mb-2" style="height: 14px; width: 90%; border-radius: 4px;"></div>
            <div class="shimmer" style="height: 14px; width: 85%; border-radius: 4px;"></div>
          </div>

          <!-- Social Links Section -->
          <div class="mb-7">
            <div class="shimmer mb-3" style="height: 24px; width: 140px; border-radius: 4px;"></div>
            <div class="d-flex gap-2">
              <div v-for="i in 4" :key="i" class="shimmer" style="height: 40px; width: 40px; border-radius: 6px;"></div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="d-flex gap-3">
            <div class="shimmer" style="height: 44px; width: 100px; border-radius: 6px;"></div>
            <div class="shimmer" style="height: 44px; width: 100px; border-radius: 6px;"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sidebar -->
    <div class="col-xl-4">
      <!-- Details Card -->
      <div class="card mb-5 mb-xl-8">
        <div class="card-header border-0">
          <div class="shimmer" style="height: 24px; width: 130px; border-radius: 4px;"></div>
        </div>
        <div class="card-body pt-0">
          <div v-for="i in 4" :key="i" class="mb-7">
            <div class="shimmer mb-2" style="height: 16px; width: 100px; border-radius: 4px;"></div>
            <div class="shimmer" style="height: 20px; width: 150px; border-radius: 4px;"></div>
          </div>
        </div>
      </div>

      <!-- Quick Actions Card -->
      <div class="card">
        <div class="card-header border-0">
          <div class="shimmer" style="height: 24px; width: 140px; border-radius: 4px;"></div>
        </div>
        <div class="card-body pt-0">
          <div class="d-flex flex-column gap-3">
            <div v-for="i in 3" :key="i" class="shimmer" style="height: 44px; width: 100%; border-radius: 6px;"></div>
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
</style>
