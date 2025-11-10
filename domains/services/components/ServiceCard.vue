<template>
  <div class="card card-flush h-100">
    <div class="card-body p-9">
      <!-- Icon -->
      <div class="d-flex flex-center mb-5" v-if="service.icon">
        <img
          :src="service.icon"
          :alt="service.title"
          class="h-60px"
          @error="onImageError"
        />
      </div>
      <div class="d-flex flex-center mb-5" v-else>
        <i class="ki-duotone ki-category fs-3x text-primary">
          <span class="path1"></span>
          <span class="path2"></span>
          <span class="path3"></span>
          <span class="path4"></span>
        </i>
      </div>

      <!-- Category Badge -->
      <div class="mb-3" v-if="service.category">
        <span class="badge badge-sm" :class="getCategoryBadgeClass(service.category)">
          {{ service.category }}
        </span>
      </div>

      <!-- Title -->
      <h3 class="fs-4 fw-bold text-gray-900 mb-3">
        {{ service.title }}
      </h3>

      <!-- Description -->
      <div class="text-gray-600 fs-6 mb-5" v-if="service.description">
        {{ truncate(service.description, 120) }}
      </div>

      <!-- Meta Info -->
      <div class="d-flex justify-content-between align-items-center mt-auto">
        <!-- Status -->
        <span class="badge" :class="getStatusBadgeClass(service.is_active)">
          {{ getStatusText(service.is_active) }}
        </span>

        <!-- Order -->
        <span class="text-muted fs-7">
          Order: {{ service.order }}
        </span>
      </div>

      <!-- Actions -->
      <div class="d-flex gap-2 mt-5 pt-5 border-top border-gray-300">
        <NuxtLink
          :to="`/services/${service.id}/edit`"
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
import type { Service } from '../types'
import { useServiceFormatters } from '../composables/useServiceFormatters'
import { useServiceActions } from '../composables/useServiceActions'

const props = defineProps<{
  service: Service
}>()

const emit = defineEmits<{
  deleted: []
}>()

const {
  truncate,
  getStatusBadgeClass,
  getStatusText,
  getCategoryBadgeClass
} = useServiceFormatters()

const { confirmAndDeleteService } = useServiceActions()

const handleDelete = async () => {
  const deleted = await confirmAndDeleteService(props.service)
  if (deleted) {
    emit('deleted')
  }
}

const onImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}
</script>
