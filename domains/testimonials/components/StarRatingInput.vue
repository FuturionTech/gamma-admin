<template>
  <div class="star-rating-input">
    <div class="d-flex align-items-center gap-2">
      <button
        v-for="star in 5"
        :key="star"
        type="button"
        class="btn btn-icon btn-sm"
        :class="getStarClass(star)"
        @click="selectRating(star)"
        @mouseenter="hoverRating = star"
        @mouseleave="hoverRating = 0"
      >
        <i class="fa-solid fa-star fs-2"></i>
      </button>
      <span v-if="showLabel" class="ms-2 text-muted">
        {{ ratingLabel }}
      </span>
    </div>
    <div v-if="error" class="text-danger fs-7 mt-1">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  modelValue?: number | null
  error?: string
  showLabel?: boolean
  disabled?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: number): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  error: '',
  showLabel: true,
  disabled: false
})

const emit = defineEmits<Emits>()

const hoverRating = ref(0)

const currentRating = computed(() => props.modelValue || 0)

const displayRating = computed(() => {
  return hoverRating.value || currentRating.value
})

const ratingLabel = computed(() => {
  const rating = displayRating.value
  if (rating === 0) return 'No rating'
  if (rating === 1) return '1 star - Very Poor'
  if (rating === 2) return '2 stars - Poor'
  if (rating === 3) return '3 stars - Average'
  if (rating === 4) return '4 stars - Good'
  if (rating === 5) return '5 stars - Excellent'
  return ''
})

const getStarClass = (star: number): string => {
  const classes = []

  if (props.disabled) {
    classes.push('btn-light', 'disabled')
  } else if (star <= displayRating.value) {
    classes.push('btn-warning', 'active')
  } else {
    classes.push('btn-light-warning')
  }

  return classes.join(' ')
}

const selectRating = (star: number) => {
  if (props.disabled) return

  // If clicking the same star, toggle it off (set to 0)
  if (star === currentRating.value) {
    emit('update:modelValue', 0)
  } else {
    emit('update:modelValue', star)
  }
}
</script>

<style scoped>
.star-rating-input .btn-icon {
  width: 40px;
  height: 40px;
  padding: 0;
  transition: all 0.2s ease;
}

.star-rating-input .btn-icon:hover:not(.disabled) {
  transform: scale(1.1);
}

.star-rating-input .btn-icon.active {
  color: #ffc700;
}

.star-rating-input .btn-icon .fa-star {
  pointer-events: none;
}
</style>
