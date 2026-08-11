<script setup>
// import { ref } from 'vue'
const playerName = '원종'
const welcomeMessage = '반갑습니다.'
</script>

<template>
  <div class="practice-section">
    <h2>{{ welcomeMessage }} {{ playerName }} 님</h2>
    <p>보간법: {{ }} 템플릿 안에서 자바스크립트 표현식 및 메서드 동적 실행</p>
    <hr />
    <p>{{ welcomeMessage.toUpperCase() }}</p>
    <p>{{ '오늘의 행운수치: ' + Math.ceil(Math.random() * 100) }} </p>
  </div>
</template>
