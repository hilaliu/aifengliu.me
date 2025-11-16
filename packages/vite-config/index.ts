import type { UserConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import autoImport from 'unplugin-auto-import/vite'
import autoComponents from 'unplugin-vue-components/vite'
import Markdown from 'unplugin-vue-markdown/vite'
import { beasties } from 'vite-plugin-beasties'
import vueDevTools from 'vite-plugin-vue-devtools'

interface Options {
  appDirUrl: string
  tailwind?: boolean
  router?: boolean
}

export function createViteConfig(options: Options): UserConfig {
  const { appDirUrl, tailwind = true, router = true } = options
  const srcPath = fileURLToPath(new URL('./src', appDirUrl))
  const config: UserConfig = {
    plugins: [
      vue(),
      Markdown({
        include: [`${srcPath}/contents/**/*.md`],
      }),
      autoImport({
        imports: [
          'vue',
          '@vueuse/core',
          ...(router ? ['vue-router'] as const : []),
        ],
        dirs: [
          `${srcPath}/composables`,
          `${srcPath}/stores`,
        ],
        dts: `${srcPath}/types/auto-imports.d.ts`,
      }),
      autoComponents({
        dirs: [
          `${srcPath}/components`,
        ],
        dts: `${srcPath}/types/components.d.ts`,
      }),
      vueDevTools(),
      beasties(),
    ],
    resolve: {
      alias: {
        '@': srcPath,
      },
    },
  }
  if (tailwind)
    config.plugins!.push(tailwindcss())
  return config
}
