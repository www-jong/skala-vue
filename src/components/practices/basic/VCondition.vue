<script setup>
import { ref } from 'vue'

const isLogged = ref(false)
const score = ref(85)
</script>

<template>
  <div class="practice-section">
    <h2>v-if, v-else-if, v-else 디렉티브 학습</h2>
    <p>조건부 렌더링: v-if, v-else-if, v-else 조건 결과에 따른 DOM 요소의 실제 생성/삭제 제어</p>
    <hr />

    <h3>1) 기본 로그인 상태 스위치</h3>
    <p v-if="isLogged">환영합니다! 회원 전용 페이지입니다.</p>
    <p v-else>로그인이 필요합니다.</p>
    <button @click="isLogged = !isLogged">
      {{ isLogged ? '로그아웃하기' : '로그인하기' }}
    </button>
    <br /><br />

    <h3>2) 성적별 학점 등급 측정 (다중 조건문)</h3>
    <label>점수 조절 ({{ score }}점): </label>
    <input type="range" v-model="score" min="0" max="100" />
    <br />

    <div v-if="score >= 80" style="color: green; font-weight: bold;">A 학점 (최우수)</div>
    <div v-else-if="score >= 60" style="color: blue; font-weight: bold;">B 학점 (우수)</div>
    <div v-else-if="score >= 40" style="color: orange; font-weight: bold;">C 학점 (보통)</div>
    <div v-else style="color: red; font-weight: bold;">F 학점 (재시험)</div>
  </div>
</template>
