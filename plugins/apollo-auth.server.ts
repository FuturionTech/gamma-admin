/**
 * Server-side: forward the sidebase `auth.token` cookie from the incoming
 * request to Apollo so SSR queries carry the Bearer token.
 */
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('apollo:auth', ({ token }) => {
    const cookie = useCookie<string | null>('auth.token')
    if (cookie.value) {
      token.value = String(cookie.value)
      return
    }

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
  })
})
