<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import LifecycleChild from './LifecycleChild.vue'

const isShow = ref(true)

console.log('1. 👨‍👦 [Parent setup] 부모 컴포넌트 생성')

onMounted(() => {
  console.log('2. 👨‍👦 [Parent onMounted] 부모 최종 마운트 완료')
})

onUnmounted(() => {
  console.log('3. 👨‍👦 [Parent onUnmounted] 부모 컴포넌트 소멸')
})
</script>

<template>
  <div class="practice-section">
    <h2>Lifecycle Hook (라이프사이클 훅 흐름)</h2>
    <p>컴포넌트의 마운트(Mounted), 데이터 변경(Updated), 파괴(Unmounted) 수명주기를 탐색합니다.</p>
    <hr />

    <div class="parent-box">
      <h3>상위 컴포넌트 (Parent)</h3>
      <button @click="isShow = !isShow" class="toggle-btn">
        {{ isShow ? '🛑 자식 컴포넌트 파괴 (v-if="false")' : '🟢 자식 컴포넌트 재생성' }}
      </button>

      <LifecycleChild v-if="isShow" />
    </div>
  </div>
</template>

<style scoped>
.toggle-btn {
  padding: 8px 16px;
  font-weight: bold;
  cursor: pointer;
}
</style>
