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
    // Literal paths (/services/categories/*) BEFORE param paths (/services/:id)
    nuxt.hook('pages:extend', (pages) => {
      pages.push(
        {
          name: 'services',
          path: '/services',
          file: resolver.resolve('./pages/ServicesList.vue'),
          meta: { requiresAuth: true },
        },
        {
          name: 'services-create',
          path: '/services/create',
          file: resolver.resolve('./pages/ServicesCreate.vue'),
          meta: { requiresAuth: true },
        },
        {
          name: 'service-categories',
          path: '/services/categories',
          file: resolver.resolve('./pages/ServiceCategoriesList.vue'),
          meta: { requiresAuth: true },
        },
        {
          name: 'service-categories-create',
          path: '/services/categories/create',
          file: resolver.resolve('./pages/ServiceCategoriesCreate.vue'),
          meta: { requiresAuth: true },
        },
        {
          name: 'service-categories-edit',
          path: '/services/categories/:id/edit',
          file: resolver.resolve('./pages/ServiceCategoriesEdit.vue'),
          meta: { requiresAuth: true },
        },
        {
          name: 'services-edit',
          path: '/services/:id/edit',
          file: resolver.resolve('./pages/ServicesEdit.vue'),
          meta: { requiresAuth: true },
        }
      )
    })
  }
})
