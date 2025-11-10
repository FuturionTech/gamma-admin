<template>
  <div
      class="menu menu-column menu-rounded menu-sub-indention fw-semibold"
      id="kt_app_sidebar_menu"
      data-kt-menu="true"
      data-kt-menu-expand="false"
  >
    <!-- Loop through each section -->
    <div v-for="section in menuSections" :key="section.key">
      <!-- Section Title -->
      <div class="menu-item pt-5">
        <div class="menu-content">
          <span class="menu-heading fw-bold text-uppercase fs-7">{{ getLocalizedText(section.title) }}</span>
        </div>
      </div>

      <!-- Loop through each route in the section -->
      <div
          v-for="item in section.routes"
          :key="item.key"
          :class="getMenuItemClasses(item)"
          :data-kt-menu-trigger="(item.children && item.children.length) ? 'click' : null"
      >
        <!-- If the item has children (submenu) -->
        <template v-if="item.children && item.children.length">
          <!-- Parent item with icon and arrow - Keen Template handles accordion -->
          <span class="menu-link">
            <span class="menu-icon">
              <i :class="item.icon">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
                <span class="path4"></span>
                <span class="path5"></span>
                <span class="path6"></span>
              </i>
            </span>
            <span class="menu-title">{{ getLocalizedText(item.title) }}</span>
            <span class="menu-arrow"></span>
          </span>
          <!-- Submenu -->
          <div class="menu-sub menu-sub-accordion">
            <!-- Child items -->
            <div
                v-for="child in item.children"
                :key="child.key"
                :class="getMenuItemClasses(child)"
                :data-kt-menu-trigger="(child.children && child.children.length) ? 'click' : null"
            >
              <!-- If child has its own children (grandchildren) -->
              <template v-if="child.children && child.children.length">
                <span class="menu-link">
                  <!-- Show child's icon if exists, else default bullet -->
                  <template v-if="child.icon">
                    <span class="menu-icon">
                      <i :class="child.icon">
                        <span class="path1"></span>
                        <span class="path2"></span>
                        <span class="path3"></span>
                        <span class="path4"></span>
                        <span class="path5"></span>
                        <span class="path6"></span>
                      </i>
                    </span>
                  </template>
                  <template v-else>
                    <span class="menu-bullet">
                      <span class="bullet bullet-dot"></span>
                    </span>
                  </template>
                  <span class="menu-title">{{ getLocalizedText(child.title) }}</span>
                  <span class="menu-arrow"></span>
                </span>
                <!-- Grandchild submenu -->
                <div class="menu-sub menu-sub-accordion">
                  <div
                      v-for="grandChild in child.children"
                      :key="grandChild.key"
                      :class="getMenuItemClasses(grandChild)"
                      :data-kt-menu-trigger="(grandChild.children && grandChild.children.length) ? 'click' : null"
                  >
                    <!-- GrandChild with children (grandChildChild) -->
                    <template v-if="grandChild.children && grandChild.children.length">
                      <span class="menu-link">
                        <template v-if="grandChild.icon">
                          <span class="menu-icon">
                            <i :class="grandChild.icon">
                              <span class="path1"></span>
                              <span class="path2"></span>
                              <span class="path3"></span>
                              <span class="path4"></span>
                              <span class="path5"></span>
                              <span class="path6"></span>
                            </i>
                          </span>
                        </template>
                        <template v-else>
                          <span class="menu-bullet">
                            <span class="bullet bullet-dot"></span>
                          </span>
                        </template>
                        <span class="menu-title">{{ getLocalizedText(grandChild.title) }}</span>
                        <span class="menu-arrow"></span>
                      </span>

                      <!-- GrandChildChildren submenu -->
                      <div class="menu-sub menu-sub-accordion">
                        <div
                            v-for="grandChildChild in grandChild.children"
                            :key="grandChildChild.key"
                            class="menu-item"
                        >
                          <component
                              :is="isExternalLink(grandChildChild) ? 'a' : 'NuxtLink'"
                              v-if="grandChildChild.path"
                              :to="isExternalLink(grandChildChild) ? undefined : grandChildChild.path"
                              :href="isExternalLink(grandChildChild) ? grandChildChild.path : undefined"
                              :target="getLinkTarget(grandChildChild)"
                              :class="getMenuLinkClasses(grandChildChild)"
                          >
                            <template v-if="grandChildChild.icon">
                              <span class="menu-icon">
                                <i :class="grandChildChild.icon">
                                  <span class="path1"></span>
                                  <span class="path2"></span>
                                  <span class="path3"></span>
                                  <span class="path4"></span>
                                  <span class="path5"></span>
                                  <span class="path6"></span>
                                </i>
                              </span>
                            </template>
                            <template v-else>
                              <span class="menu-bullet">
                                <span class="bullet bullet-dot"></span>
                              </span>
                            </template>
                            <span class="menu-title">{{ getLocalizedText(grandChildChild.title) }}</span>
                          </component>
                        </div>
                      </div>
                    </template>

                    <!-- GrandChild without further children (direct link) -->
                    <template v-else-if="grandChild.path">
                      <component
                          :is="isExternalLink(grandChild) ? 'a' : 'NuxtLink'"
                          :to="isExternalLink(grandChild) ? undefined : grandChild.path"
                          :href="isExternalLink(grandChild) ? grandChild.path : undefined"
                          :target="getLinkTarget(grandChild)"
                          :class="getMenuLinkClasses(grandChild)"
                      >
                        <template v-if="grandChild.icon">
                          <span class="menu-icon">
                            <i :class="grandChild.icon">
                              <span class="path1"></span>
                              <span class="path2"></span>
                              <span class="path3"></span>
                              <span class="path4"></span>
                              <span class="path5"></span>
                              <span class="path6"></span>
                            </i>
                          </span>
                        </template>
                        <template v-else>
                          <span class="menu-bullet">
                            <span class="bullet bullet-dot"></span>
                          </span>
                        </template>
                        <span class="menu-title">{{ getLocalizedText(grandChild.title) }}</span>
                      </component>
                    </template>
                  </div>
                </div>

              </template>

              <!-- Direct child item without further nesting -->
              <template v-else-if="child.path">
                <component
                    :is="isExternalLink(child) ? 'a' : 'NuxtLink'"
                    :to="isExternalLink(child) ? undefined : child.path"
                    :href="isExternalLink(child) ? child.path : undefined"
                    :target="getLinkTarget(child)"
                    :class="getMenuLinkClasses(child)"
                    @click="(e: Event) => handleMenuClick(child, e)"
                >
                  <!-- Check for child's icon -->
                  <template v-if="child.icon">
                    <span class="menu-icon">
                      <i :class="child.icon">
                        <span class="path1"></span>
                        <span class="path2"></span>
                        <span class="path3"></span>
                        <span class="path4"></span>
                        <span class="path5"></span>
                        <span class="path6"></span>
                      </i>
                    </span>
                  </template>
                  <template v-else>
                    <span class="menu-bullet">
                      <span class="bullet bullet-dot"></span>
                    </span>
                  </template>
                  <span class="menu-title">{{ getLocalizedText(child.title) }}</span>
                </component>
              </template>
            </div>
          </div>
        </template>

        <!-- If the item has no children (direct link) -->
        <template v-else-if="item.path">
          <component
              :is="isExternalLink(item) ? 'a' : 'NuxtLink'"
              :to="isExternalLink(item) ? undefined : item.path"
              :href="isExternalLink(item) ? item.path : undefined"
              :target="getLinkTarget(item)"
              :class="getMenuLinkClasses(item)"
              @click="(e: Event) => handleMenuClick(item, e)"
          >
            <span class="menu-icon">
              <i :class="item.icon">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
                <span class="path4"></span>
                <span class="path5"></span>
                <span class="path6"></span>
              </i>
            </span>
            <span class="menu-title">{{ getLocalizedText(item.title) }}</span>
          </component>
        </template>
      </div>
    </div>



    <!-- Logout Menu Item -->
    <div class="menu-item">
      <NuxtLink @click.prevent="handleLogout" class="menu-link" to="/">
        <span class="menu-icon">
          <i class="ki-duotone ki-entrance-right fs-3 text-danger">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
        </span>
        <span class="menu-title text-danger">Se Déconnecter</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import type { MenuSection, MenuItem } from '~/domains/shared/types/menu';

