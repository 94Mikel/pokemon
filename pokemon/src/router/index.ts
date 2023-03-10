import { createRouter, createWebHistory } from 'vue-router'
import pokemon from '@/views/pokemon.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: pokemon
    }
  ]
})

export default router
