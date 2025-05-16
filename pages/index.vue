<template>
  <div class="min-h-screen bg-gradient-to-br from-[#f8f9fb] via-[#e9eafc] to-[#f3f7fa] font-[Inter] antialiased flex flex-col relative overflow-x-hidden">
    <!-- SVG иллюстрации -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none select-none">
      <img src="/images/resume-bg.svg" class="absolute left-0 top-0 w-48 md:w-64 opacity-20 hidden md:block animate-fade-in" style="z-index:0;" alt="resume-illustration" />
      <img src="/images/cv-bg.svg" class="absolute right-0 bottom-0 w-56 md:w-72 opacity-20 hidden md:block animate-fade-in" style="z-index:0;" alt="cv-illustration" />
    </div>
    <!-- Hero -->
    <header class="w-full py-12 px-4 sm:px-0 flex flex-col items-center animate-fade-in">
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
      <div class="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 sm:p-10 flex flex-col gap-8 animate-slide-up">
        <!-- Step 1: Upload block -->
        <div class="step-anchor">
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
        <div v-if="file" class="step-anchor">
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
        <div v-if="file && profession" class="step-anchor">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xs bg-blue-100 text-blue-600 rounded-full px-2 py-0.5 font-semibold">Шаг 3 из 3</span>
            <span class="block text-base font-medium text-gray-700">Выберите тип анализа</span>
          </div>
          <div class="flex flex-col sm:flex-row gap-3">
            <button
              class="flex-1 bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold rounded-xl py-4 text-lg shadow-md hover:opacity-90 transition disabled:opacity-50 relative group"
              :disabled="!file || !profession || loading"
              @click="analyze(false)"
            >
              <span v-if="!loading" class="flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                Проанализировать
              </span>
              <span v-else class="flex items-center justify-center gap-2">
                <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                Анализируем...
              </span>
              <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-500/50 to-violet-500/50 rounded-full blur-sm group-hover:w-32 transition-all duration-300"></div>
            </button>
            <button
              class="flex-1 bg-gradient-to-r from-violet-500 to-blue-500 text-white font-semibold rounded-xl py-4 text-lg shadow-md hover:opacity-90 transition flex items-center justify-center gap-2 group relative disabled:opacity-50"
              @click="isPro ? analyze(true) : showProModal = true"
              :disabled="isProloading"
            >
              <span class="flex items-center gap-2">
                <span v-if="!isProloading">
                  Глубокий анализ
                </span>
              <span v-else class="flex items-center justify-center gap-2">
                <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                Анализируем...
              </span>
              </span>
              <span class="px-2 py-0.5 rounded bg-white/20 text-xs font-bold group-hover:bg-white/30 transition">PRO</span>
              <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-violet-500/50 to-blue-500/50 rounded-full blur-sm group-hover:w-32 transition-all duration-300"></div>
            </button>
          </div>
        </div>
        <!-- Step: Results -->
        <div v-if="parsedResult && parsedResult.weaknesses && parsedResult.tips && parsedResult.improved && parsedResult.html" class="flex flex-col gap-6 step-anchor">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="bg-red-50 rounded-xl p-4 flex flex-col gap-2 border border-red-100">
              <div class="flex items-center gap-2 text-rose-500 font-semibold"><span class="text-lg">❌</span> Ошибки в вашем резюме</div>
              <ul class="text-gray-700 text-sm list-disc ml-5">
                <li v-for="(item, i) in parsedResult.weaknesses" :key="i" v-html="formatMarkdown(item)"></li>
              </ul>
            </div>
            <div class="bg-green-50 rounded-xl p-4 flex flex-col gap-2 border border-green-100">
              <div class="flex items-center gap-2 text-green-600 font-semibold"><span class="text-lg">✔️</span> Рекомендации</div>
              <ul class="text-gray-700 text-sm list-disc ml-5">
                <li v-for="(item, i) in parsedResult.tips" :key="i" v-html="formatMarkdown(item)"></li>
              </ul>
            </div>
          </div>
          <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div class="flex items-center gap-2 text-violet-500 font-semibold mb-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> Обновлённая версия резюме</div>
            <textarea readonly class="w-full min-h-[120px] rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-700 font-mono resize-y focus:outline-none mb-2" v-html="formatMarkdown(parsedResult.improved)"></textarea>
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
        <div v-else-if="typeof result === 'object' && result && 'error' in result" class="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-yellow-800 step-anchor">
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
        <!-- Шаблоны -->
        <div v-if="parsedResult" class="flex flex-col gap-4 animate-fade-in">
          <div class="font-semibold text-gray-700 mb-1">Скачать резюме в шаблоне <span class="ml-1 px-2 py-0.5 rounded bg-gradient-to-r from-violet-500 to-blue-500 text-white text-xs font-bold">PRO</span></div>
          <div class="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div v-for="(tpl, i) in templates" :key="i" class="rounded-xl border border-gray-200 bg-gray-50 hover:shadow-lg transition cursor-pointer group relative overflow-hidden" @click="downloadTemplate(tpl)">
              <div class="absolute top-2 right-2 bg-gradient-to-r from-violet-500 to-blue-500 text-white text-xs px-2 py-0.5 rounded font-bold z-10" v-if="tpl.pro">PRO</div>
              <div class="aspect-[3/4] bg-white" v-html="tpl.img"></div>
              <div class="p-2 text-xs text-center text-gray-700">{{ tpl.name }}</div>
            </div>
          </div>
        </div>
        <!-- Модалка для PRO -->
        <div v-if="showProModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in" @click.self="showProModal = false">
          <div class="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center flex flex-col items-center">
            <div class="text-4xl mb-4">✨</div>
            <div class="font-bold text-2xl mb-2">Получите PRO</div>
            <div class="text-gray-500 mb-6">Откройте все возможности для улучшения вашего резюме</div>
            <div class="w-full space-y-4 mb-6">
              <div class="flex items-center gap-3 text-left">
                <div class="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                  </svg>
                </div>
                <div>
                  <div class="font-semibold text-gray-900">Глубокий анализ</div>
                  <div class="text-sm text-gray-500">Детальные рекомендации от HR-специалистов</div>
                </div>
              </div>
              <div class="flex items-center gap-3 text-left">
                <div class="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div>
                  <div class="font-semibold text-gray-900">5 профессиональных шаблонов</div>
                  <div class="text-sm text-gray-500">Готовые к использованию шаблоны резюме</div>
                </div>
              </div>
              <div class="flex items-center gap-3 text-left">
                <div class="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div>
                  <div class="font-semibold text-gray-900">Приоритетная поддержка</div>
                  <div class="text-sm text-gray-500">Быстрые ответы на ваши вопросы</div>
                </div>
              </div>
            </div>
            <div class="w-full flex flex-col gap-3">
              <button 
                class="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 text-white font-semibold hover:opacity-90 transition group relative disabled:opacity-50"
                :disabled="paymentLoading"
                @click="handleProPayment"
              >
                <span class="relative z-10 flex items-center justify-center gap-2">
                  <svg v-if="paymentLoading" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  {{ paymentLoading ? 'Создаем платеж...' : 'Оформить PRO за 999₽/мес' }}
                </span>
                <div class="absolute inset-0 bg-gradient-to-r from-violet-600 to-blue-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
              <button @click="showProModal = false" class="text-gray-500 hover:text-gray-700 transition">Продолжить бесплатно</button>
            </div>
            <div v-if="proPolling" class="mt-4 text-sm text-blue-500 flex items-center gap-2 justify-center">
              <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
              Ожидаем подтверждение оплаты...
            </div>
            <div v-if="proSuccess" class="mt-4 text-green-600 font-semibold">Оплата прошла успешно! PRO доступ активирован 🎉</div>
          </div>
        </div>
      </div>
    </main>
    <!-- Footer -->
    <footer class="w-full text-center text-gray-400 text-xs py-8 mt-8">Создано с ❤️ от Бахти</footer>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, computed, defineExpose, onMounted } from 'vue'

