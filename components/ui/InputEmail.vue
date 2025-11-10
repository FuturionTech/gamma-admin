<template>
    <div class="mb-4">
        <label v-if="label || $slots.label" :for="id" class="form-label" :class="{ required: isRequired }">
            <slot name="label">
                {{ label }}
            </slot>
        </label>
        <input
            :id="id"
            type="email"
            :class="inputClasses"
            :placeholder="placeholder"
            :required="isRequired"
            :readonly="isReadonly"
            :maxlength="maxLength"
            :minlength="minLength"
            v-bind="$attrs"
            v-model="inputValue"
            @blur="validate"
        />
        <div v-if="errorMessage" class="invalid-feedback d-block">{{ errorMessage }}</div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, defineProps, defineEmits, defineExpose } from 'vue'

defineOptions({ name: 'InputEmail' })

// --- Props definition ---
const props = defineProps<{
    modelValue?: string
    label?: string
    isRequired?: boolean
    isReadonly?: boolean
    maxLength?: number
    minLength?: number
    placeholder?: string
    inputClass?: string | string[] | Record<string, boolean>
    variant?: '' | 'solid' | 'transparent' | 'flush'
    id?: string
}>()

// --- Emits ---
const emit = defineEmits(['update:modelValue'])

// --- Local state ---
const inputValue = ref(props.modelValue ?? '')
const errorMessage = ref('')

// --- Compute input classes ---
function getInputClasses(): string {
    const base = ['form-control']
    if (props.variant === 'solid') base.push('form-control-solid')
    else if (props.variant === 'transparent') base.push('form-control-transparent')
    else if (props.variant === 'flush') base.push('form-control-flush')
    if (props.inputClass) {
        if (typeof props.inputClass === 'string') base.push(props.inputClass)
        else if (Array.isArray(props.inputClass)) base.push(...props.inputClass)
        else if (typeof props.inputClass === 'object') {
            const obj = props.inputClass as Record<string, boolean>
            base.push(...Object.keys(obj).filter(k => obj[k]))
        }
    }
    return base.join(' ')
}
const inputClasses = computed(getInputClasses)

// --- Email validation helper ---
function isValidEmail(email: string): boolean {
    // Simple email regex for basic validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// --- Validation logic ---
function validate(): boolean {
    errorMessage.value = ''
    const value = inputValue.value || ''
    if (props.isRequired && !value) {
        errorMessage.value = 'Ce champ est requis.'
        return false
    }
    if (typeof props.minLength === 'number' && value.length < props.minLength) {
        errorMessage.value = `Minimum ${props.minLength} caractères.`
        return false
    }
    if (typeof props.maxLength === 'number' && value.length > props.maxLength) {
        errorMessage.value = `Maximum ${props.maxLength} caractères.`
        return false
    }
    if (value && !isValidEmail(value)) {
        errorMessage.value = 'Adresse email invalide.'
        return false
    }
    return true
}

// --- Expose validation method to parent ---
defineExpose({
    isValid: validate
})

// --- Watchers for v-model sync ---
watch(() => props.modelValue, (val) => {
    inputValue.value = val ?? ''
    validate()
})
watch(inputValue, (val) => {
    emit('update:modelValue', val)
    validate()
})
</script> 