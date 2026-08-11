<script setup>
import { ref, computed } from 'vue'

const cnt = ref(0)
const dummy = ref(0)

// 1. 일반 함수: 템플릿의 어느 영역이라도 리렌더링되면 무조건 재실행
const getMethodResult = () => {
  console.log('❌ 일반 함수(Method) 재연산 가동!')
  return cnt.value * 2
}

// 2. Computed: 의존하는 count가 바뀔 때만 재연산 (dummy 변경 시에는 캐싱값 사용)
const doubleCount = computed(() => {
  console.log('✅ Computed 연산 재가동!')
  return cnt.value * 2
})
</script>

<template>
  <div class="practice-section">
    <h2>계산된 속성 computed() 캐싱</h2>
    <p>computed()는 의존성이 변경될 때만 재연산하고, 그렇지 않은 경우 캐싱된 결과값을 반환합니다.</p>
    <hr />

    <p>count: <strong>{{ cnt }}</strong> | dummy: <strong>{{ dummy }}</strong></p>

    <div>
      <button @click="cnt++">count 증가 (의존성 변경)</button>
      <button @click="dummy++">dummy 증가 (무관한 변경)</button>
    </div>

    <p>일반 함수(Method) 연산 결과: {{ getMethodResult() }}</p>
    <p>Computed 연산 결과: {{ doubleCount }}</p>
  </div>
</template>
