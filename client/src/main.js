// Programmer Name   : Mr. Chong Yuan Cheng, TP063577, Bac(Hons) Degree in Software Engineering, Asia Pacific University (APU), Malaysia.
// Program Name      : client/src/main.js
// Description       : main.js is the main file that runs the Vue application.
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { Quasar } from 'quasar'
import quasarUserOptions from './quasar-user-options'
import { createPinia } from 'pinia'

const pinia = createPinia()

createApp(App).use(Quasar, quasarUserOptions).use(pinia).use(router).mount('#app')
