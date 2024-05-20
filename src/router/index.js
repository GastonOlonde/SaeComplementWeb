import { createRouter, createWebHistory } from 'vue-router'
import AccueilView from '../views/AccueilView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'accueil',
      component: AccueilView
    },
    {
      path: '/geolocalisation',
      name: 'geolocalisation',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/GeolocalisationView.vue')
    },
    {
      path: '/cartographie',
      name: 'cartographie',
      component: () => import('../views/CartographieView.vue')
    },
    {
      path:'/donnees',
      name:'donnees',
      component: () => import('../views/DonneesView.vue')
    }
  ]
})

export default router
