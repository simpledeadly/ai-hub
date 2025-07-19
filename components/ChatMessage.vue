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
  <div :class="['flex', message.role === 'user' ? 'justify-end' : 'justify-start']">
    <div
      :class="[
        'max-w-[85%] min-w-[200px] rounded-2xl p-4 shadow',
        message.role === 'user'
          ? 'bg-gradient-to-br from-indigo-400 to-purple-500 text-white rounded-br-md'
          : 'bg-card border text-foreground rounded-bl-md',
      ]"
    >
      <div class="flex gap-3 items-start">
        <div
          :class="[
            'w-8 h-8 rounded-full flex items-center justify-center mt-1',
            message.role === 'user'
              ? 'bg-gradient-to-br from-indigo-400 to-purple-500 text-white'
              : 'bg-gradient-to-br from-pink-200 to-pink-400 text-white',
          ]"
        >
          <svg
            v-if="message.role === 'user'"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle
              cx="12"
              cy="7"
              r="4"
            />
          </svg>
          <svg
            v-else
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="mb-2 whitespace-pre-line break-words">
            {{ message.content }}
          </p>
          <div
            v-if="message.sources && message.sources.length > 0"
            class="mt-2 pt-2 border-t border-muted"
          >
            <div class="flex items-center gap-1 text-xs font-semibold uppercase opacity-80 mb-1">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              <span>Источники</span>
            </div>
            <div class="flex flex-col gap-1">
              <a
                v-for="source in message.sources"
                :key="source"
                :href="source"
                target="_blank"
                class="text-indigo-600 hover:underline text-xs break-all"
              >
                {{ source }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
