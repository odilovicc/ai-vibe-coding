<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { onMounted } from 'vue'

const router = useRouter()
const route = useRoute()

definePageMeta({
  ssr: false
})


onMounted(async () => {

  if(process.server) return

  const key = route.query.key as string

  if (!key) {
    return router.push('/')
  }

  try {
    await $fetch('/api/pro/pro-activate', { // наш серверный endpoint
      method: 'POST',
      body: { key }
    })
    console.log('PRO активирован успешно')
  } catch (e) {
    console.error('Ошибка активации PRO:', e)
  } finally {
    router.push('/')
  }
})
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <p class="text-lg font-medium">Обрабатываем оплату...</p>
  </div>
</template>
