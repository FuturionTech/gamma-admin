<template>
  <!-- Legacy fallback: if the value looks like a URL or data URI, render an image -->
  <img
    v-if="isImage"
    :src="name"
    :alt="alt || 'Icon'"
    :width="size"
    :height="size"
    :style="{ width: sizePx, height: sizePx }"
  />
  <!-- Lucide component lookup -->
  <component
    v-else-if="iconComponent"
    :is="iconComponent"
    :size="size"
    :stroke-width="strokeWidth"
    :color="color"
    :aria-label="alt || name || undefined"
    :aria-hidden="!alt"
    class="gn-icon"
  />
  <!-- Fallback placeholder if name is unknown -->
  <span
    v-else
    class="gn-icon gn-icon--empty"
    :style="{ width: sizePx, height: sizePx }"
    :aria-hidden="true"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getIcon } from './iconLibrary'

interface Props {
  /** Icon name (kebab-case Lucide name) or legacy image URL/path. */
  name?: string | null
  /** Pixel size (both width and height). */
  size?: number | string
  /** Stroke width for Lucide icons. */
  strokeWidth?: number | string
  /** Color override (CSS color). Defaults to currentColor. */
  color?: string
  /** Accessible label. Set to empty string to mark the icon decorative. */
  alt?: string
}

const props = withDefaults(defineProps<Props>(), {
  name: '',
  size: 20,
  strokeWidth: 1.75,
  color: 'currentColor',
  alt: '',
})

const isImage = computed(() => {
  if (!props.name) return false
  return /^(https?:|data:|\/|blob:)/.test(props.name)
})

const iconComponent = computed(() => {
  const icon = getIcon(props.name)
  return icon?.component ?? null
})

const sizePx = computed(() =>
  typeof props.size === 'number' ? `${props.size}px` : props.size,
)
</script>

<style scoped>
.gn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  flex-shrink: 0;
}

.gn-icon--empty {
  display: inline-block;
  border-radius: 6px;
  background: rgba(15, 23, 42, 0.06);
  border: 1px dashed rgba(15, 23, 42, 0.15);
}

:global([data-bs-theme='dark']) .gn-icon--empty {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.1);
}
</style>