const router = useRouter();
const route = useRoute();

// Import menu data directly
import menuData from '~/assets/data/menu-config.json';
const menuConfigData = menuData as { sections: MenuSection[] };

// Use all menu sections without filtering
const menuSections = menuConfigData.sections;



// Method to handle logout
const handleLogout = () => {
  router.push('/logout');
};

// Method to handle menu clicks
const handleMenuClick = (menuItem: any, event?: Event) => {
  if (menuItem.path && !isExternalLink(menuItem)) {
    // Prevent any default behavior and force navigation
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    router.push(menuItem.path);
  }
};

// Language support - French as default
const currentLanguage = ref('fr'); // You can make this reactive based on user preference

// Helper function to get localized text
const getLocalizedText = (text: string | { fr: string; en: string }): string => {
  if (typeof text === 'string') {
    return text;
  }
  return text[currentLanguage.value as keyof typeof text] || text.fr || text.en || '';
};

// Reactive current path for better reactivity
const currentPath = ref(route.path);
const isClient = ref(false);

// Watch route changes to update active states
watch(route, (newRoute) => {
  currentPath.value = newRoute.path;
}, { immediate: true });

// Helper functions for menu rendering
const isExternalLink = (menuItem: any): boolean => {
  return menuItem.isExternal || false;
};

