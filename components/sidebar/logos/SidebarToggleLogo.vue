<template>
  <NuxtLink to="/" class="gn-toggle-logo" aria-label="Gamma Neutral">
    <span class="gn-toggle-logo__strong">Gamma</span>
    <span class="gn-toggle-logo__light">Neutral</span>
  </NuxtLink>
</template>

<script setup lang="ts">
// Mobile wordmark mirrors the sidebar version
</script>

<style scoped>
.gn-toggle-logo {
  display: inline-flex;
  align-items: baseline;
  gap: 0.35rem;
  font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
  font-size: 1.1rem;
  letter-spacing: -0.02em;
  text-decoration: none;
  color: var(--gn-wordmark-color, #0f172a);
  line-height: 1;
}

.gn-toggle-logo__strong {
  font-weight: 700;
}

.gn-toggle-logo__light {
  font-weight: 300;
  color: var(--gn-wordmark-muted, rgba(15, 23, 42, 0.6));
}
</style>

<style>
html .gn-toggle-logo {
  --gn-wordmark-color: #0f172a;
  --gn-wordmark-muted: rgba(15, 23, 42, 0.58);
}

html[data-bs-theme='dark'] .gn-toggle-logo {
  --gn-wordmark-color: #ffffff;
  --gn-wordmark-muted: rgba(245, 245, 247, 0.7);
}
</style>
