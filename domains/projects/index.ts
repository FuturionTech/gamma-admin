import { defineNuxtModule, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'projects',
    configKey: 'projects'
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
          name: 'projects',
          path: '/projects',
          file: resolver.resolve('./pages/ProjectsList.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'projects-create',
          path: '/projects/create',
          file: resolver.resolve('./pages/ProjectsCreate.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'projects-detail',
          path: '/projects/:id',
          file: resolver.resolve('./pages/ProjectsDetail.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'projects-edit',
          path: '/projects/:id/edit',
          file: resolver.resolve('./pages/ProjectsEdit.vue'),
          meta: {
            requiresAuth: true
          }
        }
      )
    })
  }
})
