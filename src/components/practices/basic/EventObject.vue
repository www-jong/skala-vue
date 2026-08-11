<script setup>
import { ref } from 'vue'

const clickPosition = ref('')
const tagName = ref('')

// 실시간 마우스 좌표 반응형 변수
const mouseX = ref(0)
const mouseY = ref(0)

const getOnlyEvent = (e) => {
  clickPosition.value = `X: ${e.clientX}px, Y: ${e.clientY}px`
}

const getWithParam = (name, e) => {
  tagName.value = `사용자: ${name} / 태그명: ${e.target.tagName}`
}

// 실시간 마우스 이동 좌표 추적 함수
const handleMouseMove = (e) => {
  mouseX.value = e.clientX
  mouseY.value = e.clientY
}
</script>

<template>
  <div class="practice-section">
    <h2>v-on 이벤트 객체($event)활용</h2>
    <p>$event: 이벤트 객체를 인자로 전달하여 클릭 좌표(clientX/Y) 및 태그 정보(target) 추출</p>

    <hr />

    <h3>1) 클릭 시 좌표 및 정보 추출</h3>
    <p>클릭 좌표: {{ clickPosition }}</p>
    <p>전달 정보: {{ tagName }}</p>

    <button @click="getOnlyEvent">현재 클릭 좌표 확인</button>
    <button @click="getWithParam('원종', $event)">
      사용자 파라미터 + $event 전달
    </button>

    <br /><br />

    <h3>2) 실시간 마우스 이동 좌표 추적 (@mousemove)</h3>
    <div @mousemove="handleMouseMove"
      style="padding: 20px; background: #f1f5f9; border: 1px dashed #94a3b8; border-radius: 6px;">
      이 박스 안에서 마우스를 움직이세요.
      <br />
      <strong>실시간 좌표: X = {{ mouseX }}px, Y = {{ mouseY }}px</strong>
    </div>
  </div>
</template>
