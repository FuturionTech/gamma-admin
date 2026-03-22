<script setup lang="ts">
const props = defineProps<{
  code: string
}>()

/**
 * Converts a 2-letter ISO country code to a flag emoji
 * using Unicode regional indicator symbols.
 */
const flag = computed(() => {
  const cc = props.code.toUpperCase()
  if (cc.length !== 2) return ''
  const codePoints = [...cc].map(c => 0x1F1E6 + c.charCodeAt(0) - 65)
  return String.fromCodePoint(...codePoints)
})
</script>

<template>
  <span class="me-1" role="img" :aria-label="`Flag of ${code}`">{{ flag }}</span>
</template>
