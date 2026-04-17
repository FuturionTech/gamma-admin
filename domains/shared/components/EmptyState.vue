<template>
  <div class="empty-state" :class="{ 'empty-state--compact': compact }">
    <div class="empty-state__illustration" aria-hidden="true">
      <span class="empty-state__glow" />
      <span class="empty-state__icon">
        <slot name="icon">
          <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <rect x="8" y="10" width="32" height="30" rx="4" />
            <path d="M16 18h16M16 24h16M16 30h10" />
          </svg>
        </slot>
      </span>
    </div>

    <div class="empty-state__body">
      <h3 v-if="title" class="empty-state__title">{{ title }}</h3>
      <p v-if="description" class="empty-state__description">{{ description }}</p>
    </div>

    <div v-if="$slots.action" class="empty-state__actions">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  description?: string;
  compact?: boolean;
}

withDefaults(defineProps<Props>(), {
  title: '',
  description: '',
  compact: false,
});
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2.5rem 1.5rem;
  gap: 1.25rem;
}

.empty-state--compact {
  padding: 1.75rem 1rem;
  gap: 0.9rem;
}

.empty-state__illustration {
  position: relative;
  width: 72px;
  height: 72px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.empty-state--compact .empty-state__illustration {
  width: 56px;
  height: 56px;
}

.empty-state__glow {
  position: absolute;
  inset: -25%;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.14) 0%, rgba(139, 92, 246, 0) 65%);
  filter: blur(4px);
}

.empty-state__icon {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 18px;
  background: linear-gradient(140deg, rgba(139, 92, 246, 0.08) 0%, rgba(59, 130, 246, 0.06) 100%);
  border: 1px solid rgba(139, 92, 246, 0.18);
  color: #7c3aed;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

[data-bs-theme='dark'] .empty-state__icon {
  background: linear-gradient(140deg, rgba(139, 92, 246, 0.12) 0%, rgba(59, 130, 246, 0.08) 100%);
  border-color: rgba(167, 139, 250, 0.28);
  color: #c4b5fd;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

.empty-state__icon :deep(svg) {
  width: 60%;
  height: 60%;
}

.empty-state__body {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  max-width: 340px;
}

.empty-state__title {
  margin: 0;
  font-family: 'Space Grotesk', 'Inter', system-ui, sans-serif;
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: #0f172a;
}

[data-bs-theme='dark'] .empty-state__title {
  color: #f5f5f7;
}

.empty-state__description {
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.5;
  color: #6b7280;
}

[data-bs-theme='dark'] .empty-state__description {
  color: rgba(245, 245, 247, 0.6);
}

.empty-state__actions {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 0.25rem;
}
</style>
