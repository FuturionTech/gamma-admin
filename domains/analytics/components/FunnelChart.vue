<script setup lang="ts">
export interface FunnelStep {
  label: string
  count: number
}

const props = defineProps<{
  steps: FunnelStep[]
}>()

const maxCount = computed(() => {
  if (!props.steps.length) return 1
  return Math.max(...props.steps.map(s => s.count), 1)
})

const stepsWithMeta = computed(() => {
  return props.steps.map((step, idx) => {
    const widthPct = Math.max((step.count / maxCount.value) * 100, 8)
    const prevCount = idx > 0 ? props.steps[idx - 1].count : null
    let dropOff: number | null = null
    if (prevCount !== null && prevCount > 0) {
      dropOff = Math.round(((prevCount - step.count) / prevCount) * 100)
    }
    const conversionFromFirst = idx > 0 && props.steps[0].count > 0
      ? ((step.count / props.steps[0].count) * 100).toFixed(1)
      : null

    return { ...step, widthPct, dropOff, conversionFromFirst }
  })
})

const colors = ['#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6']

function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  return num.toLocaleString()
}
</script>

<template>
  <div class="funnel-chart">
    <div
      v-for="(step, idx) in stepsWithMeta"
      :key="idx"
      class="mb-3"
    >
      <!-- Drop-off indicator between steps -->
      <div v-if="step.dropOff !== null" class="d-flex align-items-center justify-content-center mb-2">
        <div class="border-start border-gray-300 me-2" style="height: 16px;"></div>
        <span class="text-gray-500 fs-8 fw-semibold">
          <i class="ki-duotone ki-arrow-down fs-9 text-gray-400 me-1">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          {{ step.dropOff }}% drop-off
        </span>
        <div class="border-start border-gray-300 ms-2" style="height: 16px;"></div>
      </div>

      <div class="d-flex align-items-center gap-3">
        <div class="flex-grow-1">
          <div
            class="rounded-2 px-3 py-2 d-flex align-items-center justify-content-between"
            :style="{
              width: step.widthPct + '%',
              backgroundColor: colors[idx] ?? colors[colors.length - 1],
              minWidth: '120px',
              transition: 'width 0.6s ease'
            }"
          >
            <span class="text-white fw-semibold fs-7 text-truncate">{{ step.label }}</span>
            <span class="text-white fw-bold fs-7 ms-2 text-nowrap">{{ formatNumber(step.count) }}</span>
          </div>
        </div>
        <div v-if="step.conversionFromFirst" class="text-gray-500 fs-8 fw-semibold text-nowrap" style="min-width: 50px;">
          {{ step.conversionFromFirst }}%
        </div>
      </div>
    </div>
  </div>
</template>
