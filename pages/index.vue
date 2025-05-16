<template>
  <div class="min-h-screen bg-[#f8f9fb] font-[Inter] antialiased flex flex-col">
    <!-- Hero -->
    <header class="w-full py-1 px-4 sm:px-0 flex flex-col items-center">
      <div class="max-w-2xl w-full text-center mx-auto">
        <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Улучшите своё резюме с помощью ИИ</h1>
        <p class="text-lg text-gray-500 mb-4">Загрузите PDF — получите аналитику и улучшения под нужную профессию</p>
        <div class="flex flex-col items-center gap-2 mb-2">
          <span class="text-xs text-gray-400">0₽ / Бесплатно / Без регистрации</span>
          <span class="text-xs text-gray-400">Основано на данных от HR и рекрутеров FAANG</span>
        </div>
      </div>
    </header>

    <!-- Main Card -->
    <main class="flex-1 flex flex-col items-center justify-center px-2">
      <div class="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 sm:p-10 flex flex-col gap-8">
        <!-- Step 1: Upload block -->
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xs bg-blue-100 text-blue-600 rounded-full px-2 py-0.5 font-semibold">Шаг 1 из 3</span>
            <span class="text-base font-medium text-gray-700">Загрузите резюме (PDF)</span>
          </div>
          <div
            class="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center py-8 px-4 cursor-pointer hover:border-blue-400 transition group bg-gray-50 relative"
            @dragover.prevent="dragActive = true"
            @dragleave.prevent="dragActive = false"
            @drop.prevent="onDrop"
            @click="fileInput?.click()"
            :class="{'border-blue-400 bg-blue-50/30': dragActive}"
          >
            <svg class="w-12 h-12 text-blue-400 mb-2" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 16V4m0 0L8 8m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
            </svg>
            <span class="text-gray-500 text-base mb-1">Перетащите PDF сюда или <span class="text-blue-500 underline">загрузите файл</span></span>
            <input ref="fileInput" type="file" accept="application/pdf" class="hidden" @change="onFileChange" />
            <span v-if="fileName" class="mt-2 text-sm text-gray-700">{{ fileName }}</span>
          </div>
        </div>
        <!-- Step 2: Profession select -->
        <div v-if="file">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xs bg-blue-100 text-blue-600 rounded-full px-2 py-0.5 font-semibold">Шаг 2 из 3</span>
            <span class="block text-base font-medium text-gray-700">Кем вы хотите быть?</span>
          </div>
          <select v-model="profession" class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-700 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition">
            <option disabled value="">Выберите профессию</option>
            <option v-for="role in roles" :key="role" :value="role">{{ role }}</option>
          </select>
        </div>
        <!-- Step 3: Analyze button -->
        <div v-if="file && profession">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xs bg-blue-100 text-blue-600 rounded-full px-2 py-0.5 font-semibold">Шаг 3 из 3</span>
            <span class="block text-base font-medium text-gray-700">Проанализировать резюме</span>
          </div>
          <button
            class="w-full bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold rounded-xl py-4 text-lg shadow-md hover:opacity-90 transition disabled:opacity-50"
            :disabled="!file || !profession || loading"
            @click="analyze"
          >
            <span v-if="!loading">Проанализировать</span>
            <span v-else class="flex items-center justify-center gap-2"><svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg> Анализируем...</span>
          </button>
        </div>
        <!-- Step: Results -->
        <div v-if="parsedResult && parsedResult.weaknesses && parsedResult.tips && parsedResult.improved && parsedResult.html" class="flex flex-col gap-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="bg-red-50 rounded-xl p-4 flex flex-col gap-2 border border-red-100">
              <div class="flex items-center gap-2 text-rose-500 font-semibold"><span class="text-lg">❌</span> Ошибки в вашем резюме</div>
              <ul class="text-gray-700 text-sm list-disc ml-5">
                <li v-for="(item, i) in parsedResult.weaknesses" :key="i">{{ item }}</li>
              </ul>
            </div>
            <div class="bg-green-50 rounded-xl p-4 flex flex-col gap-2 border border-green-100">
              <div class="flex items-center gap-2 text-green-600 font-semibold"><span class="text-lg">✔️</span> Рекомендации</div>
              <ul class="text-gray-700 text-sm list-disc ml-5">
                <li v-for="(item, i) in parsedResult.tips" :key="i">{{ item }}</li>
              </ul>
            </div>
          </div>
          <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div class="flex items-center gap-2 text-violet-500 font-semibold mb-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> Обновлённая версия резюме</div>
            <textarea readonly class="w-full min-h-[120px] rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-700 font-mono resize-y focus:outline-none mb-2">{{ parsedResult.improved }}</textarea>
            <div class="flex flex-wrap gap-2 mb-2">
              <button @click="download('txt')" class="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-200 transition">Скачать TXT</button>
              <button @click="download('html')" class="bg-violet-100 text-violet-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-200 transition">Скачать HTML</button>
              <button @click="copyText" class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition">Копировать текст</button>
            </div>
            <div class="flex flex-col gap-1">
              <label class="block text-sm text-gray-500">HTML шаблон</label>
              <div class="bg-gray-100 rounded-xl p-3 overflow-x-auto text-xs font-mono border border-gray-200">
                <pre class="whitespace-pre-wrap">{{ parsedResult.html }}</pre>
              </div>
              <div class="mt-2 flex flex-wrap gap-2 items-center">
                <a :href="githubUrl" target="_blank" class="text-blue-500 underline text-xs">Хочешь верстать сам? GitHub</a>
                <a :href="zipUrl" download class="text-blue-500 underline text-xs">Скачать ZIP</a>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="typeof result === 'object' && result && 'error' in result" class="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-yellow-800">
          <div class="font-bold mb-2">AI не смог вернуть структурированный результат. Вот что он прислал:</div>
          <pre class="bg-gray-100 p-2 rounded text-xs overflow-x-auto">{{ result.raw }}</pre>
        </div>
        <!-- Feedback -->
        <div v-if="parsedResult" class="flex items-center gap-3 justify-center mt-2">
          <span class="text-gray-700 text-base">Было полезно?</span>
          <button @click="feedback('up')" :class="['w-10 h-10 flex items-center justify-center rounded-full transition', feedbackValue==='up' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-400']">
            👍
          </button>
          <button @click="feedback('down')" :class="['w-10 h-10 flex items-center justify-center rounded-full transition', feedbackValue==='down' ? 'bg-rose-100 text-rose-600' : 'hover:bg-gray-100 text-gray-400']">
            👎
          </button>
        </div>
      </div>
    </main>
    <!-- Footer -->
    <footer class="w-full text-center text-gray-400 text-xs py-8 mt-8">Создано с ❤️ в Cursor + OpenAI</footer>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, computed, defineExpose } from 'vue'

