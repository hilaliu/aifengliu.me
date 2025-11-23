import { dirname } from 'node:path'
import fg from 'fast-glob'
import { Feed } from 'feed'
import fs from 'fs-extra'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'

const DOMAIN = 'https://aifengliu-me.pages.dev'
const PROJECT_DIR = './apps/web/dist'
const AUTHOR = {
  name: 'Hialry Liu',
  email: '2788370451@qq.com',
  link: DOMAIN,
}
const markdown = MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
})

async function run() {
  await buildBlogRSS()
}

async function buildBlogRSS() {
  const files = await fg('apps/web/contents/posts/*.md')
  const options = {
    title: 'Hialry Liu',
    description: 'Hialry Liu\' Blog',
    id: DOMAIN,
    link: DOMAIN,
    copyright: 'CC BY-NC-SA 4.0 2025 © Hialry Liu',
    feedLinks: {
      json: `${DOMAIN}/feed.json`,
      atom: `${DOMAIN}/feed.atom`,
      rss: `${DOMAIN}/feed.xml`,
    },
  }
  const posts = (
    await Promise.all(
      files.filter(i => !i.includes('index'))
        .map(async (i) => {
          const raw = await fs.readFile(i, 'utf-8')
          const { data, content } = matter(raw)
          console.log(i)

          const html = markdown.render(content)

          return {
            ...data,
            date: new Date(data.date),
            content: html,
            author: [AUTHOR],
            link: DOMAIN + i.replace(/^apps\/web\/contents\/posts\/(.+)\.md$/, '/posts/$1'),
          }
        }),
    ))
    .filter(Boolean)
  posts.sort((a, b) => +new Date(b.date) - +new Date(a.date))

  await writeFeed('feed', options, posts)
}

async function writeFeed(name, options, items) {
  options.author = AUTHOR
  options.image = `${DOMAIN}/avatar.jpeg`
  options.favicon = `${DOMAIN}/favicon.svg`

  const feed = new Feed(options)

  items.forEach(item => feed.addItem(item))

  await fs.ensureDir(dirname(`${PROJECT_DIR}/${name}`))
  await fs.writeFile(`${PROJECT_DIR}/${name}.xml`, feed.rss2(), 'utf-8')
  await fs.writeFile(`${PROJECT_DIR}/${name}.atom`, feed.atom1(), 'utf-8')
  await fs.writeFile(`${PROJECT_DIR}/${name}.json`, feed.json1(), 'utf-8')
}

run()
