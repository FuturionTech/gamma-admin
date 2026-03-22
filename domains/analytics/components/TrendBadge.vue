<script setup lang="ts">
const props = withDefaults(defineProps<{
  value: number | null | undefined
  invertColors?: boolean
}>(), {
  invertColors: false
})

const isPositive = computed(() => (props.value ?? 0) > 1)
const isNegative = computed(() => (props.value ?? 0) < -1)
const isFlat = computed(() => !isPositive.value && !isNegative.value)

const badgeClass = computed(() => {
  if (isFlat.value) return 'badge-light text-gray-600'
  const goodDirection = props.invertColors ? isNegative.value : isPositive.value
  return goodDirection ? 'badge-light-success text-success' : 'badge-light-danger text-danger'
})

const icon = computed(() => {
  if (isFlat.value) return 'ki-minus'
  return isPositive.value ? 'ki-arrow-up' : 'ki-arrow-down'
})

const displayValue = computed(() => {
  if (props.value == null) return '--'
  return `${Math.abs(Math.round(props.value))}%`
})
</script>

<template>
  <span class="badge fs-8 fw-semibold d-inline-flex align-items-center gap-1 px-2 py-1" :class="badgeClass">
    <i class="ki-duotone fs-9" :class="icon">
      <span class="path1"></span>
      <span class="path2"></span>
    </i>
    {{ displayValue }}
  </span>
</template>
