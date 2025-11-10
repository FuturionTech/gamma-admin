<template>
  <div class="tech-tag-input">
    <!-- Input Field -->
    <div class="position-relative">
      <input
        ref="inputRef"
        type="text"
        v-model="inputValue"
        @keydown.enter.prevent="addTag"
        @keydown.tab="addTagOnTab"
        @keydown.delete="handleBackspace"
        @input="handleInput"
        @focus="showSuggestions = true"
        class="form-control"
        :class="{ 'is-invalid': error }"
        :placeholder="placeholder"
      />

      <!-- Suggestions Dropdown -->
      <div
        v-if="showSuggestions && filteredSuggestions.length > 0"
        class="position-absolute w-100 mt-1 bg-white border rounded shadow-sm"
        style="z-index: 1000; max-height: 200px; overflow-y: auto;"
      >
        <div
          v-for="(suggestion, index) in filteredSuggestions"
          :key="index"
          class="suggestion-item px-4 py-2 cursor-pointer hover-bg-light"
          @click="selectSuggestion(suggestion)"
        >
          {{ suggestion }}
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="invalid-feedback d-block">
      {{ error }}
    </div>

    <!-- Hint -->
    <div class="form-text" v-if="hint">
      {{ hint }}
    </div>

    <!-- Tags Display -->
    <div v-if="tags.length > 0" class="tags-container mt-3 d-flex flex-wrap gap-2">
      <span
        v-for="(tag, index) in tags"
        :key="index"
        class="badge badge-lg badge-light-primary d-flex align-items-center gap-2"
      >
        {{ tag }}
        <button
          type="button"
          class="btn btn-icon btn-sm btn-active-light-primary p-0"
          @click="removeTag(index)"
          style="width: 16px; height: 16px;"
        >
          <i class="ki-duotone ki-cross fs-3">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
        </button>
      </span>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="text-muted fs-7 mt-2"
    >
      {{ emptyText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { COMMON_TECHNOLOGIES } from '../types'

interface Props {
  modelValue: string[]
  placeholder?: string
  hint?: string
  error?: string
  suggestions?: string[]
  emptyText?: string
  maxTags?: number
}

interface Emits {
  (e: 'update:modelValue', value: string[]): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Add a technology...',
  hint: 'Press Enter or Tab to add',
  emptyText: 'No technologies added',
  suggestions: () => [...COMMON_TECHNOLOGIES],
  maxTags: 20
})

const emit = defineEmits<Emits>()

const inputRef = ref<HTMLInputElement | null>(null)
const inputValue = ref('')
const tags = ref<string[]>([...props.modelValue])
const showSuggestions = ref(false)

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  tags.value = [...newValue]
}, { deep: true })

// Watch for internal changes and emit
watch(tags, (newValue) => {
  emit('update:modelValue', newValue)
}, { deep: true })

// Filter suggestions based on input
const filteredSuggestions = computed(() => {
  if (!inputValue.value) {
    return props.suggestions.filter(s => !tags.value.includes(s)).slice(0, 10)
  }

  const search = inputValue.value.toLowerCase()
  return props.suggestions
    .filter(s =>
      s.toLowerCase().includes(search) && !tags.value.includes(s)
    )
    .slice(0, 10)
})

const addTag = () => {
  const value = inputValue.value.trim()

  if (!value) return

  // Check if tag already exists
  if (tags.value.includes(value)) {
    inputValue.value = ''
    return
  }

  // Check max tags limit
  if (tags.value.length >= props.maxTags) {
    console.warn(`Maximum ${props.maxTags} tags allowed`)
    return
  }

  tags.value.push(value)
  inputValue.value = ''
  showSuggestions.value = false
}

const addTagOnTab = (event: KeyboardEvent) => {
  if (inputValue.value.trim()) {
    event.preventDefault()
    addTag()
  }
}

const removeTag = (index: number) => {
  tags.value.splice(index, 1)
}

const selectSuggestion = (suggestion: string) => {
  if (tags.value.includes(suggestion)) return

  if (tags.value.length >= props.maxTags) {
    console.warn(`Maximum ${props.maxTags} tags allowed`)
    return
  }

  tags.value.push(suggestion)
  inputValue.value = ''
  showSuggestions.value = false
  inputRef.value?.focus()
}

const handleInput = () => {
  showSuggestions.value = true
}

const handleBackspace = () => {
  if (inputValue.value === '' && tags.value.length > 0) {
    tags.value.pop()
  }
}

// Close suggestions when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.tech-tag-input')) {
    showSuggestions.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.hover-bg-light:hover {
  background-color: #f5f8fa;
}

.suggestion-item {
  transition: background-color 0.15s ease;
}

.tags-container .badge {
  padding: 0.5rem 0.75rem;
}
</style>
