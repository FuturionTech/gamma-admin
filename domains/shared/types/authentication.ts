export type OtpMethod = 'EMAIL' | 'SMS';

export interface RequestOtpInput {
    identifier: string;
    method: OtpMethod;
    language: 'EN' | 'FR';
}

export interface RequestOtpResult {
    requestOtp: {
        success: boolean;
        message?: string;
    };
}

export interface VerifyOtpInput {
    identifier: string;
    otp_code: string;
    method: OtpMethod;
}

export interface VerifyOtpResult {
    verifyOtp: {
        success: boolean;
        message?: string;
        authToken?: string;
        expiresAt?: string;
    };
}
