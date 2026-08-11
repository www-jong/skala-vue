<script setup>
const content = '[퀘스트] <strong>바론사냥</strong>'
</script>

<template>
  <div class="practice-section">
    <h2>v-text 디렉티브 학습</h2>
    <p>v-text: 요소의 textContent 속성에 값을 지정하여 텍스트로 출력</p>
    <hr />
    <h3>1) 일반 보간법 {{ }} 결과</h3>
    <p>출력: {{ content }}</p>
    <br />

    <h3>2) v-text 디렉티브 결과</h3>
    <p v-text="'출력: ' + content"></p>
    <br />

    <h3>3) v-html 결과 비교</h3>
    <p v-html="content"></p>
  </div>

</template>
