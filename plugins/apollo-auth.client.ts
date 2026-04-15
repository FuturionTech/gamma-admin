/**
 * Client-side: read the sidebase `auth.token` cookie and attach it as the
 * Apollo Bearer token for every GraphQL request.
 */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('apollo:auth', ({ token }) => {
    const cookie = useCookie<string | null>('auth.token')
    if (cookie.value) {
      token.value = String(cookie.value)
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
