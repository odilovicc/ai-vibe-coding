<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'

const router = useRouter()
const route = useRoute()
const isProActivated = ref<boolean | null>(null)
const isLoading = ref(true)

definePageMeta({
  ssr: false
})

onMounted(async () => {
  if(process.server) return

  const key = route.query.key as string

  if (!key) {
    isLoading.value = false
    isProActivated.value = false // Key is missing, treat as activation failed
    // Optionally redirect after a delay or show a message
    // setTimeout(() => router.push('/'), 3000)
    return
  }

  try {
    const res = await $fetch('/api/pro/pro-activate', { // наш серверный endpoint
      method: 'POST',
      body: { key }
    })
    
    if(res.ok) {
      isProActivated.value = true
      console.log('PRO активирован успешно')
    } else {
      isProActivated.value = false
      console.error('Ошибка активации PRO: Не удалось активировать.')
    }
  } catch (e) {
    console.error('Ошибка активации PRO:', e)
    isProActivated.value = false
  } finally {
    isLoading.value = false
    // Remove the immediate redirect, the user will see the status
    // router.push('/')
  }
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-[#f8f9fb] via-[#e9eafc] to-[#f3f7fa] font-[Inter] antialiased flex flex-col relative overflow-x-hidden">
    <!-- SVG иллюстрации (optional, depends on desired similarity) -->
    <!-- Add illustrations similar to index.vue if desired -->

    <main class="flex-1 flex flex-col items-center justify-center px-2 py-10">
      <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8 flex flex-col items-center text-center animate-slide-up">
        
        <div v-if="isLoading">
          <svg class="w-12 h-12 animate-spin text-blue-500 mb-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          <p class="text-lg font-medium text-gray-700">Обрабатываем оплату...</p>
        </div>

        <div v-else-if="isProActivated === true">
          <div class="text-green-500 text-5xl mb-4">🎉</div>
          <h1 class="text-2xl font-bold text-gray-900 mb-2">Успех!</h1>
          <p class="text-gray-700 mb-4">Ваш PRO доступ активирован.</p>
          <button @click="router.push('/')" class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">Перейти на главную</button>
        </div>

        <div v-else-if="isProActivated === false">
          <div class="text-red-500 text-5xl mb-4">😞</div>
          <h1 class="text-2xl font-bold text-gray-900 mb-2">Ошибка активации</h1>
          <p class="text-gray-700 mb-4">Не удалось активировать ваш PRO доступ. Пожалуйста, попробуйте ещё раз или обратитесь в поддержку.</p>
          <button @click="router.push('/')" class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">На главную</button>
        </div>

      </div>
    </main>

    <!-- Footer (optional) -->
    <!-- Add footer similar to index.vue if desired -->
    
  </div>
</template>

<style>
/* Inherit styles from index.vue or define similar ones */
/* You might want to copy the relevant parts of the <style> block from index.vue */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
body {
  background: #f8f9fb;
}
/* Add other necessary styles from index.vue */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in {
  animation: fade-in 1s ease;
}
@keyframes slide-up {
  from { opacity: 0; transform: translateY(40px); } 
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-up {
  animation: slide-up 0.8s cubic-bezier(.4,2,.3,1);
}
</style>
