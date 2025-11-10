import { defineNuxtModule, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'stats',
    configKey: 'stats'
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Register components
    nuxt.hook('components:dirs', (dirs) => {
      dirs.push({
        path: resolver.resolve('./components'),
        prefix: '',
        pathPrefix: false
      })
    })

    // Register auto-imports
    nuxt.hook('imports:dirs', (dirs) => {
      dirs.push(
        resolver.resolve('./composables'),
        resolver.resolve('./stores')
      )
    })

    // Register pages as routes
    nuxt.hook('pages:extend', (pages) => {
      pages.push(
        {
          name: 'stats',
          path: '/stats',
          file: resolver.resolve('./pages/StatsList.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'stats-create',
          path: '/stats/create',
          file: resolver.resolve('./pages/StatsCreate.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'stats-edit',
          path: '/stats/:id/edit',
          file: resolver.resolve('./pages/StatsEdit.vue'),
          meta: {
            requiresAuth: true
          }
        }
      )
    })
  }
})
