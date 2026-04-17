<template>
  <nav class="gn-nav" aria-label="Main navigation">
    <div
      v-for="section in menuSections"
      :key="section.key"
      class="gn-nav__section"
    >
      <div class="gn-nav__section-label">
        {{ getLocalizedText(section.title) }}
      </div>
      <ul class="gn-nav__list">
        <li
          v-for="route in section.routes"
          :key="route.key"
          class="gn-nav__item"
        >
          <!-- Parent with children: split button + chevron toggle -->
          <template v-if="hasChildren(route)">
            <div
              class="gn-nav__row"
              :class="{ 'gn-nav__row--active': isParentActive(route) }"
            >
              <NuxtLink
                :to="route.path"
                class="gn-nav__link gn-nav__link--parent"
                :class="{ 'gn-nav__link--active': isRouteActive(route.path) }"
              >
                <span class="gn-nav__indicator" aria-hidden="true" />
                <span class="gn-nav__icon" aria-hidden="true">
                  <i :class="route.icon" />
                </span>
                <span class="gn-nav__label">{{ getLocalizedText(route.title) }}</span>
              </NuxtLink>
              <button
                type="button"
                class="gn-nav__chevron"
                :aria-expanded="isExpanded(route.key)"
                :aria-label="`Toggle ${getLocalizedText(route.title)} sub-menu`"
                @click="toggleExpanded(route.key)"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  :class="{ 'gn-nav__chevron-icon--open': isExpanded(route.key) }"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </div>

            <!-- Children -->
            <Transition name="gn-nav-collapse">
              <ul v-if="isExpanded(route.key)" class="gn-nav__children">
                <li
                  v-for="child in route.children"
                  :key="child.key"
                  class="gn-nav__child-item"
                >
                  <NuxtLink
                    :to="child.path"
                    class="gn-nav__child-link"
                    :class="{ 'gn-nav__child-link--active': isChildActive(child.path, route.path) }"
                  >
                    <span class="gn-nav__child-dot" aria-hidden="true" />
                    <span class="gn-nav__child-label">{{ getLocalizedText(child.title) }}</span>
                  </NuxtLink>
                </li>
              </ul>
            </Transition>
          </template>

          <!-- Flat item (no children) -->
          <NuxtLink
            v-else
            :to="route.path"
            class="gn-nav__link"
            :class="{ 'gn-nav__link--active': isRouteActive(route.path) }"
          >
            <span class="gn-nav__indicator" aria-hidden="true" />
            <span class="gn-nav__icon" aria-hidden="true">
              <i :class="route.icon" />
            </span>
            <span class="gn-nav__label">{{ getLocalizedText(route.title) }}</span>
          </NuxtLink>
        </li>
      </ul>
    </div>

    <div class="gn-nav__section gn-nav__section--footer">
      <button
        type="button"
        class="gn-nav__link gn-nav__link--signout"
        @click="handleLogout"
      >
        <span class="gn-nav__indicator" aria-hidden="true" />
        <span class="gn-nav__icon" aria-hidden="true">
          <i class="fas fa-sign-out-alt" />
        </span>
        <span class="gn-nav__label">{{ signOutLabel }}</span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import menuData from '~/assets/data/menu-config.json'

interface LocalizedText {
  fr: string
  en: string
}

interface MenuChild {
  key: string
  title: string | LocalizedText
  path: string
}

interface MenuRoute {
  key: string
  title: string | LocalizedText
  path: string
  icon: string
  children?: MenuChild[]
}

interface MenuSection {
  key: string
  title: string | LocalizedText
  priority: number
  routes: MenuRoute[]
}

const { locale } = useI18n()
const route = useRoute()
const router = useRouter()

const menuConfig = menuData as { sections: MenuSection[] }
const menuSections = menuConfig.sections

const currentLanguage = computed(() => locale.value || 'en')

const signOutLabel = computed(() => (currentLanguage.value === 'fr' ? 'Déconnexion' : 'Sign out'))

const getLocalizedText = (text: string | LocalizedText): string => {
  if (typeof text === 'string') return text
  return text[currentLanguage.value as keyof LocalizedText] || text.en || text.fr || ''
}

const hasChildren = (route: MenuRoute): boolean => {
  return Array.isArray(route.children) && route.children.length > 0
}

const isRouteActive = (path: string): boolean => {
  if (path === '/') return route.path === '/'
  return route.path === path || route.path.startsWith(`${path}/`)
}

const isChildActive = (childPath: string, parentPath: string): boolean => {
  // Active when the child path is the best match (not overshadowed by the parent itself)
  if (route.path === childPath) return true
  if (childPath === parentPath) return route.path === parentPath
  return route.path.startsWith(`${childPath}/`)
}

