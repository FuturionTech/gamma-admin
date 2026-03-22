<script setup lang="ts">
export interface StackedSegment {
  label: string
  value: number
  color: string
}

const props = defineProps<{
  segments: StackedSegment[]
  title?: string
}>()

const total = computed(() => props.segments.reduce((sum, s) => sum + s.value, 0))

const segmentsWithPct = computed(() => {
  if (total.value === 0) return []
  return props.segments
    .filter(s => s.value > 0)
    .map(s => ({
      ...s,
      percentage: ((s.value / total.value) * 100).toFixed(1)
    }))
    .sort((a, b) => b.value - a.value)
})
</script>

<template>
  <div class="stacked-bar-wrapper mb-4">
    <div v-if="title" class="d-flex align-items-center justify-content-between mb-2">
      <span class="fw-semibold text-gray-700 fs-7">{{ title }}</span>
    </div>

    <!-- The stacked bar -->
    <div class="d-flex rounded-2 overflow-hidden" style="height: 28px;">
      <div
        v-for="(seg, idx) in segmentsWithPct"
        :key="idx"
        :style="{
          width: seg.percentage + '%',
          backgroundColor: seg.color,
          minWidth: parseFloat(seg.percentage) > 3 ? '0' : '4px',
          transition: 'width 0.5s ease'
        }"
        class="d-flex align-items-center justify-content-center"
        :title="`${seg.label}: ${seg.percentage}%`"
      >
        <span
          v-if="parseFloat(seg.percentage) > 8"
          class="text-white fw-semibold fs-9 text-truncate px-1"
        >
          {{ seg.percentage }}%
        </span>
      </div>
    </div>

    <!-- Legend -->
    <div class="d-flex flex-wrap gap-3 mt-2">
      <div
        v-for="(seg, idx) in segmentsWithPct"
        :key="idx"
        class="d-flex align-items-center gap-1"
      >
        <span
          class="rounded-circle d-inline-block"
          :style="{ width: '8px', height: '8px', backgroundColor: seg.color }"
        ></span>
        <span class="text-gray-600 fs-8">{{ seg.label }}</span>
        <span class="text-gray-500 fs-9">({{ seg.percentage }}%)</span>
      </div>
    </div>
  </div>
</template>
