import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      // component: HomeView  ,
      redirect: '/kugou'
    },
    {
      path: '/kugou',
      name: 'kugou',
      component: () => import('../page/Kugou.vue'),
      meta: {
        title: 'Player'
      }
    }

  ]
})

/**网页默认标题 */
const documentTitle = 'KUGOU'
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = !to.meta?.title ? documentTitle : [to.meta?.title, documentTitle].join('-')
  next();
});
export default router
