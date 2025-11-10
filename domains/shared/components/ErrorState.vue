<template>
  <div class="card">
    <div class="card-body text-center py-20">
      <div class="mb-10">
        <i class="ki-duotone ki-cross-circle fs-5x text-danger">
          <span class="path1"></span>
          <span class="path2"></span>
        </i>
      </div>
      
      <h3 class="text-gray-800 mb-7">{{ title || 'Something went wrong' }}</h3>
      
      <div class="text-gray-600 fw-semibold fs-6 mb-10">
        {{ message || 'We encountered an error while loading the data. Please try again.' }}
      </div>
      
      <div class="d-flex flex-center flex-wrap">
        <button 
          v-if="showRetry" 
          class="btn btn-primary me-3" 
          @click="$emit('retry')"
          :disabled="retrying"
        >
          <span v-if="retrying" class="spinner-border spinner-border-sm me-2"></span>
          <i v-else class="ki-duotone ki-arrows-circle fs-3 me-2">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          {{ retrying ? 'Retrying...' : 'Try Again' }}
        </button>
        
        <button 
          v-if="showRefresh" 
          class="btn btn-light-primary" 
          @click="refreshPage"
        >
          <i class="ki-duotone ki-refresh fs-3 me-2">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          Refresh Page
        </button>
      </div>
      
      <div v-if="details" class="mt-10">
        <button 
          class="btn btn-light-secondary btn-sm" 
          @click="showDetails = !showDetails"
        >
          <i class="ki-duotone ki-information fs-4 me-2">
            <span class="path1"></span>
            <span class="path2"></span>
            <span class="path3"></span>
          </i>
          {{ showDetails ? 'Hide' : 'Show' }} Details
        </button>
        
        <div v-if="showDetails" class="alert alert-secondary mt-5 text-start">
          <pre class="mb-0 fs-7">{{ details }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  title?: string;
  message?: string;
  details?: string;
  showRetry?: boolean;
  showRefresh?: boolean;
  retrying?: boolean;
}

withDefaults(defineProps<Props>(), {
  showRetry: true,
  showRefresh: true,
  retrying: false,
});

defineEmits<{
  retry: [];
}>();

const showDetails = ref(false);

const refreshPage = () => {
  window.location.reload();
};
</script> 