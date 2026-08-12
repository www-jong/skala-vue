<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleGoHome = () => {
  router.push('/exercise')
}
</script>

<template>
  <div class="about-container-box">
    <div class="about-header-nav">
      <h2>ℹ️ SKALA Weather Dashboard Service</h2>
      <button @click="handleGoHome" class="back-btn">← 대시보드로 돌아가기</button>
    </div>
    <hr />

    <div class="about-hero-card">
      <p class="about-lead">
        본 시스템은 <strong>Vue 3 (Composition API)</strong>, <strong>Vue Router 4</strong>, 및 <strong>Pinia 3</strong>를 기반으로 구축된
        실시간 모던 기상 관측 모듈형 대시보드 애플리케이션입니다.
      </p>
    </div>

    <!-- 주요 기능 3컬럼 카드 뷰 -->
    <div class="about-grid">
      <div class="about-feature-card">
        <div class="feature-icon">⚡</div>
        <h4>Vue 3 & Pinia 스토어</h4>
        <p>Setup Store 기반으로 전역 기온 단위(섭씨 ℃ / 화씨 ℉)를 상태 관리하며 컴포넌트 간 실시간 동기화를 지원합니다.</p>
      </div>

      <div class="about-feature-card">
        <div class="feature-icon">🧭</div>
        <h4>Vue Router 4 SPA 라우팅</h4>
        <p>클라이언트 사이드 라우팅을 통해 새로고침 없는 동적 페이지 전환 및 Catch-all 404 예외 처리를 제공합니다.</p>
      </div>

      <div class="about-feature-card">
        <div class="feature-icon">🔍</div>
        <h4>URL 쿼리 스트링 실시간 동기화</h4>
        <p><code>watch</code> 및 <code>onMounted</code> 연동을 통해 주소창의 검색 질의(<code>?search=</code>)를 실시간 반영하고 복원합니다.</p>
      </div>
    </div>

    <!-- 사용된 기술 스택 뱃지 섹션 -->
    <div class="about-tech-section">
      <h4>🛠️ 시스템 주요 기술 스택</h4>
      <div class="tech-badge-group">
        <span class="tech-badge">Vue.js v3.5</span>
        <span class="tech-badge">Vue Router v5</span>
        <span class="tech-badge">Pinia v3</span>
        <span class="tech-badge">Vite v8</span>
        <span class="tech-badge">JavaScript ESNext</span>
        <span class="tech-badge">CSS3 & Dark Mode</span>
      </div>
    </div>
  </div>
</template>
