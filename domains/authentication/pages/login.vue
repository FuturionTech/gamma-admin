<template>
  <div class="auth-card">
    <header class="auth-card__header">
      <span class="auth-card__eyebrow">{{ $t('auth.login.eyebrow') }}</span>
      <h1 class="auth-card__title">{{ $t('auth.login.title') }}</h1>
      <p class="auth-card__subtitle">{{ $t('auth.login.subtitle') }}</p>
    </header>

    <form class="auth-card__form" novalidate @submit.prevent="handleSubmit">
      <p class="auth-card__description">{{ $t('auth.login.description') }}</p>

      <div class="auth-card__field">
        <label for="login-email" class="auth-card__label">{{ $t('auth.login.emailLabel') }}</label>
        <div class="auth-input" :class="{ 'auth-input--focused': emailFocused, 'auth-input--error': showError }">
          <span class="auth-input__icon" aria-hidden="true" v-html="mailIcon" />
          <input
            id="login-email"
            v-model.trim="identifier"
            type="email"
            inputmode="email"
            autocomplete="email"
            spellcheck="false"
            :placeholder="$t('auth.login.emailPlaceholder')"
            class="auth-input__control"
            @focus="emailFocused = true"
            @blur="emailFocused = false"
          />
        </div>
        <p class="auth-card__helper">{{ $t('auth.login.helper.email') }}</p>
      </div>

      <transition name="auth-slide">
        <div v-if="errorMessage" class="auth-card__error" role="alert">
          <span class="auth-card__error-icon" aria-hidden="true" v-html="alertIcon" />
          <span>{{ errorMessage }}</span>
        </div>
      </transition>

      <button
        type="submit"
        class="auth-card__submit"
        :disabled="loading || !canSubmit"
      >
        <span v-if="!loading">{{ $t('auth.login.submit') }}</span>
        <span v-else class="auth-card__submit-loading">
          <span class="auth-card__spinner" aria-hidden="true" />
          {{ $t('auth.login.submitting') }}
        </span>
      </button>

      <p class="auth-card__meta">
        <span>{{ $t('auth.login.support') }}</span>
        <a href="#" class="auth-card__meta-link">{{ $t('auth.login.supportAction') }}</a>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthenticationStore } from '~/domains/authentication/stores/useAuthenticationStore';

definePageMeta({
  layout: 'auth',
  auth: false,
});

const { t, locale } = useI18n();
const authStore = useAuthenticationStore();

const mailIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h13A2.5 2.5 0 0 1 21 7.5v9A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-9Z"/><path d="m3.5 7.5 7.54 5.26a2 2 0 0 0 2.25 0L20.5 7.5"/></svg>`;
const alertIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>`;

const identifier = ref('');
const emailFocused = ref(false);
const errorMessage = ref<string | null>(null);
const loading = ref(false);

const showError = computed(() => !!errorMessage.value);

const currentLanguage = computed<'EN' | 'FR'>(() => (locale.value === 'fr' ? 'FR' : 'EN'));

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const canSubmit = computed(() => isValidEmail(identifier.value));

onMounted(() => {
  authStore.reset();
});

watch(identifier, () => {
  if (errorMessage.value) errorMessage.value = null;
});

const handleSubmit = async () => {
  errorMessage.value = null;

  if (!isValidEmail(identifier.value)) {
    errorMessage.value = t('auth.login.errors.invalidEmail');
    return;
  }

  loading.value = true;
  try {
    const response = await authStore.requestOtp({
      identifier: identifier.value,
      method: 'EMAIL',
      language: currentLanguage.value,
    });

    if (response.success) {
      await navigateTo({
        path: '/otp',
        query: {
          method: 'EMAIL',
          identifier: identifier.value,
        },
      });
      return;
    }

    errorMessage.value = response.error || t('auth.login.errors.generic');
  } catch {
    errorMessage.value = t('auth.login.errors.unknown');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.auth-card {
  width: 100%;
  max-width: 440px;
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
}

.auth-card__form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.auth-card__description {
  margin: 0 0 -0.35rem;
  font-size: 0.9rem;
  line-height: 1.55;
  color: rgba(245, 245, 247, 0.6);
}

.auth-card__field {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
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
  font-size: 0.8rem;
  color: rgba(245, 245, 247, 0.5);
  line-height: 1.45;
}

.auth-input {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  transition:
    border-color 0.25s ease,
    background 0.25s ease,
    box-shadow 0.25s ease,
    transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.auth-input:hover {
  border-color: rgba(255, 255, 255, 0.18);
}

.auth-input--focused {
  border-color: rgba(167, 139, 250, 0.65);
  background: rgba(167, 139, 250, 0.07);
  box-shadow:
    0 0 0 4px rgba(139, 92, 246, 0.15),
    0 12px 32px -12px rgba(124, 58, 237, 0.5);
  transform: translateY(-1px);
}

.auth-input--error {
  border-color: rgba(248, 113, 113, 0.55);
  background: rgba(248, 113, 113, 0.06);
  box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.15);
}

.auth-input__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: rgba(245, 245, 247, 0.55);
  transition: color 0.25s ease;
}

.auth-input__icon :deep(svg) {
  width: 100%;
  height: 100%;
}

.auth-input--focused .auth-input__icon {
  color: #a78bfa;
}

.auth-input__control {
  flex: 1;
  border: 0;
  background: transparent;
  color: #ffffff;
  padding: 0.95rem 0;
  font-size: 0.98rem;
  font-weight: 500;
  letter-spacing: 0.005em;
  line-height: 1.4;
  outline: none;
  font-family: inherit;
  min-width: 0;
}

.auth-input__control::placeholder {
  color: rgba(245, 245, 247, 0.35);
  font-weight: 400;
}

.auth-card__error {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  background: rgba(248, 113, 113, 0.08);
  border: 1px solid rgba(248, 113, 113, 0.25);
  border-radius: 12px;
  color: #fca5a5;
  font-size: 0.88rem;
  line-height: 1.45;
}

.auth-card__error-icon {
  display: inline-flex;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  margin-top: 0.1rem;
}

.auth-card__error-icon :deep(svg) {
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

.auth-card__meta {
  margin: 0;
  text-align: center;
  font-size: 0.85rem;
  color: rgba(245, 245, 247, 0.55);
}

.auth-card__meta-link {
  color: #a78bfa;
  text-decoration: none;
  margin-left: 0.35rem;
  font-weight: 500;
  transition: color 0.25s ease;
}

.auth-card__meta-link:hover {
  color: #c4b5fd;
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
