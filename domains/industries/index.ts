import { defineNuxtModule, createResolver, addComponentsDir } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'industries',
    configKey: 'industries'
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

    // Register pages as routes (no detail/show page — list links go directly to edit)
    nuxt.hook('pages:extend', (pages) => {
      pages.push(
        {
          name: 'industries',
          path: '/industries',
          file: resolver.resolve('./pages/IndustriesList.vue'),
          meta: { requiresAuth: true },
        },
        {
          name: 'industries-create',
          path: '/industries/create',
          file: resolver.resolve('./pages/IndustriesCreate.vue'),
          meta: { requiresAuth: true },
        },
        {
          name: 'industries-edit',
          path: '/industries/:id/edit',
          file: resolver.resolve('./pages/IndustriesEdit.vue'),
          meta: { requiresAuth: true },
        }
      )
    })
  }
})
