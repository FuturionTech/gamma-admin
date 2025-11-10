import { defineNuxtModule, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'partners',
    configKey: 'partners'
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
          name: 'partners',
          path: '/partners',
          file: resolver.resolve('./pages/PartnersList.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'partners-create',
          path: '/partners/create',
          file: resolver.resolve('./pages/PartnersCreate.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'partners-edit',
          path: '/partners/:id/edit',
          file: resolver.resolve('./pages/PartnersEdit.vue'),
          meta: {
            requiresAuth: true
          }
        }
      )
    })
  }
})
