<script setup>
import { ref } from 'vue'

const isDarkmode = ref(false)
const toggleTheme = () => {
  isDarkmode.value = !isDarkmode.value
  document.documentElement.classList.toggle('dark', isDarkmode.value)
}

// 탭 전환 상태 ('practice' | 'exercise' | 'weather')
const currentTab = ref('practice')

import ExerciseApp from './ExerciseApp.vue'
import PracticeApp from './PracticeApp.vue'
</script>

<template>
  <div :class="['app-container', { dark: isDarkmode }]">
    <!-- 상단 네비게이션 바 -->
    <nav class="nav-bar">
      <div class="nav-tabs">
        <button :class="['nav-btn', { active: currentTab === 'practice' }]" @click="currentTab = 'practice'">
          PracticeApp(실습)
        </button>
        <button :class="['nav-btn', { active: currentTab === 'exercise' }]" @click="currentTab = 'exercise'">
          ExerciseApp(과제)
        </button>
      </div>

      <!-- 테마 토글 버튼 -->
      <button class="theme-toggle-btn" @click="toggleTheme">
        {{ isDarkmode ? '☀️ 라이트 모드' : '🌙 다크 모드' }}
      </button>
    </nav>

    <!-- 탭별 메인 컨텐츠 영역 -->
    <main class="main-content">
      <!-- 1) PracticeApp 뷰 -->
      <div v-if="currentTab === 'practice'">
        <PracticeApp />
      </div>

      <!-- 2) ExerciseApp 뷰 -->
      <div v-else-if="currentTab === 'exercise'">
        <ExerciseApp />
      </div>
    </main>
  </div>
</template>

<style>
/* 전체 레이아웃 */
#app {
  max-width: 900px;
  margin: 0 auto;
  padding: 80px 20px 40px;
}

/* 상단 네비게이션 고정 바 */
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 1000;
}

.app-container.dark .nav-bar {
  background: rgba(15, 23, 42, 0.9);
  border-bottom-color: #334155;
  backdrop-filter: blur(2px);
}

.nav-tabs {
  display: flex;
  gap: 8px;
}

.nav-btn {
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid #cbd5e1;
  background: transparent;
  color: #64748b;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.nav-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.app-container.dark .nav-btn {
  border-color: #475569;
  color: #94a3b8;
}

.app-container.dark .nav-btn:hover {
  background: #1e293b;
  color: #f8fafc;
}

.app-container.dark .nav-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

/* 챕터 그룹 스타일 */
.chapter-group {
  margin-bottom: 40px;
  padding: 20px;
  border: 2px dashed #cbd5e1;
  border-radius: 16px;
}

.chapter-title {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #3b82f6;
}

/* 카드 기본 스타일 */
.practice-section {
  background: #ffffff;
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

/* 테마 스위치 스타일 */
.app-container {
  min-height: 100vh;
  padding: 20px;
  background-color: #f8fafc;
  color: #1e293b;
  transition: all 0.3s ease;
}

/* 다크 모드 스타일 */
.app-container.dark {
  background-color: #0f172a;
  color: #f8fafc;
}

.app-container.dark .practice-section {
  background-color: #1e293b;
  border-color: #334155;
  color: #f8fafc;
}

.app-container.dark .practice-section h2 {
  color: #f8fafc;
}

/* 테마 토글 버튼 */
.theme-toggle-btn {
  padding: 8px 14px;
  border-radius: 20px;
  border: none;
  background: #334155;
  color: white;
  font-weight: bold;
  cursor: pointer;
}
</style>
