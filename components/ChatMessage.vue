<script setup lang="ts">
defineProps<{
  message: {
    role: 'user' | 'agent'
    content: string
    sources?: string[]
  }
}>()
</script>

<template>
  <div
    class="message"
    :class="{ 'message--user': message.role === 'user' }"
  >
    <div
      class="message-content"
      :class="{ 'message-content--user': message.role === 'user' }"
    >
      <div class="message-body">
        <p class="message-text">
          {{ message.content }}
        </p>

        <div
          v-if="message.sources && message.sources.length > 0"
          class="message-sources"
        >
          <div class="sources-header">
            <svg
              class="sources-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            <span class="sources-title">Источники</span>
          </div>

          <div class="sources-list">
            <a
              v-for="source in message.sources"
              :key="source"
              :href="source"
              target="_blank"
              class="source-link"
            >
              {{ source }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
/** keep */
</style>
