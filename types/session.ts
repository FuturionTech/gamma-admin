export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  display_name: string;
  description: string;
  group: string;
  created_at: string;
  updated_at: string;
  pivot: {
    role_id: number;
    permission_id: number;
  };
}

export interface Role {
  id: number;
  name: string;
  guard_name: string;
  display_name: string;
  description: string;
  is_reserved: boolean;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  pivot: {
    model_id: number;
    role_id: number;
  };
  permissions: Permission[];
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  email_verified_at: string | null;
  phone_verified_at: string | null;
  is_active: boolean;
  status: string;
  last_login_at: string | null;
  last_active_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  permissions: string[];
  roles: Role[];
}

// Extend the auth module types
declare module '#auth-utils' {
  interface UserSession {
    user: User;
  }
}

// For Nuxt Auth Next
// declare module '@auth/core/types' {
//   interface Session {
//     user?: User;
//   }
// }


// For H3 event context
declare module 'h3' {
  interface H3EventContext {
    session?: {
      data: {
        user: User;
      };
    };
  }
}
