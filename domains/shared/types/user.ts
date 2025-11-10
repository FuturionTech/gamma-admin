export enum UserType {
    TENANT = 'TENANT',
    ADMINISTRATOR = 'ADMINISTRATOR',
    USER = 'USER',
}


export interface UserBase {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    profile_picture?: string;
    created_at: string;
    updated_at: string;
}

// Unified Administrator type with a user_type field
export interface Administrator extends UserBase {
    user_type: UserType;
}

export interface MeTenantResponse {
    success: boolean;
    message: string;
    meTenant: Administrator | null;
}

export interface MeAdministratorResponse {
    success: boolean;
    message: string;
    meAdministrator: Administrator | null;
}

