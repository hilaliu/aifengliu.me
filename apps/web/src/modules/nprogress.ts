import type { UserModule } from '@/types'
import NProgress from 'nprogress'
import { router } from './router'
import 'nprogress/nprogress.css'

NProgress.configure({
  easing: 'ease',
  showSpinner: false,
  minimum: 0.3,
  parent: 'body',
})

export const install: UserModule = () => {
  router.beforeEach((to, from, next) => {
    NProgress.start()
    next()
  })

  router.afterEach(() => {
    NProgress.done()
  })
}