definePageMeta({
  ssr: false
})

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
const showProModal = ref(false)
const templates = [
  { 
    name: 'Минимализм', 
    img: `<svg class="w-full h-full" viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="300" fill="#F8F9FB"/>
      <rect x="40" y="40" width="120" height="20" rx="4" fill="#E9EAFD"/>
      <rect x="40" y="80" width="80" height="4" rx="2" fill="#E9EAFD"/>
      <rect x="40" y="100" width="120" height="4" rx="2" fill="#E9EAFD"/>
      <rect x="40" y="120" width="100" height="4" rx="2" fill="#E9EAFD"/>
      <rect x="40" y="160" width="120" height="20" rx="4" fill="#E9EAFD"/>
      <rect x="40" y="200" width="80" height="4" rx="2" fill="#E9EAFD"/>
      <rect x="40" y="220" width="120" height="4" rx="2" fill="#E9EAFD"/>
      <rect x="40" y="240" width="100" height="4" rx="2" fill="#E9EAFD"/>
    </svg>`,
    pro: true 
  },
  { 
    name: 'Тёмный', 
    img: `<svg class="w-full h-full" viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="300" fill="#1A1B1E"/>
      <rect x="40" y="40" width="120" height="20" rx="4" fill="#2D2E32"/>
      <rect x="40" y="80" width="80" height="4" rx="2" fill="#2D2E32"/>
      <rect x="40" y="100" width="120" height="4" rx="2" fill="#2D2E32"/>
      <rect x="40" y="120" width="100" height="4" rx="2" fill="#2D2E32"/>
      <rect x="40" y="160" width="120" height="20" rx="4" fill="#2D2E32"/>
      <rect x="40" y="200" width="80" height="4" rx="2" fill="#2D2E32"/>
      <rect x="40" y="220" width="120" height="4" rx="2" fill="#2D2E32"/>
      <rect x="40" y="240" width="100" height="4" rx="2" fill="#2D2E32"/>
    </svg>`,
    pro: true 
  },
  { 
    name: 'Акцент', 
    img: `<svg class="w-full h-full" viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="300" fill="#F8F9FB"/>
      <rect x="0" y="0" width="8" height="300" fill="#6366F1"/>
      <rect x="40" y="40" width="120" height="20" rx="4" fill="#E9EAFD"/>
      <rect x="40" y="80" width="80" height="4" rx="2" fill="#E9EAFD"/>
      <rect x="40" y="100" width="120" height="4" rx="2" fill="#E9EAFD"/>
      <rect x="40" y="120" width="100" height="4" rx="2" fill="#E9EAFD"/>
      <rect x="40" y="160" width="120" height="20" rx="4" fill="#E9EAFD"/>
      <rect x="40" y="200" width="80" height="4" rx="2" fill="#E9EAFD"/>
      <rect x="40" y="220" width="120" height="4" rx="2" fill="#E9EAFD"/>
      <rect x="40" y="240" width="100" height="4" rx="2" fill="#E9EAFD"/>
    </svg>`,
    pro: true 
  },
  { 
    name: 'С фото', 
    img: `<svg class="w-full h-full" viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="300" fill="#F8F9FB"/>
      <circle cx="100" cy="80" r="40" fill="#E9EAFD"/>
      <rect x="40" y="140" width="120" height="20" rx="4" fill="#E9EAFD"/>
      <rect x="40" y="180" width="80" height="4" rx="2" fill="#E9EAFD"/>
      <rect x="40" y="200" width="120" height="4" rx="2" fill="#E9EAFD"/>
      <rect x="40" y="220" width="100" height="4" rx="2" fill="#E9EAFD"/>
      <rect x="40" y="240" width="120" height="4" rx="2" fill="#E9EAFD"/>
    </svg>`,
    pro: true 
  },
  { 
    name: 'Строгий', 
    img: `<svg class="w-full h-full" viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="300" fill="#F8F9FB"/>
      <rect x="40" y="40" width="120" height="4" rx="2" fill="#E9EAFD"/>
      <rect x="40" y="60" width="80" height="4" rx="2" fill="#E9EAFD"/>
      <rect x="40" y="100" width="120" height="4" rx="2" fill="#E9EAFD"/>
      <rect x="40" y="120" width="100" height="4" rx="2" fill="#E9EAFD"/>
      <rect x="40" y="160" width="120" height="4" rx="2" fill="#E9EAFD"/>
      <rect x="40" y="180" width="80" height="4" rx="2" fill="#E9EAFD"/>
      <rect x="40" y="220" width="120" height="4" rx="2" fill="#E9EAFD"/>
      <rect x="40" y="240" width="100" height="4" rx="2" fill="#E9EAFD"/>
    </svg>`,
    pro: true 
  },
]
const isPro = ref(false)
const paymentLoading = ref(false)
const proPolling = ref(false)
const proSuccess = ref(false)
const isProloading = ref(false)
let proPollingInterval: any = null
const userToken = ref('')

