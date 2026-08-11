<script setup>
import { ref } from 'vue'

const message = ref('안녕하세요! Vue3 실습입니다.')
</script>

<template>
  <div class="practice-section">
    <h2>v-pre 디렉티브 학습</h2>
    <p>v-pre: Vue 컴파일을 스킵하고 문법을 텍스트 그대로 출력</p>
    <hr />
    <button @click="message = '메시지가 수정되었습니다!'">
      메시지 수정
    </button>
    <br /><br />

    <p>1) 일반 출력 (해석됨): {{ message }}</p>
    <p v-pre>2) v-pre 적용 (스킵됨): {{ message }}</p>
  </div>
</template>
