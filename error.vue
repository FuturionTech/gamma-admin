<template>
  <div class="d-flex flex-column flex-root min-vh-100 bg-light">
    <div class="d-flex flex-column flex-center flex-column-fluid p-10">
      <!-- Error Card -->
      <div class="card shadow-sm border-0" style="max-width: 600px; width: 100%;">
        <div class="card-body text-center p-10">
          <!-- Status Code -->
          <h1 class="fw-bolder text-gray-900 mb-4" style="font-size: 6rem; line-height: 1;">
            {{ error?.statusCode || 500 }}
          </h1>

          <!-- Error Title -->
          <h3 class="fw-bold text-gray-800 mb-3">
            {{ errorTitle }}
          </h3>

          <!-- Error Message -->
          <p class="text-gray-600 fs-5 mb-8">
            {{ errorMessage }}
          </p>

          <!-- Actions -->
          <div class="d-flex justify-content-center gap-3">
            <button
              type="button"
              class="btn btn-primary"
              @click="handleGoToDashboard"
            >
              <i class="ki-duotone ki-home fs-3 me-1">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              Go to Dashboard
            </button>
            <button
              type="button"
              class="btn btn-light"
              @click="handleGoBack"
            >
              <i class="ki-duotone ki-arrow-left fs-3 me-1">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              Go Back
            </button>
          </div>
        </div>
      </div>

      <!-- Branding -->
      <div class="mt-8 text-center">
        <span class="text-gray-500 fw-semibold fs-6">
          Gamma Neutral Consulting &mdash; Admin
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const errorTitle = computed(() => {
  switch (props.error?.statusCode) {
    case 404:
      return 'Page Not Found'
    case 403:
      return 'Access Denied'
    case 401:
      return 'Unauthorized'
    case 500:
      return 'Internal Server Error'
    default:
      return 'Something Went Wrong'
  }
})

const errorMessage = computed(() => {
  if (props.error?.message && props.error.message !== String(props.error.statusCode)) {
    return props.error.message
  }

  switch (props.error?.statusCode) {
    case 404:
      return 'The page you are looking for does not exist or has been moved.'
    case 403:
      return 'You do not have permission to access this resource.'
    case 401:
      return 'Please sign in to continue.'
    case 500:
      return 'An unexpected error occurred. Please try again later.'
    default:
      return 'An error occurred while processing your request.'
  }
})

const handleGoToDashboard = () => {
  clearError({ redirect: '/dashboard' })
}

const handleGoBack = () => {
  clearError({ redirect: '/' })
}
</script>

<style scoped>
.card {
  border-radius: 1rem;
}
</style>
