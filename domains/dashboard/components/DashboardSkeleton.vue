<template>
  <div class="gn-skeleton">
    <!-- Insight strip -->
    <div class="row g-5 g-xl-6 mb-6">
      <div v-for="i in 4" :key="`insight-${i}`" class="col-xl-3 col-md-6">
        <div class="gn-skeleton__card">
          <div class="gn-skeleton__icon gn-shimmer" />
          <div class="gn-skeleton__stack">
            <div class="gn-shimmer gn-skeleton__line" style="width: 3.5rem; height: 1.5rem;" />
            <div class="gn-shimmer gn-skeleton__line" style="width: 6rem; height: 0.85rem;" />
            <div class="gn-shimmer gn-skeleton__line" style="width: 8rem; height: 0.7rem; opacity: 0.55;" />
          </div>
        </div>
      </div>
    </div>

    <!-- Section heading + metric cards -->
    <div class="d-flex align-items-end justify-content-between mb-4">
      <div class="gn-skeleton__stack" style="gap: 0.4rem;">
        <div class="gn-shimmer gn-skeleton__line" style="width: 9rem; height: 1rem;" />
        <div class="gn-shimmer gn-skeleton__line" style="width: 14rem; height: 0.75rem; opacity: 0.55;" />
      </div>
      <div class="gn-shimmer gn-skeleton__pill" />
    </div>

    <div class="row g-5 g-xl-6 mb-6 mb-xl-10">
      <div v-for="i in 4" :key="`metric-${i}`" class="col-xl-3 col-md-6">
        <div class="gn-skeleton__metric">
          <div class="gn-shimmer gn-skeleton__line" style="width: 4rem; height: 1.75rem; background-color-mix: in srgb, currentColor 30%;" />
          <div class="gn-shimmer gn-skeleton__line" style="width: 7rem; height: 0.8rem; margin-top: 0.65rem;" />
        </div>
      </div>
    </div>

    <div class="row g-5 g-xl-6 mb-6 mb-xl-10">
      <div v-for="i in 4" :key="`metric2-${i}`" class="col-xl-3 col-md-6">
        <div class="gn-skeleton__metric">
          <div class="gn-shimmer gn-skeleton__line" style="width: 4rem; height: 1.75rem;" />
          <div class="gn-shimmer gn-skeleton__line" style="width: 7rem; height: 0.8rem; margin-top: 0.65rem;" />
        </div>
      </div>
    </div>

    <!-- Activity row -->
    <div class="row g-5 g-xl-6 mb-6 mb-xl-10">
      <div v-for="i in 2" :key="`activity-${i}`" class="col-xl-6">
        <div class="gn-skeleton__panel">
          <div class="gn-skeleton__panel-header">
            <div class="gn-skeleton__stack" style="gap: 0.4rem;">
              <div class="gn-shimmer gn-skeleton__line" style="width: 10rem; height: 1rem;" />
              <div class="gn-shimmer gn-skeleton__line" style="width: 14rem; height: 0.75rem; opacity: 0.55;" />
            </div>
            <div class="gn-shimmer gn-skeleton__pill" />
          </div>
          <div class="gn-skeleton__panel-body">
            <div v-for="j in 4" :key="`row-${i}-${j}`" class="gn-skeleton__row">
              <div class="gn-shimmer gn-skeleton__avatar" />
              <div class="gn-skeleton__stack" style="flex: 1; gap: 0.45rem;">
                <div class="gn-shimmer gn-skeleton__line" style="width: 65%; height: 0.9rem;" />
                <div class="gn-shimmer gn-skeleton__line" style="width: 45%; height: 0.75rem; opacity: 0.55;" />
              </div>
              <div class="gn-shimmer gn-skeleton__badge" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick actions -->
    <div class="gn-skeleton__panel">
      <div class="gn-skeleton__panel-header">
        <div class="gn-skeleton__stack" style="gap: 0.4rem;">
          <div class="gn-shimmer gn-skeleton__line" style="width: 9rem; height: 1rem;" />
          <div class="gn-shimmer gn-skeleton__line" style="width: 14rem; height: 0.75rem; opacity: 0.55;" />
        </div>
      </div>
      <div class="gn-skeleton__panel-body">
        <div class="row g-5">
          <div v-for="i in 4" :key="`action-${i}`" class="col-lg-3 col-md-6">
            <div class="gn-skeleton__action">
              <div class="gn-shimmer gn-skeleton__icon-large" />
              <div class="gn-skeleton__stack" style="flex: 1; gap: 0.45rem;">
                <div class="gn-shimmer gn-skeleton__line" style="width: 80%; height: 0.9rem;" />
                <div class="gn-shimmer gn-skeleton__line" style="width: 55%; height: 0.75rem; opacity: 0.55;" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Pure presentational component
