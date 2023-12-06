import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/music',
      name: 'music',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../pages/music/App.vue'),
      meta: {
        title: 'MUSIC'
      }
    }
  ]
})

/**网页默认标题 */
const documentTitle = 'ZSTH'
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = !to.meta?.title ? documentTitle : [to.meta?.title, documentTitle].join('-')
  next();
});

export default router
