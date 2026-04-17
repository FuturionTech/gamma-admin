import { defineNuxtModule, createResolver, addComponentsDir } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'process-steps',
    configKey: 'processSteps'
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
          name: 'process-steps',
          path: '/process-steps',
          file: resolver.resolve('./pages/ProcessStepsList.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'process-steps-create',
          path: '/process-steps/create',
          file: resolver.resolve('./pages/ProcessStepsCreate.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'process-steps-edit',
          path: '/process-steps/:id/edit',
          file: resolver.resolve('./pages/ProcessStepsEdit.vue'),
          meta: { requiresAuth: true },
        }
      )
    })
  }
})
