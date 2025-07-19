<script setup>
import { ref, onMounted } from 'vue'
import { Settings } from 'lucide-vue-next'
import Button from '@/components/ui/button/Button.vue'
import Dialog from '@/components/ui/dialog/Dialog.vue'
import DialogTrigger from '@/components/ui/dialog/DialogTrigger.vue'
import DialogContent from '@/components/ui/dialog/DialogContent.vue'
import DialogHeader from '@/components/ui/dialog/DialogHeader.vue'
import DialogTitle from '@/components/ui/dialog/DialogTitle.vue'
import DialogDescription from '@/components/ui/dialog/DialogDescription.vue'
import DialogFooter from '@/components/ui/dialog/DialogFooter.vue'
import DialogClose from '@/components/ui/dialog/DialogClose.vue'
import Input from '@/components/ui/input/Input.vue'
import Label from '@/components/ui/label/Label.vue'

const settingsOpen = ref(false)
const url = ref('')

onMounted(() => {
  url.value = localStorage.getItem('api-url') || ''
})

function saveUrl() {
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
            variant="outline"
            size="icon"
            aria-label="Открыть настройки"
          >
            <Settings class="w-5 h-5 mr-1" />
            <span class="hidden sm:inline">Настройки</span>
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
