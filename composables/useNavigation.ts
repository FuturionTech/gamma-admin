import { useRoute } from 'vue-router';
import type { RouteLocationNormalizedLoaded } from 'vue-router';

export const useNavigation = () => {
  const route = useRoute();

  /**
   * Check if the current route matches the given path
   * @param path - The path to check against the current route
   * @returns boolean - True if the current route matches the given path
   */
  const isActive = (path: string): boolean => {
    return route.path === path || route.path.startsWith(`${path}/`);
  };

  /**
   * Check if any of the given paths match the current route
   * @param paths - Array of paths to check against the current route
   * @returns boolean - True if any of the paths match the current route
   */
  const isAnyActive = (paths: string[]): boolean => {
    return paths.some(path => isActive(path));
  };

  /**
   * Get the current route object
   * @returns RouteLocationNormalizedLoaded - The current route object
   */
  const getCurrentRoute = (): RouteLocationNormalizedLoaded => {
    return route;
  };

  return {
    isActive,
    isAnyActive,
    getCurrentRoute
  };
};

export default useNavigation;
