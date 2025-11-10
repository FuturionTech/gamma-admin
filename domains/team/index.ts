import { defineNuxtModule, createResolver, addComponentsDir } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'team',
    configKey: 'team'
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
          name: 'team',
          path: '/team',
          file: resolver.resolve('./pages/TeamList.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'team-create',
          path: '/team/create',
          file: resolver.resolve('./pages/TeamCreate.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'team-edit',
          path: '/team/:id/edit',
          file: resolver.resolve('./pages/TeamEdit.vue'),
          meta: {
            requiresAuth: true
          }
        }
      )
    })
  }
})
