---
title: How do I manage my blog
date: 2025-11-22
description: In this post, I share the process of developing a blog that supports Markdown writing using front-end technology stacks such as Vue3+Vite+TypeScript, and completing automatic deployment and launch by linking the Git repository and configuring build parameters via CloudFlare Pages.
tags: ["Frontend", "Cloudflare"]
---

This post is about how I developed and deployed my blog, and I will mainly focus on the following two points:
1. The technology stack I used in my blog
2. How was my blog deployed

## Technology
- Vue3, Vite, Typescript, Pnpm - A convenient and fast front-end framework for development
- Tailwindcss - Atomized CSS
- Unplugin auto import - Automatic import function
- Unplugin vue components - Automated import of vue components
- Unplugin vue router - file system based routing
- Unplugin vue markdown - support for markdown syntax
- Shiki - Code Highlighting
- ESLint, Husky, Commitlint - Code Quality

Based on the above technologies, I can quickly develop blog websites and write articles using the markdown syntax.

## Deploy

My blog is deployed using CloudFlare, which has better support for domestic access compared to Vercel, so I use it.
Here are the steps I deployed:
1. Open CloudFlare's `Workers and Pages`, select pages
2. Select the blog's Git repository and click on `Begin setup`
3. Fill in the `Project name`, select "main" as the `Production branch`, choose `Vue` as the `Framework preset`, enter the `Build command` with `pnpm build`, and set the `Build output directory` to `/apps/web/dist`
4. Click Save and Deploy

Through the above steps, CloudFlare will deploy our blog online and automatically assign us a domain name. You can also use a custom domain name (I haven't set it here, so I won't go into detail)，In the future, we only need to push our articles to GitHub, and CloudFlare will automatically deploy our website.

Finally, enjoy writing your article with the simple deployment workflow!

## Links

- [Cloudflare](https://dash.cloudflare.com/)
- [My blog git repository](https://github.com/GodlessLiu/aifengliu.me/)
