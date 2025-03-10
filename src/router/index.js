import { createRouter, createWebHistory } from 'vue-router'


import Login from '../pages/Login.vue'
import Clientes from '../pages/Clientes.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/clientes',
    name: 'Clientes',
    component: Clientes
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
