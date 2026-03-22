import type { Ref } from 'vue'

export interface ValidationRule {
  required?: boolean
  requiredMessage?: string
  email?: boolean
  url?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: RegExp
  patternMessage?: string
  custom?: (value: any) => string | null
}

export type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule
}

export function useFormValidation<T extends Record<string, any>>(
  form: Ref<T>,
  rules: ValidationRules<T>
) {
  const errors = ref<Partial<Record<keyof T, string>>>({})
  const touched = ref<Partial<Record<keyof T, boolean>>>({})

  const validateField = (field: keyof T): boolean => {
    touched.value[field] = true
    const value = form.value[field]
    const fieldRules = rules[field]

    if (!fieldRules) return true

    // Required check
    if (fieldRules.required) {
      if (value === null || value === undefined || value === '') {
        errors.value[field] = fieldRules.requiredMessage || `${String(field)} is required`
        return false
      }
    }

    // If field is empty and not required, skip other validations
    if (!value && !fieldRules.required) {
      errors.value[field] = undefined
      return true
    }

    // Email check
    if (fieldRules.email && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        errors.value[field] = 'Please enter a valid email address'
        return false
      }
    }

    // URL check
    if (fieldRules.url && value) {
      try {
        new URL(value)
      } catch {
        errors.value[field] = 'Please enter a valid URL (e.g., https://example.com)'
        return false
      }
    }

    // Min length check
    if (fieldRules.minLength !== undefined && value) {
      const length = typeof value === 'string' ? value.length : String(value).length
      if (length < fieldRules.minLength) {
        errors.value[field] = `Must be at least ${fieldRules.minLength} characters`
        return false
      }
    }

    // Max length check
    if (fieldRules.maxLength !== undefined && value) {
      const length = typeof value === 'string' ? value.length : String(value).length
      if (length > fieldRules.maxLength) {
        errors.value[field] = `Cannot exceed ${fieldRules.maxLength} characters`
        return false
      }
    }

    // Min value check
    if (fieldRules.min !== undefined && value !== null && value !== undefined) {
      const numValue = typeof value === 'number' ? value : Number(value)
      if (!isNaN(numValue) && numValue < fieldRules.min) {
        errors.value[field] = `Must be at least ${fieldRules.min}`
        return false
      }
    }

    // Max value check
    if (fieldRules.max !== undefined && value !== null && value !== undefined) {
      const numValue = typeof value === 'number' ? value : Number(value)
      if (!isNaN(numValue) && numValue > fieldRules.max) {
        errors.value[field] = `Cannot exceed ${fieldRules.max}`
        return false
      }
    }

    // Pattern check
    if (fieldRules.pattern && value) {
      if (!fieldRules.pattern.test(String(value))) {
        errors.value[field] = fieldRules.patternMessage || 'Invalid format'
        return false
      }
    }

    // Custom validation
    if (fieldRules.custom && value) {
      const customError = fieldRules.custom(value)
      if (customError) {
        errors.value[field] = customError
        return false
      }
    }

    // Clear error if valid
    errors.value[field] = undefined
    return true
  }

  const validateAll = (): boolean => {
    let isValid = true
    for (const field of Object.keys(rules) as (keyof T)[]) {
      if (!validateField(field)) {
        isValid = false
      }
    }
    return isValid
  }

  const clearError = (field: keyof T) => {
    errors.value[field] = undefined
  }

  const clearAllErrors = () => {
    errors.value = {}
  }

  const resetTouched = () => {
    touched.value = {}
  }

  const hasErrors = computed(() => {
    return Object.values(errors.value).some(e => e)
  })

  const isFormValid = computed(() => {
    return !hasErrors.value && Object.keys(touched.value).length > 0
  })

  return {
    errors,
    touched,
    validateField,
    validateAll,
    clearError,
    clearAllErrors,
    resetTouched,
    hasErrors,
    isFormValid
  }
}
