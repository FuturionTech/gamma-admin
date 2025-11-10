import { ref } from 'vue';
import { useRoute } from 'vue-router';
import type { MenuConfig, MenuSection, MenuItem } from '~/domains/shared/types/menu';
import menuConfigData from '~/assets/data/menu-config.json';

export const useMenu = () => {
  const route = useRoute();
  const menuConfig = ref<MenuConfig>(menuConfigData as MenuConfig);

  /**
   * Get all menu sections (no filtering needed)
   * @returns All menu sections
   */
  const getMenuSections = () => {
    return menuConfig.value.sections;
  };

  /**
   * Check if a menu item is currently active
   * @param menuItem - The menu item to check
   * @returns boolean - True if the menu item is active
   */
  const isMenuItemActive = (menuItem: MenuItem): boolean => {
    // Direct path match
    if (menuItem.path && menuItem.path === route.path) {
      return true;
    }

    // Check if current path starts with menu item path (for nested routes)
    if (menuItem.path && !menuItem.isExternal && route.path.startsWith(menuItem.path)) {
      return true;
    }

    // Check children recursively
    if (menuItem.children && menuItem.children.length > 0) {
      return menuItem.children.some((child: MenuItem) => isMenuItemActive(child));
    }

    return false;
  };

  /**
   * Check if a menu item should show as expanded (has active children)
   * @param menuItem - The menu item to check
   * @returns boolean - True if the menu item should be expanded
   */
  const shouldExpand = (menuItem: MenuItem): boolean => {
    if (!menuItem.children || menuItem.children.length === 0) {
      return false;
    }

    return menuItem.children.some((child: MenuItem) => isMenuItemActive(child));
  };

  /**
   * Get the link target for a menu item
   * @param menuItem - The menu item
   * @returns string - The target attribute value
   */
  const getLinkTarget = (menuItem: MenuItem): string => {
    return menuItem.target || (menuItem.isExternal ? '_blank' : '_self');
  };

  /**
   * Check if a link is external
   * @param menuItem - The menu item
   * @returns boolean - True if the link is external
   */
  const isExternalLink = (menuItem: MenuItem): boolean => {
    return menuItem.isExternal || false;
  };

  /**
   * Get menu item classes for styling
   * @param menuItem - The menu item
   * @returns array of CSS classes
   */
  const getMenuItemClasses = (menuItem: MenuItem): string[] => {
    const classes = ['menu-item'];
    
    if (menuItem.children && menuItem.children.length > 0) {
      classes.push('menu-accordion');
    }
    
    if (isMenuItemActive(menuItem)) {
      classes.push('here', 'show');
    }
    
    return classes;
  };

  /**
   * Get menu link classes for styling
   * @param menuItem - The menu item
   * @returns array of CSS classes
   */
  const getMenuLinkClasses = (menuItem: MenuItem): string[] => {
    const classes = ['menu-link'];
    
    if (isMenuItemActive(menuItem)) {
      classes.push('active');
    }
    
    return classes;
  };

  return {
    menuConfig,
    getMenuSections,
    isMenuItemActive,
    shouldExpand,
    getLinkTarget,
    isExternalLink,
    getMenuItemClasses,
    getMenuLinkClasses
  };
}; 