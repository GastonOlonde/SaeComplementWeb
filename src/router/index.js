import { createRouter, createWebHistory } from 'vue-router'
import CartographieView from '@/views/CartographieView.vue'
import AproposView from '@/views/AproposView.vue'

import NotFoundView from '@/views/NotFoundView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/cartographie',
      name: 'cartographie',
      component: CartographieView,
      meta: {
        title: "Cartographie - Carto\'S Search"
      }
    },
    {
      path:'/apropos',
      name:'apropos',
      component: AproposView,
      meta: {
        title: "À propos - Carto\'S Search"
      }
    },
    {
      path: '/:pathMatch(.*)*',
      component: NotFoundView
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Carto-S Search';
  next();
});

export default router
