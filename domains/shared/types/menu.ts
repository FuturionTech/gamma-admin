export interface MenuItem {
  key: string;
  title: string | { fr: string; en: string };
  path?: string;
  icon?: string;
  children?: MenuItem[];
  isExternal?: boolean;
  target?: string;
  permissions?: string[];
  description?: string | { fr: string; en: string };
  priority?: number;
}

export interface MenuSection {
  title: string | { fr: string; en: string };
  key: string;
  routes: MenuItem[];
  priority?: number;
}

// Removed - replaced above

export interface MenuConfig {
  sections: MenuSection[];
}

// Note: Permission filtering functions removed for simplified menu system 