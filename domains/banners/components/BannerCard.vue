<template>
  <div class="card h-100 banner-card">
    <!-- Banner Preview Image -->
    <div class="banner-preview position-relative" :style="bannerStyle">
      <!-- Overlay -->
      <div class="banner-overlay position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-center align-items-center text-white p-6">
        <!-- Title & Subtitle -->
        <div class="text-center mb-4">
          <h2 class="banner-title fw-bold fs-1 mb-2 text-white text-shadow">
            {{ banner.title }}
          </h2>
          <p v-if="banner.subtitle" class="banner-subtitle fs-4 text-white text-shadow mb-0">
            {{ banner.subtitle }}
          </p>
        </div>

        <!-- CTA Button Preview -->
        <div v-if="hasCta(banner.cta_text, banner.cta_url)" class="cta-preview">
          <button class="btn btn-primary btn-lg">
            {{ banner.cta_text }}
          </button>
        </div>
      </div>

      <!-- Status Badge -->
      <div class="position-absolute top-0 end-0 m-3">
        <span class="badge badge-lg" :class="getStatusBadgeClass(banner.is_active)">
          {{ getStatusText(banner.is_active) }}
        </span>
      </div>

      <!-- Order Badge -->
      <div class="position-absolute top-0 start-0 m-3">
        <span class="badge badge-lg" :class="getOrderBadgeClass(banner.order)">
          #{{ banner.order + 1 }}
        </span>
      </div>
    </div>

    <div class="card-body">
      <!-- Meta Info -->
      <div class="d-flex flex-wrap gap-3 text-gray-600 fs-7 mb-3">
        <div class="d-flex align-items-center">
          <i class="ki-duotone ki-calendar fs-5 me-1">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          {{ formatDateShort(banner.created_at) }}
        </div>
        <div class="d-flex align-items-center">
          <span class="badge" :class="getCtaBadgeClass(banner.cta_text, banner.cta_url)">
            {{ getCtaStatusText(banner.cta_text, banner.cta_url) }}
          </span>
        </div>
      </div>

      <!-- CTA Details -->
      <div v-if="hasCta(banner.cta_text, banner.cta_url)" class="mb-3">
        <div class="text-gray-700 fs-7">
          <i class="ki-duotone ki-click fs-5 me-1">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          <strong>CTA:</strong> {{ banner.cta_text }}
        </div>
        <div class="text-gray-500 fs-8">
          <i class="ki-duotone ki-link fs-6 me-1">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          {{ truncate(banner.cta_url || '', 50) }}
        </div>
      </div>

      <!-- Actions -->
      <div class="d-flex gap-2 mt-4">
        <NuxtLink
          :to="`/banners/${banner.id}`"
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
          :to="`/banners/${banner.id}/edit`"
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
import { computed } from 'vue'
import type { Banner } from '../types'
import { useBannersFormatters } from '../composables/useBannersFormatters'

const props = defineProps<{
  banner: Banner
}>()

const {
  truncate,
  formatDateShort,
  getStatusBadgeClass,
  getStatusText,
  hasCta,
  getCtaBadgeClass,
  getCtaStatusText,
  formatImageUrl,
  getOrderBadgeClass
} = useBannersFormatters()

const bannerStyle = computed(() => ({
  backgroundImage: `url(${formatImageUrl(props.banner.image_url)})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  minHeight: '250px',
  position: 'relative'
}))
</script>

<style scoped>
.banner-card {
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.banner-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.banner-preview {
  border-radius: 0.475rem 0.475rem 0 0;
}

.banner-overlay {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3),
    rgba(0, 0, 0, 0.5)
  );
}

.text-shadow {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
}

.banner-title {
  max-width: 600px;
}

.banner-subtitle {
  max-width: 500px;
}

.cta-preview button {
  pointer-events: none;
}
</style>
