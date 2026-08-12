<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="weather-router-app">
    <!-- 4번 라우터 과제 전용 네비게이션 바 (<RouterLink>) -->
    <nav class="router-nav-bar">
      <RouterLink to="/" class="router-nav-btn">🏠 날씨 대시보드 메인</RouterLink>
      <RouterLink to="/favorite" class="router-nav-btn">⭐ 관심 도시 목록</RouterLink>
      <RouterLink to="/about" class="router-nav-btn">ℹ️ 서비스 소개 (About)</RouterLink>
    </nav>

    <!-- 라우트 URL 경로에 따라 View 페이지 자동 교체 구역 -->
    <main class="router-view-container">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.router-nav-bar {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 20px;
  padding: 10px;
  background: #f1f5f9;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.router-nav-btn {
  text-decoration: none;
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.router-nav-btn:hover {
  background: #e2e8f0;
  color: #0f172a;
}

/* 현재 라우트 경로 활성화 스타일 */
.router-nav-bar .router-link-exact-active {
  background: #3b82f6;
  color: #ffffff;
}

html.dark .router-nav-bar {
  background: #1e293b;
  border-color: #334155;
}

html.dark .router-nav-btn {
  color: #94a3b8;
}

html.dark .router-nav-bar .router-link-exact-active {
  background: #3b82f6;
  color: #ffffff;
}
</style>
