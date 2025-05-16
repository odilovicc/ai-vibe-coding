import Aura from '@primevue/themes/aura'

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@primevue/nuxt-module', "@pinia/nuxt"],
  primevue: {
    options: {
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: "app-dark"
        }
      }
    }
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  css: ["~/assets/css/global.css", 'primeicons/primeicons.css'],
  components: [
    {
      path: "~/components",
      pathPrefix: false
    }
  ],
  runtimeConfig: {
    public: {
      CRPYTO_BOT_TOKEN: process.env.NUXT_PUBLIC_CRYPTO_BOT_TOKEN,
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL
    }
  }
})