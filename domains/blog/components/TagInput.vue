<template>
  <div class="tag-input-container">
    <div class="form-control form-control-solid d-flex flex-wrap gap-2 align-items-center p-3">
      <!-- Display existing tags -->
      <span
        v-for="(tag, index) in tags"
        :key="index"
        class="badge badge-primary d-flex align-items-center gap-2"
      >
        {{ tag }}
        <i
          class="ki-duotone ki-cross fs-7 cursor-pointer"
          @click="removeTag(index)"
        >
          <span class="path1"></span>
          <span class="path2"></span>
        </i>
      </span>

      <!-- Input for new tag -->
      <input
        ref="inputRef"
        v-model="currentTag"
        type="text"
        class="tag-input flex-grow-1 border-0 outline-0"
        :placeholder="tags.length === 0 ? placeholder : ''"
        @keydown.enter.prevent="addTag"
        @keydown.comma.prevent="addTag"
        @keydown.backspace="handleBackspace"
      />
    </div>

    <!-- Help text -->
    <div v-if="showHelp" class="form-text">
      {{ helpText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: string[]
  placeholder?: string
  showHelp?: boolean
  helpText?: string
  maxTags?: number
}>(), {
  placeholder: 'Add tags...',
  showHelp: true,
  helpText: 'Press Enter or comma to add a tag',
  maxTags: 10
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const currentTag = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

const tags = computed({
  get: () => props.modelValue || [],
  set: (value) => emit('update:modelValue', value)
})

const addTag = () => {
  const trimmed = currentTag.value.trim()

  if (!trimmed) {
    return
  }

  // Check if already exists
  if (tags.value.includes(trimmed)) {
    currentTag.value = ''
    return
  }

  // Check max tags
  if (tags.value.length >= props.maxTags) {
    alert(`You cannot add more than ${props.maxTags} tags`)
    return
  }

  // Add tag
  tags.value = [...tags.value, trimmed]
  currentTag.value = ''
}

const removeTag = (index: number) => {
  tags.value = tags.value.filter((_, i) => i !== index)
}

const handleBackspace = () => {
  if (currentTag.value === '' && tags.value.length > 0) {
    removeTag(tags.value.length - 1)
  }
}
</script>

<style scoped>
.tag-input-container {
  width: 100%;
}

.tag-input {
  min-width: 150px;
  outline: none;
  background: transparent;
}

.tag-input:focus {
  outline: none;
}

.cursor-pointer {
  cursor: pointer;
}

.badge {
  font-size: 0.875rem;
  padding: 0.5rem 0.75rem;
}
</style>