</script>

<style scoped>
.gn-skeleton {
  --sk-surface: #ffffff;
  --sk-border: rgba(15, 23, 42, 0.06);
  --sk-base: rgba(15, 23, 42, 0.06);
  --sk-highlight: rgba(15, 23, 42, 0.12);
  --sk-radius: 1rem;
}

:global([data-bs-theme='dark']) .gn-skeleton {
  --sk-surface: rgba(255, 255, 255, 0.03);
  --sk-border: rgba(255, 255, 255, 0.08);
  --sk-base: rgba(255, 255, 255, 0.06);
  --sk-highlight: rgba(167, 139, 250, 0.16);
}

.gn-shimmer {
  position: relative;
  background: var(--sk-base);
  border-radius: 0.5rem;
  overflow: hidden;
  isolation: isolate;
}

.gn-shimmer::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--sk-highlight) 50%,
    transparent 100%
  );
  animation: gn-shimmer-slide 1.6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  transform: translateX(-100%);
}

@keyframes gn-shimmer-slide {
  100% { transform: translateX(100%); }
}

.gn-skeleton__card {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--sk-surface);
  border: 1px solid var(--sk-border);
  border-radius: var(--sk-radius);
  box-shadow: 0 8px 20px -16px rgba(15, 23, 42, 0.12);
  height: 100%;
  align-items: flex-start;
}

.gn-skeleton__icon {
  width: 52px;
  height: 52px;
  border-radius: 0.85rem;
  flex-shrink: 0;
}

.gn-skeleton__icon-large {
  width: 56px;
  height: 56px;
  border-radius: 0.9rem;
  flex-shrink: 0;
}

.gn-skeleton__stack {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
  flex: 1;
}

.gn-skeleton__line {
  display: block;
}

.gn-skeleton__pill {
  width: 6rem;
  height: 2rem;
  border-radius: 999px;
}

.gn-skeleton__metric {
  padding: 1.4rem 1.4rem 1.6rem;
  border-radius: var(--sk-radius);
  background: var(--sk-surface);
  border: 1px solid var(--sk-border);
  box-shadow: 0 8px 20px -16px rgba(15, 23, 42, 0.12);
  height: 100%;
  min-height: 120px;
}

.gn-skeleton__panel {
  background: var(--sk-surface);
  border: 1px solid var(--sk-border);
  border-radius: var(--sk-radius);
  box-shadow: 0 8px 20px -16px rgba(15, 23, 42, 0.12);
  overflow: hidden;
  margin-bottom: 1.5rem;
}

.gn-skeleton__panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.4rem 1.4rem 1rem;
  gap: 1rem;
  border-bottom: 1px dashed var(--sk-border);
}

.gn-skeleton__panel-body {
  padding: 1rem 1.4rem 1.4rem;
}

.gn-skeleton__row {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 0.75rem 0;
  border-bottom: 1px dashed var(--sk-border);
}

.gn-skeleton__row:last-child {
  border-bottom: 0;
}

.gn-skeleton__avatar {
  width: 42px;
  height: 42px;
  border-radius: 999px;
  flex-shrink: 0;
}

.gn-skeleton__badge {
  width: 4rem;
  height: 1.5rem;
  border-radius: 999px;
  flex-shrink: 0;
}

.gn-skeleton__action {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 1rem 1.2rem;
  background: var(--sk-surface);
  border-radius: 0.85rem;
  border: 1px solid var(--sk-border);
}
</style>
