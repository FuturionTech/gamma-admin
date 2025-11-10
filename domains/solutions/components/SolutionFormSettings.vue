<template>
  <div class="card card-flush">
    <div class="card-body">
      <!-- Order -->
      <div class="mb-5">
        <label class="form-label">Order</label>
        <input
          type="number"
          class="form-control"
          v-model.number="formData.order"
          placeholder="0"
          min="0"
        />
        <div class="form-text">Display order (lower = shown first)</div>
      </div>

      <!-- Is Active -->
      <div class="mb-0">
        <div class="form-check form-switch">
          <input
            class="form-check-input"
            type="checkbox"
            id="is_active"
            v-model="formData.is_active"
          />
          <label class="form-check-label" for="is_active">
            Active
          </label>
        </div>
        <div class="form-text">Enable or disable this solution on the website</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SolutionFormData } from '../types'

defineProps<{
  formData: SolutionFormData
  errors: Record<string, string>
}>()
</script>
