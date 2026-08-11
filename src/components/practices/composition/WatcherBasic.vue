<script setup>
import { ref, watch, onUnmounted } from 'vue'

const selectedCity = ref('서울')
const watchLog = ref('초기 도시: 서울')
let timer = null

watch(selectedCity, (newVal, oldVal) => {
  if (!oldVal) {
    watchLog.value = `초기 도시 설정: [${newVal}]`
  } else {
    watchLog.value = `도시 변경 감지: [${oldVal}] ➡️ [${newVal}]`
  }

  // 2. n초 간격(1초) 콘솔 로그 출력 (기존 타이머 초기화 후 재시작)
  if (timer) clearInterval(timer)

  let seconds = 1
  console.log(`[watch 격발] ${newVal} 감시 타이머 시작`)
  timer = setInterval(() => {
    console.log(`[watch 감시 ${seconds}초 경과] 현재 도시: ${selectedCity.value}`)
    seconds++
  }, 5000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="practice-section">
    <h2>감시자 watch() 기초</h2>
    <p>watch()는 특정 반응형 데이터의 변화를 감지하여 비동기 통신이나 타이머 연동 작업을 수행합니다.</p>
    <hr />

    <p>현재 선택된 도시: <strong>{{ selectedCity }}</strong></p>
    <button @click="selectedCity = '서울'">서울</button>
    <button @click="selectedCity = '부산'">부산</button>
    <button @click="selectedCity = '제주'">제주</button>

    <p>감시 상태: {{ watchLog }}</p>
  </div>
</template>
