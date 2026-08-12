<script setup>
import { ref, onMounted, onUpdated, onUnmounted } from 'vue'

const count = ref(0)
let timerId = null

console.log('1. 👶 [Child setup] 자식 메모리 생성')

onMounted(() => {
  console.log('2. 👶 [Child onMounted] 자식 마운트 완료')
  timerId = setInterval(() => {
    count.value++
  }, 3000)
})

onUpdated(() => {
  console.log(`3. 👶 [Child onUpdated] count 변경: ${count.value}`)
})

onUnmounted(() => {
  clearInterval(timerId)
  console.log('4. 👶 [Child onUnmounted] 자식 소멸 & 타이머 안전 정제 완료')
})
</script>

<template>
  <div class="child-box">
    <h3>하위 컴포넌트 (Child)</h3>
    <p>타이머 카운트: <strong>{{ count }}</strong></p>
    <button @click="count++">수동 카운트 +1 (onUpdated 격발)</button>
  </div>
</template>
