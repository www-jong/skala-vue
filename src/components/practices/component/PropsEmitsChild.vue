<script setup>
import { ref } from 'vue'

// 1. 부모로부터 전달받는 props
defineProps({
  parentData: {
    type: String,
    required: true
  }
})

// 2. 부모로 보낼 커스텀 이벤트 등록
const emit = defineEmits(['update-count'])

// 3. 자식 자체 카운트 상태
const childCount = ref(0)

// 4. 버튼 클릭 시 카운트 +1 증가 후 부모에게 emit 전달
const incrementAndEmit = () => {
  childCount.value++
  emit('update-count', childCount.value)
}
</script>

<template>
  <div class="child-container">
    <h3>하위 컴포넌트 (Child)</h3>
    <p>부모로부터 수신된 Props: <strong>{{ parentData }}</strong></p>
    <p>자식 카운트 상태: <strong>{{ childCount }}</strong></p>
    <button @click="incrementAndEmit">카운트 +1 증가 후 부모 전송 (Emit)</button>
  </div>
</template>
