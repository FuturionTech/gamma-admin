<template>
  <div class="auth-card">
    <header class="auth-card__header">
      <span class="auth-card__eyebrow">{{ $t('auth.otp.eyebrow') }}</span>
      <h1 class="auth-card__title">{{ $t('auth.otp.title') }}</h1>
      <p class="auth-card__subtitle">
        <span>{{ $t('auth.otp.sentToIntro') }}</span>
        <span class="auth-card__identifier">{{ maskedIdentifier }}</span>
      </p>
    </header>

    <form class="auth-card__form" novalidate @submit.prevent="handleSubmit">
      <div class="auth-card__field">
        <span class="auth-card__label">{{ $t('auth.otp.codeLabel') }}</span>
        <OtpSlots
          ref="slotsRef"
          v-model="code"
          :length="6"
          :error="!!errorMessage"
          :disabled="loading"
          :aria-label="$t('auth.otp.codeLabel')"
          @complete="handleComplete"
        />
        <p class="auth-card__helper">
          <span class="auth-card__helper-icon" aria-hidden="true" v-html="shieldIcon" />
          {{ $t('auth.otp.validity') }}
        </p>
      </div>

      <transition name="auth-slide">
        <div v-if="errorMessage" class="auth-card__error" role="alert">
          <span class="auth-card__error-icon" aria-hidden="true" v-html="alertIcon" />
          <span>{{ errorMessage }}</span>
        </div>
      </transition>

      <transition name="auth-slide">
        <div v-if="successMessage" class="auth-card__success" role="status">
          <span class="auth-card__success-icon" aria-hidden="true" v-html="checkIcon" />
          <span>{{ successMessage }}</span>
        </div>
      </transition>

      <button
        type="submit"
        class="auth-card__submit"
        :disabled="loading || code.length !== 6"
      >
        <span v-if="!loading">{{ $t('auth.otp.submit') }}</span>
        <span v-else class="auth-card__submit-loading">
          <span class="auth-card__spinner" aria-hidden="true" />
          {{ $t('auth.otp.verifying') }}
        </span>
      </button>

      <div class="auth-card__resend">
        <span>{{ $t('auth.otp.resendPrompt') }}</span>
        <button
          type="button"
          class="auth-card__resend-action"
          :disabled="!canResend || resending"
          @click="handleResend"
        >
          <span v-if="resending">{{ $t('auth.otp.resending') }}</span>
          <span v-else-if="countdown.isActive.value">
            {{ $t('auth.otp.resendIn', { seconds: countdown.remaining.value }) }}
          </span>
          <span v-else>{{ $t('auth.otp.resendAction') }}</span>
        </button>
      </div>

      <NuxtLink to="/login" class="auth-card__back">
        <span class="auth-card__back-icon" aria-hidden="true" v-html="backIcon" />
        {{ $t('auth.otp.backToLogin') }}
      </NuxtLink>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useOtpCountdown } from '~/domains/authentication/composables/useOtpCountdown';
import { useAuthenticationStore } from '~/domains/authentication/stores/useAuthenticationStore';
import type { OtpMethod } from '~/domains/shared/types/authentication';

definePageMeta({
  layout: 'auth',
  auth: false,
});

const { t, locale } = useI18n();
const { signIn } = useAuth();
const route = useRoute();
const router = useRouter();
const authStore = useAuthenticationStore();

const shieldIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 5 6v6c0 4.2 2.9 7.95 7 9 4.1-1.05 7-4.8 7-9V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></svg>`;
const alertIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>`;
const checkIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></svg>`;
const backIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18 9 12l6-6"/></svg>`;

const method = ref<OtpMethod | null>(null);
const identifier = ref('');
const code = ref('');
const errorMessage = ref<string | null>(null);
const successMessage = ref<string | null>(null);
const loading = ref(false);
const resending = ref(false);
const slotsRef = ref<{ focusFirst: () => void; clear: () => void } | null>(null);

const countdown = useOtpCountdown({ durationSeconds: 45 });

const canResend = computed(() => !countdown.isActive.value && !resending.value);

const currentLanguage = computed<'EN' | 'FR'>(() => (locale.value === 'fr' ? 'FR' : 'EN'));

const maskedIdentifier = computed(() => {
  if (!method.value || !identifier.value) return '';
  if (method.value === 'EMAIL') {
    const [name, domain] = identifier.value.split('@');
    if (!name || !domain) return identifier.value;
    const masked = name.length > 2 ? `${name.slice(0, 2)}•••` : '•••';
    return `${masked}@${domain}`;
  }
  const last4 = identifier.value.slice(-4);
  const prefix = identifier.value.slice(0, Math.max(0, identifier.value.length - 6));
  return `${prefix}•••${last4}`;
});

onMounted(() => {
  const routeMethod = (route.query.method as OtpMethod) || authStore.method;
  const routeIdentifier = (route.query.identifier as string) || authStore.identifier || '';

  if (!routeMethod || !routeIdentifier) {
    router.replace('/login');
    return;
  }

  method.value = routeMethod;
  identifier.value = routeIdentifier;
  countdown.start();
});

const handleComplete = (value: string) => {
  if (loading.value) return;
  code.value = value;
  handleSubmit();
};

