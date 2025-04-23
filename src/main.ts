import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import { createApp } from 'vue'
import App from './App.vue'
import Transactions from './pages/on/Transactions.vue'
import Overview from './pages/on/Overview.vue'
import Login from './pages/Login.vue'
import Register from './pages/Register.vue'

import { createWebHistory, createRouter, useRouter } from 'vue-router'

const routes = [
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
    .mount('#app')
