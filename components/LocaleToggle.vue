<template>
  <div class="gn-locale-toggle" role="radiogroup" aria-label="Content language">
    <button
      v-for="loc in LOCALES"
      :key="loc.code"
      type="button"
      class="gn-locale-toggle__btn"
      :class="{ 'gn-locale-toggle__btn--active': modelValue === loc.code }"
      :aria-pressed="modelValue === loc.code"
      @click="$emit('update:modelValue', loc.code)"
    >
      <span class="gn-locale-toggle__flag">{{ loc.flag }}</span>
      <span class="gn-locale-toggle__label">{{ loc.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

defineEmits<{
  'update:modelValue': [locale: string]
}>()

const LOCALES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
]
</script>

<style>
.gn-locale-toggle {
  display: inline-flex;
  background: rgba(15, 23, 42, 0.05);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 10px;
  padding: 3px;
  gap: 2px;
}

.gn-locale-toggle__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.85rem;
  border: 0;
  border-radius: 8px;
  background: transparent;
  font-family: inherit;
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(15, 23, 42, 0.55);
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
}

.gn-locale-toggle__btn:hover {
  color: rgba(15, 23, 42, 0.8);
}

.gn-locale-toggle__btn--active {
  background: #ffffff;
  color: #7c3aed;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.1);
}

.gn-locale-toggle__flag {
  font-size: 0.9rem;
  line-height: 1;
}

.gn-locale-toggle__label {
  line-height: 1;
}

html[data-bs-theme='dark'] .gn-locale-toggle {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.1);
}

html[data-bs-theme='dark'] .gn-locale-toggle__btn {
  color: rgba(245, 245, 247, 0.55);
}

html[data-bs-theme='dark'] .gn-locale-toggle__btn:hover {
  color: rgba(245, 245, 247, 0.8);
}

html[data-bs-theme='dark'] .gn-locale-toggle__btn--active {
  background: rgba(255, 255, 255, 0.1);
  color: #c4b5fd;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}
</style>
