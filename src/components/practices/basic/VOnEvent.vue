<script setup>
import { ref } from 'vue'

const count = ref(0)
const showAlert = () => {
  alert('스크립트 함수가 성공적으로 호출되었습니다.')
}
</script>

<template>
  <div class="practice-section">
    <h2>v-on 이벤트 핸들링 기초</h2>
    <p>v-on: @click 등 이벤트 수신 시 인라인 연산 처리 및 스크립트 함수 호출</p>

    <hr />

    <h3>1) 인라인 연산 처리</h3>
    <p>현재 카운트: {{ count }}</p>
    <button @click="count++">1씩 증가</button>
    <br /><br />

    <h3>2) 스크립트 함수 호출</h3>
    <button @click="showAlert">알림창 띄우기</button>
  </div>
</template>
