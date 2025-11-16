import type { UserModule } from '@/types'
import { SITE_NAME } from '@repo/constant'
import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/Base.layout.vue'),
      redirect: '/home',
      children: [
        {
          path: '/home',
          name: 'home',
          meta: {
            title: 'Home',
          },
          component: () => import('@/views/Home.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFound.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  document.title = `${SITE_NAME} | ${to.meta.title as string}`
  next()
})

export const install: UserModule = ({ app }) => {
  app.use(router)
}
