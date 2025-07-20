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
  <div>
    <!-- Кнопка настроек -->
    <div>
      <Dialog v-model:open="settingsOpen">
        <DialogTrigger as-child>
          <Button size="icon">
            <Settings />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Настройки</DialogTitle>
            <DialogDescription>Укажите URL-адрес для отправки запросов</DialogDescription>
          </DialogHeader>
          <form @submit.prevent="saveUrl">
            <div>
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
                  variant="destructive"
                  type="button"
                >
                  Отмена
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
    <NuxtPage />
  </div>
</template>

<style lang="scss">
/** keep */
</style>
