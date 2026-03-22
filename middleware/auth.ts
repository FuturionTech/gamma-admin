/**
 * Auth middleware override.
 *
 * This replaces @sidebase/nuxt-auth's default 'auth' middleware.
 * When BYPASS_AUTH=true in .env, it skips authentication entirely.
 * Otherwise, it delegates to sidebase's auth logic.
 *
 * To re-enable authentication:
 *   1. Set BYPASS_AUTH=false in .env (or remove the variable)
 *   2. Restart the dev server
 */
export default defineNuxtRouteMiddleware((to) => {
  const config = useRuntimeConfig()

  if (config.public.bypassAuth) {
    // Skip auth — allow access to all pages
    return
  }

  // Delegate to sidebase auth: check if user has a session
  const { status } = useAuth()

  if (status.value === 'unauthenticated') {
    return navigateTo('/login')
  }
})
