<!-- otp.vue -->
<template>
  <div>
    <div class="d-flex flex-center flex-column flex-lg-row-fluid">
      <div class="w-lg-500px p-10">
        <form @submit.prevent="handleSubmit" class="form w-100" novalidate>
          <div class="text-center mb-7">
            <div class="brand-logo mb-5">
              <img alt="Gamma Neutral Consulting" src="/assets/media/logos/logo.png" class="h-80px" />
            </div>

            <h1 class="text-dark fw-bolder mb-2 fs-2x">
              Verification
            </h1>

            <div class="fs-6 text-gray-600 mb-1">Gamma Neutral Consulting</div>
            <div class="fs-7 text-gray-500 mb-3">One-time security code to access your account</div>
          </div>

          <div class="card auth-card mb-8">
            <div class="card-header border-0 pt-8 pb-0">
              <h2 class="card-title text-dark fw-bold fs-3">Enter the code you received</h2>
            </div>
            <div class="card-body p-8 pt-3">
              <p class="text-gray-600 fs-6 mb-5">
                Enter the 6-digit code sent to
                <span class="fw-bold text-gray-800">{{ maskedIdentifier || 'your device' }}</span>
              </p>
              
              <!-- Input fields -->
              <div class="mb-8">
                <div class="otp-input-container">
                  <input
                    v-for="(digit, index) in otpDigits"
                    :key="index"
                    type="text"
                    :name="'code_' + (index + 1)"
                    maxlength="1"
                    class="otp-input"
                    v-model="otpDigits[index]"
                    @input="onInput(index)"
                    @keydown="handleKeyDown($event, index)"
                    @keypress="validateNumericInput"
                    @paste="handlePaste($event)"
                    inputmode="numeric"
                    pattern="[0-9]*"
                    autocomplete="one-time-code"
                    required
                  />
                </div>

                <div class="text-gray-500 fs-7 mt-2 text-center">
                  <i class="ki-outline ki-shield-tick fs-7 me-1 text-success"></i>
                  This code is valid for 15 minutes
                </div>
              </div>

              <!-- Error message -->
              <div v-if="errorMessage" class="alert alert-danger d-flex p-4 mb-6">
                <i class="ki-outline ki-shield-cross fs-2 text-danger me-3"></i>
                <div>
                  {{ errorMessage }}
                </div>
              </div>

              <!-- Action buttons -->
              <div class="d-flex justify-content-center mt-7">
                <button
                  type="submit"
                  class="btn btn-primary btn-sm fw-semibold px-10 py-3"
                  :disabled="loading || otpDigits.join('').length !== 6"
                >
                  <span v-if="!loading" class="indicator-label">
                    Verify
                  </span>
                  <span v-else class="indicator-progress">
                    <span class="spinner-border spinner-border-sm align-middle"></span>
                    <span class="ms-2">Please wait...</span>
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div class="text-center fs-7 text-gray-500 mt-6">
            <span class="text-gray-600">Didn't receive the code?</span>
            <a href="#" @click.prevent="resendOTP" class="text-primary fw-medium ms-1">Resend</a>
          </div>
          
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { UserType } from '~/domains/shared/types/user';
import { useAuthenticationStore } from '~/domains/authentication/stores/useAuthenticationStore';
import type { OtpMethod } from '~/domains/shared/types/authentication';
import {Language} from "~/domains/shared/types/language";

definePageMeta({
  layout: 'auth',
  auth: false
});

const {signIn} = useAuth();
const route = useRoute();
const router = useRouter();
const authStore = useAuthenticationStore();

const language = ref<Language>(Language.FR);

const method = ref<OtpMethod | null>(null);
const identifier = ref('');
const errorMessage = ref<string | null>(null);
const loading = ref<boolean>(false);
const otpDigits = ref<string[]>(['', '', '', '', '', '']);
const resendEnabled = ref(true);
const resendCountdown = ref(30);

onMounted(() => {

  // Get browser language (returns something like 'fr', 'en-US', etc.)
  const browserLang = navigator.language || (navigator as any).userLanguage;

  // Check if browser language starts with 'fr' (for fr, fr-FR, fr-CA, etc.)
  if (browserLang.toLowerCase().startsWith('fr')) {
    language.value = Language.FR;
  } else {
    language.value = Language.EN;
  }

  // Try to get from route query first, then fallback to store
  method.value = (route.query.method as OtpMethod) || authStore.getMethod;
  identifier.value = (route.query.identifier as string) || authStore.getIdentifier || '';
  
  // If still no method/identifier, redirect to login
  if (!method.value || !identifier.value) {
    router.push('/login');
    return;
  }
  
  // Start resend countdown
  startResendCountdown();
});

// Format the identifier for display
const maskedIdentifier = computed(() => {
  if (!method.value || !identifier.value) return '';
  
  if (method.value === 'EMAIL') {
    const [name, domain] = identifier.value.split('@');
    if (!name || !domain) return identifier.value;
    const maskedName = name.length > 2 ? name.slice(0, 2) + '***' : '***';
    return `${maskedName}@${domain}`;
  } else if (method.value === 'SMS') {
    const last4 = identifier.value.slice(-4);
    return `******${last4}`;
  }
  
  return '';
});

