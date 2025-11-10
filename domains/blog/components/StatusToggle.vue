<template>
  <div class="status-toggle-container">
    <div class="form-check form-switch form-check-custom form-check-solid">
      <input
        class="form-check-input"
        type="checkbox"
        :checked="isDraft"
        @change="toggleStatus"
        :id="inputId"
      />
      <label class="form-check-label fw-semibold" :for="inputId">
        <span v-if="isDraft" class="text-warning">
          <i class="ki-duotone ki-file-down fs-5 me-1">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          Draft
        </span>
        <span v-else class="text-success">
          <i class="ki-duotone ki-check-circle fs-5 me-1">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          Published
        </span>
      </label>
    </div>
    <div v-if="showDescription" class="form-text mt-2">
      {{ isDraft ? 'The post is a draft and not publicly visible' : 'The post is published and publicly visible' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PostStatus } from '../types'

const props = withDefaults(defineProps<{
  modelValue: PostStatus
  showDescription?: boolean
  disabled?: boolean
}>(), {
  showDescription: true,
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: PostStatus]
}>()

const inputId = `status-toggle-${Math.random().toString(36).substring(2, 9)}`

const isDraft = computed(() => props.modelValue === 'draft')

const toggleStatus = () => {
  if (props.disabled) return

  const newStatus: PostStatus = isDraft.value ? 'published' : 'draft'
  emit('update:modelValue', newStatus)
}
</script>
