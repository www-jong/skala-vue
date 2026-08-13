<script setup>
import { ref, computed } from 'vue'
import PracticeBasic from '@/views/practice/PracticeBasic.vue'
import PracticeComposition from '@/views/practice/PracticeComposition.vue'
import PracticeComponent from '@/views/practice/PracticeComponent.vue'
import PracticeAxios from '@/views/practice/PracticeAxios.vue'

// 하위 서브 탭 상태 ('basic' | 'composition' | 'component')
const subTab = ref('basic')
const isDropdownOpen = ref(false)

const practiceTabOptions = [
  { value: 'basic', label: '📖 1. Basic Directives & Events' },
  { value: 'composition', label: '⚙️ 2. Composition API' },
  { value: 'component', label: '🧩 3. Component & Lifecycle' },
  { value: 'axios', label: '📡 4. Axios' }
]

const currentOptionLabel = computed(() => {
  const found = practiceTabOptions.find((opt) => opt.value === subTab.value)
  return found ? found.label : ''
})

function selectPracticeSubTab(val) {
  subTab.value = val
  isDropdownOpen.value = false
}
</script>

<template>
  <div class="practice-app-wrapper">
    <!-- PracticeApp 전용 하위 서브 네비게이션 바 (전 화면 우측 드롭다운 전용) -->
    <div class="sub-nav-bar">
      <div class="sub-nav-select-wrapper">
        <button type="button" class="sub-nav-dropdown-btn" @click="isDropdownOpen = !isDropdownOpen">
          <span>{{ currentOptionLabel }}</span>
          <span :class="['select-arrow', { open: isDropdownOpen }]">▾</span>
        </button>

        <Transition name="dropdown-fade">
          <div v-if="isDropdownOpen" class="sub-nav-dropdown-menu">
            <button v-for="opt in practiceTabOptions" :key="opt.value" type="button"
              :class="['sub-nav-dropdown-item', { active: subTab === opt.value }]"
              @click="selectPracticeSubTab(opt.value)">
              {{ opt.label }}
            </button>
          </div>
        </Transition>
      </div>
    </div>

    <!-- 서브 탭별 뷰 전환 -->
    <main class="sub-content">
      <PracticeBasic v-if="subTab === 'basic'" />
      <PracticeComposition v-else-if="subTab === 'composition'" />
      <PracticeComponent v-else-if="subTab === 'component'" />
      <PracticeAxios v-else-if="subTab === 'axios'" />
    </main>
  </div>
</template>

<style>
@import '@/assets/subnavbar.css';
@import '@/assets/Practice.css';

/* PracticeApp (실습) 뷰 전용 컴팩트 중앙 정렬 (900px 고정) */
.practice-app-wrapper {
  max-width: 900px;
  margin: 0 auto;
}
</style>
