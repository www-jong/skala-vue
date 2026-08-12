<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import { useWeatherStore } from '@/stores/weatherStore'
import { weatherService } from '@/services/weatherService'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()
const weatherStore = useWeatherStore()

const cityData = ref(null)

onMounted(async () => {
  const id = route.params.cityId
  if (weatherStore.displayList.length === 0) {
    await weatherStore.initWeather()
  }
  const found = await weatherService.getCityById(id, weatherStore.displayList)
  if (found) {
    cityData.value = found
  }
})

const displayTemp = computed(() => {
  if (!cityData.value) return 0
  const rawTemp = cityData.value.current.temp_c
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})

const displayFeelTemp = computed(() => {
  if (!cityData.value) return 0
  const rawTemp = cityData.value.current.feels_like_c
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})

const formattedLocation = computed(() => {
  if (!cityData.value) return ''
  const { country, region, name } = cityData.value.location
  if (!region || region === name) {
    return `[${country}] ${name}`
  }
  return `[${country}] ${region} ${name}`
})

const handleBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

<template>
  <div class="detail-container-box">
    <div class="detail-header-nav">
      <h2>📊 지역별 상세 기상 관측 정보</h2>
      <button @click="handleBack" class="back-btn">← 대시보드로 돌아가기</button>
    </div>
    <hr />

    <div v-if="cityData" class="detail-main-wrapper">
      <!-- 상단 메인 기온 히어로 카운터 -->
      <div class="detail-hero-card">
        <div class="hero-left">
          <div class="location-badge-wrap">
            <span class="city-id-tag">ID: {{ route.params.cityId }}</span>
            <span class="country-tag">[{{ cityData.location.country }}]</span>
          </div>
          <h3 class="location-full-name">📍 {{ formattedLocation }}</h3>
        </div>

        <div class="hero-right">
          <div class="hero-temp-group">
            <span class="hero-main-temp">{{ displayTemp }}<span class="hero-unit">{{ configStore.unitSymbol }}</span></span>
            <span class="hero-feels-like">체감 {{ displayFeelTemp }}{{ configStore.unitSymbol }}</span>
          </div>
          <div class="hero-status-badge">
            <span v-if="cityData.current.temp_c >= 30" class="badge hot">🔥 폭염 (30°C 이상)</span>
            <span v-else-if="cityData.current.temp_c >= 25" class="badge warm">☀️ 더움 (25°C 이상)</span>
            <span v-else-if="cityData.current.temp_c >= 18" class="badge pleasant">🌿 쾌적 (18°C 이상)</span>
            <span v-else-if="cityData.current.temp_c >= 10" class="badge chilly">🧥 쌀쌀 (10°C 이상)</span>
            <span v-else class="badge cold">❄️ 한파 (10°C 미만)</span>
          </div>
        </div>
      </div>

      <!-- 세부 기상 항목 2x2 그리드 -->
      <div class="detail-grid">
        <div class="detail-metric-card">
          <span class="metric-icon">☀️</span>
          <div class="metric-info">
            <span class="metric-label">현재 기상 상태</span>
            <span class="metric-value">{{ cityData.current.condition.text }}</span>
          </div>
        </div>

        <div class="detail-metric-card">
          <span class="metric-icon">💧</span>
          <div class="metric-info">
            <span class="metric-label">대기 습도</span>
            <span class="metric-value">{{ cityData.current.humidity }}%</span>
          </div>
        </div>

        <div class="detail-metric-card">
          <span class="metric-icon">💨</span>
          <div class="metric-info">
            <span class="metric-label">풍속 (Wind Speed)</span>
            <span class="metric-value">{{ cityData.current.wind_kph }} km/h</span>
          </div>
        </div>

        <div class="detail-metric-card">
          <span class="metric-icon">🌐</span>
          <div class="metric-info">
            <span class="metric-label">위도 / 경도</span>
            <span class="metric-value">{{ cityData.location.lat }}° N / {{ cityData.location.lon }}° E</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 데이터 없음 예외 상태 카드 -->
    <div v-else class="detail-empty-card">
      <span class="empty-icon">😫</span>
      <h3>해당 도시 정보를 찾을 수 없습니다.</h3>
      <p>요청하신 도시 고유 ID (<strong>{{ route.params.cityId }}</strong>)의 기상 데이터가 존재하지 않습니다.</p>
      <button @click="handleBack" class="back-btn" style="margin-top: 15px;">
        ← 메인 대시보드로 돌아가기
      </button>
    </div>
  </div>
</template>
