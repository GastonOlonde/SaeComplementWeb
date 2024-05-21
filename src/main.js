import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '../node_modules/leaflet/dist/leaflet.css'
const app = createApp(App)

app.use(router)

app.mount('#app')
