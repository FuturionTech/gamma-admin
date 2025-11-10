import { defineNuxtModule, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'solutions',
    configKey: 'solutions'
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
          name: 'solutions',
          path: '/solutions',
          file: resolver.resolve('./pages/SolutionsList.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'solutions-create',
          path: '/solutions/create',
          file: resolver.resolve('./pages/SolutionsCreate.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'solutions-edit',
          path: '/solutions/:id/edit',
          file: resolver.resolve('./pages/SolutionsEdit.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'solutions-features',
          path: '/solutions/:id/features',
          file: resolver.resolve('./pages/SolutionFeatures.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'solutions-benefits',
          path: '/solutions/:id/benefits',
          file: resolver.resolve('./pages/SolutionBenefits.vue'),
          meta: {
            requiresAuth: true
          }
        }
      )
    })
  }
})
