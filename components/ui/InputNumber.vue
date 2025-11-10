<template>
    <div class="mb-4">
        <label v-if="label || $slots.label" :for="id" class="form-label" :class="{ required: isRequired }">
            <slot name="label">
                {{ label }}
            </slot>
        </label>
        <input
            :id="id"
            type="text"
            :class="inputClasses"
            :placeholder="placeholder"
            :required="isRequired"
            :readonly="isReadonly"
            :maxlength="maxLength"
            :minlength="minLength"
            v-bind="$attrs"
            v-model="inputValue"
            @input="onInput"
            @blur="validate"
            inputmode="numeric"
            pattern="[0-9]*"
        />
        <div v-if="errorMessage" class="invalid-feedback d-block">{{ errorMessage }}</div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, defineProps, defineEmits, defineExpose } from 'vue'

defineOptions({ name: 'InputNumber' })

// --- Props definition ---
const props = defineProps<{
    modelValue?: string | number
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
const inputValue = ref(props.modelValue?.toString() ?? '')
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

// --- Input filtering ---
function onInput(e: Event) {
    let value = (e.target as HTMLInputElement).value
    // Autorise uniquement les chiffres
    value = value.replace(/[^0-9]/g, '')
    inputValue.value = value
    emit('update:modelValue', value)
    validate()
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
        errorMessage.value = `Minimum ${props.minLength} chiffres.`
        return false
    }
    if (typeof props.maxLength === 'number' && value.length > props.maxLength) {
        errorMessage.value = `Maximum ${props.maxLength} chiffres.`
        return false
    }
    // Vérifie que la valeur ne contient que des chiffres
    if (value && !/^[0-9]+$/.test(value)) {
        errorMessage.value = 'Seuls les chiffres sont autorisés.'
        return false
    }
    return true
}

defineExpose({
    isValid: validate
})

// --- Watchers for v-model sync ---
watch(() => props.modelValue, (val) => {
    inputValue.value = val?.toString() ?? ''
    validate()
})
</script> 