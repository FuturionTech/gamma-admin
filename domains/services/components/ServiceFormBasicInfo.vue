<template>
  <div class="service-form-basic-info">
    <!-- Title -->
    <div class="mb-7">
      <label class="form-label required">Title</label>
      <InputText
        :modelValue="modelValue.title"
        @update:modelValue="updateField('title', $event)"
        placeholder="Enter service title"
        :error="errors.title"
        required
        @blur="handleTitleBlur"
      />
      <div class="form-text" v-if="!errors.title">
        The title will be displayed on the website
      </div>
    </div>

    <!-- Description -->
    <div class="mb-7">
      <label class="form-label">Description</label>
      <Textarea
        :modelValue="modelValue.description || ''"
        @update:modelValue="updateField('description', $event)"
        placeholder="Enter service description"
        :error="errors.description"
        rows="5"
      />
      <div class="form-text" v-if="!errors.description">
        Full description of the service
      </div>
    </div>

    <!-- Category -->
    <div class="mb-7">
      <label class="form-label">Category</label>
      <InputText
        :modelValue="modelValue.category || ''"
        @update:modelValue="updateField('category', $event)"
        placeholder="e.g. AI, Data Engineering, Cybersecurity"
        :error="errors.category"
      />
      <div class="form-text" v-if="!errors.category">
        Service category for grouping
      </div>
    </div>

    <!-- Slug -->
    <div class="mb-7">
      <label class="form-label required">Slug</label>
      <InputText
        :modelValue="modelValue.slug || ''"
        @update:modelValue="updateField('slug', $event)"
        placeholder="Auto-generated from title"
        :error="errors.slug"
        required
      />
      <div class="form-text" v-if="!errors.slug">
        URL-friendly identifier (auto-generated if empty)
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ServiceFormData } from '../types'
import { useServiceFormatters } from '../composables/useServiceFormatters'

const props = defineProps<{
  modelValue: ServiceFormData
  errors: Record<string, string>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: ServiceFormData]
}>()

const { generateSlug } = useServiceFormatters()

const updateField = (field: keyof ServiceFormData, value: any) => {
  const updated = { ...props.modelValue, [field]: value }
  emit('update:modelValue', updated)
}

const handleTitleBlur = () => {
  // Auto-generate slug if empty
  if (!props.modelValue.slug && props.modelValue.title) {
    const slug = generateSlug(props.modelValue.title)
    updateField('slug', slug)
  }
}
</script>