const isParentActive = (parent: MenuRoute): boolean => {
  if (route.path === parent.path) return true
  if (!parent.children) return false
  return parent.children.some((child) => route.path === child.path || route.path.startsWith(`${child.path}/`))
}

// Expansion state
const expandedKeys = ref<Set<string>>(new Set())

const isExpanded = (key: string): boolean => expandedKeys.value.has(key)

const toggleExpanded = (key: string) => {
  const next = new Set(expandedKeys.value)
  if (next.has(key)) {
    next.delete(key)
  } else {
    next.add(key)
  }
  expandedKeys.value = next
}

// Auto-expand the parent that owns the currently active route
const syncExpandedFromRoute = () => {
  const next = new Set(expandedKeys.value)
  for (const section of menuSections) {
    for (const parent of section.routes) {
      if (hasChildren(parent) && isParentActive(parent)) {
        next.add(parent.key)
      }
    }
  }
  expandedKeys.value = next
}

watch(
  () => route.path,
  () => {
    syncExpandedFromRoute()
  },
  { immediate: true },
)

const handleLogout = () => {
  router.push('/logout')
}
</script>

<style>
/* Non-scoped so CSS variables cascade correctly from html[data-bs-theme] */
html .gn-nav {
  --gn-nav-text: rgba(15, 23, 42, 0.72);
  --gn-nav-text-hover: #0f172a;
  --gn-nav-text-active: #ffffff;
  --gn-nav-label-muted: rgba(15, 23, 42, 0.45);
  --gn-nav-hover-bg: rgba(139, 92, 246, 0.08);
  --gn-nav-active-bg: linear-gradient(135deg, #a78bfa 0%, #7c3aed 55%, #6d28d9 100%);
  --gn-nav-active-shadow: 0 10px 26px -12px rgba(124, 58, 237, 0.55);
  --gn-nav-indicator: #a78bfa;
  --gn-nav-icon: rgba(15, 23, 42, 0.55);
  --gn-nav-icon-hover: #7c3aed;
  --gn-nav-chevron: rgba(15, 23, 42, 0.45);
  --gn-nav-chevron-hover: #7c3aed;
  --gn-nav-child-text: rgba(15, 23, 42, 0.58);
  --gn-nav-child-text-hover: #0f172a;
  --gn-nav-child-text-active: #7c3aed;
  --gn-nav-child-dot: rgba(15, 23, 42, 0.2);
  --gn-nav-child-dot-active: #7c3aed;
  --gn-nav-branch: rgba(15, 23, 42, 0.1);
}

html .gn-nav {
  --gn-nav-signout: #dc2626;
  --gn-nav-signout-hover: #dc2626;
  --gn-nav-signout-hover-bg: rgba(220, 38, 38, 0.1);
}

html[data-bs-theme='dark'] .gn-nav {
  --gn-nav-text: rgba(245, 245, 247, 0.72);
  --gn-nav-text-hover: #ffffff;
  --gn-nav-label-muted: rgba(245, 245, 247, 0.42);
  --gn-nav-hover-bg: rgba(167, 139, 250, 0.12);
  --gn-nav-icon: rgba(245, 245, 247, 0.58);
  --gn-nav-icon-hover: #c4b5fd;
  --gn-nav-chevron: rgba(245, 245, 247, 0.45);
  --gn-nav-chevron-hover: #c4b5fd;
  --gn-nav-child-text: rgba(245, 245, 247, 0.6);
  --gn-nav-child-text-hover: #ffffff;
  --gn-nav-child-text-active: #c4b5fd;
  --gn-nav-child-dot: rgba(245, 245, 247, 0.25);
  --gn-nav-child-dot-active: #c4b5fd;
  --gn-nav-branch: rgba(255, 255, 255, 0.1);
  --gn-nav-signout: #f87171;
  --gn-nav-signout-hover: #fca5a5;
  --gn-nav-signout-hover-bg: rgba(248, 113, 113, 0.14);
}
</style>

<style scoped>
.gn-nav {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
  padding: 0.25rem 0.85rem 1.5rem;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.gn-nav__section {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.gn-nav__section--footer {
  margin-top: auto;
  padding-top: 1rem;
}

.gn-nav__section-label {
  padding: 0.35rem 0.9rem 0.5rem;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--gn-nav-label-muted);
}

.gn-nav__list {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.gn-nav__item {
  position: relative;
}

.gn-nav__row {
  display: flex;
  align-items: center;
  gap: 0;
  border-radius: 12px;
  position: relative;
}

.gn-nav__link {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.62rem 0.9rem;
  border-radius: 12px;
  color: var(--gn-nav-text);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.005em;
  transition:
    background 0.25s ease,
    color 0.25s ease,
    box-shadow 0.3s ease,
    transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  background: transparent;
  border: 0;
  width: 100%;
  cursor: pointer;
  font-family: inherit;
  text-align: left;
}

.gn-nav__link--parent {
  flex: 1;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.gn-nav__link:hover {
  background: var(--gn-nav-hover-bg);
  color: var(--gn-nav-text-hover);
}

.gn-nav__link:hover .gn-nav__icon {
  color: var(--gn-nav-icon-hover);
  transform: translateX(1px);
}

.gn-nav__link:focus-visible {
  outline: 2px solid rgba(167, 139, 250, 0.75);
  outline-offset: 2px;
}

.gn-nav__link--active {
  background: var(--gn-nav-active-bg);
  color: var(--gn-nav-text-active);
  box-shadow: var(--gn-nav-active-shadow);
}

.gn-nav__link--active .gn-nav__icon {
  color: #ffffff;
}

.gn-nav__link--active .gn-nav__indicator {
  opacity: 1;
  transform: translateY(-50%) scaleY(1);
}

.gn-nav__link--active:hover {
  background: var(--gn-nav-active-bg);
  color: var(--gn-nav-text-active);
  transform: translateY(-1px);
}

.gn-nav__indicator {
  position: absolute;
  top: 50%;
  left: -0.85rem;
  width: 3px;
  height: 60%;
  border-radius: 4px;
  background: var(--gn-nav-indicator);
  opacity: 0;
  transform: translateY(-50%) scaleY(0.5);
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  pointer-events: none;
}

.gn-nav__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: var(--gn-nav-icon);
  font-size: 0.95rem;
  transition: color 0.25s ease, transform 0.3s ease;
  flex-shrink: 0;
}

.gn-nav__label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Chevron */
.gn-nav__chevron {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 36px;
  padding: 0;
  border: 0;
  background: transparent;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  color: var(--gn-nav-chevron);
  cursor: pointer;
  transition: background 0.25s ease, color 0.25s ease;
  flex-shrink: 0;
}

.gn-nav__chevron:hover {
  background: var(--gn-nav-hover-bg);
  color: var(--gn-nav-chevron-hover);
}

.gn-nav__chevron:focus-visible {
  outline: 2px solid rgba(167, 139, 250, 0.75);
  outline-offset: 2px;
  border-radius: 8px;
}

.gn-nav__chevron svg {
  width: 14px;
  height: 14px;
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.gn-nav__chevron-icon--open {
  transform: rotate(180deg);
}

.gn-nav__row--active .gn-nav__chevron {
  color: var(--gn-nav-child-text-active);
}

/* Children */
.gn-nav__children {
  display: flex;
  flex-direction: column;
  gap: 0.05rem;
  list-style: none;
  padding: 0.25rem 0 0.35rem 2.25rem;
  margin: 0.1rem 0 0;
  position: relative;
}

.gn-nav__children::before {
  content: '';
  position: absolute;
  left: 1.6rem;
  top: 0.35rem;
  bottom: 0.35rem;
  width: 1px;
  background: var(--gn-nav-branch);
  border-radius: 1px;
}

.gn-nav__child-item {
  position: relative;
}

.gn-nav__child-link {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.48rem 0.85rem;
  border-radius: 10px;
  color: var(--gn-nav-child-text);
  text-decoration: none;
  font-size: 0.83rem;
  font-weight: 500;
  transition: background 0.2s ease, color 0.2s ease;
}

.gn-nav__child-link:hover {
  background: var(--gn-nav-hover-bg);
  color: var(--gn-nav-child-text-hover);
}

.gn-nav__child-link:hover .gn-nav__child-dot {
  background: var(--gn-nav-child-dot-active);
  transform: scale(1.3);
}

.gn-nav__child-link--active {
  color: var(--gn-nav-child-text-active);
  font-weight: 600;
}

.gn-nav__child-link--active .gn-nav__child-dot {
  background: var(--gn-nav-child-dot-active);
  transform: scale(1.3);
  box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.18);
}

.gn-nav__child-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--gn-nav-child-dot);
  transition: background 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
  flex-shrink: 0;
}

.gn-nav__child-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Collapse transition */
.gn-nav-collapse-enter-active,
.gn-nav-collapse-leave-active {
  transition:
    max-height 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    opacity 0.2s ease,
    padding 0.25s ease;
  overflow: hidden;
}

.gn-nav-collapse-enter-from,
.gn-nav-collapse-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.gn-nav-collapse-enter-to,
.gn-nav-collapse-leave-from {
  max-height: 260px;
  opacity: 1;
}

/* Sign out */
.gn-nav__link--signout {
  color: var(--gn-nav-signout, #dc2626);
}

.gn-nav__link--signout:hover {
  background: var(--gn-nav-signout-hover-bg, rgba(220, 38, 38, 0.1));
  color: var(--gn-nav-signout-hover, #dc2626);
}

.gn-nav__link--signout .gn-nav__icon {
  color: inherit;
}
</style>
