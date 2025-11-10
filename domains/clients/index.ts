import { defineNuxtModule, createResolver, addComponentsDir } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'clients',
    configKey: 'clients'
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
          name: 'clients',
          path: '/clients',
          file: resolver.resolve('./pages/ClientsList.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'clients-create',
          path: '/clients/create',
          file: resolver.resolve('./pages/ClientsCreate.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'clients-edit',
          path: '/clients/:id/edit',
          file: resolver.resolve('./pages/ClientsEdit.vue'),
          meta: {
            requiresAuth: true
          }
        }
      )
    })
  }
})
