<template>
  <div class="card card-flush h-100">
    <div class="card-body p-9">
      <!-- Hero Image -->
      <div class="mb-5" v-if="solution.hero_image_url">
        <img
          :src="solution.hero_image_url"
          :alt="solution.title"
          class="w-100 rounded"
          style="max-height: 150px; object-fit: cover;"
          @error="onImageError"
        />
      </div>

      <!-- Icon with Color -->
      <div class="d-flex flex-center mb-5" v-else-if="solution.icon">
        <img
          :src="solution.icon"
          :alt="solution.title"
          :style="getIconColorStyle(solution)"
          class="h-60px"
          @error="onIconError"
        />
      </div>
      <div class="d-flex flex-center mb-5" v-else>
        <i
          class="ki-duotone ki-grid-2 fs-3x"
          :style="getIconColorStyle(solution)"
        >
          <span class="path1"></span>
          <span class="path2"></span>
        </i>
      </div>

      <!-- Title & Subtitle -->
      <h3 class="fs-4 fw-bold text-gray-900 mb-2">
        {{ solution.title }}
      </h3>
      <div class="text-primary fw-semibold fs-6 mb-3" v-if="solution.subtitle">
        {{ solution.subtitle }}
      </div>

      <!-- Description -->
      <div class="text-gray-600 fs-6 mb-5" v-if="solution.description">
        {{ truncate(solution.description, 120) }}
      </div>

      <!-- Features & Benefits Count -->
      <div class="d-flex gap-3 mb-4">
        <div class="d-flex align-items-center">
          <i class="ki-duotone ki-check-circle fs-3 text-success me-2">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          <span class="text-gray-700 fs-7">
            {{ getFeatureCount(solution) }} Features
          </span>
        </div>
        <div class="d-flex align-items-center">
          <i class="ki-duotone ki-star fs-3 text-warning me-2">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          <span class="text-gray-700 fs-7">
            {{ getBenefitCount(solution) }} Benefits
          </span>
        </div>
      </div>

      <!-- Meta Info -->
      <div class="d-flex justify-content-between align-items-center mt-auto">
        <!-- Status -->
        <span class="badge" :class="getStatusBadgeClass(solution.is_active)">
          {{ getStatusText(solution.is_active) }}
        </span>

        <!-- Order -->
        <span class="text-muted fs-7">
          Order: {{ solution.order }}
        </span>
      </div>

      <!-- Actions -->
      <div class="d-flex gap-2 mt-5 pt-5 border-top border-gray-300">
        <NuxtLink
          :to="`/solutions/${solution.id}/edit`"
          class="btn btn-sm btn-light-primary flex-grow-1"
        >
          <i class="ki-duotone ki-pencil fs-3">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          Edit
        </NuxtLink>

        <button
          type="button"
          class="btn btn-sm btn-light-danger"
          @click="handleDelete"
        >
          <i class="ki-duotone ki-trash fs-3">
            <span class="path1"></span>
            <span class="path2"></span>
            <span class="path3"></span>
            <span class="path4"></span>
            <span class="path5"></span>
          </i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Solution } from '../types'
import { useSolutionFormatters } from '../composables/useSolutionFormatters'
import { useSolutionActions } from '../composables/useSolutionActions'

const props = defineProps<{
  solution: Solution
}>()

const emit = defineEmits<{
  deleted: []
}>()

const {
  truncate,
  getStatusBadgeClass,
  getStatusText,
  getIconColorStyle,
  getFeatureCount,
  getBenefitCount
} = useSolutionFormatters()

const { confirmAndDeleteSolution } = useSolutionActions()

const handleDelete = async () => {
  const deleted = await confirmAndDeleteSolution(props.solution)
  if (deleted) {
    emit('deleted')
  }
}

const onImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}

const onIconError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}
</script>
