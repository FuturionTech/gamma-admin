import { computed } from 'vue'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'gn-admin-theme'

const applyTheme = (value: Theme) => {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute('data-bs-theme', value)
  document.documentElement.dataset.gnTheme = value
}

export const useTheme = () => {
  const theme = useState<Theme>('gn-admin-theme', () => 'light')

  const initialize = () => {
    if (typeof window === 'undefined') return
    const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null
    if (stored === 'light' || stored === 'dark') {
      theme.value = stored
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      theme.value = 'dark'
    }
    applyTheme(theme.value)
  }

  const set = (value: Theme) => {
    theme.value = value
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, value)
    }
    applyTheme(value)
  }

  const toggle = () => set(theme.value === 'dark' ? 'light' : 'dark')

  const isDark = computed(() => theme.value === 'dark')
  const isLight = computed(() => theme.value === 'light')

  return {
    theme,
    isDark,
    isLight,
    set,
    toggle,
    initialize,
  }
}
