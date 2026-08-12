<script setup>
import { RouterLink, RouterView } from 'vue-router'
import WeatherMockup from './components/exercise/WeatherMockup.vue'
import WeatherComposition from './components/exercise/WeatherComposition.vue'
import WeatherParent from './components/exercise/WeatherParent.vue'
</script>

<template>
  <div class="exercise-grid-container">
    <!-- 과제 1 -->
    <div class="app-container grid-item">
      <h1>⛅ 과제 1: 날씨 (Mockup)</h1>
      <hr />
      <WeatherMockup />
    </div>

    <!-- 과제 2 -->
    <div class="app-container grid-item">
      <h1>⛅ 과제 2: 날씨 (컴포지션)</h1>
      <hr />
      <WeatherComposition />
    </div>

    <!-- 과제 3 -->
    <div class="app-container grid-item">
      <h1>⛅ 과제 3: 날씨 (컴포넌트)</h1>
      <hr />
      <WeatherParent />
    </div>

    <!-- 과제 4 (라우터 적용) -->
    <div class="app-container grid-item">
      <h1>⛅ 과제 5: 라우터 적용</h1>
      <hr />
      <div class="dashboard-wrapper">
        <nav class="navigation-bar">
          <RouterLink to="/" class="nav-item">🌦️ 날씨 대시보드</RouterLink>
          <span class="divider">|</span>
          <RouterLink to="/about" class="nav-item">ℹ️ 서비스 소개</RouterLink>
          <UnitToggler/>
        </nav>
        <main>
          <RouterView />
        </main>
      </div>
    </div>
  </div>
</template>

<style>
@import '@/assets/exercise.css';

/* 반응형 균등 5:5 2x2 그리드 레이아웃 */
.exercise-grid-container {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
}

.grid-item {
  margin: 0 !important;
  width: 100%;
  min-width: 0; /* 내부 고정폭에 의한 컬럼 왜곡 방지 */
  box-sizing: border-box;
}

/* 화면 너비 1100px 이하 시 세로 1줄 스택 배치 */
@media (max-width: 1100px) {
  .exercise-grid-container {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