// Handle resend OTP countdown
const startResendCountdown = () => {
  resendEnabled.value = false;
  resendCountdown.value = 30;
  
  const timer = setInterval(() => {
    resendCountdown.value--;
    if (resendCountdown.value <= 0) {
      clearInterval(timer);
      resendEnabled.value = true;
    }
  }, 1000);
};

// Gestion des entrées
const onInput = (index: number) => {
  // Ensure only numbers are stored
  otpDigits.value[index] = otpDigits.value[index].replace(/[^0-9]/g, '');
  
  if (otpDigits.value[index].length === 1 && index < otpDigits.value.length - 1) {
    const nextInput = document.querySelector(`input[name="code_${index + 2}"]`) as HTMLInputElement;
    if (nextInput) nextInput.focus();
  }
};

// Handle all keyboard events
const handleKeyDown = (event: KeyboardEvent, index: number) => {
  // Handle backspace
  if (event.key === 'Backspace') {
    if (otpDigits.value[index] === '' && index > 0) {
      const prevInput = document.querySelector(`input[name="code_${index}"]`) as HTMLInputElement;
      if (prevInput) prevInput.focus();
    }
  }
  // Handle arrow keys for navigation
  else if (event.key === 'ArrowLeft' && index > 0) {
    const prevInput = document.querySelector(`input[name="code_${index}"]`) as HTMLInputElement;
    if (prevInput) prevInput.focus();
  }
  else if (event.key === 'ArrowRight' && index < otpDigits.value.length - 1) {
    const nextInput = document.querySelector(`input[name="code_${index + 2}"]`) as HTMLInputElement;
    if (nextInput) nextInput.focus();
  }
};

// Prevent non-numeric input
const validateNumericInput = (event: KeyboardEvent) => {
  const keyCode = event.keyCode;
  // Allow only numbers (0-9)
  if (keyCode < 48 || keyCode > 57) {
    event.preventDefault();
  }
};

// Gestion du collage
const handlePaste = (event: ClipboardEvent) => {
  const pasteData = event.clipboardData?.getData('text') || '';
  const digits = pasteData.replace(/\D/g, '').slice(0, 6).split('');
  if (digits.length === 6) {
    event.preventDefault();
    otpDigits.value = digits;
    digits.forEach((digit, index) => {
      const input = document.querySelector(`input[name="code_${index + 1}"]`) as HTMLInputElement;
      if (input) input.value = digit;
    });
  }
};

// Handle form submission
const handleSubmit = async () => {
  const otpCode = otpDigits.value.join('');

  if (otpCode.length !== 6) {
    errorMessage.value = 'Please enter a 6-digit code';
    return;
  }

  if (!method.value || !identifier.value) {
    errorMessage.value = 'Invalid session. Please try again.';
    return;
  }
  
  loading.value = true;
  errorMessage.value = null;
  
  const credentials = {
    identifier: identifier.value,
    code: otpCode,
    method: method.value
  };

  try {
    await signIn(credentials, { callbackUrl: '/' });
    loading.value = false;
    await navigateTo('/');
  } catch (error) {
    console.error('OTP verification error:', error);
    loading.value = false;
    errorMessage.value = 'Verification error; OTP invalid or expired';
    // Clear OTP fields on error
    otpDigits.value = ['', '', '', '', '', ''];
    // Focus first input
    const firstInput = document.querySelector('input[name="code_1"]') as HTMLInputElement;
    if (firstInput) firstInput.focus();
  }
};

// Resend OTP
const resendOTP = async () => {
  if (!resendEnabled.value || !method.value || !identifier.value) return;
  
  loading.value = true;
  errorMessage.value = null;
  
  try {
    const response = await authStore.requestOtp({
      identifier: identifier.value,
      method: method.value,
      language: language.value
    });
    
    if (!response.success) {
      // Focus the first input
      const firstInput = document.querySelector('input[name="code_1"]') as HTMLInputElement;
      if (firstInput) firstInput.focus();
    } else {
      errorMessage.value = response.error || 'Unable to resend code. Please try again.';
    }
  } catch (error) {
    console.error('Error resending OTP:', error);
    errorMessage.value = 'An error occurred. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Logo styling */
.brand-logo {
  padding: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Card styling */
.auth-card {
  border: none;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.03);
  border-radius: 12px;
}

.card-header {
  background: transparent;
}

/* OTP Input Field Styling */
.otp-input-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
  padding: 0 10px;
}

.otp-input {
  width: 60px;
  height: 60px;
  border: 1px solid #e4e6ef;
  border-radius: 10px;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  background-color: #f9f9f9;
  transition: all 0.2s ease;
}

.otp-input:focus {
  border-color: rgba(182, 44, 255, 0.4);
  box-shadow: 0 0 0 0.25rem rgba(182, 44, 255, 0.15);
  background-color: #fff;
}

/* Form styling */
.form-control {
  height: calc(3.25rem + 2px);
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border-radius: 0.5rem;
  border-color: #e4e6ef;
}

.form-control:focus {
  border-color: rgba(182, 44, 255, 0.4);
  box-shadow: 0 0 0 0.25rem rgba(182, 44, 255, 0.15);
}

.spinner-border {
  width: 1rem;
  height: 1rem;
}

/* Transition animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
