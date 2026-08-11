<script setup>
import { ref } from 'vue'

const isApplied = ref(false)

const toggleStyle = () => {
  isApplied.value = !isApplied.value
}
</script>

<template>
  <div class="practice-section">
    <h2>Scoped 스타일 및 외부 CSS 활용</h2>
    <p>Scoped 스타일: 컴포넌트 고유 격리 CSS 정의 및 외부 CSS 모듈(@import) 연동</p>
    <hr />

    <p class="title">이 글자는 기본 scoped 스타일 (분홍색)</p>
    <p :class="{ 'title-external': isApplied }" class="title">
      버튼을 누르면 외부 CSS 스타일이 덮어씌워집니다.
    </p>

    <button @click="toggleStyle">
      외부 CSS 적용 버튼 {{ isApplied ? '(적용됨)' : '(미적용)' }}
    </button>
  </div>
</template>

<style scoped>
@import '@/assets/challenge.css';

/* 기본 scoped 스타일 정의 (분홍색) */
.title {
  color: #ff7675 !important;
  font-weight: bold;
  font-size: 18px;
}

html.dark .title {
  color: #ff7675 !important;
}
</style>
