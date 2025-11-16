import type { UserModule } from '../types'
import { createHead } from '@unhead/vue/client'

export const install: UserModule = ({ app }) => {
  const head = createHead()
  app.use(head)
}
