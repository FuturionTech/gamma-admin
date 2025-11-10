import { defineNuxtModule, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'testimonials',
    configKey: 'testimonials'
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
          name: 'testimonials',
          path: '/testimonials',
          file: resolver.resolve('./pages/TestimonialsList.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'testimonials-create',
          path: '/testimonials/create',
          file: resolver.resolve('./pages/TestimonialsCreate.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'testimonials-edit',
          path: '/testimonials/:id/edit',
          file: resolver.resolve('./pages/TestimonialsEdit.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          name: 'testimonials-detail',
          path: '/testimonials/:id',
          file: resolver.resolve('./pages/TestimonialsDetail.vue'),
          meta: {
            requiresAuth: true
          }
        }
      )
    })
  }
})
