<template>
  <div class="container mx-auto">
    <header class="mb-2">
      <nav class="py-4">
        <ul class="flex">
          <li>
            <router-link to="/blog">
              Blog
            </router-link>
          </li>
          <li>
            <router-link to="/about">
              About
            </router-link>
          </li>
        </ul>
      </nav>
    </header>
    <router-view />
    <footer class="flex justify-center text-sm flex-col sm:flex-row items-center">
      <div>
        2025 - Present © Aifeng Liu <span class="mx-2">|</span> Learn · Share · Tech
      </div>
      <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank" class=" after:content-['↗']">CC BY-NC-SA 4.0</a>
    </footer>
  </div>
</template>
