<template>
  <div class="card card-flush">
    <div class="card-body">
      <!-- Title -->
      <div class="mb-5">
        <label class="form-label required">Title</label>
        <input
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.title }"
          v-model="formData.title"
          placeholder="Enter solution title"
          @input="onTitleChange"
        />
        <div class="invalid-feedback" v-if="errors.title">{{ errors.title }}</div>
      </div>

      <!-- Subtitle -->
      <div class="mb-5">
        <label class="form-label">Subtitle</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.subtitle"
          placeholder="Enter subtitle"
        />
      </div>

      <!-- Description -->
      <div class="mb-5">
        <label class="form-label">Description</label>
        <textarea
          class="form-control"
          rows="5"
          v-model="formData.description"
          placeholder="Enter solution description"
        ></textarea>
      </div>

      <!-- Slug -->
      <div class="mb-0">
        <label class="form-label">Slug</label>
        <input
          type="text"
          class="form-control"
          v-model="formData.slug"
          placeholder="Auto-generated from title"
          readonly
        />
        <div class="form-text">URL-friendly identifier (auto-generated if empty)</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SolutionFormData } from '../types'
import { useSolutionFormatters } from '../composables/useSolutionFormatters'

const props = defineProps<{
  formData: SolutionFormData
  errors: Record<string, string>
}>()

const emit = defineEmits<{
  'update:formData': [value: SolutionFormData]
}>()

const { generateSlug } = useSolutionFormatters()

const onTitleChange = () => {
  // Auto-generate slug from title
  if (props.formData.title) {
    const updatedData = {
      ...props.formData,
      slug: generateSlug(props.formData.title)
    }
    emit('update:formData', updatedData)
  }
}
</script>
