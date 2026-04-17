<template>
  <button
    type="button"
    class="theme-toggle"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="toggle"
  >
    <span class="theme-toggle__track">
      <span class="theme-toggle__thumb" :class="{ 'theme-toggle__thumb--dark': isDark }">
        <svg
          v-if="isDark"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
        </svg>
        <svg
          v-else
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      </span>
    </span>
  </button>
</template>

<script setup lang="ts">
const { isDark, toggle } = useTheme()
</script>

<style scoped>
.theme-toggle {
  --thumb-size: 22px;
  --track-padding: 3px;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
  border-radius: 999px;
  transition: transform 0.2s ease;
}

.theme-toggle:focus-visible {
  outline: 2px solid #a78bfa;
  outline-offset: 3px;
  border-radius: 999px;
}

.theme-toggle:hover {
  transform: translateY(-1px);
}

.theme-toggle__track {
  display: inline-flex;
  align-items: center;
  width: calc(var(--thumb-size) * 2 + var(--track-padding) * 2);
  height: calc(var(--thumb-size) + var(--track-padding) * 2);
  padding: var(--track-padding);
  border-radius: 999px;
  background: var(--gn-toggle-track, #e6e8ee);
  border: 1px solid var(--gn-toggle-border, #d7dbe4);
  box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.06);
  transition: background 0.3s ease, border-color 0.3s ease;
}

[data-bs-theme='dark'] .theme-toggle__track {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.14);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.35);
}

.theme-toggle__thumb {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--thumb-size);
  height: var(--thumb-size);
  border-radius: 999px;
  background: linear-gradient(135deg, #fff, #f1f3f8);
  color: #f59e0b;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(15, 23, 42, 0.06);
  transform: translateX(0);
  transition: transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94), background 0.3s ease, color 0.3s ease;
}

.theme-toggle__thumb--dark {
  transform: translateX(var(--thumb-size));
  background: linear-gradient(135deg, #1f2230, #0f1119);
  color: #c4b5fd;
  box-shadow: 0 4px 12px rgba(124, 58, 237, 0.35), 0 0 0 1px rgba(167, 139, 250, 0.25);
}

.theme-toggle__thumb svg {
  width: 14px;
  height: 14px;
}
</style>
