<script setup>
import { ref, watch } from 'vue'

const user = ref({ name: '홍길동', age: 20 })
const logDeep = ref('아직 감지 안 됨')
const logTarget = ref('아직 감지 안 됨')

// 1. { deep: true } 옵션: 객체 내부 모든 속성 변경 감시 (단, 과거값과 최신값이 동일 주소를 지목함)
watch(user, (newVal) => {
  logDeep.value = `[deep 감지] 현재 상태 -> 이름: ${newVal.name}, 나이: ${newVal.age}세`
}, { deep: true })

// 2. 화살표 함수 타깃 감시: 특정 속성(age)만 감시 (과거값 oldAge 완벽 보존)
watch(() => user.value.age, (newAge, oldAge) => {
  logTarget.value = `[타깃 감지] 나이: ${oldAge}세 ➡️ ${newAge}세로 변경`
})
</script>

<template>
  <div class="practice-section">
    <h2>깊은 감시자 watch({ deep: true }) 및 타깃 감시</h2>
    <p>ref 객체 내부 변경 감시 시 { deep: true } 옵션이나 화살표 함수 () => 속성 타깃 감시를 사용합니다.</p>
    <hr />

    <p>사용자 정보: <strong>{{ user.name }}</strong> ({{ user.age }}세)</p>

    <div>
      <button @click="user.name = user.name === '홍길동' ? '이순신' : '홍길동'">이름 변경</button>
      <button @click="user.age++">나이 증가 (+1)</button>
    </div>

    <div class="monitor">
      <p>👁️‍🗨️ 1) deep: true 모니터 (전체 감시)</p>
      <p>{{ logDeep }}</p>
    </div>

    <div class="monitor target">
      <p>🎯 2) 화살표 함수 모니터 (나이만 타겟 감시)</p>
      <p>{{ logTarget }}</p>
    </div>
  </div>
</template>
<style scoped>
.monitor {
  border-color: #0984e3;
  background: #e3fafc;
  font-weight: bold;
  color: black !important;
}


.target {
  border-color: #6c5ce7;
  background: #efe5ff;
  color: black;
}

html.dark .monitor,
html.dark .target,
html.dark .monitor *,
html.dark .target * {
  color: #0f172a !important;
}
</style>
