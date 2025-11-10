<template>
  <div class="card h-100">
    <!-- Featured Image -->
    <div class="card-img-top position-relative" v-if="project.featured_image_url">
      <img
        :src="project.featured_image_url"
        :alt="project.title"
        class="w-100"
        style="height: 200px; object-fit: cover;"
      />
      <div class="position-absolute top-0 end-0 p-3">
        <span class="badge" :class="getStatusBadgeClass(project.status)">
          {{ getStatusText(project.status) }}
        </span>
      </div>
    </div>

    <!-- Card Body -->
    <div class="card-body d-flex flex-column">
      <!-- Industry Badge -->
      <div class="mb-3" v-if="project.industry">
        <span class="badge" :class="getIndustryBadgeClass(project.industry)">
          {{ project.industry }}
        </span>
      </div>

      <!-- Title -->
      <h3 class="card-title fs-4 fw-bold mb-3">
        <NuxtLink
          :to="`/projects/${project.id}`"
          class="text-gray-800 text-hover-primary"
        >
          {{ project.title }}
        </NuxtLink>
      </h3>

      <!-- Client Name -->
      <div class="mb-2" v-if="project.client_name">
        <i class="ki-duotone ki-user fs-6 me-1 text-muted">
          <span class="path1"></span>
          <span class="path2"></span>
        </i>
        <span class="text-muted fs-7">{{ project.client_name }}</span>
      </div>

      <!-- Description -->
      <p class="text-gray-600 fs-6 mb-4" v-if="project.description">
        {{ truncate(project.description, 120) }}
      </p>

      <!-- Technologies -->
      <div class="mb-4" v-if="project.technologies && project.technologies.length > 0">
        <div class="d-flex flex-wrap gap-2">
          <span
            v-for="(tech, index) in project.technologies.slice(0, 4)"
            :key="index"
            class="badge badge-light-primary"
          >
            {{ tech }}
          </span>
          <span
            v-if="project.technologies.length > 4"
            class="badge badge-light"
          >
            +{{ project.technologies.length - 4 }}
          </span>
        </div>
      </div>

      <!-- Spacer -->
      <div class="flex-grow-1"></div>

      <!-- Footer -->
      <div class="d-flex justify-content-between align-items-center mt-auto pt-4 border-top">
        <!-- Completion Date -->
        <div v-if="project.completion_date">
          <i class="ki-duotone ki-calendar fs-6 me-1 text-muted">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          <span class="text-muted fs-7">{{ formatDateShort(project.completion_date) }}</span>
        </div>

        <!-- Actions -->
        <div class="d-flex gap-2">
          <NuxtLink
            :to="`/projects/${project.id}`"
            class="btn btn-sm btn-light-primary"
          >
            <i class="ki-duotone ki-eye fs-4">
              <span class="path1"></span>
              <span class="path2"></span>
              <span class="path3"></span>
            </i>
          </NuxtLink>
          <NuxtLink
            :to="`/projects/${project.id}/edit`"
            class="btn btn-sm btn-light"
          >
            <i class="ki-duotone ki-pencil fs-4">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Project } from '../types'
import { useProjectFormatters } from '../composables/useProjectFormatters'

interface Props {
  project: Project
}

defineProps<Props>()

const {
  truncate,
  formatDateShort,
  getStatusBadgeClass,
  getStatusText,
  getIndustryBadgeClass
} = useProjectFormatters()
</script>
