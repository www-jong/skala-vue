<script setup>
import { ref, watch } from 'vue'

const city = ref('서울')
const dateType = ref('평일')
const logMessage = ref('감시 대기 중...')

// 다중 소스 배열 감시 [city, dateType]
watch([city, dateType], ([newCity, newDate], [oldCity, oldDate]) => {
  logMessage.value = `도시: [${oldCity} ➡️ ${newCity}] | 일정: [${oldDate} ➡️ ${newDate}]`
  console.log(`[다중 감시 발생] ${oldCity}/${oldDate} ➡️ ${newCity}/${newDate}`)
})
</script>

<template>
  <div class="practice-section">
    <h2>다중 소스 감시자 watch([])</h2>
    <p>watch() 대상을 배열로 지정하면 여러 반응형 데이터 중 하나만 변경되어도 감시 콜백이 가동됩니다.</p>
    <hr />

    <p>현재 선택: <strong>{{ city }}</strong> / <strong>{{ dateType }}</strong></p>

    <div>
      <h3>도시 선택</h3>
      <button @click="city = '서울'">서울</button>
      <button @click="city = '부산'">부산</button>
      <button @click="city = '제주'">제주</button>
    </div>

    <div>
      <h3>일정 선택</h3>
      <button @click="dateType = '평일'">평일</button>
      <button @click="dateType = '주말'">주말</button>
    </div>

    <p>다중 감시 로그: {{ logMessage }}</p>
  </div>
</template>
