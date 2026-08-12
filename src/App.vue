<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import '@/assets/themeToggle.css'

const isDarkmode = ref(false)
const toggleTheme = () => {
  isDarkmode.value = !isDarkmode.value
  document.documentElement.classList.toggle('dark', isDarkmode.value)
}

const route = useRoute()
</script>

<template>
  <div :class="['top-app-wrapper', { dark: isDarkmode }]">
    <!-- 상단 네비게이션 바 -->
    <nav class="nav-bar">
      <div class="nav-tabs">
        <RouterLink
          to="/practice"
          :class="['nav-btn', { active: route.path === '/practice' }]"
        >
          PracticeApp(실습)
        </RouterLink>
        <RouterLink
          to="/exercise"
          :class="['nav-btn', { active: route.path.startsWith('/exercise') || route.path === '/about' || route.path.startsWith('/weather') }]"
        >
          ExerciseApp(과제)
        </RouterLink>
      </div>

      <!-- 3D 입체 라이트/다크모드 전환 스위치 버튼 -->
      <div class="theme-toggle-container">
        <input
          type="checkbox"
          name="theme-checkbox"
          id="theme-checkbox"
          :checked="isDarkmode"
          @change="toggleTheme"
        />
        <label for="theme-checkbox" class="theme-toggle-label" title="라이트/다크모드 전환"></label>
      </div>
    </nav>

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

/* 상단 네비게이션 플로팅 글래스모피즘 고정 바 */
.nav-bar {
  position: fixed;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 32px);
  max-width: 1360px;
  height: 56px;
  background: rgba(255, 255, 255, 0.68);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  z-index: 1000;
  box-shadow: 0 10px 30px rgba(79, 70, 229, 0.1), 0 1px 3px rgba(0, 0, 0, 0.05);
}

html.dark .nav-bar {
  background: rgba(19, 25, 39, 0.72);
  border-color: rgba(129, 140, 248, 0.22);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

.nav-tabs {
  display: flex;
  gap: 8px;
}

.nav-btn {
  padding: 8px 18px;
  border-radius: 20px;
  border: 1px solid rgba(99, 102, 241, 0.2);
  background: transparent;
  color: #475569;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  background: rgba(99, 102, 241, 0.08);
  color: #4f46e5;
}

.nav-btn.active {
  background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%);
  color: #ffffff;
  border-color: transparent;
  box-shadow: 0 4px 14px rgba(79, 70, 229, 0.35);
}

html.dark .nav-btn {
  color: #94a3b8;
  border-color: rgba(129, 140, 248, 0.15);
}

html.dark .nav-btn:hover {
  background: rgba(129, 140, 248, 0.15);
  color: #818cf8;
}

html.dark .nav-btn.active {
  background: linear-gradient(135deg, #6366f1 0%, #2dd4bf 100%);
  color: #ffffff;
  border-color: transparent;
  box-shadow: 0 4px 16px rgba(45, 212, 191, 0.35);
}

.theme-toggle-btn {
  padding: 7px 16px;
  border-radius: 20px;
  border: 1px solid rgba(99, 102, 241, 0.25);
  background: rgba(99, 102, 241, 0.08);
  color: #4f46e5;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.theme-toggle-btn:hover {
  background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%);
  color: #ffffff;
  border-color: transparent;
  transform: translateY(-1px);
}

html.dark .theme-toggle-btn {
  background: rgba(129, 140, 248, 0.12);
  border-color: rgba(129, 140, 248, 0.25);
  color: #2dd4bf;
}

html.dark .theme-toggle-btn:hover {
  background: linear-gradient(135deg, #6366f1 0%, #2dd4bf 100%);
  color: #ffffff;
  border-color: transparent;
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
