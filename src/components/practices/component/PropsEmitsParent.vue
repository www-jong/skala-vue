<script setup>
import { ref } from 'vue'
import PropsEmitsChild from './PropsEmitsChild.vue'

const parentMessage = ref('Parent 전달 메시지')
const receivedChildCount = ref(0)

// 자식이 emit으로 보낸 childCount 수신 함수
const handleCountUpdate = (newCount) => {
  receivedChildCount.value = newCount
}
</script>

<template>
  <div class="practice-section">
    <h2>Props & Emits (데이터 단방향 바인딩 및 이벤트 수신)</h2>
    <p>Props로 자식에게 데이터를 내리고, 자식의 클릭 이벤트를 Emits로 수신하여 부모 상태를 업데이트합니다.</p>
    <hr />

    <div class="parent-container">
      <h3>상위 컴포넌트 (Parent)</h3>
      <p>자식으로부터 수신된 카운트: <strong>{{ receivedChildCount }}</strong></p>

      <!-- 자식 컴포넌트에 props 전달 (:parent-data) 및 emit 수신 (@update-count) -->
      <PropsEmitsChild :parent-data="parentMessage" @update-count="handleCountUpdate" />
    </div>
  </div>
</template>
