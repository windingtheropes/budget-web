import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import Landing from './components/Landing.vue'
import Login from './components/Login.vue'

import { createWebHistory, createRouter } from 'vue-router'

const routes = [
  { path: '/', component: Landing },
  { path: '/login', component: Login },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

createApp(App)
    .use(router)
    .mount('#app')
