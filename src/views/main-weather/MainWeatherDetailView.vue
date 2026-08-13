<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import { useWeatherStore } from '@/stores/weatherStore'
import { weatherService } from '@/services/weatherService'
import '@/assets/mainWeather.css'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()
const weatherStore = useWeatherStore()

const cityData = ref(null)
const hourlyForecast = ref([])
const dailyForecast = ref([])
const isForecastLoading = ref(false)

onMounted(async () => {
  const id = route.params.cityId
  if (weatherStore.displayList.length === 0) {
    await weatherStore.initWeather()
  }
  const found = await weatherService.getCityById(id, weatherStore.displayList)

  if (found) {
    cityData.value = found
    const lat = found.location?.lat
    const lon = found.location?.lon
    if (lat && lon) {
      isForecastLoading.value = true
      try {
        const { hourlyList, dailyList } = await weatherService.fetchCityDetailedForecast(lat, lon)
        hourlyForecast.value = hourlyList
        dailyForecast.value = dailyList
      } finally {
        isForecastLoading.value = false
      }
    }
  }
})

const convertTemp = (tempC) => {
  if (configStore.unit === 'fahrenheit') {
    return Math.round((tempC * 9) / 5 + 32)
  }
  return tempC
}

const displayTemp = computed(() => {
  if (!cityData.value || !cityData.value.current) return 0
  return convertTemp(cityData.value.current.temp_c)
})

const displayFeelTemp = computed(() => {
  if (!cityData.value || !cityData.value.current) return 0
  return convertTemp(cityData.value.current.feels_like_c)
})

const formattedLocation = computed(() => {
  if (!cityData.value || !cityData.value.location) return ''
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
  <div class="main-weather-container detail-container-box">
    <div class="detail-header-nav">
      <h2>📊 {{ cityData ? formattedLocation : '관측지역' }} 상세 기상 예보</h2>
      <button @click="handleBack" class="back-btn">← 대시보드로 돌아가기</button>
    </div>
    <hr />

    <div v-if="cityData && cityData.current" class="detail-main-wrapper">
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

      <div class="detail-grid">
        <div class="detail-metric-card">
          <span class="metric-icon">☀️</span>
          <div class="metric-info">
            <span class="metric-label">현재 기상 상태</span>
            <span class="metric-value">{{ cityData.current.condition?.text || '맑음' }}</span>
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

      <section class="forecast-section">
        <div class="forecast-section-header">
          <h3>⏱️ 24시간 시간별 기온 & 강수 확률 예보</h3>
          <span class="forecast-sub">좌우로 스크롤하여 24시간 추이를 확인하세요</span>
        </div>

        <div v-if="isForecastLoading" class="forecast-loading">
          ⚡ OpenWeatherMap 시간별 예보 데이터를 로딩 중입니다...
        </div>

        <div v-else-if="hourlyForecast.length > 0" class="hourly-scroll-container">
          <div
            v-for="(item, idx) in hourlyForecast"
            :key="idx"
            class="hourly-pill-card"
          >
            <span class="hourly-time">{{ item.timeLabel }}</span>
            <span class="hourly-icon">{{ item.weatherIcon }}</span>
            <span class="hourly-temp">{{ convertTemp(item.temp_c) }}{{ configStore.unitSymbol }}</span>
            <span class="hourly-rain" :class="{ active: item.rainProb > 0 }">
              💧 {{ item.rainProb }}%
            </span>
          </div>
        </div>
      </section>

      <section class="forecast-section">
        <div class="forecast-section-header">
          <h3>📅 5일간 주간 일기예보</h3>
          <span class="forecast-sub">최고/최저 기온 및 강수 확률</span>
        </div>

        <div v-if="isForecastLoading" class="forecast-loading">
          ⚡ OpenWeatherMap 주간 예보 데이터를 로딩 중입니다...
        </div>

        <div v-else-if="dailyForecast.length > 0" class="daily-list-container">
          <div
            v-for="(day, idx) in dailyForecast"
            :key="idx"
            class="daily-row-card"
          >
            <div class="daily-date-group">
              <span class="daily-date">{{ day.dateLabel }}</span>
            </div>

            <div class="daily-weather-group">
              <span class="daily-icon">{{ day.weatherIcon }}</span>
              <span class="daily-condition">{{ day.conditionText }}</span>
            </div>

            <div class="daily-rain-group">
              <span class="daily-rain-badge" :class="{ active: day.rainProbMax > 20 }">
                🌧️ 강수확률 {{ day.rainProbMax }}%
              </span>
            </div>

            <div class="daily-temp-bar-group">
              <span class="temp-min">{{ convertTemp(day.tempMin_c) }}{{ configStore.unitSymbol }}</span>
              <div class="temp-range-bar">
                <div class="temp-range-fill"></div>
              </div>
              <span class="temp-max">{{ convertTemp(day.tempMax_c) }}{{ configStore.unitSymbol }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>

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