const getLinkTarget = (menuItem: any): string => {
  return menuItem.target || (menuItem.isExternal ? '_blank' : '_self');
};

// Check if a menu item is currently active
const isMenuItemActive = (menuItem: any): boolean => {
  if (!menuItem.path || !isClient.value) return false;
  
  // Exact path match only - no more partial matching
  if (menuItem.path === currentPath.value) {
    return true;
  }
  
  return false;
};

// Check if a menu item has active children
const hasActiveChildren = (menuItem: any): boolean => {
  if (!menuItem.children || menuItem.children.length === 0 || !isClient.value) {
    return false;
  }
  
  // Check direct children
  for (const child of menuItem.children) {
    if (isMenuItemActive(child)) {
      return true;
    }
    
    // Check grandchildren recursively
    if (hasActiveChildren(child)) {
      return true;
    }
  }
  
  return false;
};

// Enhanced menu item classes with better active state detection
const getMenuItemClasses = (menuItem: any): string[] => {
  const classes = ['menu-item'];
  
  if (menuItem.children && menuItem.children.length > 0) {
    classes.push('menu-accordion');
  }
  
  // Check if this item or any of its children are active
  const isActive = isMenuItemActive(menuItem);
  const hasActiveChild = hasActiveChildren(menuItem);
  
  // Only mark as active if it's an exact match OR if it has active children (but not both)
  if (isActive) {
    classes.push('here');
  } else if (hasActiveChild) {
    classes.push('here');
    
    // Add 'show' class to expand accordion if it has active children
    if (menuItem.children && menuItem.children.length > 0) {
      classes.push('show');
    }
  }
  
  return classes;
};

// Enhanced menu link classes
const getMenuLinkClasses = (menuItem: any): string[] => {
  const classes = ['menu-link'];
  
  // Add active class for exact matches
  if (isMenuItemActive(menuItem)) {
    classes.push('active');
  }
  
  return classes;
};





