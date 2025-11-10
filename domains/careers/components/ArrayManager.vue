<template>
  <div class="array-manager">
    <label v-if="label" class="form-label">
      {{ label }}
      <span v-if="required" class="text-danger">*</span>
    </label>
    <div v-if="description" class="text-muted fs-7 mb-3">{{ description }}</div>

    <!-- Items List -->
    <div class="array-items mb-3">
      <div
        v-for="(item, index) in localItems"
        :key="index"
        class="input-group mb-2"
      >
        <input
          type="text"
          v-model="localItems[index]"
          @input="emitUpdate"
          class="form-control"
          :placeholder="placeholder"
        />
        <button
          type="button"
          class="btn btn-light-danger btn-icon"
          @click="removeItem(index)"
          :disabled="localItems.length === 1 && required"
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

    <!-- Add Button -->
    <button
      type="button"
      class="btn btn-light-primary btn-sm"
      @click="addItem"
    >
      <i class="ki-duotone ki-plus fs-2"></i>
      {{ addButtonText || 'Add Item' }}
    </button>

    <!-- Validation Error -->
    <div v-if="error" class="text-danger fs-7 mt-2">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue: string[] | null
  label?: string
  description?: string
  placeholder?: string
  addButtonText?: string
  required?: boolean
  minItems?: number
  maxItems?: number
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  description: '',
  placeholder: 'Enter an item',
  addButtonText: 'Add Item',
  required: false,
  minItems: 0,
  maxItems: 50
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

// Initialize local items with at least one empty item if required
const localItems = ref<string[]>(
  props.modelValue && props.modelValue.length > 0
    ? [...props.modelValue]
    : props.required
    ? ['']
    : []
)

// Watch for external changes to modelValue
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      localItems.value = [...newValue]
    } else {
      localItems.value = props.required ? [''] : []
    }
  }
)

const addItem = () => {
  if (localItems.value.length < props.maxItems) {
    localItems.value.push('')
    emitUpdate()
  }
}

const removeItem = (index: number) => {
  // Don't allow removing if it's the last item and field is required
  if (localItems.value.length === 1 && props.required) {
    return
  }

  // Don't allow removing if we're at minItems
  if (localItems.value.length <= props.minItems) {
    return
  }

  localItems.value.splice(index, 1)
  emitUpdate()
}

const emitUpdate = () => {
  // Filter out empty strings before emitting
  const filteredItems = localItems.value.filter(item => item.trim() !== '')
  emit('update:modelValue', filteredItems)
}
</script>

<style scoped>
.array-manager {
  margin-bottom: 1rem;
}

.array-items {
  max-height: 400px;
  overflow-y: auto;
}

.input-group {
  align-items: stretch;
}

.btn-icon {
  padding: 0.5rem;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
