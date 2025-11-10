import { createResolver, defineNuxtModule } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtModule({
  meta: {
    name: 'dashboard-domain',
    configKey: 'dashboardDomain'
  },
  setup(options, nuxt) {
    // Add dashboard components (without prefix so they work as-is)
    nuxt.hook('components:dirs', (dirs) => {
      dirs.push({
        path: resolve('./components')
      })
    })

    // Add dashboard page
    nuxt.hook('pages:extend', (pages) => {
      pages.push({
        name: 'dashboard',
        path: '/',
        file: resolve('./pages/dashboard.vue')
      })
    })

    // Add stores auto-import
    nuxt.hook('imports:dirs', (dirs) => {
      dirs.push(resolve('./stores'))
    })
  }
})
