<script setup>
import { ref } from 'vue'

const chatInput = ref('')
const chatMessage = ref('')

function showMessage() {
  chatMessage.value = chatInput.value
}
</script>

<template>
  <div class="practice-section">
    <h2>v-html XSS 학습</h2>
    <p>XSS: v-html 사용 시 악성 스크립트 주입 위험성 검증</p>
    <hr />
    <input v-model="chatInput" placeholder="채팅을 입력하세요" />
    <button @click="showMessage">채팅 출력</button>
    <div v-html="chatMessage"></div>
  </div>

</template>
