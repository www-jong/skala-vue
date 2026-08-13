<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import AppNavbar from '@/components/AppNavbar.vue'

const isDarkmode = ref(false)
const toggleTheme = () => {
  isDarkmode.value = !isDarkmode.value
  document.documentElement.classList.toggle('dark', isDarkmode.value)
}
</script>

<template>
  <div :class="['top-app-wrapper', { dark: isDarkmode }]">
    <!-- 독립 분리된 네비게이션 헤더 컴포넌트 -->
    <AppNavbar :is-darkmode="isDarkmode" @toggle-theme="toggleTheme" />

    <!-- 탭별 메인 컨텐츠 영역 -->
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style>
/* 전체 레이아웃 */
#app {
  max-width: 1400px;
  margin: 0 auto;
  padding: 120px 20px 40px;
}

/* 챕터 그룹 스타일 */
.chapter-group {
  margin-bottom: 40px;
  padding: 24px;
  background-color: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid #cbd5e1;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
}

html.dark .chapter-group {
  background-color: rgba(30, 41, 59, 0.92);
  border-color: #334155;
  color: #f8fafc;
}

/* 카드 기본 스타일 */
.practice-section {
  background-color: #ffffff !important;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.practice-section h2 {
  font-size: 1.25rem;
  color: #1e293b;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #3b82f6;
}

.practice-section button {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  background: #3b82f6;
  color: white;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
}

.practice-section button:hover {
  background: #2563eb;
}

/* 반응형 레이아웃 (App.vue) */
@media (max-width: 768px) {
  #app {
    padding: 74px 12px 76px;
  }

  .chapter-group {
    padding: 16px;
    margin-bottom: 24px;
  }
}

@media (max-width: 480px) {
  #app {
    padding: 70px 8px 74px;
  }
}
</style>
