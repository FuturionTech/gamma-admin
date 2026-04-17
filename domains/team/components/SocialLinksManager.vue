<template>
  <div class="gn-social">
    <!-- Existing links -->
    <div v-if="internalLinks.length > 0" class="gn-social__list">
      <div
        v-for="(link, index) in internalLinks"
        :key="`${link.platform_id}-${index}`"
        class="gn-social__row"
      >
        <span class="gn-social__row-icon">
          <GIcon :name="iconForPlatform(link.platform_id)" :size="20" />
        </span>
        <div class="gn-social__row-body">
          <span class="gn-social__row-label">
            {{ nameForPlatform(link.platform_id) || 'Select platform' }}
          </span>
          <input
            v-model="link.url"
            type="url"
            class="gn-social__row-input"
            placeholder="https://…"
            @input="emitUpdate"
          />
        </div>
        <button
          type="button"
          class="gn-social__row-remove"
          title="Remove"
          @click="removeLink(index)"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="gn-social__empty">
      <span class="gn-social__empty-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      </span>
      <div>
        <p class="gn-social__empty-title">No links yet</p>
        <p class="gn-social__empty-hint">Pick a platform below to add a link.</p>
      </div>
    </div>

    <!-- Platform picker -->
    <div class="gn-social__picker">
      <span class="gn-social__picker-label">Add a platform</span>
      <div class="gn-social__chips">
        <button
          v-for="platform in availablePlatforms"
          :key="platform.id"
          type="button"
          class="gn-social__chip"
          :title="`Add ${platform.name}`"
          @click="addLink(platform.id)"
        >
          <span class="gn-social__chip-icon">
            <GIcon :name="iconForPlatform(platform.id)" :size="18" />
          </span>
          <span class="gn-social__chip-label">{{ platform.name }}</span>
        </button>
        <div v-if="availablePlatforms.length === 0" class="gn-social__chips-empty">
          All platforms already added
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import GIcon from '~/components/icons/GIcon.vue'
import type { SocialMediaPlatform, TeamSocialLinkInput } from '../types'

interface Props {
  modelValue?: TeamSocialLinkInput[]
  platforms: SocialMediaPlatform[]
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: TeamSocialLinkInput[]): void
}>()

const internalLinks = ref<TeamSocialLinkInput[]>([...props.modelValue])

watch(
  () => props.modelValue,
  (next) => {
    internalLinks.value = [...next]
  },
  { deep: true },
)

const usedPlatformIds = computed(
  () => new Set(internalLinks.value.map((link) => link.platform_id).filter(Boolean)),
)

const availablePlatforms = computed(() =>
  props.platforms.filter((platform) => !usedPlatformIds.value.has(platform.id)),
)

const platformMap = computed(() => {
  const map: Record<string, SocialMediaPlatform> = {}
  for (const platform of props.platforms) {
    map[platform.id] = platform
  }
  return map
})

const iconForPlatform = (platformId: string): string => {
  const platform = platformMap.value[platformId]
  if (!platform) return 'at-sign'
  if (platform.icon) return platform.icon
  return platform.name.toLowerCase()
}

const nameForPlatform = (platformId: string): string => {
  return platformMap.value[platformId]?.name ?? ''
}

const addLink = (platformId: string) => {
  internalLinks.value.push({ platform_id: platformId, url: '' })
  emitUpdate()
}

const removeLink = (index: number) => {
  internalLinks.value.splice(index, 1)
  emitUpdate()
}

const emitUpdate = () => {
  const valid = internalLinks.value.filter(
    (link) => link.platform_id && link.url && link.url.trim() !== '',
  )
  emit('update:modelValue', valid)
}
</script>

<style scoped>
.gn-social {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.gn-social__list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.gn-social__row {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.75rem 0.95rem;
  background: rgba(15, 23, 42, 0.025);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 14px;
  transition:
    border-color 0.25s ease,
    background 0.25s ease,
    box-shadow 0.25s ease;
}

.gn-social__row:focus-within {
  border-color: rgba(139, 92, 246, 0.5);
  background: rgba(139, 92, 246, 0.04);
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
}

.gn-social__row-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 11px;
  background: linear-gradient(135deg, rgba(167, 139, 250, 0.14) 0%, rgba(124, 58, 237, 0.18) 100%);
  color: #6d28d9;
  flex-shrink: 0;
}

.gn-social__row-body {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  flex: 1;
  min-width: 0;
}

.gn-social__row-label {
  font-size: 0.68rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: rgba(15, 23, 42, 0.55);
}

