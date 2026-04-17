<template>
  <div class="gn-sidebar-logo" id="kt_app_sidebar_logo">
    <NuxtLink to="/" class="gn-sidebar-logo__link" aria-label="Gamma Neutral">
      <span class="gn-sidebar-logo__strong">Gamma</span>
      <span class="gn-sidebar-logo__light">Neutral</span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
// Pure presentation — wordmark matches gamma-web
</script>

<style scoped>
.gn-sidebar-logo {
  display: flex;
  align-items: center;
  padding: 1.8rem 1.4rem 1rem;
}

.gn-sidebar-logo__link {
  display: inline-flex;
  align-items: baseline;
  gap: 0.45rem;
  font-family: 'Space Grotesk', 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 1.65rem;
  letter-spacing: -0.028em;
  text-decoration: none;
  line-height: 1;
  color: var(--gn-wordmark-color, #0f172a);
  transition: opacity 0.2s ease;
}

@media (min-width: 1400px) {
  .gn-sidebar-logo__link {
    font-size: 1.85rem;
    gap: 0.5rem;
  }
}

.gn-sidebar-logo__link:hover {
  opacity: 0.85;
}

.gn-sidebar-logo__strong {
  font-weight: 700;
}

.gn-sidebar-logo__light {
  font-weight: 300;
  color: var(--gn-wordmark-muted, rgba(15, 23, 42, 0.6));
}
</style>

<style>
html .gn-sidebar-logo {
  --gn-wordmark-color: #0f172a;
  --gn-wordmark-muted: rgba(15, 23, 42, 0.58);
}

html[data-bs-theme='dark'] .gn-sidebar-logo {
  --gn-wordmark-color: #ffffff;
  --gn-wordmark-muted: rgba(245, 245, 247, 0.7);
}
</style>
