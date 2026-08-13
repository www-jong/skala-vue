<script setup>
import { RouterLink, useRoute } from 'vue-router'
import '@/assets/themeToggle.css'
import '@/assets/navbar.css'

defineProps({
  isDarkmode: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['toggle-theme'])
const route = useRoute()

const handleThemeToggle = () => {
  emit('toggle-theme')
}
</script>

<template>
  <header class="app-header-nav">
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
          @change="handleThemeToggle"
        />
        <label for="theme-checkbox" class="theme-toggle-label" title="라이트/다크모드 전환"></label>
      </div>
    </nav>

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
  </header>
</template>
