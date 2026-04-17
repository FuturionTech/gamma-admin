/**
 * Overrides @sidebase/nuxt-auth's default 'auth' middleware.
 * When BYPASS_AUTH=true in .env, skips authentication entirely.
 *
 * To re-enable authentication:
 *   1. Set BYPASS_AUTH=false in .env (or remove the variable)
 *   2. Restart the dev server
 */
export default defineNuxtPlugin(() => {
  addRouteMiddleware(
    'auth',
    (to) => {
      const config = useRuntimeConfig()

      if (config.public.bypassAuth) {
        return
      }

      const { status } = useAuth()

      if (status.value === 'unauthenticated') {
        return navigateTo('/login')
      }
    },
    { override: true },
  )
})
