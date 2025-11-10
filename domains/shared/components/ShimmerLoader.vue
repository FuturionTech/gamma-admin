<template>
  <div class="shimmer-container">
    <!-- Card Shimmer -->
    <div v-if="type === 'card'" class="shimmer-card">
      <div class="shimmer-header">
        <div class="shimmer shimmer-avatar"></div>
        <div class="shimmer-content">
          <div class="shimmer shimmer-line shimmer-line-lg mb-2"></div>
          <div class="shimmer shimmer-line shimmer-line-sm"></div>
        </div>
      </div>
      <div class="shimmer-body mt-4">
        <div class="shimmer shimmer-line mb-3"></div>
        <div class="shimmer shimmer-line mb-3"></div>
        <div class="shimmer shimmer-line shimmer-line-md"></div>
      </div>
    </div>

    <!-- Table Row Shimmer -->
    <div v-else-if="type === 'table-row'" class="shimmer-table-row">
      <div class="shimmer-cell">
        <div class="shimmer shimmer-avatar shimmer-avatar-sm me-3"></div>
        <div class="shimmer-content">
          <div class="shimmer shimmer-line shimmer-line-md mb-1"></div>
          <div class="shimmer shimmer-line shimmer-line-xs"></div>
        </div>
      </div>
      <div class="shimmer-cell">
        <div class="shimmer shimmer-line shimmer-line-lg"></div>
      </div>
      <div class="shimmer-cell">
        <div class="shimmer shimmer-badge"></div>
      </div>
      <div class="shimmer-cell">
        <div class="shimmer shimmer-line shimmer-line-sm"></div>
      </div>
      <div class="shimmer-cell">
        <div class="shimmer shimmer-button"></div>
      </div>
    </div>

    <!-- Stats Shimmer -->
    <div v-else-if="type === 'stats'" class="shimmer-stats">
      <div class="shimmer-stat" v-for="i in count" :key="i">
        <div class="shimmer shimmer-icon me-3"></div>
        <div class="shimmer-content">
          <div class="shimmer shimmer-line shimmer-line-xs mb-1"></div>
          <div class="shimmer shimmer-line shimmer-line-sm"></div>
        </div>
        <div class="shimmer shimmer-number"></div>
      </div>
    </div>

    <!-- Form Shimmer -->
    <div v-else-if="type === 'form'" class="shimmer-form">
      <div class="shimmer-form-group" v-for="i in count" :key="i">
        <div class="shimmer shimmer-label mb-2"></div>
        <div class="shimmer shimmer-input"></div>
      </div>
    </div>

    <!-- Timeline Shimmer -->
    <div v-else-if="type === 'timeline'" class="shimmer-timeline">
      <div class="shimmer-timeline-item" v-for="i in count" :key="i">
        <div class="shimmer-timeline-icon">
          <div class="shimmer shimmer-avatar shimmer-avatar-sm"></div>
        </div>
        <div class="shimmer-timeline-content">
          <div class="shimmer shimmer-line shimmer-line-lg mb-2"></div>
          <div class="shimmer shimmer-line shimmer-line-md mb-2"></div>
          <div class="shimmer shimmer-line shimmer-line-sm"></div>
        </div>
      </div>
    </div>

    <!-- List Shimmer -->
    <div v-else-if="type === 'list'" class="shimmer-list">
      <div class="shimmer-list-item" v-for="i in count" :key="i">
        <div class="shimmer shimmer-avatar shimmer-avatar-sm me-3"></div>
        <div class="shimmer-content flex-grow-1">
          <div class="shimmer shimmer-line shimmer-line-md mb-1"></div>
          <div class="shimmer shimmer-line shimmer-line-xs"></div>
        </div>
        <div class="shimmer shimmer-badge"></div>
      </div>
    </div>

    <!-- Custom Shimmer Lines -->
    <div v-else class="shimmer-custom">
      <div 
        v-for="i in count" 
        :key="i" 
        class="shimmer shimmer-line mb-3"
        :class="lineClass"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type?: 'card' | 'table-row' | 'stats' | 'form' | 'timeline' | 'list' | 'custom';
  count?: number;
  lineClass?: string;
}

withDefaults(defineProps<Props>(), {
  type: 'custom',
  count: 3,
  lineClass: 'shimmer-line-md'
});
</script>

<style scoped>
/* Base Shimmer Animation */
.shimmer {
  background: linear-gradient(90deg, 
    rgba(240, 240, 240, 0.4) 25%, 
    rgba(240, 240, 240, 0.8) 37%, 
    rgba(240, 240, 240, 0.4) 63%
  );
  background-size: 400% 100%;
  animation: shimmer-wave 1.8s ease-in-out infinite;
  border-radius: 6px;
}

@keyframes shimmer-wave {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Shimmer Elements */
.shimmer-line {
  height: 12px;
  border-radius: 6px;
}

.shimmer-line-xs { width: 30%; height: 10px; }
.shimmer-line-sm { width: 50%; height: 12px; }
.shimmer-line-md { width: 70%; height: 12px; }
.shimmer-line-lg { width: 90%; height: 14px; }

.shimmer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.shimmer-avatar-sm {
  width: 32px;
  height: 32px;
}

.shimmer-icon {
  width: 50px;
  height: 50px;
  border-radius: 8px;
}

.shimmer-badge {
  width: 60px;
  height: 24px;
  border-radius: 12px;
}

.shimmer-button {
  width: 80px;
  height: 36px;
  border-radius: 6px;
}

.shimmer-input {
  width: 100%;
  height: 44px;
  border-radius: 6px;
}

.shimmer-label {
  width: 120px;
  height: 16px;
  border-radius: 4px;
}

.shimmer-number {
  width: 40px;
  height: 24px;
  border-radius: 4px;
}

/* Layout Components */
.shimmer-card {
  padding: 20px;
}

.shimmer-header {
  display: flex;
  align-items: center;
}

.shimmer-content {
  flex: 1;
  margin-left: 12px;
}

.shimmer-table-row {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
}

.shimmer-cell {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0 8px;
}

.shimmer-cell:first-child {
  flex: 2;
}

.shimmer-stats {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.shimmer-stat {
  display: flex;
  align-items: center;
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}

.shimmer-form {
  max-width: 400px;
}

.shimmer-form-group {
  margin-bottom: 20px;
}

.shimmer-timeline {
  position: relative;
}

.shimmer-timeline::before {
  content: '';
  position: absolute;
  left: 16px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #f0f0f0;
}

.shimmer-timeline-item {
  display: flex;
  margin-bottom: 24px;
  position: relative;
}

.shimmer-timeline-icon {
  position: relative;
  z-index: 1;
  margin-right: 16px;
}

.shimmer-timeline-content {
  flex: 1;
  padding-top: 4px;
}

.shimmer-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.shimmer-list-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .shimmer {
    background: linear-gradient(90deg, 
      rgba(60, 60, 60, 0.4) 25%, 
      rgba(80, 80, 80, 0.8) 37%, 
      rgba(60, 60, 60, 0.4) 63%
    );
  }
  
  .shimmer-table-row {
    border-bottom-color: #333;
  }
  
  .shimmer-stat,
  .shimmer-list-item {
    border-color: #333;
    background-color: rgba(255, 255, 255, 0.02);
  }
  
  .shimmer-timeline::before {
    background: #333;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .shimmer-table-row {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  
  .shimmer-cell {
    padding: 4px 0;
  }
  
  .shimmer-stats {
    gap: 12px;
  }
  
  .shimmer-stat {
    padding: 12px;
  }
}
</style> 