const handleSubmit = async () => {
  if (code.value.length !== 6) {
    errorMessage.value = t('auth.otp.errors.incomplete');
    return;
  }

  if (!method.value || !identifier.value) {
    errorMessage.value = t('auth.otp.errors.session');
    return;
  }

  loading.value = true;
  errorMessage.value = null;
  successMessage.value = null;

  try {
    await signIn(
      {
        identifier: identifier.value,
        code: code.value,
        method: method.value,
      },
      { callbackUrl: '/' },
    );
    await navigateTo('/');
  } catch {
    errorMessage.value = t('auth.otp.errors.invalid');
    code.value = '';
    slotsRef.value?.clear();
  } finally {
    loading.value = false;
  }
};

const handleResend = async () => {
  if (!canResend.value || !method.value || !identifier.value) return;

  resending.value = true;
  errorMessage.value = null;
  successMessage.value = null;

  try {
    const response = await authStore.requestOtp({
      identifier: identifier.value,
      method: method.value,
      language: currentLanguage.value,
    });

    if (response.success) {
      successMessage.value = t('auth.otp.codeResent');
      code.value = '';
      slotsRef.value?.clear();
      countdown.start();
    } else {
      errorMessage.value = response.error || t('auth.otp.errors.resend');
    }
  } catch {
    errorMessage.value = t('auth.otp.errors.unknown');
  } finally {
    resending.value = false;
  }
};
</script>

<style scoped>
.auth-card {
  width: 100%;
  max-width: 460px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  color: #f5f5f7;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.auth-card__header {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.auth-card__eyebrow {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #a78bfa;
}

.auth-card__title {
  margin: 0;
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  font-weight: 600;
  font-size: clamp(2rem, 3.4vw, 2.6rem);
  line-height: 1.1;
  letter-spacing: -0.028em;
  color: #ffffff;
}

.auth-card__subtitle {
  margin: 0;
  font-size: 1rem;
  color: rgba(245, 245, 247, 0.72);
  line-height: 1.5;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.auth-card__identifier {
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.65rem;
  background: rgba(167, 139, 250, 0.1);
  border: 1px solid rgba(167, 139, 250, 0.3);
  border-radius: 999px;
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  font-weight: 500;
  font-size: 0.85rem;
  color: #c4b5fd;
}

.auth-card__form {
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}

.auth-card__field {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.auth-card__label {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  color: rgba(245, 245, 247, 0.72);
  text-transform: uppercase;
}

.auth-card__helper {
  margin: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  font-size: 0.8rem;
  color: rgba(245, 245, 247, 0.5);
  line-height: 1.45;
}

.auth-card__helper-icon {
  display: inline-flex;
  width: 14px;
  height: 14px;
  color: #6ee7b7;
}

.auth-card__helper-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.auth-card__error,
.auth-card__success {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  font-size: 0.88rem;
  line-height: 1.45;
}

.auth-card__error {
  background: rgba(248, 113, 113, 0.08);
  border: 1px solid rgba(248, 113, 113, 0.25);
  color: #fca5a5;
}

.auth-card__success {
  background: rgba(52, 211, 153, 0.08);
  border: 1px solid rgba(52, 211, 153, 0.25);
  color: #6ee7b7;
}

.auth-card__error-icon,
.auth-card__success-icon {
  display: inline-flex;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.auth-card__error-icon :deep(svg),
.auth-card__success-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.auth-card__submit {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  height: 54px;
  padding: 0 1.75rem;
  border: 0;
  border-radius: 999px;
  background: linear-gradient(135deg, #a78bfa 0%, #7c3aed 50%, #6d28d9 100%);
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  font-size: 0.98rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  cursor: pointer;
  box-shadow:
    0 18px 40px -18px rgba(124, 58, 237, 0.75),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.2);
  transition:
    transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    box-shadow 0.3s ease,
    filter 0.25s ease;
}

.auth-card__submit:hover:not(:disabled) {
  transform: translateY(-1px);
  filter: brightness(1.06);
  box-shadow:
    0 24px 48px -20px rgba(124, 58, 237, 0.85),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.25);
}

.auth-card__submit:active:not(:disabled) {
  transform: translateY(0);
}

.auth-card__submit:disabled {
  cursor: not-allowed;
  filter: grayscale(0.4) brightness(0.85);
  box-shadow: none;
}

.auth-card__submit:focus-visible {
  outline: 2px solid rgba(167, 139, 250, 0.9);
  outline-offset: 3px;
}

.auth-card__submit-loading {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
}

.auth-card__spinner {
  width: 16px;
  height: 16px;
  border-radius: 999px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #ffffff;
  animation: auth-spin 0.8s linear infinite;
}

.auth-card__resend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: rgba(245, 245, 247, 0.55);
}

.auth-card__resend-action {
  border: 0;
  background: transparent;
  color: #a78bfa;
  font-weight: 500;
  font-size: 0.85rem;
  cursor: pointer;
  transition: color 0.25s ease, opacity 0.25s ease;
  padding: 0;
  font-family: inherit;
}

.auth-card__resend-action:hover:not(:disabled) {
  color: #c4b5fd;
}

.auth-card__resend-action:disabled {
  cursor: not-allowed;
  opacity: 0.75;
}

.auth-card__back {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  margin: 0 auto;
  font-size: 0.85rem;
  color: rgba(245, 245, 247, 0.55);
  text-decoration: none;
  padding: 0.5rem 0.8rem;
  border-radius: 999px;
  transition: color 0.25s ease, background 0.25s ease;
}

.auth-card__back:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.04);
}

.auth-card__back-icon {
  display: inline-flex;
  width: 14px;
  height: 14px;
}

.auth-card__back-icon :deep(svg) {
  width: 100%;
  height: 100%;
}

@keyframes auth-spin {
  to { transform: rotate(360deg); }
}

.auth-slide-enter-active,
.auth-slide-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.auth-slide-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.auth-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
