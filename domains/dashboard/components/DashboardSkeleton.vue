<template>
  <div class="d-flex flex-column flex-column-fluid">
    <div id="kt_app_content" class="app-content flex-column-fluid">
      <div id="kt_app_content_container" class="app-container container-fluid">
        
        <!-- Key Metrics Cards Skeleton -->
        <div class="row g-5 g-xl-8 mb-5 mb-xl-10">
          <div v-for="i in 4" :key="i" class="col-xl-3 col-md-6">
            <div class="card card-flush bgi-no-repeat bgi-size-contain bgi-position-x-end h-xl-100" 
                 :style="`background-color: ${getCardColor(i)};`">
              <div class="card-header pt-5">
                <div class="card-title d-flex flex-column">
                  <div class="shimmer-block shimmer-metric-number"></div>
                  <div class="shimmer-block shimmer-metric-label mt-2"></div>
                </div>
              </div>
              <div class="card-body d-flex align-items-end pt-0">
                <div class="d-flex align-items-center flex-column mt-3 w-100">
                  <div class="d-flex justify-content-between fw-bold fs-6 w-100 mt-auto mb-2">
                    <div class="shimmer-block shimmer-growth-label"></div>
                    <div class="shimmer-block shimmer-growth-value"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Revenue & System Health Row Skeleton -->
        <div class="row g-5 g-xl-8 mb-5 mb-xl-10">
          <!-- Revenue Card Skeleton -->
          <div class="col-xl-6">
            <div class="card card-flush h-xl-100">
              <div class="card-header pt-7">
                <div class="card-title align-items-start flex-column">
                  <div class="shimmer-block shimmer-card-title"></div>
                  <div class="shimmer-block shimmer-card-subtitle mt-1"></div>
                </div>
              </div>
              <div class="card-body pt-6">
                <div class="d-flex align-items-center mb-7">
                  <div class="symbol symbol-45px me-5">
                    <div class="shimmer-block shimmer-icon-circle"></div>
                  </div>
                  <div class="flex-grow-1">
                    <div class="shimmer-block shimmer-revenue-amount mb-2"></div>
                    <div class="shimmer-block shimmer-revenue-badge"></div>
                  </div>
                </div>
                <div class="d-flex justify-content-between">
                  <div class="shimmer-block shimmer-previous-label"></div>
                  <div class="shimmer-block shimmer-previous-amount"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- System Health Card Skeleton -->
          <div class="col-xl-6">
            <div class="card card-flush h-xl-100">
              <div class="card-header pt-7">
                <div class="card-title align-items-start flex-column">
                  <div class="shimmer-block shimmer-card-title"></div>
                  <div class="shimmer-block shimmer-card-subtitle mt-1"></div>
                </div>
              </div>
              <div class="card-body pt-6">
                <div class="d-flex align-items-center mb-7">
                  <div class="symbol symbol-45px me-5">
                    <div class="shimmer-block shimmer-health-score"></div>
                  </div>
                  <div class="flex-grow-1">
                    <div class="shimmer-block shimmer-score-label mb-2"></div>
                    <div class="shimmer-block shimmer-progress-bar"></div>
                  </div>
                </div>
                <div class="d-flex flex-stack">
                  <div class="shimmer-block shimmer-services-label"></div>
                  <div class="d-flex">
                    <div class="shimmer-block shimmer-service-badge me-2"></div>
                    <div class="shimmer-block shimmer-service-badge me-2"></div>
                    <div class="shimmer-block shimmer-service-badge"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Analytics & Activity Row Skeleton -->
        <div class="row g-5 g-xl-8 mb-5 mb-xl-10">
          <!-- Analytics Chart Skeleton -->
          <div class="col-xl-8">
            <div class="card card-flush h-xl-100">
              <div class="card-header pt-7">
                <div class="card-title align-items-start flex-column">
                  <div class="shimmer-block shimmer-card-title"></div>
                  <div class="shimmer-block shimmer-card-subtitle mt-1"></div>
                </div>
              </div>
              <div class="card-body pt-6">
                <!-- Visitor Stats Skeleton -->
                <div class="row mb-7">
                  <div class="col-6">
                    <div class="border border-gray-300 border-dashed rounded p-6">
                      <div class="shimmer-block shimmer-visitor-number mb-2"></div>
                      <div class="shimmer-block shimmer-visitor-label"></div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="border border-gray-300 border-dashed rounded p-6">
                      <div class="shimmer-block shimmer-visitor-number mb-2"></div>
                      <div class="shimmer-block shimmer-visitor-label"></div>
                    </div>
                  </div>
                </div>
                
                <!-- Device Breakdown Skeleton -->
                <div class="shimmer-block shimmer-device-title mb-4"></div>
                <div class="row">
                  <div class="col-4 text-center">
                    <div class="shimmer-block shimmer-device-percentage mb-1"></div>
                    <div class="shimmer-block shimmer-device-label"></div>
                  </div>
                  <div class="col-4 text-center">
                    <div class="shimmer-block shimmer-device-percentage mb-1"></div>
                    <div class="shimmer-block shimmer-device-label"></div>
                  </div>
                  <div class="col-4 text-center">
                    <div class="shimmer-block shimmer-device-percentage mb-1"></div>
                    <div class="shimmer-block shimmer-device-label"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Activity Skeleton -->
          <div class="col-xl-4">
            <div class="card card-flush h-xl-100">
              <div class="card-header pt-7">
                <div class="card-title align-items-start flex-column">
                  <div class="shimmer-block shimmer-card-title"></div>
                  <div class="shimmer-block shimmer-card-subtitle mt-1"></div>
                </div>
              </div>
              <div class="card-body pt-6">
                <div class="timeline timeline-border-dashed">
                  <div v-for="i in 4" :key="i" class="timeline-item">
                    <div class="timeline-line w-40px"></div>
                    <div class="timeline-icon symbol symbol-circle symbol-40px">
                      <div class="shimmer-block shimmer-activity-icon"></div>
                    </div>
                    <div class="timeline-content mb-10 mt-n1">
                      <div class="pe-3 mb-5">
                        <div class="shimmer-block shimmer-activity-title mb-2"></div>
                        <div class="shimmer-block shimmer-activity-description"></div>
                      </div>
                      <div class="d-flex align-items-center">
                        <div class="shimmer-block shimmer-activity-status me-2"></div>
                        <div class="shimmer-block shimmer-activity-time"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions Skeleton -->
        <div class="row g-5 g-xl-8">
          <div class="col-12">
            <div class="card card-flush">
              <div class="card-header pt-7">
                <div class="card-title align-items-start flex-column">
                  <div class="shimmer-block shimmer-card-title"></div>
                  <div class="shimmer-block shimmer-card-subtitle mt-1"></div>
                </div>
              </div>
              <div class="card-body pt-6">
                <div class="row g-6">
                  <div v-for="i in 4" :key="i" class="col-lg-3 col-md-6">
                    <div class="card bg-body card-xl-stretch mb-xl-8">
                      <div class="card-body">
                        <div class="shimmer-block shimmer-action-icon mb-4"></div>
                        <div class="shimmer-block shimmer-action-title mb-2"></div>
                        <div class="shimmer-block shimmer-action-description"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const getCardColor = (index: number) => {
  const colors = ['#7239EA', '#17C653', '#F1416C', '#FFC700'];
  return colors[index - 1] || '#7239EA';
};
</script>

