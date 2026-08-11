<script setup>
import { ref } from 'vue'

const id = 'user-profile-card'
const src = 'https://vuejs.org/images/logo.png'
const alt = 'Vue 로고'
const imgWidth = ref(60)
</script>

<template>
  <div class="practice-section">
    <h2>v-bind 디렉티브 고급(단축 문법)</h2>
    <p>단축 문법: v-bind 축약형 콜론(:) 및 동일 이름 변수 동적 바인딩(:id, :src)</p>
    <hr />

    <label>이미지 크기 ({{ imgWidth }}px): </label>
    <input type="range" min="30" max="300" v-model="imgWidth" />

    <div :id style="margin-top: 10px;">
      <img :src :alt :style="{ width: imgWidth + 'px' }" />
    </div>
  </div>
</template>
