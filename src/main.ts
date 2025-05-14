import '@/assets/main.css'
import { createApp } from 'vue'
import App from '@/App.vue'
import Transactions from '@/pages/on/Transactions.vue'
import Overview from '@/pages/on/Overview.vue'
import Login from '@/pages/Login.vue'
import Register from '@/pages/Register.vue'
import Landing from '@/pages/Landing.vue'


import { createWebHistory, createRouter } from 'vue-router'

import { createPinia } from 'pinia'

const pinia = createPinia()

const routes = [
  { path: '/', component: Landing },
  { path: '/on/overview', component: Overview },
  { path: '/on/transactions', component: Transactions },
  { path: '/login', component: Login },
  { path: '/register', component: Register }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

createApp(App)
    .use(router)
    .use(pinia)
    .mount('#app')

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
