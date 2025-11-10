import { defineNuxtModule, createResolver, addComponentsDir } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'contact-requests',
    configKey: 'contactRequests'
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
          name: 'contact-requests',
          path: '/contact-requests',
          file: resolver.resolve('./pages/ContactRequestsList.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'contact-request-detail',
          path: '/contact-requests/:id',
          file: resolver.resolve('./pages/ContactRequestDetail.vue'),
          meta: {
            requiresAuth: true
          }
        }
      )
    })
  }
})
