import type { UserModule } from '@/types'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/Base.layout.vue'),
      redirect: '/blog',
      children: [...routes],
    },
  ],
})

export const install: UserModule = ({ app }) => {
  app.use(router)
}
