import { defineStore } from 'pinia';
import { useAuth } from '#imports';
import { requestOtpMutation, verifyOtpMutation } from '~/domains/authentication/graphql/mutations';
import type {
  OtpMethod,
  RequestOtpInput,
  RequestOtpResult,
  VerifyOtpInput,
  VerifyOtpResult,
} from '~/domains/shared/types/authentication';
import type { NetworkResponse } from '~/domains/shared/types/network';
import { UserType } from '~/domains/shared/types/user';

export const useAuthenticationStore = defineStore('authentication', {
  state: () => ({
    method: null as OtpMethod | null,
    identifier: '',
    token: null,
    userType: null as UserType | null,
    expiresAt: null as string | null,
  }),

  getters: {
    isAuthenticated: () => {
      const { status } = useAuth();
      return status.value === 'authenticated';
    },
    getToken: () => {
      const { data } = useAuth();
      return data.value?.accessToken || null;
    },
    getMethod: (state) => state.method,
    getIdentifier: (state) => state.identifier,
  },

  actions: {
    /**
     * Sends an OTP to the user
     */
    async requestOtp(input: RequestOtpInput): Promise<NetworkResponse<RequestOtpResult>> {
      this.method = input.method;
      this.identifier = input.identifier;
      this.userType = input.userType;

      try {
        const { mutate } = useMutation<RequestOtpResult>(requestOtpMutation);
        const response = await mutate({ input });

        if (response?.errors?.length) {
          return {
            success: false,
            error: response.errors[0].message || 'Failed to send OTP',
            data: null,
          };
        }

        if (!response?.data?.requestOtp.success) {
          return {
            success: false,
            error: response?.data?.requestOtp.message || 'Failed to send OTP',
            data: null,
          };
        }

        return {
          success: true,
          data: response?.data || null,
          error: null,
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message || 'Failed to send OTP',
          data: null,
        };
      }
    },

    /**
     * Verifies the OTP and logs the user in
     */
    async verifyOtp(input: VerifyOtpInput): Promise<NetworkResponse<VerifyOtpResult>> {
      try {
        const { mutate } = useMutation<VerifyOtpResult>(verifyOtpMutation);
        const response = await mutate({ input });

        if (response?.errors?.length) {
          return {
            success: false,
            error: response.errors[0].message || 'Failed to verify OTP',
            data: null,
          };
        }

        const result = response?.data?.verifyOtp;
        
        if (result?.success && result.authToken) {
          this.token = result.authToken;
          this.expiresAt = result.expiresAt || null;
          
          // Set the auth token for subsequent requests
          const authToken = useCookie('auth_token');
          authToken.value = result.authToken;
        }

        return {
          success: true,
          data: response?.data || null,
          error: null,
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message || 'Failed to verify OTP',
          data: null,
        };
      }
    },

    /**
     * Logs the user out
     */
    logout() {
      this.token = null;
      this.method = null;
      this.identifier = '';
      this.userType = null;
      this.expiresAt = null;
      
      // Clear the auth token
      const authToken = useCookie('auth_token');
      authToken.value = null;
      
      // Clear the Apollo cache
      const { $apollo } = useNuxtApp();
      $apollo.defaultClient.clearStore();
      
      // Redirect to login
      navigateTo('/login');
    },
  },
  
  // persist: process.env.NODE_ENV === 'production'
  persist: true
});
