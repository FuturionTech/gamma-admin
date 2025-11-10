<template>
  <tbody>
    <tr v-for="i in rows" :key="i">
      <td v-if="hasCheckbox">
        <div class="skeleton skeleton-checkbox"></div>
      </td>
      <td v-for="(col, index) in columns" :key="index">
        <div
          class="skeleton skeleton-text"
          :style="{ height: '16px', width: getColumnWidth(index) }"
        ></div>
      </td>
      <td v-if="hasActions">
        <div class="d-flex gap-2">
          <div class="skeleton skeleton-icon"></div>
          <div class="skeleton skeleton-icon"></div>
          <div class="skeleton skeleton-icon"></div>
        </div>
      </td>
    </tr>
  </tbody>
</template>

<script setup lang="ts">
const props = defineProps({
  rows: {
    type: Number,
    default: 5
  },
  columns: {
    type: Number,
    default: 5
  },
  hasCheckbox: {
    type: Boolean,
    default: false
  },
  hasActions: {
    type: Boolean,
    default: true
  }
})

const getColumnWidth = (index: number): string => {
  // Vary the width to make it look more realistic
  const widths = ['60%', '80%', '70%', '90%', '65%', '75%', '85%']
  return widths[index % widths.length]
}
</script>

<style scoped>
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border-radius: 4px;
}

.skeleton-text {
  height: 16px;
  display: inline-block;
}

.skeleton-checkbox {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

.skeleton-icon {
  width: 32px;
  height: 32px;
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
