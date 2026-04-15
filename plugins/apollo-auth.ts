/**
 * Attaches the sidebase auth token to every Apollo GraphQL request via the
 * apollo:auth hook. Reads from @sidebase/nuxt-auth's `auth.token` cookie,
 * which is the single source of truth for the current session.
 */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('apollo:auth', ({ token }) => {
    const cookie = useCookie<string | null>('auth.token')
    if (cookie.value) {
      token.value = cookie.value
      return
    }

    if (import.meta.server) {
      const headers = useRequestHeaders(['cookie'])
      const raw = headers.cookie || ''
      const match = raw.match(/(?:^|;\s*)auth\.token=([^;]+)/)
      if (match) {
        try {
          const decoded = decodeURIComponent(match[1])
          token.value = decoded.startsWith('"') ? JSON.parse(decoded) : decoded
        } catch {
          token.value = match[1]
        }
      }
      return
    }

    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/(?:^|;\s*)auth\.token=([^;]+)/)
      if (match) {
        try {
          const decoded = decodeURIComponent(match[1])
          token.value = decoded.startsWith('"') ? JSON.parse(decoded) : decoded
        } catch {
          token.value = match[1]
        }
      }
    }
  })
})
