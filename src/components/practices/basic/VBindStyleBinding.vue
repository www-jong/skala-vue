<script setup>
import { ref } from 'vue'

const textColor = ref('purple')
const fontSize = ref(16) // 폰트 크기 동적 조절
const boxWidth = ref(200)
const borderRadius = ref(8) // 모서리 둥글기

const baseBoxStyle = ref({
  backgroundColor: '#42b883',
  height: '100px',
  transition: 'all 0.3s ease',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '10px'
})
</script>

<template>
  <div class="practice-section">
    <h2>v-bind 디렉티브 고급(스타일바인딩)</h2>
    <p>스타일 바인딩: 객체 및 배열 형식을 활용한 동적 인라인 CSS 스타일 바인딩</p>
    <hr />

    <h3>1) 인라인스타일 변수 조작</h3>
    <!-- 동적 글자 색상 + 동적 폰트 크기 바인딩 -->
    <p :style="{ color: textColor, fontSize: fontSize + 'px', fontWeight: 'bold' }">
      이 글자의 색상과 크기({{ fontSize }}px)는 실시간으로 변화
    </p>
    <button @click="textColor = textColor === 'purple' ? 'blue' : 'purple'">글자 색상 변경</button>
    <button @click="fontSize += 2" style="margin-left: 8px;">글자 크게 (+2px)</button>
    <button @click="fontSize = Math.max(12, fontSize - 2)" style="margin-left: 4px;">글자 작게 (-2px)</button>
    <br /><br />

    <h3>2) 다중 스타일 객체 조립 (배열 형식 + 슬라이더)</h3>
    <label>박스 가로 크기: {{ boxWidth }}px </label>
    <input type="range" min="100" max="500" v-model="boxWidth" />
    <br />
    <label>모서리 둥글기: {{ borderRadius }}px </label>
    <input type="range" min="0" max="50" v-model="borderRadius" />

    <!-- 다중 스타일 배열 조립 -->
    <div :style="[baseBoxStyle, { width: boxWidth + 'px', borderRadius: borderRadius + 'px' }]">
      <p style="color: white; font-weight: bold; margin: 0;">
        {{ boxWidth }}px x 100px (Radius: {{ borderRadius }}px)
      </p>
    </div>
  </div>
</template>
