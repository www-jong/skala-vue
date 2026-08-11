<script setup>
import { ref } from 'vue'

const position = ref('')
const tagName = ref('')
const getOnlyEvent = (e) => {
  position.value = `좌표: X=${e.clientX}, Y=${e.clientY}`
}

const getWithParam = (name, e) => {
  tagName.value = `대상: ${name} / 클릭된 태그이름 : ${e.target.tagName}`
}
</script>

<template>
  <div class="practice-section">
    <h2>v-on 이벤트 객체($event)활용</h2>
    <p>좌표: {{ position }}</p>
    <p>태그이름: {{ tagName }}</p>
    <button @click="getOnlyEvent">현재 클릭 좌표</button>
    <button @click="getWithParam('학생A',$event)">학생 정보와 태그이름 확인</button>
  </div>

</template>
