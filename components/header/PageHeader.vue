<template>
  <div class="gn-page-header">
    <h1 class="gn-page-header__title">
      {{ title || computedTitle || 'Dashboard' }}
    </h1>
    <p v-if="subtitle" class="gn-page-header__subtitle">
      {{ subtitle }}
    </p>
    <nav
      v-if="breadcrumbItems.length > 1"
      class="gn-page-header__breadcrumb"
      aria-label="Breadcrumb"
    >
      <ol>
        <li
          v-for="(item, index) in breadcrumbItems"
          :key="`${item.title}-${index}`"
        >
          <NuxtLink v-if="item.path && index < breadcrumbItems.length - 1" :to="item.path">
            {{ item.title }}
          </NuxtLink>
          <span v-else>{{ item.title }}</span>
          <span
            v-if="index < breadcrumbItems.length - 1"
            class="gn-page-header__sep"
            aria-hidden="true"
          >/</span>
        </li>
      </ol>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore';

defineProps<{
  title?: string;
  subtitle?: string;
}>();

const breadcrumbStore = useBreadcrumbStore();

const breadcrumbItems = computed(() => breadcrumbStore.items);
const computedTitle = computed(() => {
  if (breadcrumbStore.items.length === 0) return '';
  return breadcrumbStore.items[breadcrumbStore.items.length - 1].title;
});
</script>

<style scoped>
.gn-page-header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.15rem;
  min-width: 0;
  margin-right: 1rem;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.gn-page-header__title {
  margin: 0;
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: -0.018em;
  line-height: 1.1;
  color: var(--gn-page-title, #0f172a);
}

.gn-page-header__subtitle {
  margin: 0;
  font-size: 0.85rem;
  color: var(--gn-page-subtitle, rgba(15, 23, 42, 0.6));
  font-weight: 500;
}

.gn-page-header__breadcrumb {
  font-size: 0.75rem;
  color: var(--gn-page-breadcrumb, rgba(15, 23, 42, 0.55));
  padding-top: 0.15rem;
}

.gn-page-header__breadcrumb ol {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.3rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.gn-page-header__breadcrumb li {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.gn-page-header__breadcrumb a {
  color: inherit;
  text-decoration: none;
  transition: color 0.2s ease;
}

.gn-page-header__breadcrumb a:hover {
  color: #7c3aed;
}

.gn-page-header__sep {
  opacity: 0.45;
}
</style>

<style>
/* The Keen `.app-header` container is dark in both themes, so the page title
   needs to stay light regardless of body theme. */
html .gn-page-header {
  --gn-page-title: #ffffff;
  --gn-page-subtitle: rgba(245, 245, 247, 0.72);
  --gn-page-breadcrumb: rgba(245, 245, 247, 0.55);
}

.gn-page-header .gn-page-header__breadcrumb a:hover {
  color: #c4b5fd !important;
}
</style>
