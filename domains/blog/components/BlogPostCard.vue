<template>
  <div class="card h-100">
    <div class="card-body d-flex flex-column">
      <!-- Featured Image -->
      <div v-if="post.featured_image_url" class="mb-4">
        <img
          :src="post.featured_image_url"
          :alt="post.title"
          class="w-100 rounded"
          style="max-height: 200px; object-fit: cover;"
        />
      </div>

      <!-- Category & Status -->
      <div class="d-flex justify-content-between align-items-start mb-3">
        <span
          v-if="post.category"
          class="badge"
          :class="getCategoryBadgeClass(post.category)"
        >
          {{ post.category }}
        </span>
        <span
          class="badge"
          :class="getStatusBadgeClass(post.status)"
        >
          {{ getStatusText(post.status) }}
        </span>
      </div>

      <!-- Title -->
      <h3 class="card-title fs-4 fw-bold mb-3">
        <NuxtLink :to="`/blog/${post.id}`" class="text-gray-900 text-hover-primary">
          {{ post.title }}
        </NuxtLink>
      </h3>

      <!-- Excerpt -->
      <p v-if="post.excerpt" class="text-gray-600 mb-4 flex-grow-1">
        {{ truncate(post.excerpt, 120) }}
      </p>

      <!-- Meta Info -->
      <div class="d-flex flex-wrap gap-4 text-gray-500 fs-7 mb-4">
        <div v-if="post.author" class="d-flex align-items-center">
          <i class="ki-duotone ki-user fs-5 me-1">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          {{ getAuthorName(post.author) }}
        </div>
        <div class="d-flex align-items-center">
          <i class="ki-duotone ki-calendar fs-5 me-1">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          {{ formatDateShort(post.published_at || post.created_at) }}
        </div>
        <div class="d-flex align-items-center">
          <i class="ki-duotone ki-eye fs-5 me-1">
            <span class="path1"></span>
            <span class="path2"></span>
            <span class="path3"></span>
          </i>
          {{ formatViewCount(post.view_count) }} views
        </div>
        <div v-if="post.content" class="d-flex align-items-center">
          <i class="ki-duotone ki-time fs-5 me-1">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          {{ calculateReadingTime(post.content) }} min
        </div>
      </div>

      <!-- Tags -->
      <div v-if="post.tags && post.tags.length > 0" class="mb-4">
        <div class="d-flex flex-wrap gap-2">
          <span
            v-for="tag in post.tags.slice(0, 3)"
            :key="tag"
            class="badge badge-light"
          >
            #{{ tag }}
          </span>
          <span
            v-if="post.tags.length > 3"
            class="badge badge-light"
          >
            +{{ post.tags.length - 3 }}
          </span>
        </div>
      </div>

      <!-- Actions -->
      <div class="d-flex gap-2 mt-auto">
        <NuxtLink
          :to="`/blog/${post.id}`"
          class="btn btn-sm btn-light-primary flex-grow-1"
        >
          <i class="ki-duotone ki-eye fs-5">
            <span class="path1"></span>
            <span class="path2"></span>
            <span class="path3"></span>
          </i>
          View
        </NuxtLink>
        <NuxtLink
          :to="`/blog/${post.id}/edit`"
          class="btn btn-sm btn-light-primary flex-grow-1"
        >
          <i class="ki-duotone ki-pencil fs-5">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          Edit
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BlogPost } from '../types'
import { useBlogFormatters } from '../composables/useBlogFormatters'

const props = defineProps<{
  post: BlogPost
}>()

const {
  truncate,
  formatDateShort,
  getStatusBadgeClass,
  getStatusText,
  getCategoryBadgeClass,
  formatViewCount,
  getAuthorName,
  calculateReadingTime
} = useBlogFormatters()
</script>
