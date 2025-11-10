<template>
  <div class="service-form-settings">
    <!-- Icon Upload -->
    <div class="mb-7">
      <label class="form-label">Icon</label>

      <!-- Icon Preview -->
      <div class="mb-3" v-if="iconPreview">
        <div class="symbol symbol-100px">
          <img :src="iconPreview" alt="Icon preview" class="w-100" />
        </div>
        <button
          type="button"
          class="btn btn-sm btn-light-danger mt-2"
          @click="handleRemoveIcon"
        >
          <i class="ki-duotone ki-trash fs-3">
            <span class="path1"></span>
            <span class="path2"></span>
            <span class="path3"></span>
            <span class="path4"></span>
            <span class="path5"></span>
          </i>
          Delete
        </button>
      </div>

      <!-- Icon URL Input or File Upload -->
      <div class="mb-3">
        <InputText
          :modelValue="modelValue.icon || ''"
          @update:modelValue="updateField('icon', $event)"
          placeholder="Icon URL or path"
          :error="errors.icon"
          type="url"
        />
      </div>

      <div class="text-center fw-bold text-muted my-3">or</div>

      <SingleFileUpload
        @file-selected="handleFileSelected"
        accept="image/*"
        label="Choose a file"
      />

      <div class="form-text" v-if="!errors.icon">
        Upload an icon or enter a URL
      </div>
    </div>

    <!-- Order -->
    <div class="mb-7">
      <label class="form-label">Order</label>
      <InputNumber
        :modelValue="modelValue.order || 0"
        @update:modelValue="updateField('order', $event)"
        placeholder="0"
        :error="errors.order"
        :min="0"
      />
      <div class="form-text" v-if="!errors.order">
        Display order (lower = shown first)
      </div>
    </div>

    <!-- Active Status -->
    <div class="mb-7">
      <label class="form-label d-block">Active</label>
      <InputSwitch
        :modelValue="modelValue.is_active ?? true"
        @update:modelValue="updateField('is_active', $event)"
      />
      <div class="form-text mt-2">
        Enable or disable this service on the website
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ServiceFormData } from '../types'

const props = defineProps<{
  modelValue: ServiceFormData
  errors: Record<string, string>
  iconPreview: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: ServiceFormData]
  iconChanged: [file: File]
  iconRemoved: []
}>()

const updateField = (field: keyof ServiceFormData, value: any) => {
  const updated = { ...props.modelValue, [field]: value }
  emit('update:modelValue', updated)
}

const handleFileSelected = (file: File) => {
  emit('iconChanged', file)
}

const handleRemoveIcon = () => {
  updateField('icon', null)
  emit('iconRemoved')
}
</script>
