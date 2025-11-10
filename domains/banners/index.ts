import { defineNuxtModule, createResolver, addComponentsDir } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'banners',
    configKey: 'banners'
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
          name: 'banners',
          path: '/banners',
          file: resolver.resolve('./pages/BannersList.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'banners-create',
          path: '/banners/create',
          file: resolver.resolve('./pages/BannersCreate.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'banners-detail',
          path: '/banners/:id',
          file: resolver.resolve('./pages/BannersDetail.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'banners-edit',
          path: '/banners/:id/edit',
          file: resolver.resolve('./pages/BannersEdit.vue'),
          meta: {
            requiresAuth: true
          }
        }
      )
    })
  }
})
