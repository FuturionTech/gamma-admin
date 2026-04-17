<template>
  <div class="icon-picker">
    <!-- Trigger -->
    <button
      type="button"
      class="icon-picker__trigger"
      :class="{ 'icon-picker__trigger--empty': !modelValue }"
      :aria-expanded="isOpen"
      :aria-haspopup="true"
      :disabled="disabled"
      @click="toggle"
    >
      <span class="icon-picker__preview">
        <GIcon v-if="modelValue" :name="modelValue" :size="22" />
        <svg
          v-else
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="icon-picker__preview-placeholder"
        >
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M9 9h.01M15 9h.01M9 15h6" />
        </svg>
      </span>
      <span class="icon-picker__value">
        <span class="icon-picker__value-label">{{ modelValue || placeholder }}</span>
        <span class="icon-picker__value-hint">{{ modelValue ? 'Click to change' : 'Click to pick an icon' }}</span>
      </span>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="icon-picker__chevron"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>

    <!-- Dropdown -->
    <transition name="icon-picker-pop">
      <div
        v-if="isOpen"
        ref="dropdownRef"
        class="icon-picker__dropdown"
        role="dialog"
        aria-label="Pick an icon"
      >
        <!-- Search -->
        <div class="icon-picker__search">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="icon-picker__search-icon"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref="searchInputRef"
            v-model="searchTerm"
            type="text"
            placeholder="Search icons…"
            class="icon-picker__search-input"
            autocomplete="off"
            spellcheck="false"
          />
          <button
            v-if="modelValue"
            type="button"
            class="icon-picker__clear"
            title="Clear"
            @click="clear"
          >
            Clear
          </button>
        </div>

        <!-- Category tabs -->
        <div class="icon-picker__tabs" role="tablist">
          <button
            type="button"
            role="tab"
            :aria-selected="activeCategory === 'all'"
            class="icon-picker__tab"
            :class="{ 'icon-picker__tab--active': activeCategory === 'all' }"
            @click="activeCategory = 'all'"
          >
            All
            <span class="icon-picker__tab-count">{{ iconList.length }}</span>
          </button>
          <button
            v-for="category in iconCategories"
            :key="category"
            type="button"
            role="tab"
            :aria-selected="activeCategory === category"
            class="icon-picker__tab"
            :class="{ 'icon-picker__tab--active': activeCategory === category }"
            @click="activeCategory = category"
          >
            {{ category }}
            <span class="icon-picker__tab-count">{{ iconsByCategory[category]?.length ?? 0 }}</span>
          </button>
        </div>

        <!-- Grid -->
        <div class="icon-picker__body">
          <div v-if="filteredIcons.length === 0" class="icon-picker__empty">
            <span class="icon-picker__empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </span>
            <span>No icons match "{{ searchTerm }}"</span>
          </div>
          <div v-else class="icon-picker__grid">
            <button
              v-for="icon in filteredIcons"
              :key="icon.name"
              type="button"
              class="icon-picker__cell"
              :class="{ 'icon-picker__cell--active': icon.name === modelValue }"
              :title="icon.name"
              :aria-label="icon.name"
              @click="select(icon.name)"
            >
              <GIcon :name="icon.name" :size="22" />
              <span class="icon-picker__cell-label">{{ icon.name }}</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import GIcon from './GIcon.vue'
import { iconCategories, iconList } from './iconLibrary'
import type { IconDefinition } from './iconLibrary'

interface Props {
  modelValue?: string | null
  placeholder?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'No icon selected',
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const isOpen = ref(false)
const searchTerm = ref('')
const activeCategory = ref<string>('all')
const dropdownRef = ref<HTMLElement | null>(null)
const searchInputRef = ref<HTMLInputElement | null>(null)

const iconsByCategory = computed<Record<string, IconDefinition[]>>(() => {
  const map: Record<string, IconDefinition[]> = {}
  for (const icon of iconList) {
    if (!map[icon.category]) map[icon.category] = []
    map[icon.category].push(icon)
  }
  return map
})

const filteredIcons = computed(() => {
  const term = searchTerm.value.trim().toLowerCase()
  const base = activeCategory.value === 'all'
    ? iconList
    : iconsByCategory.value[activeCategory.value] ?? []

  if (!term) return base

  return base.filter((icon) => {
    if (icon.name.includes(term)) return true
    if (icon.category.toLowerCase().includes(term)) return true
    if (icon.keywords?.some((kw) => kw.toLowerCase().includes(term))) return true
    return false
  })
})

const toggle = () => {
  if (props.disabled) return
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    nextTick(() => searchInputRef.value?.focus())
  }
}

