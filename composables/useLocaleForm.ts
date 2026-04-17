import { ref, reactive, computed, type Ref } from 'vue'
import type { DocumentNode } from '@apollo/client/core'

type Locale = 'en' | 'fr'

interface LocaleFormOptions<T extends Record<string, unknown>> {
  translatableKeys: (keyof T)[]
  defaults: T
}

/**
 * Manages bilingual form state for translatable entities.
 *
 * Splits form fields into:
 * - `shared`: non-translatable fields (same regardless of locale)
 * - `localized`: per-locale translatable fields (switch on toggle)
 *
 * Usage:
 *   const { locale, form, setLocale, loadTranslation, getSubmitPayload } = useLocaleForm({
 *     translatableKeys: ['title', 'short_description', 'description'],
 *     defaults: { title: '', short_description: '', description: '', category: '', icon: '' },
 *   })
 */
export const useLocaleForm = <T extends Record<string, unknown>>(options: LocaleFormOptions<T>) => {
  const { translatableKeys, defaults } = options

  const locale = ref<Locale>('en') as Ref<Locale>

  const translations = reactive<Record<Locale, Record<string, unknown>>>({
    en: extractTranslatable(defaults),
    fr: extractTranslatable(defaults),
  })

  const shared = reactive<Record<string, unknown>>(extractShared(defaults))

  const form = computed(() => {
    const t = translations[locale.value]
    return new Proxy(
      {},
      {
        get(_, key: string) {
          if (translatableKeys.includes(key as keyof T)) return t[key]
          return shared[key]
        },
        set(_, key: string, value) {
          if (translatableKeys.includes(key as keyof T)) {
            t[key] = value
          } else {
            shared[key] = value
          }
          return true
        },
      },
    ) as T
  })

  function extractTranslatable(source: T): Record<string, unknown> {
    const result: Record<string, unknown> = {}
    for (const key of translatableKeys) {
      result[key as string] = source[key as string] ?? ''
    }
    return result
  }

  function extractShared(source: T): Record<string, unknown> {
    const result: Record<string, unknown> = {}
    for (const key of Object.keys(source)) {
      if (!translatableKeys.includes(key as keyof T)) {
        result[key] = source[key as string]
      }
    }
    return result
  }

  function setLocale(loc: Locale) {
    locale.value = loc
  }

  function loadTranslation(loc: Locale, data: Partial<T>) {
    const t = translations[loc]
    for (const key of translatableKeys) {
      const k = key as string
      if (k in data) {
        t[k] = (data as Record<string, unknown>)[k] ?? ''
      }
    }
  }

  function loadShared(data: Partial<T>) {
    for (const key of Object.keys(shared)) {
      if (key in data) {
        shared[key] = (data as Record<string, unknown>)[key]
      }
    }
  }

  function loadAll(loc: Locale, data: Partial<T>) {
    loadTranslation(loc, data)
    loadShared(data)
  }

  function getSubmitPayload(): T & { locale: string } {
    const t = translations[locale.value]
    return {
      ...shared,
      ...t,
      locale: locale.value,
    } as T & { locale: string }
  }

  async function fetchBothLocales(
    query: DocumentNode,
    variables: Record<string, unknown>,
    extractFn: (data: any) => Partial<T> | null,
  ) {
    const api = useApi()

    const enData = await api.client.query({
      query,
      variables,
      fetchPolicy: 'no-cache',
      context: { headers: { 'X-Locale': 'en' } },
    })

    const frData = await api.client.query({
      query,
      variables,
      fetchPolicy: 'no-cache',
      context: { headers: { 'X-Locale': 'fr' } },
    })

    const enResult = extractFn(enData.data)
    const frResult = extractFn(frData.data)

    if (enResult) loadAll('en', enResult)
    if (frResult) loadTranslation('fr', frResult)
  }

  return {
    locale,
    form,
    translations,
    shared,
    setLocale,
    loadTranslation,
    loadShared,
    loadAll,
    getSubmitPayload,
    fetchBothLocales,
  }
}
