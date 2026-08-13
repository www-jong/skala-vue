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
      <div class="nav-brand">
        <span class="nav-logo">⚡ SKALA Vue</span>
      </div>

      <!-- 데스크탑 전용 상단 탭 -->
      <div class="nav-tabs desktop-only">
        <RouterLink
          to="/"
          :class="['nav-btn', { active: route.path === '/' || route.path === '/about' || (route.path.startsWith('/weather') && !route.path.startsWith('/exercise')) }]"
        >
          🌦️ 날씨 앱
        </RouterLink>
        <RouterLink
          to="/practice"
          :class="['nav-btn', { active: route.path === '/practice' }]"
        >
          📚 PracticeApp(실습)
        </RouterLink>
        <RouterLink
          to="/exercise"
          :class="['nav-btn', { active: route.path.startsWith('/exercise') }]"
        >
          📝 ExerciseApp(과제)
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

    <!-- 모바일 전용 하단 고정 탭바 (Bottom Nav) -->
    <nav class="bottom-nav-bar mobile-only">
      <RouterLink
        to="/"
        :class="['bottom-nav-item', { active: route.path === '/' || route.path === '/about' || (route.path.startsWith('/weather') && !route.path.startsWith('/exercise')) }]"
      >
        <span class="bottom-nav-icon">🌦️</span>
        <span class="bottom-nav-label">날씨 앱</span>
      </RouterLink>
      <RouterLink
        to="/practice"
        :class="['bottom-nav-item', { active: route.path === '/practice' }]"
      >
        <span class="bottom-nav-icon">📚</span>
        <span class="bottom-nav-label">실습</span>
      </RouterLink>
      <RouterLink
        to="/exercise"
        :class="['bottom-nav-item', { active: route.path.startsWith('/exercise') }]"
      >
        <span class="bottom-nav-icon">📝</span>
        <span class="bottom-nav-label">과제</span>
      </RouterLink>
    </nav>
  </div>
</template>

<style>
/* 전체 레이아웃 */
#app {
  max-width: 1400px;
  margin: 0 auto;
  padding: 120px 20px 40px;
}

.nav-brand {
  display: flex;
  align-items: center;
}

.nav-logo {
  font-size: 1.05rem;
  font-weight: 800;
  background: linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

html.dark .nav-logo {
  background: linear-gradient(135deg, #818cf8 0%, #2dd4bf 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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
  text-decoration: none;
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

/* 모바일 전용 하단 고정 탭바 (Bottom Nav) */
.bottom-nav-bar {
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 60px;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-top: 1px solid rgba(99, 102, 241, 0.18);
  z-index: 10000;
  box-shadow: 0 -4px 20px rgba(79, 70, 229, 0.08);
  justify-content: space-around;
  align-items: center;
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

html.dark .bottom-nav-bar {
  background: rgba(15, 23, 42, 0.92);
  border-top-color: rgba(129, 140, 248, 0.22);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.4);
}

.bottom-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  flex: 1;
  height: 100%;
  color: #64748b;
  text-decoration: none;
  font-size: 0.74rem;
  font-weight: 700;
  transition: all 0.2s ease;
}

.bottom-nav-icon {
  font-size: 1.3rem;
  line-height: 1;
  transition: transform 0.2s ease;
}

.bottom-nav-item.active {
  color: #4f46e5;
}

.bottom-nav-item.active .bottom-nav-icon {
  transform: translateY(-2px) scale(1.12);
}

html.dark .bottom-nav-item {
  color: #94a3b8;
}

html.dark .bottom-nav-item.active {
  color: #2dd4bf;
}

/* 데스크탑/모바일 표시 분개 클래스 */
.desktop-only {
  display: flex;
}

.mobile-only {
  display: none;
}

/* 반응형 레이아웃 (App.vue) */
@media (max-width: 768px) {
  #app {
    padding: 74px 12px 76px;
  }

  .nav-bar {
    top: 8px;
    width: calc(100% - 16px);
    padding: 0 16px;
    height: 48px;
  }

  .desktop-only {
    display: none !important;
  }

  .mobile-only {
    display: flex !important;
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

  .nav-bar {
    padding: 0 12px;
  }
}
</style>

