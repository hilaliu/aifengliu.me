<script setup lang="ts">
const router = useRouter()

const tags = router.getRoutes().filter(route => (route.path.startsWith('/posts/'))).reduce((acc, route) => {
  route.meta.frontmatter?.tags?.forEach((tag) => {
    acc.add(tag)
  })
  return acc
}, new Set<string>())
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold">
      Tags
    </h1>
    <div v-if="tags.size > 0" class="flex gap-2 flex-wrap">
      <div v-for="tag in Array.from(tags)" :key="tag">
        <router-link :to="`/tags/${tag}`" class="nav-link mx-0!">
          #{{ tag }}
        </router-link>
      </div>
    </div>
    <div v-else>
      <p class="text-gray-400">
        No tags found
      </p>
    </div>
  </div>
</template>
