<script setup>
import { ref } from 'vue'

// 자식 내부 데이터
const message = ref('현재 서버 상태 정상')
const userCount = ref(150)
</script>

<template>
  <div class="child-card">
    <!-- 자식 내부 데이터(:text, :count)를 부모 슬롯 영역으로 역발송 바인딩 -->
    <slot :text="message" :count="userCount">
      <!-- 부모가 슬롯을 전달하지 않았을 때 출력되는 기본 대체 문구 -->
      <p class="fallback-text">💡 부모가 마크업을 주입하지 않았을 때 출력되는 기본 대체 화면입니다.</p>
    </slot>
  </div>
</template>

<style scoped>


.fallback-text {
  color: #94a3b8;
  font-style: italic;
  margin: 0;
}
</style>
