<script setup>
import { ref, watch } from 'vue'
import { useRoute, RouterLink, RouterView } from 'vue-router'
import WeatherMockup from './components/exercise/WeatherMockup.vue'
import WeatherComposition from './components/exercise/WeatherComposition.vue'
import WeatherParent from './components/exercise/WeatherParent.vue'
import UnitToggler from './components/exercise/UnitToggler.vue'

const route = useRoute()
// 과제 선택 서브 탭 ('all' | 'ex1' | 'ex2' | 'ex3' | 'ex4')
const subTab = ref('all')

// /about 및 /weather 경로 이동 시 라우터 뷰(ex4 또는 all)가 표시되도록 감지
watch(
  () => route.path,
  (newPath) => {
    if (newPath === '/about' || newPath.startsWith('/weather')) {
      if (subTab.value !== 'all' && subTab.value !== 'ex4') {
        subTab.value = 'ex4'
      }
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="exercise-app-wrapper">
    <!-- ExerciseApp 전용 하위 서브 네비게이션 바 -->
    <div class="sub-nav-bar">
      <button :class="['sub-nav-btn', { active: subTab === 'all' }]" @click="subTab = 'all'">
        전체 보기 (2x2)
      </button>
      <button :class="['sub-nav-btn', { active: subTab === 'ex1' }]" @click="subTab = 'ex1'">
        과제 1. Mockup
      </button>
      <button :class="['sub-nav-btn', { active: subTab === 'ex2' }]" @click="subTab = 'ex2'">
        과제 2. Composition
      </button>
      <button :class="['sub-nav-btn', { active: subTab === 'ex3' }]" @click="subTab = 'ex3'">
        과제 3. Component
      </button>
      <button :class="['sub-nav-btn', { active: subTab === 'ex4' }]" @click="subTab = 'ex4'">
        과제 4/5. Router & Store
      </button>
    </div>

    <!-- 1) 전체 보기 (그리드 레이아웃) -->
    <div v-if="subTab === 'all'" class="exercise-grid-container">
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

      <!-- 과제 4/5 (라우터 적용) -->
      <div class="app-container grid-item">
        <h1>⛅ 과제 5: 라우터 적용</h1>
        <hr />
        <div class="dashboard-wrapper">
          <nav class="navigation-bar">
            <RouterLink to="/exercise" class="nav-item">🌦️ 날씨 대시보드</RouterLink>
            <span class="divider">|</span>
            <RouterLink to="/exercise/about" class="nav-item">ℹ️ 서비스 소개</RouterLink>
            <UnitToggler />
          </nav>
          <main>
            <RouterView />
          </main>
        </div>
      </div>
    </div>

    <!-- 2) 단일 과제 확대 보기 영역 -->
    <div v-else class="single-exercise-container">
      <!-- 과제 1 단일 뷰 -->
      <div v-if="subTab === 'ex1'" class="app-container single-item">
        <h1>⛅ 과제 1: 날씨 (Mockup)</h1>
        <hr />
        <WeatherMockup />
      </div>

      <!-- 과제 2 단일 뷰 -->
      <div v-else-if="subTab === 'ex2'" class="app-container single-item">
        <h1>⛅ 과제 2: 날씨 (컴포지션)</h1>
        <hr />
        <WeatherComposition />
      </div>

      <!-- 과제 3 단일 뷰 -->
      <div v-else-if="subTab === 'ex3'" class="app-container single-item">
        <h1>⛅ 과제 3: 날씨 (컴포넌트)</h1>
        <hr />
        <WeatherParent />
      </div>

      <!-- 과제 4/5 단일 뷰 -->
      <div v-else-if="subTab === 'ex4'" class="app-container single-item">
        <h1>⛅ 과제 5: 라우터 적용</h1>
        <hr />
        <div class="dashboard-wrapper">
          <nav class="navigation-bar">
            <RouterLink to="/exercise" class="nav-item">🌦️ 날씨 대시보드</RouterLink>
            <span class="divider">|</span>
            <RouterLink to="/about" class="nav-item">ℹ️ 서비스 소개</RouterLink>
            <UnitToggler />
          </nav>
          <main>
            <RouterView />
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import '@/assets/subnavbar.css';
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

/* 단일 과제 확대 스타일 */
.single-exercise-container {
  max-width: 950px;
  margin: 0 auto;
  padding: 20px;
}

.single-item {
  width: 100%;
  margin: 0 auto !important;
}

/* 화면 너비 1100px 이하 시 세로 1줄 스택 배치 */
@media (max-width: 1100px) {
  .exercise-grid-container {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
