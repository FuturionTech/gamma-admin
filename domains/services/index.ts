import { defineNuxtModule, createResolver, addComponentsDir } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'services',
    configKey: 'services'
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
          name: 'services',
          path: '/services',
          file: resolver.resolve('./pages/ServicesList.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'services-create',
          path: '/services/create',
          file: resolver.resolve('./pages/ServicesCreate.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'services-detail',
          path: '/services/:id',
          file: resolver.resolve('./pages/ServicesDetail.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'services-edit',
          path: '/services/:id/edit',
          file: resolver.resolve('./pages/ServicesEdit.vue'),
          meta: {
            requiresAuth: true
          }
        }
      )
    })
  }
})