.gn-social__row-input {
  width: 100%;
  padding: 0.1rem 0;
  border: 0;
  background: transparent;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 500;
  color: #0f172a;
  outline: none;
  min-width: 0;
}

.gn-social__row-input::placeholder {
  color: rgba(15, 23, 42, 0.35);
  font-weight: 400;
}

.gn-social__row-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  background: transparent;
  color: rgba(15, 23, 42, 0.4);
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
  flex-shrink: 0;
}

.gn-social__row-remove svg {
  width: 16px;
  height: 16px;
}

.gn-social__row-remove:hover {
  background: rgba(220, 38, 38, 0.1);
  color: #dc2626;
}

/* Empty state */
.gn-social__empty {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: rgba(15, 23, 42, 0.02);
  border: 1px dashed rgba(15, 23, 42, 0.15);
  border-radius: 14px;
}

.gn-social__empty-icon {
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

.gn-social__empty-icon svg {
  width: 22px;
  height: 22px;
}

.gn-social__empty-title {
  margin: 0;
  font-size: 0.88rem;
  font-weight: 600;
  color: #0f172a;
}

.gn-social__empty-hint {
  margin: 0.1rem 0 0;
  font-size: 0.8rem;
  color: rgba(15, 23, 42, 0.55);
}

/* Picker */
.gn-social__picker {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.gn-social__picker-label {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: rgba(15, 23, 42, 0.55);
}

.gn-social__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.gn-social__chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 0.95rem;
  background: rgba(15, 23, 42, 0.04);
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 999px;
  font-family: inherit;
  font-size: 0.84rem;
  font-weight: 500;
  color: rgba(15, 23, 42, 0.72);
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.gn-social__chip:hover {
  background: rgba(139, 92, 246, 0.08);
  border-color: rgba(139, 92, 246, 0.3);
  color: #7c3aed;
  transform: translateY(-1px);
}

.gn-social__chip-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: inherit;
}

.gn-social__chips-empty {
  font-size: 0.8rem;
  color: rgba(15, 23, 42, 0.45);
  padding: 0.5rem 0;
}
</style>

<style>
/* Dark theme */
html[data-bs-theme='dark'] .gn-social__row {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.08);
}

html[data-bs-theme='dark'] .gn-social__row:focus-within {
  border-color: rgba(167, 139, 250, 0.55);
  background: rgba(167, 139, 250, 0.08);
}

html[data-bs-theme='dark'] .gn-social__row-icon {
  background: linear-gradient(135deg, rgba(167, 139, 250, 0.2) 0%, rgba(124, 58, 237, 0.26) 100%);
  color: #c4b5fd;
}

html[data-bs-theme='dark'] .gn-social__row-label {
  color: rgba(245, 245, 247, 0.55);
}

html[data-bs-theme='dark'] .gn-social__row-input {
  color: #f5f5f7;
}

html[data-bs-theme='dark'] .gn-social__row-input::placeholder {
  color: rgba(245, 245, 247, 0.35);
}

html[data-bs-theme='dark'] .gn-social__row-remove {
  color: rgba(245, 245, 247, 0.4);
}

html[data-bs-theme='dark'] .gn-social__row-remove:hover {
  background: rgba(248, 113, 113, 0.14);
  color: #fca5a5;
}

html[data-bs-theme='dark'] .gn-social__empty {
  background: rgba(255, 255, 255, 0.02);
  border-color: rgba(255, 255, 255, 0.1);
}

html[data-bs-theme='dark'] .gn-social__empty-icon {
  background: rgba(167, 139, 250, 0.15);
  color: #c4b5fd;
}

html[data-bs-theme='dark'] .gn-social__empty-title {
  color: #f5f5f7;
}

html[data-bs-theme='dark'] .gn-social__empty-hint {
  color: rgba(245, 245, 247, 0.55);
}

html[data-bs-theme='dark'] .gn-social__picker-label {
  color: rgba(245, 245, 247, 0.55);
}

html[data-bs-theme='dark'] .gn-social__chip {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.1);
  color: rgba(245, 245, 247, 0.7);
}

html[data-bs-theme='dark'] .gn-social__chip:hover {
  background: rgba(167, 139, 250, 0.12);
  border-color: rgba(167, 139, 250, 0.35);
  color: #c4b5fd;
}

html[data-bs-theme='dark'] .gn-social__chips-empty {
  color: rgba(245, 245, 247, 0.45);
}
</style>
