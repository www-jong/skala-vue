<script setup>
import { ref } from 'vue'
let Gold = 0
const gameGold = ref(0)
</script>

<template>
  <div class="practice-section">
    <h2>Hello Skala-Vue</h2>
    <p>ref: Vue3 반응형 상태 생성 및 일반 변수와의 실시간 갱신 차이 비교</p>
    <hr />
    <h3>현재 골드: {{ Gold }}</h3>
    <button @click="Gold += 100">골드 100G 획득</button>
    <br />
    <h3>상자까기: {{ gameGold }}</h3>
    <button @click="gameGold += 500">골드상자 오픈</button>
  </div>
</template>
