<script setup>
const rawHtmlData = ' 장비등급: <span style="color: red;">전설</span>'
</script>
<template>
  <div class="practice-section">
    <h2>v-html 디렉티브 학습</h2>
    <p>v-html: 요소의 innerHTML을 직접 파싱하여 원시 HTML 태그 출력</p>
    <hr />
    <h3> 일반 보간법 {{}} 사용 결과</h3>
    <p>{{ rawHtmlData }}</p>
    <h3>v-html 디렉티브 사용 결과</h3>
    <p v-html="rawHtmlData"></p>
  </div>
</template>
