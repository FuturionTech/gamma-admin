// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },

    // Suppress dev.json 404 warning in development
    nitro: {
        devProxy: {
            '/_nuxt/builds/meta': {
                target: 'http://localhost:3000',
                changeOrigin: true
            }
        }
    },

    // Runtime configuration for environment variables
    runtimeConfig: {
        // Private keys (only available on server-side)
        gqlToken: process.env.GQL_TOKEN || '',

        // Public keys (exposed to client-side)
        public: {
            gqlHost: process.env.GQL_HOST || 'https://gamma.ngrok.app/graphql',
            authOrigin: process.env.AUTH_ORIGIN || 'https://gamma.ngrok.app/api/auth',
        }
    },

    app: {
        head: {
            script: [
                { src: '/assets/plugins/global/plugins.bundle.js', tagPosition: 'bodyClose' },
                { src: '/assets/js/scripts.bundle.js', tagPosition: 'bodyClose' },
            ],
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
                { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
                { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
                { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
                { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/android-chrome-192x192.png' },
                { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/android-chrome-512x512.png' },
                { rel: 'manifest', href: '/site.webmanifest' },
            ],
        },
    },
    css: [
        "~/assets/sass/style.scss",
        "~/assets/sass/plugins.scss",
        '~/public/assets/plugins/global/plugins.bundle.css',
        '~/public/assets/css/menu-highlighting.css',
        'flatpickr/dist/flatpickr.min.css'
    ],

  modules: [
    // Load internal feature modules - Gamma domains
    '~/domains/authentication/index.ts',
    '~/domains/dashboard/index.ts',
    '~/domains/shared/index.ts',
    '~/domains/services/index.ts',
    '~/domains/solutions/index.ts',
    '~/domains/projects/index.ts',
    '~/domains/blog/index.ts',
    '~/domains/team/index.ts',
    '~/domains/faqs/index.ts',
    '~/domains/stats/index.ts',
    '~/domains/certifications/index.ts',
    '~/domains/clients/index.ts',
    '~/domains/partners/index.ts',
    '~/domains/testimonials/index.ts',
    '~/domains/careers/index.ts',
    '~/domains/contact-requests/index.ts',

    '@pinia/nuxt',
    '@nuxtjs/apollo',
    '@sidebase/nuxt-auth',
    '@nuxtjs/i18n',
  ],

  // Ensure all global components are auto-imported
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', name: 'English' },
      { code: 'fr', iso: 'fr-FR', name: 'Français' },
    ],
    defaultLocale: 'en',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      redirectOn: 'root',
      alwaysRedirect: false,
      fallbackLocale: 'en',
    },
    vueI18n: './i18n.config.ts',
  },

  auth: {
    isEnabled: true,
    disableServerSideAuth: false,
    originEnvKey: 'AUTH_ORIGIN',
    baseURL: process.env.AUTH_ORIGIN || 'http://api.gamma.test/api/auth',
    provider: {
      type: 'local',
      endpoints: {
        signIn: {path: 'login', method: 'post'},
        signOut: {path: 'logout', method: 'post'},
        getSession: {path: 'session', method: 'get'},
      },
      token: {
        signInResponseTokenPointer: '/authToken',
        type: 'Bearer',
        cookieName: 'auth.token',
        headerName: 'Authorization',
        maxAgeInSeconds: 365 * 24 * 60 * 60
      },
      pages: {
        login: '/login'
      },
    },
    sessionRefresh: {
      enablePeriodically: false,
      enableOnWindowFocus: true,
    }
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          quietDeps: true,
          silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'mixed-decls'],
        }
      }
    }
  },
  apollo: {
    clients: {
      default: './apollo/default.ts',
    },
  },
})
