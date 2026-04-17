import { defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'certifications',
    configKey: 'certifications',
  },
  setup(options, nuxt) {
    // Add routes
    // IMPORTANT: literal paths like /certifications/categories MUST be
    // registered BEFORE /certifications/:id so the router matches them
    // before falling through to the param route.
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
          name: 'certification-categories',
          path: '/certifications/categories',
          file: '~/domains/certifications/pages/CertificationCategoriesList.vue',
        },
        {
          name: 'certification-categories-create',
          path: '/certifications/categories/create',
          file: '~/domains/certifications/pages/CertificationCategoriesCreate.vue',
        },
        {
          name: 'certification-categories-edit',
          path: '/certifications/categories/:id/edit',
          file: '~/domains/certifications/pages/CertificationCategoriesEdit.vue',
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
        },
        {
          name: 'compliance',
          path: '/compliance',
          file: '~/domains/certifications/pages/ComplianceList.vue',
          meta: { requiresAuth: true },
        },
        {
          name: 'compliance-create',
          path: '/compliance/create',
          file: '~/domains/certifications/pages/ComplianceCreate.vue',
          meta: { requiresAuth: true },
        },
        {
          name: 'compliance-edit',
          path: '/compliance/:id/edit',
          file: '~/domains/certifications/pages/ComplianceEdit.vue',
          meta: { requiresAuth: true },
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