const file = ref<File|null>(null)
const fileName = ref('')
const fileInput = ref<HTMLInputElement|null>(null)
const dragActive = ref(false)
const profession = ref('')
const roles = [
  'Frontend Developer',
  'Backend Developer',
  'Fullstack Developer',
  'Product Manager',
  'Data Scientist',
  'QA Engineer',
  'DevOps Engineer',
  'UI/UX Designer',
  'Project Manager',
  'Mobile Developer',
]
const loading = ref(false)
const result = ref<any>(null)
const feedbackValue = ref<string|null>(null)
const githubUrl = 'https://github.com/your-cv-template'
const zipUrl = '/cv-template.zip'

function onFileChange(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (files && files[0]) {
    file.value = files[0]
    fileName.value = files[0].name
    scrollToStep(2)
  }
}
function onDrop(e: DragEvent) {
  dragActive.value = false
  if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
    file.value = e.dataTransfer.files[0]
    fileName.value = e.dataTransfer.files[0].name
    scrollToStep(2)
  }
}
function scrollToStep(step: number) {
  nextTick(() => {
    const el = document.querySelectorAll('.step-anchor')[step-1] as HTMLElement
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  })
}
watch([file, profession], ([f, p]) => {
  if (f && !p) scrollToStep(2)
  if (f && p) scrollToStep(3)
})
async function analyze() {
  loading.value = true
  result.value = null
  try {
    const formData = new FormData()
    if (file.value) formData.append('file', file.value)
    formData.append('profession', profession.value)
    const res = await fetch('/api/analyze', {
      method: 'POST',
      body: formData
    })
    if (!res.ok) throw new Error('Ошибка анализа. Попробуйте позже.')
    const data = await res.json()
    result.value = data
    nextTick(() => scrollToStep(4))
  } catch (e: any) {
    alert(e.message || 'Ошибка анализа. Попробуйте позже.')
  } finally {
    loading.value = false
  }
}
function feedback(val: string) {
  feedbackValue.value = val
}
function download(type: 'txt'|'html') {
  if (!result.value) return
  let content = type === 'txt' ? result.value.improved : result.value.html
  const blob = new Blob([content], { type: type === 'txt' ? 'text/plain' : 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = type === 'txt' ? 'improved-cv.txt' : 'improved-cv.html'
  document.body.appendChild(a)
  a.click()
  setTimeout(() => {
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, 100)
}
function copyText() {
  if (!result.value) return
  navigator.clipboard.writeText(result.value.improved)
}

const parsedResult = computed(() => {
  if (!result.value) return null
  if (result.value.weaknesses && result.value.tips && result.value.improved && result.value.html) {
    return result.value
  }
  if (result.value.raw) {
    let raw = result.value.raw.trim()
    if (raw.startsWith('```json')) {
      raw = raw.replace(/^```json/, '').replace(/```$/, '').trim()
    } else if (raw.startsWith('```')) {
      raw = raw.replace(/^```/, '').replace(/```$/, '').trim()
    }
    try {
      const parsed = JSON.parse(raw)
      if (parsed.weaknesses && parsed.tips && parsed.improved && parsed.html) {
        return parsed
      }
    } catch {}
  }
  return null
})
defineExpose({ parsedResult })
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
body {
  background: #f8f9fb;
}
::-webkit-scrollbar {
  width: 8px;
  background: #f3f4f6;
}
::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 8px;
}
@media (max-width: 640px) {
  h1, .text-4xl, .sm\:text-5xl {
    font-size: 1.7rem !important;
  }
  .text-lg {
    font-size: 1rem !important;
  }
  .max-w-2xl {
    max-width: 98vw !important;
  }
  .rounded-2xl {
    border-radius: 1rem !important;
  }
  .p-6, .sm\:p-10 {
    padding: 1.25rem !important;
  }
  .py-10 {
    padding-top: 1.5rem !important;
    padding-bottom: 1.5rem !important;
  }
  .gap-8 {
    gap: 1.25rem !important;
  }
  .w-12, .h-12 {
    width: 2.2rem !important;
    height: 2.2rem !important;
  }
  .w-full {
    width: 100% !important;
  }
}
</style>