<style scoped>
.shimmer-block {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: 0.375rem;
}

.card .shimmer-block {
  background: linear-gradient(90deg, rgba(255,255,255,0.3) 25%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0.3) 75%);
}

/* Metric Cards */
.shimmer-metric-number {
  height: 2.5rem;
  width: 4rem;
}

.shimmer-metric-label {
  height: 1rem;
  width: 6rem;
}

.shimmer-growth-label {
  height: 0.875rem;
  width: 4rem;
}

.shimmer-growth-value {
  height: 0.875rem;
  width: 2.5rem;
}

/* Cards */
.shimmer-card-title {
  height: 1.5rem;
  width: 8rem;
}

.shimmer-card-subtitle {
  height: 1rem;
  width: 6rem;
}

/* Revenue Card */
.shimmer-icon-circle {
  height: 45px;
  width: 45px;
  border-radius: 50%;
}

.shimmer-revenue-amount {
  height: 2rem;
  width: 8rem;
}

.shimmer-revenue-badge {
  height: 1.5rem;
  width: 4rem;
  border-radius: 1rem;
}

.shimmer-previous-label {
  height: 1rem;
  width: 6rem;
}

.shimmer-previous-amount {
  height: 1rem;
  width: 4rem;
}

/* System Health Card */
.shimmer-health-score {
  height: 45px;
  width: 45px;
  border-radius: 0.375rem;
}

.shimmer-score-label {
  height: 1rem;
  width: 5rem;
}

.shimmer-progress-bar {
  height: 6px;
  width: 100%;
  border-radius: 3px;
}

.shimmer-services-label {
  height: 1rem;
  width: 4rem;
}

.shimmer-service-badge {
  height: 1.5rem;
  width: 4rem;
  border-radius: 1rem;
}

/* Analytics Card */
.shimmer-visitor-number {
  height: 2.5rem;
  width: 5rem;
}

.shimmer-visitor-label {
  height: 1rem;
  width: 7rem;
}

.shimmer-device-title {
  height: 1rem;
  width: 8rem;
}

.shimmer-device-percentage {
  height: 1.25rem;
  width: 3rem;
  margin: 0 auto;
}

.shimmer-device-label {
  height: 0.875rem;
  width: 4rem;
  margin: 0 auto;
}

/* Activity Timeline */
.shimmer-activity-icon {
  height: 40px;
  width: 40px;
  border-radius: 50%;
}

.shimmer-activity-title {
  height: 1.25rem;
  width: 8rem;
}

.shimmer-activity-description {
  height: 1rem;
  width: 12rem;
}

.shimmer-activity-status {
  height: 1.25rem;
  width: 4rem;
  border-radius: 1rem;
}

.shimmer-activity-time {
  height: 1rem;
  width: 5rem;
}

/* Quick Actions */
.shimmer-action-icon {
  height: 3rem;
  width: 3rem;
}

.shimmer-action-title {
  height: 1.25rem;
  width: 10rem;
}

.shimmer-action-description {
  height: 1rem;
  width: 12rem;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>