<script setup lang="ts">
const router = useRouter()

const posts = router.getRoutes().filter(route => (route.path.startsWith('/posts/'))).map(r => ({
  title: r.meta.frontmatter?.title,
  date: r.meta.frontmatter?.date,
  tags: r.meta.frontmatter?.tags,
  description: r.meta.frontmatter?.description,
  path: r.path,
}))
</script>

<template>
  <div>
    <div v-if="posts.length > 0">
      <PostItem v-for="post in posts" :key="post.title" :post="post" />
    </div>
    <div v-else>
      <p class="text-gray-400">
        No posts found
      </p>
    </div>
  </div>
</template>
