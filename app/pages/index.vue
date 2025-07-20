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

const url = ref('')

onMounted(() => {
  url.value = localStorage.getItem('api-url') || ''
})

const getUrlFromLS = () => {
  url.value = localStorage.getItem('api-url') || ''
}

const saveUrl = () => {
  localStorage.setItem('api-url', url.value)
}

const methods = ['GET', 'POST', 'PUT', 'DELETE']
const method = ref(methods[1])
</script>

<template>
  <div class="app-container">
    <div class="chat-wrapper">
      <div
        class="chat-messages"
        ref="chatMessages"
      >
        <div
          v-for="message in messages"
          :key="message.id"
          class="chat-message-row"
        >
          <ChatMessage :message="message" />
        </div>
        <div v-if="isLoading">
          <span class="loading-text">Агент думает...</span>
        </div>
      </div>
      <div class="chat-input-bar">
        <form
          class="flex items-center gap-2 w-full"
          @submit.prevent="sendMessage"
        >
          <UButtonGroup class="w-full">
            <UModal
              title="Настройки запроса"
              close-icon="i-lucide-x"
            >
              <UButton
                icon="i-lucide-settings"
                color="neutral"
                variant="subtle"
                @click="getUrlFromLS"
              />
              <template #body>
                <UButtonGroup class="mt-1">
                  <USelectMenu
                    v-model="method"
                    :items="methods"
                  />
                  <UInput
                    v-model="url"
                    class="w-75"
                    placeholder="Webhook url here"
                  >
                  </UInput>
                  <UButton
                    color="neutral"
                    variant="outline"
                    icon="i-lucide-x"
                    @click="getUrlFromLS"
                  />
                  <UButton
                    color="neutral"
                    variant="subtle"
                    icon="i-lucide-save"
                    @click="saveUrl"
                  />
                </UButtonGroup>
              </template>
              <template #footer="{ close }">
                <UButton
                  label="Отмена"
                  color="neutral"
                  variant="outline"
                  @click="close"
                />
                <UButton
                  label="Сохранить"
                  color="neutral"
                  @click="
                    () => {
                      saveUrl(), close()
                    }
                  "
                />
              </template>
            </UModal>
            <UInput
              v-model="userInput"
              :disabled="isLoading"
              class="flex-1"
              placeholder="Спросите что-нибудь у агента..."
            />
            <UButton
              variant="subtle"
              color="neutral"
              icon="i-lucide-send"
              @click="sendMessage"
            />
          </UButtonGroup>
        </form>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.app-container {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  align-items: center;
  justify-content: center;
}

.chat-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  max-width: 1024px;
}

.chat-messages {
  flex: 1 1 0%;
  overflow-y: auto;
  padding: 2rem 1.5rem 1rem 1.5rem;
  display: flex;
  flex-direction: column;
}

.chat-message-row {
  width: 100%;
}

.chat-input-bar {
  padding: 1rem 1.5rem;
  width: 100%;
}
</style>
