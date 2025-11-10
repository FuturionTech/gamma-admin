import { defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'certifications',
    configKey: 'certifications',
  },
  setup(options, nuxt) {
    // Add routes
    nuxt.hook('pages:extend', (pages) => {
      pages.push(
        {
          name: 'certifications',
          path: '/certifications',
          file: '~/domains/certifications/pages/CertificationsList.vue',
        },
        {
          name: 'certifications-create',
          path: '/certifications/create',
          file: '~/domains/certifications/pages/CertificationsCreate.vue',
        },
        {
          name: 'certifications-view',
          path: '/certifications/:id',
          file: '~/domains/certifications/pages/CertificationsView.vue',
        },
        {
          name: 'certifications-edit',
          path: '/certifications/:id/edit',
          file: '~/domains/certifications/pages/CertificationsEdit.vue',
        }
      )
    })

    // Auto-import components
    nuxt.hook('components:dirs', (dirs) => {
      dirs.push({
        path: '~/domains/certifications/components',
        prefix: 'Certification',
        global: true,
      })
    })

    // Auto-import composables
    nuxt.hook('imports:dirs', (dirs) => {
      dirs.push('~/domains/certifications/composables')
    })
  },
})
