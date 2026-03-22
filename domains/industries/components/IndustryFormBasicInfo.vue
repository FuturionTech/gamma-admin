<template>
  <div class="industry-form-basic-info">
    <!-- Title -->
    <div class="mb-7">
      <label class="form-label required">Title</label>
      <InputText
        :modelValue="modelValue.title"
        @update:modelValue="updateField('title', $event)"
        placeholder="Enter industry title"
        :error="errors.title"
        required
        @blur="handleTitleBlur"
      />
      <div class="form-text" v-if="!errors.title">
        The title will be displayed on the website
      </div>
    </div>

    <!-- Short Description -->
    <div class="mb-7">
      <label class="form-label">Short Description</label>
      <InputText
        :modelValue="modelValue.short_description || ''"
        @update:modelValue="updateField('short_description', $event)"
        placeholder="Brief description for cards and lists"
        :error="errors.short_description"
      />
      <div class="form-text" v-if="!errors.short_description">
        A concise summary displayed in list views and cards
      </div>
    </div>

    <!-- Description -->
    <div class="mb-7">
      <label class="form-label">Description</label>
      <Textarea
        :modelValue="modelValue.description || ''"
        @update:modelValue="updateField('description', $event)"
        placeholder="Enter full industry description"
        :error="errors.description"
        rows="5"
      />
      <div class="form-text" v-if="!errors.description">
        Full description of the industry sector
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
import type { IndustryFormData } from '../types'
import { useIndustryFormatters } from '../composables/useIndustryFormatters'

const props = defineProps<{
  modelValue: IndustryFormData
  errors: Record<string, string>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: IndustryFormData]
}>()

const { generateSlug } = useIndustryFormatters()

const updateField = (field: keyof IndustryFormData, value: any) => {
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
