import { createRouter, createWebHistory } from 'vue-router'
import AccueilView from '../views/AccueilView.vue'
import GeolocalisationView from '@/views/GeolocalisationView.vue'
import CartographieView from '@/views/CartographieView.vue'
import DonneesView from '@/views/DonneesView.vue'

import NotFoundView from '@/views/NotFoundView.vue'


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
      component: GeolocalisationView
    },
    {
      path: '/cartographie',
      name: 'cartographie',
      component: CartographieView
    },
    {
      path:'/donnees',
      name:'donnees',
      component: DonneesView
    },
    {
      path: '/:pathMatch(.*)*',
      component: NotFoundView
    }
  ]
})

export default router
