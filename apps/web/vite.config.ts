import fs from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import { SITE_NAME } from '@repo/constant'
import Shiki from '@shikijs/markdown-it'
import slugify from '@sindresorhus/slugify'
import Tailwindcss from '@tailwindcss/vite'
import Vue from '@vitejs/plugin-vue'
import matter from 'gray-matter'
import anchor from 'markdown-it-anchor'
import AutoImport from 'unplugin-auto-import/vite'
import AutoComponents from 'unplugin-vue-components/vite'
import Markdown from 'unplugin-vue-markdown/vite'
import VueRouter from 'unplugin-vue-router/vite'
import { defineConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import VueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig(() => {
  const srcPath = fileURLToPath(new URL('./src', import.meta.url))
  const contentsPath = fileURLToPath(new URL('./contents', import.meta.url))
  return {
    plugins: [
      VueRouter({
        routesFolder: contentsPath,
        extensions: ['.vue', '.md'],
        dts: `${srcPath}/types/vue-router.d.ts`,
        extendRoute(route) {
          const path = route.components.get('default')
          if (!path)
            return

          if (path.endsWith('.md')) {
            const { data } = matter(fs.readFileSync(path, 'utf-8'))
            route.addToMeta({
              frontmatter: data,
            })
          }
        },
      }),
      Vue({
        include: [/\.vue$/, /\.md$/],
      }),
      Markdown({
        wrapperComponent: 'WrapperPost',
        include: [`${contentsPath}/**/*.md`],
        headEnabled: true,
        wrapperClasses: 'prose',
        exportFrontmatter: false,
        exposeFrontmatter: false,
        exposeExcerpt: false,
        async markdownItSetup(md) {
          md.use(await Shiki({
            themes: {
              light: 'vitesse-light',
            },
          }))

          md.use(anchor, {
            slugify,
            permalink: anchor.permalink.linkInsideHeader({
              symbol: '#',
              renderAttrs: () => ({ 'aria-hidden': 'true' }),
            }),
          })
        },
      }),
      AutoImport({
        imports: [
          'vue',
          '@vueuse/core',
          'vue-router',
        ],
        dirs: [
          `${srcPath}/composables`,
          `${srcPath}/stores`,
        ],
        dts: `${srcPath}/types/auto-imports.d.ts`,
      }),
      AutoComponents({
        extensions: ['vue', 'md'],
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        dirs: [
          `${srcPath}/components`,
        ],
        dts: `${srcPath}/types/components.d.ts`,
      }),
      VueDevTools(),
      Tailwindcss(),
      createHtmlPlugin({
        inject: {
          data: {
            title: SITE_NAME,
          },
        },
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@contents': fileURLToPath(new URL('./contents', import.meta.url)),
      },
    },
  }
})
