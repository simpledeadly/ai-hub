<script setup>
import { ref, onMounted } from 'vue'
import { Settings } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogContent,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
  <div class="app-container">
    <!-- Кнопка настроек -->
    <div style="position: absolute; top: 24px; right: 32px; z-index: 50">
      <Dialog v-model:open="settingsOpen">
        <DialogTrigger as-child>
          <Button
            size="icon"
            class="cursor-pointer"
          >
            <Settings class="w-5 h-5 mr-1" />
          </Button>
        </DialogTrigger>
        <DialogContent class="max-w-md w-full">
          <DialogHeader>
            <DialogTitle>Настройки</DialogTitle>
            <DialogDescription>Укажите URL-адрес для отправки запросов</DialogDescription>
          </DialogHeader>
          <form @submit.prevent="saveUrl">
            <div class="space-y-2 py-4">
              <Label for="api-url">URL-адрес</Label>
              <Input
                id="api-url"
                v-model="url"
                placeholder="https://example.com/api"
              />
            </div>
            <DialogFooter>
              <Button type="submit">Сохранить</Button>
              <DialogClose as-child>
                <Button
                  variant="ghost"
                  type="button"
                  >Отмена</Button
                >
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
    <!-- Сюда Nuxt будет рендерить страницы из папки /pages -->
    <NuxtPage />
  </div>
</template>
