<template>
  <NuxtLink v-if="link" :to="link" class="card card-flush bgi-no-repeat bgi-size-contain bgi-position-x-end h-xl-100 text-decoration-none" :style="cardStyle">
    <div class="card-header pt-5 pb-0 border-0">
      <div class="card-title d-flex flex-column">
        <span class="fs-2hx fw-bold text-white me-2 lh-1 ls-n2">{{ count }}</span>
        <span class="text-white opacity-75 pt-1 fw-semibold fs-6">{{ title }}</span>
      </div>
    </div>
    <div v-if="subtitle" class="card-body d-flex align-items-end pt-0 pb-5">
      <span class="text-white opacity-75 fw-semibold fs-7">{{ subtitle }}</span>
    </div>
  </NuxtLink>
  <div v-else class="card card-flush bgi-no-repeat bgi-size-contain bgi-position-x-end h-xl-100" :style="cardStyle">
    <div class="card-header pt-5 pb-0 border-0">
      <div class="card-title d-flex flex-column">
        <span class="fs-2hx fw-bold text-white me-2 lh-1 ls-n2">{{ count }}</span>
        <span class="text-white opacity-75 pt-1 fw-semibold fs-6">{{ title }}</span>
      </div>
    </div>
    <div v-if="subtitle" class="card-body d-flex align-items-end pt-0 pb-5">
      <span class="text-white opacity-75 fw-semibold fs-7">{{ subtitle }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title: string
  count: number
  icon?: string
  color?: string
  link?: string
  subtitle?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: '#7239EA',
  icon: '',
  link: '',
  subtitle: '',
})

const cardStyle = computed(() => ({
  backgroundColor: props.color,
}))
</script>
