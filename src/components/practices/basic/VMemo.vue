<script setup>
import { ref } from 'vue';

const name = ref('원종현')
const age = ref('30')
</script>
<template>

  <div class="practice-section">
    <h2>v-memo 디렉티브 학습</h2>
    <div v-memo="[name]" style="padding: 20px; border: 1px solid #42b883; margin-bottom:10px">
      <p> v-memo 적용 영역(기준: name)</p>
      <p>이름: {{ name }}</p>
      <p>나이: {{ age }} = 이름이 바뀌면 같이 갱신됨.</p>

    </div>
    <button @click="name = '이순신'">1. 이름변경(이순신)</button>
    <button @click="age++">2. 나이 한살 증가(age++)</button>
  </div>
</template>
