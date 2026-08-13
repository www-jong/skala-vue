<script setup>
import { useRouter } from 'vue-router'
import '@/assets/mainWeather.css'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="global-not-found-container">
    <div class="not-found-card">
      <div class="not-found-globe-badge">🌍</div>
      <h1 class="not-found-code">404</h1>
      <h2 class="not-found-title">페이지를 찾을 수 없습니다</h2>
      <p class="not-found-desc">
        요청하신 관측 경로가 존재하지 않거나 이동되었습니다.<br />
        3D 실시간 기상 관측 메인 대시보드로 돌아가세요.
      </p>
      <button class="btn-go-home" @click="goHome">
        🏠 메인 대시보드로 돌아가기
      </button>
    </div>
  </div>
</template>

<style scoped>
.global-not-found-container {
  min-height: calc(100vh - 160px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
}

.not-found-card {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(99, 102, 241, 0.25);
  border-radius: 24px;
  padding: 48px 36px;
  text-align: center;
  max-width: 480px;
  width: 100%;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
}

html.dark .not-found-card {
  background: rgba(15, 23, 42, 0.92);
  border-color: rgba(99, 102, 241, 0.4);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  color: #f8fafc;
}

.not-found-globe-badge {
  font-size: 4rem;
  margin-bottom: 12px;
  animation: floatGlobe 3s ease-in-out infinite;
}

@keyframes floatGlobe {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.not-found-code {
  font-size: 4.5rem;
  font-weight: 900;
  margin: 0;
  background: linear-gradient(135deg, #6366f1 0%, #3b82f6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
}

.not-found-title {
  font-size: 1.35rem;
  font-weight: 800;
  margin: 12px 0;
}

.not-found-desc {
  font-size: 0.9rem;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 28px;
}

html.dark .not-found-desc {
  color: #94a3b8;
}

.btn-go-home {
  background: linear-gradient(135deg, #4f46e5 0%, #2563eb 100%);
  color: #ffffff;
  border: none;
  padding: 12px 24px;
  border-radius: 24px;
  font-size: 0.95rem;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(79, 70, 229, 0.3);
  transition: all 0.25s ease;
}

.btn-go-home:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(79, 70, 229, 0.45);
}
</style>
