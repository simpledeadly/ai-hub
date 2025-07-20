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
    <div class="message-body">
      <div
        :class="
          message.role === 'user'
            ? 'message-content message-content--user bg-gray-800 text-white'
            : 'message-content text-white'
        "
      >
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
.message {
  display: flex;
  margin-bottom: 1rem;
  width: 100%;
  
}
.message--user {
  justify-content: flex-end;
}
.message:not(.message--user) {
  justify-content: flex-start;
}

.message-content {
  border-radius: 1rem 1rem 1rem 0.25rem;
  padding: 0.5rem 1rem;
  max-width: 70vw;
  min-width: 80px;
  box-shadow: none;
  text-align: left;
}
.message-content--user {
  border-radius: 1rem 1rem 0.25rem 1rem;
  text-align: left;
}

.message-body {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.message-text {
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
  word-break: break-word;
}
.message-sources {
  margin-top: 0.5rem;
}
.sources-header {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #888;
  font-size: 0.85em;
}
.sources-icon {
  width: 1em;
  height: 1em;
}
.sources-title {
  font-weight: 600;
}
.sources-list {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}
.source-link {
  color: #888;
  font-size: 0.92em;
  text-decoration: underline;
  transition: color 0.2s;
}
.source-link:hover {
  color: #111;
}
</style>
