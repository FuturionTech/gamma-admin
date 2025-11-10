<template>
  <div class="card card-flush h-100">
    <div class="card-body p-9">
      <!-- File Icon -->
      <div class="d-flex align-items-center mb-5">
        <div class="symbol symbol-50px me-3">
          <span class="symbol-label bg-light-primary">
            <i
              class="ki-duotone fs-2x"
              :class="getFileIconClass(certification.file_url)"
            >
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
          </span>
        </div>
        <div class="flex-grow-1">
          <span
            class="badge"
            :class="getCategoryBadgeClass(certification.category?.name || null)"
          >
            {{ certification.category?.name || 'N/A' }}
          </span>
        </div>
      </div>

      <!-- Title -->
      <div class="mb-5">
        <h3 class="fs-4 fw-bold text-gray-800 mb-2">
          {{ certification.title }}
        </h3>
        <div class="text-muted fs-7" v-if="certification.issued_date">
          Issued: {{ formatDate(certification.issued_date) }}
        </div>
      </div>

      <!-- Status and Age -->
      <div class="d-flex justify-content-between align-items-center mb-5">
        <span
          class="badge"
          :class="getStatusBadgeClass(certification.is_active)"
        >
          {{ getStatusText(certification.is_active) }}
        </span>
        <span
          v-if="certification.issued_date && isRecent(certification.issued_date)"
          class="badge badge-light-success"
        >
          Recent
        </span>
      </div>

      <!-- Actions -->
      <div class="d-flex gap-2">
        <NuxtLink
          :to="`/certifications/${certification.id}`"
          class="btn btn-sm btn-light-primary flex-grow-1"
        >
          <i class="ki-duotone ki-eye fs-2">
            <span class="path1"></span>
            <span class="path2"></span>
            <span class="path3"></span>
          </i>
          View
        </NuxtLink>
        <button
          type="button"
          class="btn btn-sm btn-icon btn-light-primary"
          @click="handleDownload"
        >
          <i class="ki-duotone ki-file-down fs-2">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Certification } from '../types'
import { useCertificationFormatters } from '../composables/useCertificationFormatters'
import { useCertificationActions } from '../composables/useCertificationActions'

interface Props {
  certification: Certification
}

const props = defineProps<Props>()

const {
  formatDate,
  getStatusBadgeClass,
  getStatusText,
  getCategoryBadgeClass,
  getFileIconClass,
  isRecent
} = useCertificationFormatters()

const { downloadCertificationFile } = useCertificationActions()

const handleDownload = () => {
  downloadCertificationFile(props.certification)
}
</script>
