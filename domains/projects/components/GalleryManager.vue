<template>
  <div class="gallery-manager">
    <!-- Upload Button -->
    <div class="mb-5">
      <label class="btn btn-primary">
        <i class="ki-duotone ki-file-up fs-2">
          <span class="path1"></span>
          <span class="path2"></span>
        </i>
        Add Images
        <input
          type="file"
          multiple
          accept="image/*"
          class="d-none"
          @change="handleFileSelect"
        />
      </label>
      <div class="form-text">
        Accepted formats: JPG, PNG, WebP. Max 5MB per image.
      </div>
    </div>

    <!-- Images Grid -->
    <div v-if="images.length > 0" class="gallery-grid">
      <div class="row g-4">
        <div
          v-for="(image, index) in images"
          :key="index"
          class="col-md-3 col-sm-4 col-6"
        >
          <div class="card card-flush position-relative">
            <!-- Image Preview -->
            <div class="card-img-top position-relative">
              <img
                :src="image"
                :alt="`Gallery image ${index + 1}`"
                class="w-100"
                style="height: 150px; object-fit: cover;"
              />

              <!-- Overlay Actions -->
              <div
                class="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50 opacity-0 hover-opacity-100 transition"
                style="transition: opacity 0.3s ease;"
                @mouseenter="(e) => (e.currentTarget as HTMLElement).classList.add('opacity-100')"
                @mouseleave="(e) => (e.currentTarget as HTMLElement).classList.remove('opacity-100')"
              >
                <button
                  type="button"
                  class="btn btn-sm btn-icon btn-light-danger"
                  @click="removeImage(index)"
                  title="Delete"
                >
                  <i class="ki-duotone ki-trash fs-2">
                    <span class="path1"></span>
                    <span class="path2"></span>
                    <span class="path3"></span>
                    <span class="path4"></span>
                    <span class="path5"></span>
                  </i>
                </button>
              </div>
            </div>

            <!-- Image Index -->
            <div class="card-footer text-center py-2">
              <span class="badge badge-light">{{ index + 1 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="text-center py-10 border border-dashed border-gray-300 rounded"
    >
      <i class="ki-duotone ki-file-added fs-3x text-gray-400 mb-3">
        <span class="path1"></span>
        <span class="path2"></span>
      </i>
      <div class="text-gray-600 fw-semibold fs-6">
        No images in gallery
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue: string[]
}

interface Emits {
  (e: 'update:modelValue', value: string[]): void
  (e: 'filesAdded', files: File[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const images = ref<string[]>([...props.modelValue])

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  images.value = [...newValue]
}, { deep: true })

// Watch for internal changes and emit
watch(images, (newValue) => {
  emit('update:modelValue', newValue)
}, { deep: true })

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files

  if (!files || files.length === 0) return

  // Validate file types and sizes
  const validFiles: File[] = []
  const maxSizeInBytes = 5 * 1024 * 1024 // 5MB

  for (let i = 0; i < files.length; i++) {
    const file = files[i]

    // Check file type
    if (!file.type.startsWith('image/')) {
      console.warn(`File ${file.name} is not an image`)
      continue
    }

    // Check file size
    if (file.size > maxSizeInBytes) {
      console.warn(`File ${file.name} exceeds 5MB`)
      continue
    }

    validFiles.push(file)
  }

  if (validFiles.length === 0) {
    return
  }

  // Emit files for parent to handle upload
  emit('filesAdded', validFiles)

  // Create preview URLs
  const previews = validFiles.map(file => URL.createObjectURL(file))
  images.value.push(...previews)

  // Clear input
  target.value = ''
}

const removeImage = (index: number) => {
  // Revoke object URL to free memory
  const imageUrl = images.value[index]
  if (imageUrl.startsWith('blob:')) {
    URL.revokeObjectURL(imageUrl)
  }

  images.value.splice(index, 1)
}
</script>

<style scoped>
.hover-opacity-100:hover {
  opacity: 1 !important;
}

.transition {
  transition: opacity 0.3s ease;
}
</style>
