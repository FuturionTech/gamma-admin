import type { User, Role, Permission } from '~/types/session';

export { type User, type Role, type Permission };

export const useCurrentUser = () => {
  const user = useState<User | null>('user', () => null);
  const { data: authData, status } = useAuth();

  // Update user state when auth data changes
  watchEffect(() => {
    if (authData.value?.user) {
      user.value = authData.value.user as User;
    } else if (status.value === 'unauthenticated') {
      user.value = null;
    }
  });

  // Check if user has a specific permission
  const hasPermission = (permission: string): boolean => {
    if (!user.value) return false;
    return user.value.permissions?.includes(permission) || false;
  };

  // Check if user has any of the given permissions
  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user.value?.permissions?.length) return false;
    return permissions.some(permission => 
      user.value?.permissions?.includes(permission)
    );
  };

  // Check if user has all of the given permissions
  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!user.value?.permissions?.length) return false;
    return permissions.every(permission => 
      user.value?.permissions?.includes(permission)
    );
  };

  // Check if user has a specific role
  const hasRole = (roleName: string): boolean => {
    if (!user.value?.roles?.length) return false;
    return user.value.roles.some(role => role.name === roleName);
  };

  // Check if user has any of the given roles
  const hasAnyRole = (roleNames: string[]): boolean => {
    if (!user.value?.roles?.length) return false;
    return user.value.roles.some(role => roleNames.includes(role.name));
  };

  // Get user's full name
  const fullName = computed((): string => {
    if (!user.value) return '';
    return [user.value.first_name, user.value.last_name]
      .filter(Boolean)
      .join(' ')
      .trim();
  });

  // Get user's initials
  const initials = computed((): string => {
    if (!user.value) return '';
    return [user.value.first_name?.[0], user.value.last_name?.[0]]
      .filter(Boolean)
      .join('')
      .toUpperCase();
  });

  // Get user's primary role (first role in the array)
  const primaryRole = computed((): Role | null => {
    if (!user.value?.roles?.length) return null;
    return user.value.roles[0];
  });

  // Get all permissions from all roles
  const allPermissions = computed((): string[] => {
    if (!user.value?.roles) return [];
    
    const permissions = new Set<string>();
    
    // Add direct permissions
    if (user.value.permissions) {
      user.value.permissions.forEach(p => permissions.add(p));
    }
    
    // Add role permissions
    user.value.roles.forEach(role => {
      role.permissions?.forEach(p => permissions.add(p.name));
    });
    
    return Array.from(permissions);
  });

  return {
    user: readonly(user),
    fullName,
    initials,
    primaryRole,
    allPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    isAuthenticated: computed(() => !!user.value && status.value === 'authenticated'),
    isLoading: computed(() => status.value + '' === 'pending')
  };
};

// Auto-import the composable
export default useCurrentUser;
