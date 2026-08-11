<script setup>
import { ref } from 'vue'

const isDarkmode = ref(false)
const toggleTheme = () => {
  isDarkmode.value = !isDarkmode.value
  document.documentElement.classList.toggle('dark', isDarkmode.value)
}

import SampleOne from './components/practices/basic/SampleOne.vue'
import SampleTwo from './components/practices/basic/SampleTwo.vue'
import VHtml from './components/practices/basic/VHtml.vue'
import VHtmlXSS from './components/practices/basic/VHtmlXSS.vue'
import VText from './components/practices/basic/VText.vue'
import VBindBasic from './components/practices/basic/VBindBasic.vue'
import VBindClassBinding from './components/practices/basic/VBindClassBinding.vue'
import VBindStyleBinding from './components/practices/basic/VBindStyleBinding.vue'
import VBindShortHand from './components/practices/basic/VBindShortHand.vue'
import VCondition from './components/practices/basic/VCondition.vue'
import VShow from './components/practices/basic/VShow.vue'
import VFor from './components/practices/basic/VFor.vue'
import VPre from './components/practices/basic/VPre.vue'
import VCloak from './components/practices/basic/VCloak.vue'
import VOnce from './components/practices/basic/VOnce.vue'
import VMemo from './components/practices/basic/VMemo.vue'

import VOnEvent from './components/practices/basic/VOnEvent.vue'
import EventObject from './components/practices/basic/EventObject.vue'
import EventModifier from './components/practices/basic/EventModifier.vue'
</script>
<template>

  <div :class="['app-container', { dark: isDarkmode }]">
    <!-- 테마 토글 버튼 -->
    <button class="theme-toggle-btn" @click="toggleTheme">
      {{ isDarkmode ? '☀️ 라이트 모드' : '🌙 다크 모드' }}
    </button>
        <div class="chapter-group">
          <h1 class="chapter-title">Vue Directive</h1>
    <SampleOne />
    <SampleTwo />
    <VHtml />
    <VHtmlXSS />
    <VText />
    <VBindBasic />
    <VBindClassBinding />
    <VBindStyleBinding />
    <VBindShortHand />
    <VCondition />
    <VShow />
    <VFor />
    <VPre />
    <VCloak />
    <VOnce />
    <VMemo />
    </div>
    <div class="chapter-group">
      <h1 class="chapter-title">Vue Event Handling</h1>
    <VOnEvent />
    <EventObject/>
    <EventModifier/>
    </div>
  </div>
</template>
<style>
/* 전체 중앙 카드 레이아웃 */
#app {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

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
  padding: 40px 20px;
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

/* 토글 버튼 */
.theme-toggle-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 10px 16px;
  border-radius: 20px;
  border: none;
  background: #334155;
  color: white;
  font-weight: bold;
  cursor: pointer;
  z-index: 1000;
}
</style>
