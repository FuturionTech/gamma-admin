import { defineNuxtModule, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'faqs',
    configKey: 'faqs'
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
          name: 'faqs',
          path: '/faqs',
          file: resolver.resolve('./pages/FAQsList.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'faqs-create',
          path: '/faqs/create',
          file: resolver.resolve('./pages/FAQsCreate.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'faqs-edit',
          path: '/faqs/:id/edit',
          file: resolver.resolve('./pages/FAQsEdit.vue'),
          meta: {
            requiresAuth: true
          }
        }
      )
    })
  }
})