function getCookie(name: string) {
  if (typeof document === 'undefined') return '' // SSR check
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || ''
  return ''
}
function setCookie(name: string, value: string, days = 365) {
  if (typeof document === 'undefined') return // SSR check
  const expires = new Date(Date.now() + days*24*60*60*1000).toUTCString()
  document.cookie = `${name}=${value}; expires=${expires}; path=/`
}
function getUserToken() {
  let token = getCookie('userToken')
  if (!token) {
    token = crypto.randomUUID()
    setCookie('userToken', token)
  }
  return token
}

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
    // Add checks for document and querySelectorAll for SSR safety
    if (typeof document !== 'undefined') {
      const el = document.querySelectorAll('.step-anchor')[step-1] as HTMLElement
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  })
}
watch([file, profession], ([f, p]) => {
  if (f && !p) scrollToStep(2)
  if (f && p) scrollToStep(3)
})
async function analyze(isDeep: boolean = false) {
  isDeep ? isProloading.value = true : loading.value = true
  
  result.value = null
  try {
    const formData = new FormData()
    if (file.value) formData.append('file', file.value)
    formData.append('profession', profession.value)
    if (isDeep) formData.append('deep', 'true')

    // Ждём userToken, если он ещё не инициализирован
    if (!userToken.value) {
      userToken.value = getUserToken()
    }
    formData.append('userToken', userToken.value)

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
    isProloading.value = false
  }
}
function feedback(val: string) {
  feedbackValue.value = val
}
function download(type: 'txt'|'html') {
  if (!parsedResult.value) return
  let content = type === 'txt' ? parsedResult.value.improved : parsedResult.value.html
  if (!content) return
  
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
  // Check if navigator.clipboard is available (client-side)
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(result.value.improved)
  } else {
    // Fallback for environments without clipboard API
    console.warn('Clipboard API not available.');
    // You might want to add a textarea fallback here if needed
  }
}
function downloadTemplate(tpl: any) {
  // Check if user is PRO before allowing download or showing modal
  if (isPro.value) {
    alert('Функция скачивания шаблона пока не реализована.') // TODO: Implement actual download
  } else {
    showProModal.value = true
  }
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

function formatMarkdown(text: string) {
  // Add check for text being a string
  if (typeof text !== 'string') return text;
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
}

onMounted(async () => {
  userToken.value = getUserToken()
  // Проверяем статус PRO при загрузке, только если есть userToken
  if (userToken.value) {
    try {
      const res = await fetch(`/api/pro/status?userToken=${userToken.value}`)
      const data = await res.json()
      if (data.pro) isPro.value = true
    } catch {}
  }
})

async function handleProPayment() {
  paymentLoading.value = true
  try {
    // Ждём userToken, если он ещё не инициализирован
    if (!userToken.value) {
      userToken.value = getUserToken()
    }
    const res = await fetch('/api/pro/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userToken: userToken.value })
    })
    const data = await res.json()
    
    if (!data.ok) {
      throw new Error(data.error || 'Ошибка создания платежа')
    }

    // Открываем окно с платежом
    window.open(data.result.pay_url, '_blank')
    // Запускаем polling статуса PRO
    pollProStatus()
    // Закрываем модалку
    showProModal.value = false
  } catch (e: any) {
    alert(e.message || 'Ошибка создания платежа')
  } finally {
    paymentLoading.value = false
  }
}

async function pollProStatus() {
  proPolling.value = true
  // Add a small delay before starting polling in case the modal closes and re-renders
  await new Promise(r => setTimeout(r, 500)); 
  for (let i = 0; i < 40; i++) { // ~2 минуты
    if (!userToken.value) break
    try {
      const res = await fetch(`/api/pro/status?userToken=${userToken.value}`)
      const data = await res.json()
      if (data.pro) {
        isPro.value = true
        proSuccess.value = true // Show success message
        proPolling.value = false
        clearInterval(proPollingInterval) // Stop polling
        return
      }
    } catch {}
    await new Promise(r => setTimeout(r, 3000))
  }
  proPolling.value = false // Stop polling after timeout
  // Optional: Show a message if PRO status wasn't confirmed
  // if (!isPro.value) {
  //   alert('Не удалось подтвердить статус PRO. Пожалуйста, проверьте оплату или обратитесь в поддержку.');
  // }
}

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
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in {
  animation: fade-in 1s ease forwards;
}
@keyframes slide-up {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-up {
  animation: slide-up 0.8s cubic-bezier(.4,2,.3,1);
}
</style>