<template>
  <div class="auth-shell" data-bs-theme="dark">
    <!-- Cinematic hero panel -->
    <aside class="auth-shell__stage" aria-hidden="true">
      <video
        class="auth-shell__video"
        src="/assets/videos/toronto_drone_footage.mp4"
        autoplay
        muted
        loop
        playsinline
        preload="metadata"
        disableremoteplayback
      />
      <div class="auth-shell__veil" />
      <div class="auth-shell__grid" />
      <div class="auth-shell__glow auth-shell__glow--top" />
      <div class="auth-shell__glow auth-shell__glow--bottom" />
    </aside>

    <!-- Foreground content -->
    <div class="auth-shell__stage-content">
      <div class="auth-shell__brand">
        <NuxtLink to="/" class="auth-shell__wordmark" aria-label="Gamma Neutral">
          <span class="auth-shell__wordmark-strong">Gamma</span>
          <span class="auth-shell__wordmark-light">Neutral</span>
        </NuxtLink>
        <span class="auth-shell__eyebrow">{{ $t('auth.brand.eyebrow') }}</span>
      </div>

      <div class="auth-shell__pitch">
        <span class="auth-shell__badge">
          <span class="auth-shell__badge-dot" />
          {{ $t('auth.brand.location') }}
        </span>
        <h2 class="auth-shell__headline">
          {{ $t('auth.brand.tagline') }}
        </h2>
      </div>

      <div class="auth-shell__footer-stage">
        <span>© {{ year }} Gamma Neutral Consulting Inc.</span>
      </div>
    </div>

    <!-- Form panel -->
    <main class="auth-shell__panel">
      <div class="auth-shell__panel-brand">
        <NuxtLink to="/" class="auth-shell__wordmark auth-shell__wordmark--compact" aria-label="Gamma Neutral">
          <span class="auth-shell__wordmark-strong">Gamma</span>
          <span class="auth-shell__wordmark-light">Neutral</span>
        </NuxtLink>
      </div>

      <div class="auth-shell__panel-inner">
        <slot />
      </div>

      <footer class="auth-shell__panel-footer">
        <a href="#" class="auth-shell__footer-link">{{ $t('auth.login.terms') }}</a>
        <span class="auth-shell__footer-sep">·</span>
        <a href="#" class="auth-shell__footer-link">{{ $t('auth.login.privacy') }}</a>
      </footer>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

useHead({
  bodyAttrs: { class: 'auth-body' },
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap',
    },
  ],
});

const year = computed(() => new Date().getFullYear());
</script>

<style>
/* Non-scoped body tweak: remove scroll on auth screens and apply app typography */
.auth-body {
  min-height: 100vh;
  background: #050608;
  color: #f5f5f7;
  font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
</style>

<style scoped>
.auth-shell {
  --auth-bg: #050608;
  --auth-surface: #0e0f13;
  --auth-surface-raised: #141720;
  --auth-border: rgba(255, 255, 255, 0.08);
  --auth-border-strong: rgba(255, 255, 255, 0.16);
  --auth-text: #f5f5f7;
  --auth-text-muted: #9199a7;
  --auth-text-dim: #6b7280;
  --auth-accent: #a78bfa;
  --auth-accent-strong: #8b5cf6;
  --auth-accent-deep: #6d28d9;
  --auth-danger: #f87171;
  --auth-ease: cubic-bezier(0.25, 0.46, 0.45, 0.94);

  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  min-height: 100vh;
  background: var(--auth-bg);
  color: var(--auth-text);
  overflow: hidden;
}

.auth-shell::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(80% 60% at 50% 0%, rgba(139, 92, 246, 0.12), transparent 60%);
  pointer-events: none;
}

/* Hero stage */
.auth-shell__stage {
  display: none;
  position: relative;
  overflow: hidden;
  grid-row: 1;
  grid-column: 1;
}

.auth-shell__video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.8) contrast(1.05);
  opacity: 0.65;
}

.auth-shell__veil {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(5, 6, 8, 0.25) 0%, rgba(5, 6, 8, 0.55) 55%, rgba(5, 6, 8, 0.9) 100%),
    linear-gradient(115deg, rgba(109, 40, 217, 0.25) 0%, rgba(5, 6, 8, 0) 65%);
}

