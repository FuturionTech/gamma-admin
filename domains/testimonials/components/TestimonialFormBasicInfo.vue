<template>
  <div class="testimonial-form-basic-info">
    <!-- Name -->
    <div class="mb-7">
      <label class="form-label required">Name</label>
      <InputText
        :modelValue="modelValue.name"
        @update:modelValue="updateField('name', $event)"
        placeholder="Enter person's name"
        :error="errors.name"
        required
      />
      <div class="form-text" v-if="!errors.name">
        The name of the person giving the testimonial
      </div>
    </div>

    <!-- Content -->
    <div class="mb-7">
      <label class="form-label required">Content</label>
      <Textarea
        :modelValue="modelValue.content"
        @update:modelValue="updateField('content', $event)"
        placeholder="Enter testimonial content"
        :error="errors.content"
        rows="6"
        required
      />
      <div class="d-flex justify-content-between align-items-center mt-1">
        <div class="form-text" v-if="!errors.content">
          The testimonial text (max 500 characters recommended)
        </div>
        <div
          class="fs-7"
          :class="isCharacterLimitExceeded(modelValue.content || '', 500) ? 'text-danger' : 'text-muted'"
        >
          {{ getCharacterCount(modelValue.content || '', 500) }}
        </div>
      </div>
    </div>

    <!-- Position & Company Row -->
    <div class="row">
      <div class="col-md-6">
        <!-- Position -->
        <div class="mb-7">
          <label class="form-label">Position</label>
          <InputText
            :modelValue="modelValue.position || ''"
            @update:modelValue="updateField('position', $event)"
            placeholder="e.g. CEO"
            :error="errors.position"
          />
          <div class="form-text" v-if="!errors.position">
            The person's job title or position
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <!-- Company -->
        <div class="mb-7">
          <label class="form-label">Company</label>
          <InputText
            :modelValue="modelValue.company || ''"
            @update:modelValue="updateField('company', $event)"
            placeholder="e.g. Acme Corp"
            :error="errors.company"
          />
          <div class="form-text" v-if="!errors.company">
            The person's company or organization
          </div>
        </div>
      </div>
    </div>

    <!-- Rating -->
    <div class="mb-7">
      <label class="form-label">Rating</label>
      <StarRatingInput
        :modelValue="modelValue.rating || 5"
        @update:modelValue="updateField('rating', $event)"
        :error="errors.rating"
        :showLabel="true"
      />
      <div class="form-text" v-if="!errors.rating">
        Star rating from 1 to 5 (optional)
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TestimonialFormData } from '../types'
import { useTestimonialFormatters } from '../composables/useTestimonialFormatters'
import StarRatingInput from './StarRatingInput.vue'

const props = defineProps<{
  modelValue: TestimonialFormData
  errors: Record<string, string>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: TestimonialFormData]
}>()

const { getCharacterCount, isCharacterLimitExceeded } = useTestimonialFormatters()

const updateField = (field: keyof TestimonialFormData, value: any) => {
  const updated = { ...props.modelValue, [field]: value }
  emit('update:modelValue', updated)
}
</script>
