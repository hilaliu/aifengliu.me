<script setup lang="ts">
const isDark = useDark({
  storageKey: 'color-scheme',
})
const toggleDark = useToggle(isDark)
</script>

<template>
  <button
    class="inline-flex items-center cursor-pointer justify-center rounded-md px-3 py-2 text-sm dark:text-white transition-colors"
    aria-label="Toggle color scheme"
    title="Toggle color scheme"
    @click="toggleDark()"
  >
    <span v-if="isDark" class="icon-[solar--moon-line-duotone] w-5 h-5" />
    <span v-else class="icon-[solar--sun-line-duotone] w-5 h-5" />
  </button>
</template>

<style scoped>

</style>
