import './assets/main.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.js'
import { createApp } from 'vue'
import App from './App.vue'
import Transactions from './pages/Transactions.vue'
import Login from './pages/Login.vue'

import { createWebHistory, createRouter } from 'vue-router'

const routes = [
  { path: '/transactions', component: Transactions },
  { path: '/login', component: Login },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

createApp(App)
    .use(router)
    .mount('#app')
