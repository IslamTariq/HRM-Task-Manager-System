import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'

// If you have a router or store, import them
import router from './router'   // if you chose router
// import store from './store'  // if using Pinia or something

const app = createApp(App)
app.use(vuetify)
if (router) app.use(router)
// if (store) app.use(store)
app.mount('#app')
