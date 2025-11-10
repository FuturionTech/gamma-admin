<template>
  <div class="card card-flush">
    <div class="card-body">
      <!-- Icon URL -->
      <div class="mb-5">
        <label class="form-label">Icon</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.icon"
          placeholder="Icon URL or path"
        />
        <div class="form-text">Icon representing the solution</div>
      </div>

      <!-- Icon Color -->
      <div class="mb-5">
        <label class="form-label">Icon Color</label>
        <div class="d-flex align-items-center gap-3">
          <input
            type="color"
            class="form-control form-control-color"
            v-model="formData.icon_color"
            style="width: 60px; height: 40px;"
          />
          <input
            type="text"
            class="form-control"
            v-model="formData.icon_color"
            placeholder="#3B82F6"
            pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
          />
        </div>
        <div class="form-text">Hexadecimal color for the icon</div>
      </div>

      <!-- Hero Image URL -->
      <div class="mb-0">
        <label class="form-label">Hero Image</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.hero_image_url"
          placeholder="Hero image URL"
        />
        <div class="form-text">Main image for the solution</div>

        <!-- Preview -->
        <div class="mt-3" v-if="formData.hero_image_url">
          <img
            :src="formData.hero_image_url"
            alt="Preview"
            class="rounded"
            style="max-width: 100%; max-height: 200px; object-fit: cover;"
            @error="onImageError"
          />
        </div>
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

const onImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
}
</script>
