<script setup>
import { ref } from 'vue'

const message = ref('느린 네트워크에서도 안정적으로 출력되는 메세지')
</script>
<template>
  <div v-cloak class="practice-section">
    <h2>v-cloak 디렉티브 학습</h2>
    <p>v-cloak: Vue 컴파일 완료 전 템플릿 코드({{ }})의 화면 깜빡임 방지</p>
    <hr />

    <p>{{ message }}</p>
  </div>

</template>

<style scoped>
[v-cloak] {
  display: none !important;
}
</style>
