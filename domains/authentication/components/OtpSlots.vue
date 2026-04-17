<template>
  <div
    class="otp-slots"
    :class="{ 'otp-slots--error': !!error, 'otp-slots--disabled': disabled }"
    role="group"
    :aria-label="ariaLabel"
  >
    <input
      v-for="(_, index) in length"
      :key="index"
      :ref="(el) => setRef(el as HTMLInputElement | null, index)"
      type="text"
      inputmode="numeric"
      pattern="[0-9]*"
      maxlength="1"
      :value="digits[index] ?? ''"
      :disabled="disabled"
      :aria-label="`Digit ${index + 1} of ${length}`"
      :aria-invalid="!!error"
      autocomplete="one-time-code"
      class="otp-slots__slot"
      @input="(e) => handleInput(e, index)"
      @keydown="(e) => handleKeydown(e, index)"
      @paste="handlePaste"
      @focus="(e) => (e.target as HTMLInputElement).select()"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';

interface Props {
  modelValue: string;
  length?: number;
  disabled?: boolean;
  error?: boolean;
  ariaLabel?: string;
  autofocus?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  length: 6,
  disabled: false,
  error: false,
  ariaLabel: 'One-time verification code',
  autofocus: true,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'complete', value: string): void;
}>();

const inputRefs = ref<Array<HTMLInputElement | null>>([]);

const setRef = (el: HTMLInputElement | null, index: number) => {
  inputRefs.value[index] = el;
};

const digits = computed(() => {
  const chars = (props.modelValue || '').split('').slice(0, props.length);
  while (chars.length < props.length) chars.push('');
  return chars;
});

const focusIndex = async (index: number) => {
  await nextTick();
  const safe = Math.max(0, Math.min(index, props.length - 1));
  inputRefs.value[safe]?.focus();
};

const commit = (next: string[]) => {
  const joined = next.join('').slice(0, props.length);
  emit('update:modelValue', joined);
  if (joined.length === props.length && !joined.includes(' ')) {
    emit('complete', joined);
  }
};

const handleInput = (event: Event, index: number) => {
  const target = event.target as HTMLInputElement;
  const raw = target.value.replace(/\D/g, '');

  const current = [...digits.value];

  if (!raw) {
    current[index] = '';
    commit(current);
    return;
  }

  if (raw.length > 1) {
    const chars = raw.split('');
    for (let i = 0; i < chars.length && index + i < props.length; i++) {
      current[index + i] = chars[i];
    }
    commit(current);
    focusIndex(Math.min(index + chars.length, props.length - 1));
    return;
  }

  current[index] = raw;
  commit(current);
  if (index < props.length - 1) focusIndex(index + 1);
};

const handleKeydown = (event: KeyboardEvent, index: number) => {
  const key = event.key;
  const current = [...digits.value];

  if (key === 'Backspace') {
    if (current[index]) {
      current[index] = '';
      commit(current);
      return;
    }
    if (index > 0) {
      event.preventDefault();
      current[index - 1] = '';
      commit(current);
      focusIndex(index - 1);
    }
    return;
  }

  if (key === 'ArrowLeft' && index > 0) {
    event.preventDefault();
    focusIndex(index - 1);
    return;
  }

  if (key === 'ArrowRight' && index < props.length - 1) {
    event.preventDefault();
    focusIndex(index + 1);
    return;
  }

  if (key === 'Home') {
    event.preventDefault();
    focusIndex(0);
    return;
  }

  if (key === 'End') {
    event.preventDefault();
    focusIndex(props.length - 1);
  }
};

const handlePaste = (event: ClipboardEvent) => {
  const raw = event.clipboardData?.getData('text') ?? '';
  const cleaned = raw.replace(/\D/g, '').slice(0, props.length);
  if (!cleaned) return;
  event.preventDefault();
  const next = cleaned.split('');
  while (next.length < props.length) next.push('');
  commit(next);
  focusIndex(Math.min(cleaned.length, props.length - 1));
};

const focusFirst = () => focusIndex(0);
const clear = () => {
  commit(Array(props.length).fill(''));
  focusIndex(0);
};

defineExpose({ focusFirst, clear });

watch(
  () => props.autofocus,
  (value) => {
    if (value) focusIndex(0);
  },
  { immediate: true },
);
</script>

<style scoped>
.otp-slots {
  display: grid;
  grid-template-columns: repeat(var(--otp-length, 6), 1fr);
  gap: 0.75rem;
  max-width: 100%;
}

.otp-slots__slot {
  width: 100%;
  aspect-ratio: 1 / 1.1;
  min-height: 3.5rem;
  padding: 0;
  text-align: center;
  font-family: 'Space Grotesk', 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 1.75rem;
  font-weight: 600;
  font-feature-settings: 'tnum' 1;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  transition:
    border-color 0.25s ease,
    background 0.25s ease,
    box-shadow 0.25s ease,
    transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.otp-slots__slot::selection {
  background: rgba(167, 139, 250, 0.35);
}

.otp-slots__slot:hover:not(:disabled) {
  border-color: rgba(255, 255, 255, 0.18);
}

.otp-slots__slot:focus {
  outline: none;
  border-color: rgba(167, 139, 250, 0.65);
  background: rgba(167, 139, 250, 0.08);
  box-shadow:
    0 0 0 4px rgba(139, 92, 246, 0.15),
    0 10px 30px -10px rgba(124, 58, 237, 0.5);
  transform: translateY(-1px);
}

.otp-slots--error .otp-slots__slot {
  border-color: rgba(220, 38, 38, 0.55);
  background: rgba(220, 38, 38, 0.08);
  animation: shake 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97);
}

.otp-slots--error .otp-slots__slot:focus {
  box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.2);
}

.otp-slots--disabled .otp-slots__slot {
  opacity: 0.6;
  cursor: not-allowed;
}

@keyframes shake {
  10%, 90% { transform: translateX(-1px); }
  20%, 80% { transform: translateX(2px); }
  30%, 50%, 70% { transform: translateX(-3px); }
  40%, 60% { transform: translateX(3px); }
}

@media (max-width: 420px) {
  .otp-slots {
    gap: 0.5rem;
  }
  .otp-slots__slot {
    min-height: 3rem;
    font-size: 1.5rem;
  }
}
</style>
