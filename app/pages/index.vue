<script setup lang="ts">
import type { ServerResponse } from '@@/middlewares/types/types'
import ChatMessage from '@/components/ChatMessage.vue'
import { ref } from 'vue'

type Message = {
  id: number
  role: 'user' | 'agent'
  content: string
  sources?: string[]
}

const messages = ref<Message[]>([
  {
    id: 1,
    role: 'agent',
    content:
      'Здравствуйте! Я ваш ИИ-агент-оркестратор. Какой проект мы будем разрабатывать сегодня?',
  },
])
const userInput = ref('')
const isLoading = ref(false)

const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return

  messages.value.push({
    id: Date.now(),
    role: 'user',
    content: userInput.value,
  })

  const userMessage = userInput.value
  userInput.value = ''
  isLoading.value = true

  try {
    const agentUrl = localStorage.getItem('api-url') || ''

    const response = await $fetch<ServerResponse>('/api/chat', {
      method: 'POST',
      body: { message: userMessage, agentUrl },
    })

    messages.value.push({
      id: Date.now(),
      role: 'agent',
      content: response.reply,
      sources: response.sources,
    })
  } catch {
    messages.value.push({
      id: Date.now(),
      role: 'agent',
      content:
        'Произошла ошибка при обращении к серверу. Убедитесь, что сервер запущен и API-URL настроен в настройках.',
    })
  } finally {
    isLoading.value = false
  }
}

const settingsOpen = ref(false)
const url = ref('')

onMounted(() => {
  url.value = localStorage.getItem('api-url') || ''
})

const saveUrl = () => {
  localStorage.setItem('api-url', url.value)
  settingsOpen.value = false
}
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-4 h-screen">
    <UModal
      title="Settings"
      close-icon="i-lucide-x"
    >
      <UButton
        label="Open"
        color="neutral"
        variant="subtle"
      />
      <template #body>
        <form @submit.prevent="saveUrl">
          <div>
            <ULabel for="api-url">URL-адрес</ULabel>
            <UInput
              id="api-url"
              v-model="url"
              placeholder="https://example.com/api"
            />
          </div>
          <UButton
            type="submit"
            >Сохранить</UButton
          >
          <UButton> Отмена </UButton>
        </form>
      </template>
    </UModal>

    <h1 class="font-bold text-2xl">Send mesage to Agent</h1>

    <div
      v-for="message in messages"
      :key="message.id"
    >
      <ChatMessage :message="message" />
    </div>

    <!-- Loading indicator -->
    <div v-if="isLoading">
      <span class="loading-text">Агент думает...</span>
    </div>

    <div class="flex items-center gap-2">
      <form
        class="flex"
        @submit.prevent="sendMessage"
      >
        <UInput
          v-model="userInput"
          :disabled="isLoading"
          placeholder="Спросите что-нибудь у агента..."
        />
        <UButton
          color="neutral"
          icon="i-lucide-send"
          @click="sendMessage"
        />
      </form>
    </div>
  </div>
</template>

<style lang="scss">
/** keep */
</style>
