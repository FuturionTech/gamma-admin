import { computed, onBeforeUnmount, ref } from 'vue';

export interface UseOtpCountdownOptions {
  durationSeconds?: number;
}

export function useOtpCountdown(options: UseOtpCountdownOptions = {}) {
  const duration = options.durationSeconds ?? 30;

  const remaining = ref(0);
  let timerId: ReturnType<typeof setInterval> | null = null;

  const clear = () => {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  };

  const start = (seconds: number = duration) => {
    clear();
    remaining.value = seconds;
    timerId = setInterval(() => {
      remaining.value -= 1;
      if (remaining.value <= 0) {
        clear();
        remaining.value = 0;
      }
    }, 1000);
  };

  const reset = () => {
    clear();
    remaining.value = 0;
  };

  const isActive = computed(() => remaining.value > 0);

  const formatted = computed(() => {
    const s = Math.max(0, remaining.value);
    const mm = Math.floor(s / 60).toString().padStart(2, '0');
    const ss = (s % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  });

  onBeforeUnmount(clear);

  return {
    remaining,
    isActive,
    formatted,
    start,
    reset,
  };
}
