import path from 'path'
import {defineNuxtModule} from "@nuxt/kit";

export default defineNuxtModule({
    // Default configuration options for your module
    defaults: {},
    hooks: {
        // ROUTES
        'pages:extend'(pages) {
            pages.push(
                {
                    name: 'login',
                    path: '/login',
                    file: path.resolve(__dirname, 'pages/login.vue'),
                },
                {
                    name: 'logout',
                    path: '/logout',
                    file: path.resolve(__dirname, 'pages/logout.vue'),
                },
                {
                    name: 'otp',
                    path: '/otp',
                    file: path.resolve(__dirname, 'pages/otp.vue'),
                },
            )
        },

        // COMPONENTS
        'components:dirs'(dirs) {
            dirs.push({
                path: path.resolve(__dirname, 'components'),
            })
        },
    },
})
