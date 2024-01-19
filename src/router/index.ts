import { createRouter, createWebHistory } from 'vue-router'
import MapView from '../views/MapView.vue'

const router = createRouter({
  // @ts-ignore
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MapView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
