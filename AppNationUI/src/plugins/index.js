// Plugins
import { createPinia } from 'pinia'
import { loadFonts } from './webfontloader'
import vuetify from './vuetify'
import axios from './axios'
import router from '../router'


export function registerPlugins(app) {
  const pinia = createPinia()

  loadFonts()
  app
    .use(pinia)
    .use(vuetify)
    .use(router)
    .use(axios, {
      baseUrl: 'http://localhost:3000/v1/',
    })
}
