<script setup>
import { ref } from 'vue'
import PracticeBasic from './views/practice/PracticeBasic.vue'
import PracticeComposition from './views/practice/PracticeComposition.vue'
import PracticeComponent from './views/practice/PracticeComponent.vue';
// 하위 서브 탭 상태 ('basic' | 'composition')
const subTab = ref('basic')
</script>

<template>
  <div class="practice-app-wrapper">
    <!-- PracticeApp 전용 하위 서브 네비게이션 바 -->
    <div class="sub-nav-bar">
      <button :class="['sub-nav-btn', { active: subTab === 'basic' }]" @click="subTab = 'basic'">
        1. Basic Directives & Events
      </button>
      <button :class="['sub-nav-btn', { active: subTab === 'composition' }]" @click="subTab = 'composition'">
        2. Composition API (Reactive & Watch)
      </button>
      <button :class="['sub-nav-btn', { active: subTab === 'component' }]" @click="subTab = 'component'">
        3. Component & Lifecycle
      </button>

    </div>

    <!-- 서브 탭별 뷰 전환 -->
    <main class="sub-content">
      <PracticeBasic v-if="subTab === 'basic'" />
      <PracticeComposition v-else-if="subTab === 'composition'" />
      <PracticeComponent v-else-if="subTab === 'component'" />
    </main>
  </div>
</template>

<style>
@import '@/assets/subnavbar.css';
@import '@/assets/Practice.css';
</style>