const close = () => {
  isOpen.value = false
  searchTerm.value = ''
  activeCategory.value = 'all'
}

const select = (name: string) => {
  emit('update:modelValue', name)
  close()
}

const clear = () => {
  emit('update:modelValue', '')
  close()
}

const handleClickOutside = (event: MouseEvent) => {
  if (!isOpen.value) return
  const target = event.target as Node
  const picker = (event.currentTarget as Document)?.querySelectorAll('.icon-picker') ?? []
  for (const el of picker) {
    if (el.contains(target)) return
  }
  close()
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isOpen.value) {
    close()
  }
}

watch(isOpen, (value) => {
  if (typeof document === 'undefined') return
  if (value) {
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
  } else {
    document.removeEventListener('click', handleClickOutside)
    document.removeEventListener('keydown', handleEscape)
  }
})

onBeforeUnmount(() => {
  if (typeof document === 'undefined') return
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
.icon-picker {
  position: relative;
  display: block;
  width: 100%;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.icon-picker__trigger {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  width: 100%;
  padding: 0.85rem 1rem;
  background: var(--gn-input-bg, #ffffff);
  border: 1px solid var(--gn-input-border, rgba(15, 23, 42, 0.12));
  border-radius: 14px;
  color: var(--gn-input-text, #0f172a);
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 0.25s ease,
    background 0.25s ease,
    box-shadow 0.25s ease,
    transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.icon-picker__trigger:hover:not(:disabled) {
  border-color: rgba(139, 92, 246, 0.45);
  background: rgba(139, 92, 246, 0.04);
}

.icon-picker__trigger:focus-visible {
  outline: 2px solid rgba(167, 139, 250, 0.65);
  outline-offset: 2px;
}

.icon-picker__trigger:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

[aria-expanded='true'].icon-picker__trigger {
  border-color: rgba(139, 92, 246, 0.6);
  background: rgba(139, 92, 246, 0.06);
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.12);
}

.icon-picker__preview {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(139, 92, 246, 0.1);
  color: #7c3aed;
  flex-shrink: 0;
}

.icon-picker__trigger--empty .icon-picker__preview {
  background: rgba(15, 23, 42, 0.04);
  color: rgba(15, 23, 42, 0.4);
}

.icon-picker__preview-placeholder {
  width: 22px;
  height: 22px;
}

.icon-picker__value {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  flex: 1;
  min-width: 0;
}

.icon-picker__value-label {
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--gn-input-text, #0f172a);
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  letter-spacing: -0.005em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.icon-picker__trigger--empty .icon-picker__value-label {
  color: rgba(15, 23, 42, 0.55);
  font-weight: 500;
}

.icon-picker__value-hint {
  font-size: 0.72rem;
  color: rgba(15, 23, 42, 0.5);
  font-weight: 500;
}

.icon-picker__chevron {
  width: 18px;
  height: 18px;
  color: rgba(15, 23, 42, 0.4);
  transition: transform 0.25s ease;
  flex-shrink: 0;
}

[aria-expanded='true'] .icon-picker__chevron {
  transform: rotate(180deg);
  color: #7c3aed;
}

/* Dropdown */
.icon-picker__dropdown {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 0.6rem);
  z-index: 50;
  background: #ffffff;
  border: 1px solid rgba(15, 23, 42, 0.1);
  border-radius: 16px;
  box-shadow:
    0 24px 48px -24px rgba(15, 23, 42, 0.2),
    0 12px 24px -16px rgba(15, 23, 42, 0.12);
  overflow: hidden;
  max-height: 520px;
  display: flex;
  flex-direction: column;
}

.icon-picker__search {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.9rem 1.1rem;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(15, 23, 42, 0.015);
}

.icon-picker__search-icon {
  width: 18px;
  height: 18px;
  color: rgba(15, 23, 42, 0.4);
  flex-shrink: 0;
}

.icon-picker__search-input {
  flex: 1;
  border: 0;
  background: transparent;
  font-family: inherit;
  font-size: 0.92rem;
  font-weight: 500;
  color: #0f172a;
  outline: none;
  min-width: 0;
}

.icon-picker__search-input::placeholder {
  color: rgba(15, 23, 42, 0.4);
  font-weight: 400;
}

.icon-picker__clear {
  border: 0;
  background: rgba(139, 92, 246, 0.1);
  color: #7c3aed;
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.3rem 0.7rem;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.25s ease;
}

.icon-picker__clear:hover {
  background: rgba(139, 92, 246, 0.18);
}

/* Tabs */
.icon-picker__tabs {
  display: flex;
  gap: 0.3rem;
  padding: 0.7rem 1.1rem;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
  overflow-x: auto;
  scrollbar-width: thin;
}

.icon-picker__tabs::-webkit-scrollbar {
  height: 4px;
}

.icon-picker__tabs::-webkit-scrollbar-thumb {
  background: rgba(15, 23, 42, 0.15);
  border-radius: 4px;
}

.icon-picker__tab {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.85rem;
  border: 0;
  background: transparent;
  color: rgba(15, 23, 42, 0.6);
  font-family: inherit;
  font-size: 0.78rem;
  font-weight: 600;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.25s ease, color 0.25s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.icon-picker__tab:hover {
  background: rgba(15, 23, 42, 0.05);
  color: #0f172a;
}

.icon-picker__tab--active {
  background: rgba(139, 92, 246, 0.12);
  color: #7c3aed;
}

.icon-picker__tab-count {
  display: inline-block;
  padding: 0.05rem 0.45rem;
  background: rgba(15, 23, 42, 0.08);
  border-radius: 999px;
  font-size: 0.65rem;
  font-weight: 600;
  color: rgba(15, 23, 42, 0.55);
}

.icon-picker__tab--active .icon-picker__tab-count {
  background: rgba(139, 92, 246, 0.22);
  color: #6d28d9;
}

/* Body */
.icon-picker__body {
  flex: 1;
  overflow-y: auto;
  padding: 0.9rem 1.1rem 1.1rem;
  max-height: 340px;
}

.icon-picker__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(84px, 1fr));
  gap: 0.55rem;
}

.icon-picker__cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  padding: 0.7rem 0.4rem 0.55rem;
  border: 1px solid transparent;
  background: rgba(15, 23, 42, 0.03);
  border-radius: 12px;
  color: rgba(15, 23, 42, 0.7);
  font-family: inherit;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.icon-picker__cell:hover {
  background: rgba(139, 92, 246, 0.08);
  border-color: rgba(139, 92, 246, 0.3);
  color: #7c3aed;
  transform: translateY(-1px);
}

.icon-picker__cell--active {
  background: linear-gradient(135deg, rgba(167, 139, 250, 0.18) 0%, rgba(124, 58, 237, 0.22) 100%);
  border-color: #7c3aed;
  color: #6d28d9;
}

.icon-picker__cell-label {
  display: block;
  width: 100%;
  font-size: 0.62rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: 0.75;
}

.icon-picker__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 3rem 1rem;
  color: rgba(15, 23, 42, 0.5);
  font-size: 0.88rem;
}

.icon-picker__empty-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.04);
  color: rgba(15, 23, 42, 0.35);
}

.icon-picker__empty-icon svg {
  width: 22px;
  height: 22px;
}

/* Animations */
.icon-picker-pop-enter-active,
.icon-picker-pop-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform-origin: top center;
}

