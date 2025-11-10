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
              Welcome
            </h1>

            <div class="fs-6 text-gray-600 mb-1">Administration Panel</div>
            <div class="fs-5 fw-semibold text-primary mb-1">Gamma Neutral Consulting</div>
            <div class="fs-7 text-gray-500 fst-italic">Your Data Solutions</div>
          </div>

          <div class="card auth-card mb-8">
            <div class="card-header border-0 pt-8 pb-0">
              <h2 class="card-title text-dark fw-bold fs-3">Sign in to your account</h2>
            </div>
            <div class="card-body p-8 pt-3">
              <p class="text-gray-600 fs-6 mb-7">
                Choose a method to receive a one-time verification code (OTP)
              </p>
              
              <div class="method-selector mb-8">
                <div class="row gx-3 gy-3">
                  <div class="col-6">
                    <div 
                      :class="['method-option', method === 'EMAIL' ? 'method-active' : '']" 
                      @click="selectMethod('EMAIL')"
                    >
                      <div class="option-icon">
                        <i class="ki-outline ki-sms fs-1"></i>
                      </div>
                      <div class="option-name">Email</div>
                      <input
                        class="form-check-input visually-hidden"
                        type="radio"
                        name="method"
                        id="methodEmail"
                        value="EMAIL"
                        v-model="method"
                      />
                    </div>
                  </div>
                  
                  <div class="col-6">
                    <div 
                      :class="['method-option', method === 'SMS' ? 'method-active' : '']" 
                      @click="selectMethod('SMS')"
                    >
                      <div class="option-icon">
                        <i class="ki-outline ki-call fs-1"></i>
                      </div>
                      <div class="option-name">SMS</div>
                      <input
                        class="form-check-input visually-hidden"
                        type="radio"
                        name="method"
                        id="methodSMS"
                        value="SMS"
                        v-model="method"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Input fields -->
              <div class="mb-8">
                <transition name="fade" mode="out-in">
                  <div v-if="method === 'EMAIL'" key="email">
                    <label class="form-label fs-6 fw-medium text-gray-700">Your email address</label>
                    <div class="input-group">
                      <span class="input-group-text">
                        <i class="ki-outline ki-sms fs-3 text-gray-500"></i>
                      </span>
                      <input
                        type="email"
                        placeholder="example@domain.com"
                        name="email"
                        autocomplete="email"
                        class="form-control form-control-lg"
                        v-model="identifier"
                        required
                      />
                    </div>
                    <div class="text-gray-500 fs-7 mt-2">
                      <i class="ki-outline ki-information-5 fs-7 me-1"></i>
                      A code will be sent to this address to verify your identity
                    </div>
                  </div>

                  <div v-else-if="method === 'SMS'" key="sms">
                    <label class="form-label fs-6 fw-medium text-gray-700">Your phone number</label>
                    <PhoneInput
                      v-model="identifier"
                      placeholder="+1 XX XX XX XX"
                      class="phone-input"
                      required
                    />
                    <div class="text-gray-500 fs-7 mt-2">
                      <i class="ki-outline ki-information-5 fs-7 me-1"></i>
                      A code will be sent to this number to verify your identity
                    </div>
                  </div>

                  <div v-else key="select">
                    <div class="d-flex flex-column align-items-center py-5">
                      <div class="empty-state-icon mb-4">
                        <i class="ki-outline ki-message-notif fs-3x text-primary"></i>
                      </div>
                      <div class="text-gray-600 fs-6 text-center">
                        Select Email or SMS to receive your sign-in code
                      </div>
                    </div>
                  </div>
                </transition>
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
                  :disabled="loading || !method"
                >
                  <span v-if="!loading" class="indicator-label">
                    Continue
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
            <span class="text-gray-600">Having trouble?</span>
            <a href="#" class="text-primary fw-medium ms-1">Contact support</a>
          </div>
          
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import PhoneInput from '~/domains/shared/components/PhoneInput.vue';
import { UserType } from '~/domains/shared/types/user';
import { useAuthenticationStore } from '~/domains/authentication/stores/useAuthenticationStore';
import type {OtpMethod} from '~/domains/shared/types/authentication';
import {Language} from "~/domains/shared/types/language";

