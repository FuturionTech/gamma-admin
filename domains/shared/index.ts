import path from 'path'
import {defineNuxtModule} from "@nuxt/kit";

export default defineNuxtModule({
    // Default configuration options for your module
    defaults: {},
    hooks: {
        // COMPONENTS
        'components:dirs'(dirs) {
            dirs.push({
                path: path.resolve(__dirname, 'components'),
            })
        },
    },
})
