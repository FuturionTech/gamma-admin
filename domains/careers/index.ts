import { defineNuxtModule, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'careers',
    configKey: 'careers'
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
          name: 'careers-positions',
          path: '/careers/positions',
          file: resolver.resolve('./pages/CareersList.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'careers-positions-create',
          path: '/careers/positions/create',
          file: resolver.resolve('./pages/CareersCreate.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'careers-positions-detail',
          path: '/careers/positions/:id',
          file: resolver.resolve('./pages/CareersDetail.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'careers-positions-edit',
          path: '/careers/positions/:id/edit',
          file: resolver.resolve('./pages/CareersEdit.vue'),
          meta: {
            requiresAuth: true
          }
        }
      )
    })
  }
})
