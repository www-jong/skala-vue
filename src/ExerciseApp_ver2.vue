<script setup>
import { ref } from 'vue'
import WeatherMockup from '@/components/exercise/WeatherMockup.vue'
import WeatherComposition from '@/components/exercise/WeatherComposition.vue'
import WeatherParent from '@/components/exercise/WeatherParent.vue'
import WeatherRouterApp from '@/views/weather/WeatherRouterApp.vue'

const subTab = ref('ex1')
</script>

<template>
  <div class="exercise-app-wrapper">
    <!-- ExerciseApp 전용 상단 서브 네비게이션 바 -->
    <div class="sub-nav-bar">
      <button :class="['sub-nav-btn', { active: subTab === 'ex1' }]" @click="subTab = 'ex1'">
        과제 1: WeatherMockup (기본)
      </button>
      <button :class="['sub-nav-btn', { active: subTab === 'ex2' }]" @click="subTab = 'ex2'">
        과제 2: 날씨 현황 (Composition API)
      </button>
      <button :class="['sub-nav-btn', { active: subTab === 'ex3' }]" @click="subTab = 'ex3'">
        과제 3: 날씨 (Component)
      </button>
      <button :class="['sub-nav-btn', { active: subTab === 'ex4' }]" @click="subTab = 'ex4'">
        과제 4: Vue Router (라우터 적용)
      </button>
    </div>

    <!-- 서브 탭별 과제 뷰 전환 -->
    <main class="exercise-content">
      <WeatherMockup v-if="subTab === 'ex1'" />
      <WeatherComposition v-else-if="subTab === 'ex2'" />
      <WeatherParent v-else-if="subTab === 'ex3'" />
      <WeatherRouterApp v-else-if="subTab === 'ex4'" />
    </main>
  </div>
</template>

<style>
@import '@/assets/subnavbar.css';
@import '@/assets/exercise.css';

.exercise-app-wrapper {
  max-width: 900px;
  margin: 0 auto;
}
</style>