.icon-picker-pop-enter-from,
.icon-picker-pop-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}
</style>

<style>
/* Dark-mode overrides (non-scoped) */
html[data-bs-theme='dark'] .icon-picker__trigger {
  --gn-input-bg: rgba(255, 255, 255, 0.03);
  --gn-input-border: rgba(255, 255, 255, 0.1);
  --gn-input-text: #f5f5f7;
  color: #f5f5f7;
}

html[data-bs-theme='dark'] .icon-picker__trigger:hover:not(:disabled) {
  background: rgba(167, 139, 250, 0.08);
  border-color: rgba(167, 139, 250, 0.35);
}

html[data-bs-theme='dark'] [aria-expanded='true'].icon-picker__trigger {
  background: rgba(167, 139, 250, 0.1);
  border-color: rgba(167, 139, 250, 0.55);
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.18);
}

html[data-bs-theme='dark'] .icon-picker__preview {
  background: rgba(167, 139, 250, 0.15);
  color: #c4b5fd;
}

html[data-bs-theme='dark'] .icon-picker__trigger--empty .icon-picker__preview {
  background: rgba(255, 255, 255, 0.04);
  color: rgba(245, 245, 247, 0.35);
}

html[data-bs-theme='dark'] .icon-picker__value-label {
  color: #f5f5f7;
}

