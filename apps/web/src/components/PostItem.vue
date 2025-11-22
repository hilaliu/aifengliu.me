<script setup lang="ts">
import type { Post } from '@/types'
import { formatDate } from '@/utils'

const { post } = defineProps<{
  post: Post
}>()
</script>

<template>
  <div class="border-b border-dashed py-2">
    <h2 class="text-2xl font-bold my-2!">
      {{ post.title }}
    </h2>
    <div class="flex gap-1 items-center flex-wrap">
      <time class="text-xs text-gray-500">
        {{ formatDate(post.date) }}
      </time>
      <div>
        <router-link v-for="tag in post.tags" :key="tag" :to="`/tags/${tag}`" class="nav-link mx-1!">
          #{{ tag }}
        </router-link>
      </div>
    </div>
    <p class="mb-1! mt-1!">
      {{ post.description }}
    </p>
    <div class="text-right">
      <router-link :to="post.path" class="text-xs nav-link">
        READ MORE →
      </router-link>
    </div>
  </div>
</template>

<style scoped>

</style>