// Initialize Metronic's KTMenu when component is mounted
onMounted(() => {
  // Set client flag to true
  isClient.value = true;
  
  // Force update current path
  currentPath.value = route.path;
  
  // Initialize Metronic's KTMenu if needed
  if (typeof window !== 'undefined' && (window as any).KTMenu) {
    setTimeout(() => {
      // Initialize KTMenu but allow Vue Router to handle navigation
      const menuElement = document.querySelector('#kt_app_sidebar_menu');
      if (menuElement) {
        (window as any).KTMenu.createInstances();
        
        // Fix accordion behavior - close other menus when one opens
        const accordionItems = menuElement.querySelectorAll('.menu-item.menu-accordion');
        accordionItems.forEach((item: Element) => {
          const link = item.querySelector('.menu-link');
          if (link) {
            link.addEventListener('click', (e: Event) => {
              // Close all other accordions
              accordionItems.forEach((otherItem: Element) => {
                if (otherItem !== item) {
                  otherItem.classList.remove('show');
                  const subMenu = otherItem.querySelector('.menu-sub');
                  if (subMenu) {
                    subMenu.style.display = 'none';
                  }
                }
              });
            });
          }
        });
        
        // Prevent KTMenu from interfering with NuxtLink clicks
        menuElement.addEventListener('click', (e: Event) => {
          const target = e.target as HTMLElement;
          const link = target.closest('a[href]') || target.closest('[data-nuxt-link]');
          if (link && !target.closest('.menu-arrow')) {
            // Let Vue Router handle the navigation
            e.stopPropagation();
          }
        });
      }
    }, 1000);
  }
  
      // Force trigger reactive updates after a delay
    setTimeout(() => {
      currentPath.value = route.path;
    }, 2000);
});
</script>

<style scoped>
/* Keen Template Menu Highlighting CSS */

/* Menu item states */
.menu-item {
  transition: all 0.3s ease;
}

/* Active menu item highlighting */
.menu-item.here > .menu-link {
  background-color: var(--bs-primary-bg-subtle, #f5f8fa);
  color: var(--bs-primary, #009ef7);
}

.menu-item.here > .menu-link .menu-title {
  color: var(--bs-primary, #009ef7);
  font-weight: 600;
}

.menu-item.here > .menu-link .menu-icon {
  color: var(--bs-primary, #009ef7);
}

/* Active link states */
.menu-link.active {
  background-color: var(--bs-primary-bg-subtle, #f5f8fa);
  color: var(--bs-primary, #009ef7);
}

.menu-link.active .menu-title {
  color: var(--bs-primary, #009ef7);
  font-weight: 600;
}

.menu-link.active .menu-icon {
  color: var(--bs-primary, #009ef7);
}

/* Submenu accordion states */
.menu-item.menu-accordion.here.show > .menu-sub {
  display: block;
}

.menu-item.menu-accordion.here > .menu-link {
  background-color: var(--bs-primary-bg-subtle, #f5f8fa);
  color: var(--bs-primary, #009ef7);
}

.menu-item.menu-accordion.here > .menu-link .menu-title {
  color: var(--bs-primary, #009ef7);
  font-weight: 600;
}

.menu-item.menu-accordion.here > .menu-link .menu-icon {
  color: var(--bs-primary, #009ef7);
}

/* Hover states */
.menu-item:hover > .menu-link:not(.active) {
  background-color: #f8f9fa;
}

/* Ensure the show class works for accordion expansion */
.menu-item.menu-accordion.show > .menu-sub {
  display: block;
}

.menu-item.menu-accordion:not(.show) > .menu-sub {
  display: none;
}

/* Menu link base styles */
.menu-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 0.475rem;
  margin: 0.125rem 0;
  text-decoration: none;
  transition: all 0.3s ease;
}

/* Menu icon spacing */
.menu-icon {
  margin-right: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
}

/* Menu title */
.menu-title {
  flex: 1;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Menu arrow for accordions */
.menu-arrow {
  margin-left: auto;
  transition: transform 0.3s ease;
}

.menu-item.menu-accordion.show > .menu-link .menu-arrow {
  transform: rotate(90deg);
}



/* Submenu styling */
.menu-sub {
  padding-left: 2.5rem;
  margin-top: 0.25rem;
}

.menu-sub .menu-item {
  margin: 0.125rem 0;
}

.menu-sub .menu-link {
  padding: 0.5rem 1rem;
  font-size: 0.825rem;
}

/* Bullet styles for submenu items without icons */
.menu-bullet {
  margin-right: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
}

.bullet.bullet-dot {
  width: 0.375rem;
  height: 0.375rem;
  background-color: #99A1B7;
  border-radius: 50%;
}

/* Active submenu bullet */
.menu-item.here .bullet.bullet-dot {
  background-color: var(--bs-primary, #009ef7);
}

/* Menu section titles */
.menu-heading {
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.75rem;
  font-weight: 600;
  color: #99A1B7;
  margin-bottom: 0.5rem;
}
</style>