.auth-shell__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(70% 70% at 30% 40%, #000 30%, transparent 80%);
  -webkit-mask-image: radial-gradient(70% 70% at 30% 40%, #000 30%, transparent 80%);
  opacity: 0.6;
}

.auth-shell__glow {
  position: absolute;
  width: 560px;
  height: 560px;
  border-radius: 999px;
  filter: blur(120px);
  pointer-events: none;
}

.auth-shell__glow--top {
  top: -180px;
  left: -160px;
  background: radial-gradient(circle, rgba(167, 139, 250, 0.45) 0%, rgba(5, 6, 8, 0) 70%);
}

.auth-shell__glow--bottom {
  bottom: -220px;
  right: -200px;
  background: radial-gradient(circle, rgba(124, 58, 237, 0.35) 0%, rgba(5, 6, 8, 0) 70%);
}

.auth-shell__stage-content {
  display: none;
  position: absolute;
  inset: 0;
  padding: 4rem 4.5rem;
  flex-direction: column;
  justify-content: space-between;
  pointer-events: none;
  z-index: 2;
}

.auth-shell__stage-content > * {
  pointer-events: auto;
}

.auth-shell__brand {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  opacity: 0;
  transform: translateY(-12px);
  animation: auth-fade-in 0.9s var(--auth-ease) 0.1s forwards;
}

.auth-shell__wordmark {
  display: inline-flex;
  align-items: baseline;
  gap: 0.55rem;
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  font-size: 2.25rem;
  letter-spacing: -0.028em;
  text-decoration: none;
  color: var(--auth-text);
  line-height: 1;
}

.auth-shell__wordmark-strong {
  font-weight: 700;
}

.auth-shell__wordmark-light {
  font-weight: 300;
  color: rgba(245, 245, 247, 0.72);
}

.auth-shell__wordmark--compact {
  font-size: 1.6rem;
}

@media (min-width: 1400px) {
  .auth-shell__wordmark {
    font-size: 2.6rem;
  }
}

.auth-shell__eyebrow {
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--auth-accent);
}

.auth-shell__pitch {
  max-width: 520px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  opacity: 0;
  transform: translateY(16px);
  animation: auth-fade-in 1s var(--auth-ease) 0.25s forwards;
}

.auth-shell__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.45rem 0.95rem;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(10px);
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: rgba(245, 245, 247, 0.85);
  align-self: flex-start;
}

.auth-shell__badge-dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: #a78bfa;
  box-shadow: 0 0 0 0 rgba(167, 139, 250, 0.6);
  animation: auth-pulse 2.4s ease-in-out infinite;
}

.auth-shell__headline {
  margin: 0;
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  font-weight: 600;
  font-size: clamp(1.9rem, 3vw, 2.75rem);
  line-height: 1.15;
  letter-spacing: -0.025em;
  color: var(--auth-text);
}

.auth-shell__footer-stage {
  font-size: 0.78rem;
  color: rgba(245, 245, 247, 0.5);
  opacity: 0;
  animation: auth-fade-in 0.8s var(--auth-ease) 0.5s forwards;
}

/* Form panel */
.auth-shell__panel {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 2rem 1.5rem 2.5rem;
  background: linear-gradient(180deg, rgba(20, 23, 32, 0.6) 0%, rgba(5, 6, 8, 1) 100%);
  z-index: 1;
}

.auth-shell__panel-brand {
  display: flex;
  justify-content: center;
  padding-bottom: 1.5rem;
}

@media (min-width: 992px) {
  .auth-shell__panel-brand {
    display: none;
  }
}

.auth-shell__panel-inner {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-shell__panel-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding-top: 1.5rem;
  font-size: 0.78rem;
  color: var(--auth-text-dim);
}

.auth-shell__footer-link {
  color: var(--auth-text-muted);
  text-decoration: none;
  transition: color 0.25s ease;
}

.auth-shell__footer-link:hover {
  color: var(--auth-accent);
}

.auth-shell__footer-sep {
  opacity: 0.5;
}

@media (min-width: 992px) {
  .auth-shell {
    grid-template-columns: 1.05fr 0.95fr;
  }

  .auth-shell__stage {
    display: block;
    grid-column: 1;
  }

  .auth-shell__stage-content {
    display: flex;
  }

  .auth-shell__panel {
    grid-column: 2;
    padding: 3rem 3.5rem 3rem;
  }

  .auth-shell__panel-brand {
    justify-content: flex-start;
  }
}

@media (min-width: 1400px) {
  .auth-shell__panel {
    padding: 3.5rem 5rem;
  }
}

@keyframes auth-fade-in {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes auth-pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(167, 139, 250, 0.55);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(167, 139, 250, 0);
  }
}
</style>
