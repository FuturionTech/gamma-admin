import type {UserType} from "~/domains/shared/types/user";

export type OtpMethod = 'EMAIL' | 'SMS';

export interface RequestOtpInput {
    identifier: string;
    userType: UserType;
    method: OtpMethod;
    language?: string;
}

export interface RequestOtpResult {
    requestOtp: {
        success: boolean;
        message?: string;
    };
}

export interface VerifyOtpInput {
    identifier: string;
    userType: UserType;
    code: string;
}

export interface VerifyOtpResult {
    verifyOtp: {
        success: boolean;
        message?: string;
        authToken?: string;
        expiresAt?: string;
    };
}
