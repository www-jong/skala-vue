<script setup>
import '@/assets/mainWeather.css'
</script>

<template>
  <div class="main-weather-container about-container-box">
    <div class="about-header-nav">
      <h2>ℹ️ 글로벌 기상 관측 플랫폼 소개</h2>
      <span class="about-badge">Main Weather Service v2.0</span>
    </div>
    <hr />

    <div class="about-main-wrapper">
      <!-- 상단 히어로 소서 -->
      <div class="about-hero-card">
        <h3>🌦️ 실시간 Open-Meteo API 연동 날씨 정보 시스템</h3>
        <p class="about-lead">
          전 세계 10,000개 이상의 기상 관측소와 위성 데이터를 실시간으로 동기화하여
          정확한 기온, 체감 온도, 대기 습도, 풍속 및 24시간/7일 일기예보 정보를 제공합니다.
        </p>
      </div>

      <!-- 핵심 기능 3컬럼 카드 -->
      <div class="about-feature-grid">
        <div class="about-feature-card">
          <span class="feature-icon">⚡</span>
          <h4>실시간 데이터 수신</h4>
          <p>Open-Meteo Forecast & Geocoding API를 통해 초단위 실시간 관측 데이터를 동기화합니다.</p>
        </div>

        <div class="about-feature-card">
          <span class="feature-icon">🔍</span>
          <h4>스마트 검색 & 최근기록</h4>
          <p>한글 지명 자동 번역 및 Prefix Search API로 입력과 동시에 실시간 도시 추천을 제공합니다.</p>
        </div>

        <div class="about-feature-card">
          <span class="feature-icon">🌡️</span>
          <h4>섭씨/화씨 원클릭 전환</h4>
          <p>Pinia 전역 스토어 상태 관리로 모든 관측 도시의 온도를 섭씨(℃) 및 화씨(℉)로 즉시 전환합니다.</p>
        </div>
      </div>

      <!-- 기술 스택 섹션 -->
      <div class="about-tech-section">
        <h4>🛠️ 사용된 기술 스택 (Tech Stack)</h4>
        <div class="tech-badge-group">
          <span class="tech-badge">Vue 3 Composition API</span>
          <span class="tech-badge">Vue Router 4</span>
          <span class="tech-badge">Pinia State Management</span>
          <span class="tech-badge">Open-Meteo API</span>
          <span class="tech-badge">Vite</span>
          <span class="tech-badge">CSS Glassmorphism</span>
        </div>
      </div>
    </div>
  </div>
</template>
