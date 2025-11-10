<template>
    <div :class="['mb-4 form-check form-switch form-check-custom form-check-solid', variantClass]">
        <input 
            :id="inputId" 
            class="form-check-input" 
            type="checkbox" 
            :required="isRequired" 
            :disabled="isDisabled"
            :checked="modelValue" 
            @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)" 
        />
        <label v-if="label" class="form-check-label" :for="inputId">
            {{ label }}
        </label>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'InputSwitch' })

const props = defineProps({
    id: {
        type: String,
        required: false,
    },
    label: {
        type: String,
        required: false,
    },
    modelValue: {
        type: Boolean,
        default: false,
    },
    isRequired: {
        type: Boolean,
        default: false,
    },
    isDisabled: {
        type: Boolean,
        default: false,
    },
    variant: {
        type: String,
        default: '', // '', 'success', 'danger', 'warning'
        validator: (value) =>
            ['', 'success', 'danger', 'warning'].includes(value),
    },
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const inputId = computed(() => props.id || `switch-${Math.random().toString(36).substr(2, 9)}`)

const variantClass = computed(() =>
    props.variant ? `form-check-${props.variant}` : ''
)
</script>