definePageMeta({
  layout: 'auth',
  auth: false,
});

const authStore = useAuthenticationStore();
const language = ref<Language>(Language.FR);

const method = ref<OtpMethod | null>(null);
const identifier = ref('');
const errorMessage = ref<string | null>(null);
const loading = ref(false);

// Clear any existing auth state when loading login page
onMounted(() => {
  // Get browser language (returns something like 'fr', 'en-US', etc.)
  const browserLang = navigator.language || (navigator as any).userLanguage;

  // Check if browser language starts with 'fr' (for fr, fr-FR, fr-CA, etc.)
  if (browserLang.toLowerCase().startsWith('fr')) {
    language.value = Language.FR;
  } else {
    language.value = Language.EN;
  }

  authStore.logout();
});

const selectMethod = (methodType: 'EMAIL' | 'SMS') => {
  method.value = methodType;
  identifier.value = '';
  errorMessage.value = null;
};

const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// const validatePhone = (phone: string) => {
//   // Validate phone number format (+XXX XX XX XX XX)
//   return /^\+\d{1,4}\s\d{2}\s\d{2}\s\d{2}\s\d{2}$/.test(phone);
// };
const validatePhone = (phone: string) => {
  // Accepts + followed by 9-15 digits (common international format)
  return /^\+\d{9,15}$/.test(phone);
};

const handleSubmit = async () => {
  if (!method.value) {
    errorMessage.value = 'Please select a verification method.';
    return;
  }

  // Reset error message
  errorMessage.value = null;

  // Validate input based on method
  if (method.value === 'EMAIL' && !validateEmail(identifier.value)) {
    errorMessage.value = 'Please enter a valid email address.';
    return;
  } else if (method.value === 'SMS' && !validatePhone(identifier.value)) {
    errorMessage.value = 'Please enter a valid phone number.';
    return;
  }
  
  loading.value = true;
  
  try {
    const response = await authStore.requestOtp({
      identifier: identifier.value,
      method: method.value,
      language: Language.FR
    });

    if (response.success) {
      // Redirect to OTP page with the identifier and method
      await navigateTo({
        path: '/otp',
        query: {
          method: method.value,
          identifier: identifier.value
        }
      });
    } else {
      errorMessage.value = response.error || 'An error occurred while requesting the code.';
    }
  } catch (error: any) {
    console.error('Login error:', error);
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

/* Method selector styling */
.method-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 22px 15px;
  border-radius: 8px;
  border: 1px solid #f1f1f4;
  background-color: #f9f9f9;
  transition: all 0.2s ease;
  cursor: pointer;
}

.method-option:hover {
  background-color: #f5f8fa;
  border-color: #eaecf0;
}

.method-active {
  background-color: rgba(139, 92, 246, 0.04);
  border-color: rgba(139, 92, 246, 0.3);
}

.option-icon {
  margin-bottom: 12px;
  color: #7E8299;
}

.method-active .option-icon {
  color: #8b5cf6;
}

.option-name {
  font-weight: 500;
  font-size: 0.9rem;
  color: #3F4254;
}

.method-active .option-name {
  color: #8b5cf6;
  font-weight: 600;
}

.empty-state-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: rgba(139, 92, 246, 0.05);
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
  border-color: rgba(139, 92, 246, 0.4);
  box-shadow: 0 0 0 0.25rem rgba(139, 92, 246, 0.15);
}

.phone-input {
  width: 100%;
  min-height: calc(3.25rem + 2px);
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #e4e6ef;
  border-radius: 0.5rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.phone-input:focus-within {
  border-color: rgba(139, 92, 246, 0.4);
  box-shadow: 0 0 0 0.25rem rgba(139, 92, 246, 0.15);
  outline: 0;
}

.input-group-text {
  background-color: #f5f8fa;
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
  border-color: #e4e6ef;
  border-right: 0;
  padding: 0 1rem;
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
