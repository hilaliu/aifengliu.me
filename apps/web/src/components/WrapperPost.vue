<script setup lang="ts">
import { formatDate } from '@/utils'

const { frontmatter } = defineProps<{
  frontmatter: {
    title: string
    date: string
    display: boolean
    tags: string[]
    description: string
  }
}>()
</script>

<template>
  <div>
    <div v-if="frontmatter.display ?? frontmatter.title" class="flex gap-2 flex-col mb-8">
      <h1 v-if="frontmatter.title" class="text-4xl font-bold mb-1">
        {{ frontmatter.title }}
      </h1>
      <div class="flex items-center">
        <time v-if="frontmatter.date" class="text-sm text-gray-500 mr-2">
          Posted on {{ formatDate(frontmatter.date) }}
        </time>
        <div v-if="frontmatter.tags?.length > 0">
          <router-link v-for="tag in frontmatter.tags" :key="tag" :to="`/tags/${tag}`" class="nav-link mx-1!">
            #{{ tag }}
          </router-link>
        </div>
      </div>
    </div>
    <article>
      <slot />
    </article>
  </div>
</template>

<style scoped>

</style>
