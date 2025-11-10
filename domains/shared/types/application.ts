// domains/shared/types/application.ts
export interface ApplicationTheme {
    id: string;
    primary_color: string;
    secondary_color: string;
    tertiary_color: string;
    created_at: string;
    updated_at: string;
}

export interface ApplicationInformation {
    id: string;
    application_id: string;
    name: string;
    frontoffice_url?: string;
    backoffice_url?: string;
    description?: string;
    logo?: string;
    compact_logo?: string;
    logo_dark?: string;
    compact_logo_dark?: string;
    logoUrl?: string;
    compactLogoUrl?: string;
    logoDarkUrl?: string;
    compactLogoDarkUrl?: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
}


export interface Application {
    id: string;
    name: string;
    is_admin: boolean;
    is_enabled: boolean;
    theme: ApplicationTheme;
    information: ApplicationInformation;
    created_at: string;
    updated_at: string;
}

export interface ApplicationResponse {
    application: Application
}

export interface PaginatorInfo {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
    hasMorePages: boolean;
}

export interface ApplicationsListResponse {
    applications: {
        data: Application[];
        paginatorInfo: PaginatorInfo;
    };
}
