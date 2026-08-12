<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()

const mockDetails = {
  loc_01: { country: '대한민국', region: '서울특별시', name: '강남구', temp: 28, feelsLike: 29.5, status: '맑음', humidity: '60%', lat: 37.5172, lon: 127.0473 },
  loc_02: { country: '대한민국', region: '울산광역시', name: '남구', temp: 30, feelsLike: 32.1, status: '구름조금', humidity: '70%', lat: 35.5439, lon: 129.3301 },
  loc_03: { country: '대한민국', region: '부산광역시', name: '해운대구', temp: 23, feelsLike: 24.8, status: '흐림', humidity: '80%', lat: 35.1631, lon: 129.1636 },
  loc_04: { country: '대한민국', region: '경기도', name: '수원시', temp: 16, feelsLike: 17.0, status: '비', humidity: '85%', lat: 37.2636, lon: 127.0286 },
  loc_05: { country: '대한민국', region: '제주특별자치도', name: '제주시', temp: 9, feelsLike: 10.0, status: '맑음', humidity: '65%', lat: 33.4996, lon: 126.5312 }
}

const cityData = ref(null)

onMounted(() => {
  const id = route.params.cityId
  if (mockDetails[id]) {
    cityData.value = mockDetails[id]
  }
})

const displayTemp = computed(() => {
  if (!cityData.value) return 0
  const rawTemp = cityData.value.temp
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})

const displayFeelTemp = computed(() => {
  if (!cityData.value) return 0
  const rawTemp = cityData.value.feelsLike
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})

</script>

<template>
  <div class="detail-container-box">
    <div class="detail-header-nav">
      <h2>📊 지역별 상세 기상 관측 정보</h2>
      <button @click="router.push('/exercise')" class="back-btn">← 대시보드로 돌아가기</button>
    </div>
    <hr />

   <div v-if="cityData" class="detail-main-wrapper">
      <!-- 상단 메인 기온 히어로 카운터 -->
      <div class="detail-hero-card">
        <div class="hero-left">
          <div class="location-badge-wrap">
            <span class="city-id-tag">ID: {{ route.params.cityId }}</span>
            <span class="country-tag">[{{ cityData.country }}]</span>
          </div>
          <h3 class="location-full-name">📍 {{ cityData.region }} {{ cityData.name }}</h3>
        </div>

        <div class="hero-right">
          <div class="hero-temp-group">
            <span class="hero-main-temp">{{ displayTemp }}<span class="hero-unit">{{ configStore.unitSymbol }}</span></span>
            <span class="hero-feels-like">체감 {{ displayFeelTemp }}{{ configStore.unitSymbol }}</span>
          </div>
          <div class="hero-status-badge">
            <span v-if="cityData.temp >= 30" class="badge hot">🔥 폭염 (30°C 이상)</span>
            <span v-else-if="cityData.temp >= 25" class="badge warm">☀️ 더움 (25°C 이상)</span>
            <span v-else-if="cityData.temp >= 18" class="badge pleasant">🌿 쾌적 (18°C 이상)</span>
            <span v-else-if="cityData.temp >= 10" class="badge chilly">🧥 쌀쌀 (10°C 이상)</span>
            <span v-else class="badge cold">❄️ 한파 (10°C 미만)</span>
          </div>
        </div>
      </div>

      <div class="detail-grid">
        <div class="detail-metric-card">
          <span class="metric-icon">☀️</span>
          <div class="metric-info">
            <span class="metric-label">현재 기상 상태</span>
            <span class="metric-value">{{ cityData.status }}</span>
          </div>
        </div>

        <div class="detail-metric-card">
          <span class="metric-icon">💧</span>
          <div class="metric-info">
            <span class="metric-label">대기 습도</span>
            <span class="metric-value">{{ cityData.humidity }}</span>
          </div>
        </div>

        <div class="detail-metric-card">
          <span class="metric-icon">🌐</span>
          <div class="metric-info">
            <span class="metric-label">위도 (Latitude)</span>
            <span class="metric-value">{{ cityData.lat }}° N</span>
          </div>
        </div>

        <div class="detail-metric-card">
          <span class="metric-icon">🧭</span>
          <div class="metric-info">
            <span class="metric-label">경도 (Longitude)</span>
            <span class="metric-value">{{ cityData.lon }}° E</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 데이터 없음 예외 상태 카드 -->
    <div v-else class="detail-empty-card">
      <span class="empty-icon">😫</span>
      <h3>해당 도시 정보를 찾을 수 없습니다.</h3>
      <p>요청하신 도시 고유 ID (<strong>{{ route.params.cityId }}</strong>)의 기상 데이터가 존재하지 않습니다.</p>
      <button @click="router.push('/exercise')" class="back-btn" style="margin-top: 15px;">
        ← 메인 대시보드로 돌아가기
      </button>
    </div>
  </div>
</template>

<style scoped>
.info-card {
  background: #f8fafc;
  padding: 18px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  margin: 15px 0;
}

.back-btn {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

.back-btn:hover {
  background: #2563eb;
}


html.dark .info-card {
  background-color: #1e293b !important;
  border-color: #334155 !important;
  color: #f8fafc !important;
}

html.dark .info-card h4,
html.dark .info-card p,
html.dark .info-card strong {
  color: #f8fafc !important;
}

html.dark .back-btn {
  background-color: #3b82f6 !important;
  color: #ffffff !important;
}

html.dark .back-btn:hover {
  background-color: #2563eb !important;
}
</style>
