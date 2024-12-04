// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  
  ssr: false,
  
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith('c-'),
    },
  },

  devtools: { enabled: true },

  modules: ['@vueuse/nuxt', '@nuxtjs/tailwindcss', '@formkit/auto-animate/nuxt'],

  css: ['~/assets/css/main.css'],
})
