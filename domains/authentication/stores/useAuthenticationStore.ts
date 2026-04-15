import { defineStore } from 'pinia';
import { useAuth } from '#imports';
import { requestOtpMutation } from '~/domains/authentication/graphql/mutations';
import type {
  OtpMethod,
  RequestOtpInput,
  RequestOtpResult,
} from '~/domains/shared/types/authentication';
import type { NetworkResponse } from '~/domains/shared/types/network';
import { UserType } from '~/domains/shared/types/user';

/**
 * Transient state for the OTP sign-in flow only.
 * The authoritative session and token are owned by @sidebase/nuxt-auth
 * (`useAuth()` / `auth.token` cookie). Do not duplicate token storage here.
 */
export const useAuthenticationStore = defineStore('authentication', {
  state: () => ({
    method: null as OtpMethod | null,
    identifier: '',
    userType: null as UserType | null,
  }),

  getters: {
    isAuthenticated: () => {
      const { status } = useAuth();
      return status.value === 'authenticated';
    },
    getMethod: (state) => state.method,
    getIdentifier: (state) => state.identifier,
  },

  actions: {
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

    reset() {
      this.method = null;
      this.identifier = '';
      this.userType = null;
    },
  },
});