html[data-bs-theme='dark'] .icon-picker__trigger--empty .icon-picker__value-label {
  color: rgba(245, 245, 247, 0.55);
}

html[data-bs-theme='dark'] .icon-picker__value-hint {
  color: rgba(245, 245, 247, 0.45);
}

html[data-bs-theme='dark'] .icon-picker__chevron {
  color: rgba(245, 245, 247, 0.45);
}

html[data-bs-theme='dark'] .icon-picker__dropdown {
  background: #141720;
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow:
    0 32px 64px -28px rgba(0, 0, 0, 0.7),
    0 16px 32px -20px rgba(0, 0, 0, 0.5);
}

html[data-bs-theme='dark'] .icon-picker__search {
  background: rgba(255, 255, 255, 0.02);
  border-bottom-color: rgba(255, 255, 255, 0.06);
}

html[data-bs-theme='dark'] .icon-picker__search-icon {
  color: rgba(245, 245, 247, 0.4);
}

html[data-bs-theme='dark'] .icon-picker__search-input {
  color: #f5f5f7;
}

html[data-bs-theme='dark'] .icon-picker__search-input::placeholder {
  color: rgba(245, 245, 247, 0.4);
}

html[data-bs-theme='dark'] .icon-picker__clear {
  background: rgba(167, 139, 250, 0.16);
  color: #c4b5fd;
}

html[data-bs-theme='dark'] .icon-picker__clear:hover {
  background: rgba(167, 139, 250, 0.26);
}

html[data-bs-theme='dark'] .icon-picker__tabs {
  border-bottom-color: rgba(255, 255, 255, 0.06);
}

html[data-bs-theme='dark'] .icon-picker__tab {
  color: rgba(245, 245, 247, 0.55);
}

html[data-bs-theme='dark'] .icon-picker__tab:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #f5f5f7;
}

html[data-bs-theme='dark'] .icon-picker__tab--active {
  background: rgba(167, 139, 250, 0.16);
  color: #c4b5fd;
}

html[data-bs-theme='dark'] .icon-picker__tab-count {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(245, 245, 247, 0.55);
}

html[data-bs-theme='dark'] .icon-picker__tab--active .icon-picker__tab-count {
  background: rgba(167, 139, 250, 0.24);
  color: #ddd6fe;
}

html[data-bs-theme='dark'] .icon-picker__cell {
  background: rgba(255, 255, 255, 0.03);
  color: rgba(245, 245, 247, 0.7);
}

html[data-bs-theme='dark'] .icon-picker__cell:hover {
  background: rgba(167, 139, 250, 0.12);
  border-color: rgba(167, 139, 250, 0.35);
  color: #c4b5fd;
}

html[data-bs-theme='dark'] .icon-picker__cell--active {
  background: linear-gradient(135deg, rgba(167, 139, 250, 0.2) 0%, rgba(124, 58, 237, 0.3) 100%);
  border-color: #a78bfa;
  color: #ddd6fe;
}

html[data-bs-theme='dark'] .icon-picker__empty {
  color: rgba(245, 245, 247, 0.5);
}

html[data-bs-theme='dark'] .icon-picker__empty-icon {
  background: rgba(255, 255, 255, 0.04);
  color: rgba(245, 245, 247, 0.35);
}
</style>
