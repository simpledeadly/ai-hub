<template>
  <div class="app-container">
    <!-- Сюда Nuxt будет рендерить страницы из папки /pages -->
    <NuxtPage />
  </div>
</template>

<style>
/*
  Глобальные стили для всего приложения.
  Они не "scoped", поэтому будут применяться везде.
*/
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif;
  background-color: #f0f2f5;
  color: #1c1e21;
}

.app-container {
  max-width: 800px;
  margin: 0 auto;
  background-color: #ffffff;
  height: 100vh;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
