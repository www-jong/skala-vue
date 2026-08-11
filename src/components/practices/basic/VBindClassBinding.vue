<script setup>
import { ref } from 'vue'

const isWarning = ref(false)
const themeClass = ref('bg-dark')

// 애니메이션 조작 반응형 변수
const isSpinning = ref(false)
</script>

<template>
  <div class="practice-section">
    <h2>v-bind 디렉티브 고급(클래스바인딩)</h2>
    <p>클래스 바인딩: 객체 구문({ active: isActive }) 및 배열 구문 기반 동적 CSS 클래스 적용</p>
    <hr />
    <h3>클래스 바인딩 (객체형식)</h3>
    <p :class="{ 'text-danger': isWarning }">현재 경고 상태: {{ isWarning }}</p>
    <button @click="isWarning = !isWarning">경고 상태 변경</button>
    <br />

    <h3>클래스 바인딩 (배열형식)</h3>
    <div :class="[themeClass, isWarning ? 'border-red' : 'border-gray']"> 다중 클래스가 조립된 박스 구역</div>

    <br />
    <button :disabled="isWarning" @click="isSpinning = !isSpinning">
      글자 애니메이션 {{ isWarning ? '잠김' : (isSpinning ? '중지' : '시작') }}
    </button>

    <span :class="['moving-text', { spin: isSpinning }]">
      @
    </span>
  </div>
</template>

<style scoped>
.text-danger {
  color: red;
  font-weight: bold;
}

.bg-dark {
  background-color: #333;
  color: white;
  padding: 15px;
}

.border-red {
  border: 3px solid red;
}

.border-gray {
  border: 3px solid #ccc;
}

/* 상하좌우 빙글빙글 회전 애니메이션 */
.moving-text {
  display: inline-block;
  margin-left: 15px;
  font-weight: bold;
  transition: transform 0.3s;
}

.moving-text.spin {
  animation: moveAround 1.5s infinite linear;
}

@keyframes moveAround {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }

  25% {
    transform: translate(1px, -1px) rotate(90deg);
  }

  50% {
    transform: translate(1px, 1px) rotate(180deg);
  }

  75% {
    transform: translate(-1px, 1px) rotate(270deg);
  }

  100% {
    transform: translate(0, 0) rotate(360deg);
  }
}
</style>
