<script setup>
import { ref } from 'vue'

const isVisible = ref(true)
</script>

<template>
  <div class="practice-section">
    <h2>v-show 디렉티브 학습</h2>
    <p>v-show: CSS display 속성을 토글하여 가시성을 제어 (DOM 트리는 유지)</p>
    <hr />

    <button @click="isVisible = !isVisible">
      상자 토글 ({{ isVisible ? '숨기기' : '보이기' }})
    </button>
    <br /><br />

    <div v-show="isVisible" class="box">
      <p><strong>v-show 상자 영역</strong></p>
      <p>false가 되면 DOM은 유지되고 CSS display: none 처리됨</p>
    </div>
  </div>
</template>

<style scoped>
.box {
  padding: 15px;
  color: white;
  border-radius: 8px;
  background-color: #3498db;
}
</style>
