<template>
  <div class="photo-upload">
    <label class="form-label">{{ label }}</label>

    <div class="d-flex align-items-center gap-5">
      <!-- Preview -->
      <div class="symbol symbol-100px symbol-circle">
        <img
          v-if="previewUrl"
          :src="previewUrl"
          :alt="label"
        />
        <div
          v-else
          class="symbol-label fs-2 fw-bold bg-light-primary text-primary"
        >
          <i class="ki-duotone ki-user fs-2x">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
        </div>
      </div>

      <!-- Upload Controls -->
      <div class="flex-grow-1">
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="d-none"
          @change="handleFileSelect"
        />

        <div class="d-flex gap-2">
          <button
            type="button"
            class="btn btn-sm btn-light-primary"
            @click="triggerFileInput"
          >
            <i class="ki-duotone ki-cloud-upload fs-3">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            {{ previewUrl ? 'Change Photo' : 'Upload Photo' }}
          </button>

          <button
            v-if="previewUrl"
            type="button"
            class="btn btn-sm btn-light-danger"
            @click="removePhoto"
          >
            <i class="ki-duotone ki-trash fs-3">
              <span class="path1"></span>
              <span class="path2"></span>
              <span class="path3"></span>
              <span class="path4"></span>
              <span class="path5"></span>
            </i>
            Remove
          </button>
        </div>

        <div class="form-text mt-2">
          Accepted formats: JPG, PNG, GIF. Max size: 2MB
        </div>

        <div v-if="error" class="text-danger mt-2 fs-7">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue?: string | null
  label?: string
}

interface Emits {
  (e: 'update:modelValue', value: string | null): void
  (e: 'fileSelected', file: File | null): void
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Profile Picture'
})

const emit = defineEmits<Emits>()

const fileInput = ref<HTMLInputElement | null>(null)
const previewUrl = ref<string | null>(props.modelValue || null)
const error = ref<string | null>(null)

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  previewUrl.value = newValue || null
})

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  error.value = null

  // Validate file type
  if (!file.type.startsWith('image/')) {
    error.value = 'Please select a valid image'
    return
  }

  // Validate file size (2MB)
  const maxSize = 2 * 1024 * 1024
  if (file.size > maxSize) {
    error.value = 'Image size must not exceed 2MB'
    return
  }

  // Create preview URL
  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result as string
    previewUrl.value = result
    emit('update:modelValue', result)
    emit('fileSelected', file)
  }
  reader.readAsDataURL(file)
}

const removePhoto = () => {
  previewUrl.value = null
  error.value = null
  emit('update:modelValue', null)
  emit('fileSelected', null)

  // Reset file input
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>
