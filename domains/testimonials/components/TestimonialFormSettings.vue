<template>
  <div class="testimonial-form-settings">
    <!-- Image Upload -->
    <div class="mb-7">
      <label class="form-label">Photo</label>

      <!-- Current Image Preview -->
      <div v-if="imagePreview" class="mb-3">
        <div class="image-preview-wrapper position-relative d-inline-block">
          <img
            :src="imagePreview"
            class="rounded-circle"
            style="width: 120px; height: 120px; object-fit: cover;"
            alt="Testimonial image preview"
          />
          <button
            type="button"
            class="btn btn-icon btn-sm btn-danger position-absolute top-0 end-0"
            @click="handleImageRemove"
          >
            <i class="ki-duotone ki-cross fs-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
          </button>
        </div>
      </div>

      <!-- Upload Button -->
      <div v-else class="mb-3">
        <div class="image-placeholder d-flex align-items-center justify-content-center bg-light rounded-circle" style="width: 120px; height: 120px;">
          <i class="ki-duotone ki-user fs-3x text-gray-400">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
        </div>
      </div>

      <input
        type="file"
        ref="fileInput"
        class="d-none"
        accept="image/png, image/jpeg, image/jpg, image/gif"
        @change="handleImageChange"
      />

      <button
        type="button"
        class="btn btn-light-primary btn-sm"
        @click="triggerFileInput"
      >
        <i class="ki-duotone ki-cloud-upload fs-2">
          <span class="path1"></span>
          <span class="path2"></span>
        </i>
        {{ imagePreview ? 'Change Photo' : 'Upload Photo' }}
      </button>

      <div class="form-text" v-if="!errors.image_url">
        Profile photo of the person (optional, PNG, JPG, max 2MB)
      </div>
      <div v-if="errors.image_url" class="text-danger fs-7 mt-1">
        {{ errors.image_url }}
      </div>
    </div>

    <!-- Order -->
    <div class="mb-7">
      <label class="form-label">Order</label>
      <InputNumber
        :modelValue="modelValue.order || 0"
        @update:modelValue="updateField('order', $event)"
        placeholder="0"
        :error="errors.order"
        :min="0"
      />
      <div class="form-text" v-if="!errors.order">
        Display order (lower numbers appear first)
      </div>
    </div>

    <!-- Active Status -->
    <div class="mb-7">
      <div class="form-check form-switch form-check-custom form-check-solid">
        <input
          class="form-check-input"
          type="checkbox"
          :checked="modelValue.is_active"
          @change="updateField('is_active', ($event.target as HTMLInputElement).checked)"
          id="testimonial-active-switch"
        />
        <label class="form-check-label" for="testimonial-active-switch">
          Active
        </label>
      </div>
      <div class="form-text">
        Enable or disable this testimonial on the website
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { TestimonialFormData } from '../types'

const props = defineProps<{
  modelValue: TestimonialFormData
  errors: Record<string, string>
  imagePreview?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: TestimonialFormData]
  'imageChanged': [file: File]
  'imageRemoved': []
}>()

const fileInput = ref<HTMLInputElement | null>(null)

const updateField = (field: keyof TestimonialFormData, value: any) => {
  const updated = { ...props.modelValue, [field]: value }
  emit('update:modelValue', updated)
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif']
    if (!validTypes.includes(file.type)) {
      alert('Invalid file format. Please select a PNG, JPG, or GIF image.')
      return
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024 // 2MB
    if (file.size > maxSize) {
      alert('File size is too large. Maximum 2MB.')
      return
    }

    emit('imageChanged', file)
  }
}

const handleImageRemove = () => {
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  emit('imageRemoved')
}
</script>

<style scoped>
.image-preview-wrapper .btn-danger {
  margin-top: -10px;
  margin-right: -10px;
}
</style>
