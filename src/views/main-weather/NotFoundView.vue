<script setup>
import { useRouter } from 'vue-router'
import '@/assets/mainWeather.css'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="main-weather-container not-found-container">
    <div class="not-found-content">
      <div class="error-icon">☀️❓</div>
      <h2>페이지를 찾을 수 없습니다.</h2>
      <p>요청하신 주소가 존재하지 않거나, 옮겨졌습니다.</p>
      <button class="home-button" @click="goHome">날씨 메인 대시보드로 이동</button>
    </div>
  </div>
</template>
