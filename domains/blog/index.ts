import { defineNuxtModule, createResolver, addComponentsDir } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'blog',
    configKey: 'blog'
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
          name: 'blog',
          path: '/blog',
          file: resolver.resolve('./pages/BlogList.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'blog-create',
          path: '/blog/create',
          file: resolver.resolve('./pages/BlogCreate.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'blog-detail',
          path: '/blog/:id',
          file: resolver.resolve('./pages/BlogDetail.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'blog-edit',
          path: '/blog/:id/edit',
          file: resolver.resolve('./pages/BlogEdit.vue'),
          meta: {
            requiresAuth: true
          }
        }
      )
    })
  }
})
