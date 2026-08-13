<script setup>
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { weatherService } from '@/services/weatherService'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  cityItem: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close'])
const configStore = useConfigStore()

const hourlyForecast = ref([])
const dailyForecast = ref([])
const isForecastLoading = ref(false)

// 모달이 열리거나 대상 도시가 바뀔 때 Open-Meteo 실시간 예보 로드
watch(
  () => [props.isOpen, props.cityItem],
  async ([open, item]) => {
    if (open && item && item.location) {
      const { lat, lon } = item.location
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
  },
  { immediate: true },
)

const convertTemp = (tempC) => {
  if (configStore.unit === 'fahrenheit') {
    return Math.round((tempC * 9) / 5 + 32)
  }
  return tempC
}

const displayTemp = computed(() => {
  if (!props.cityItem) return 0
  return convertTemp(props.cityItem.current.temp_c)
})

const displayFeelTemp = computed(() => {
  if (!props.cityItem) return 0
  return convertTemp(props.cityItem.current.feels_like_c)
})

const formattedLocation = computed(() => {
  if (!props.cityItem) return ''
  const { country, region, name } = props.cityItem.location
  if (!region || region === name) {
    return `[${country}] ${name}`
  }
  return `[${country}] ${region} ${name}`
})

const handleKeyDown = (e) => {
  if (props.isOpen && e.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="isOpen && cityItem"
        class="main-modal-overlay"
        @click.self="emit('close')"
      >
        <div class="main-modal-dialog">
          <!-- 모달 헤더 -->
          <div class="main-modal-header">
            <div class="header-title-group">
              <span class="modal-badge">📊 실시간 상세 기상 리포트</span>
              <h2>📍 {{ formattedLocation }}</h2>
            </div>
            <button class="modal-close-btn" @click="emit('close')" title="모달 닫기 (Esc)">
              ✕
            </button>
          </div>

          <!-- 모달 바디 내용 -->
          <div class="main-modal-body">
            <!-- 상단 기온 히어로 카드 -->
            <div class="detail-hero-card">
              <div class="hero-left">
                <div class="location-badge-wrap">
                  <span class="city-id-tag">ID: {{ cityItem.location.id }}</span>
                  <span class="country-tag">[{{ cityItem.location.country }}]</span>
                </div>
                <h3 class="location-full-name">📍 {{ formattedLocation }}</h3>
              </div>

              <div class="hero-right">
                <div class="hero-temp-group">
                  <span class="hero-main-temp">{{ displayTemp }}<span class="hero-unit">{{ configStore.unitSymbol }}</span></span>
                  <span class="hero-feels-like">체감 {{ displayFeelTemp }}{{ configStore.unitSymbol }}</span>
                </div>
                <div class="hero-status-badge">
                  <span v-if="cityItem.current.temp_c >= 30" class="badge hot">🔥 폭염 (30°C 이상)</span>
                  <span v-else-if="cityItem.current.temp_c >= 25" class="badge warm">☀️ 더움 (25°C 이상)</span>
                  <span v-else-if="cityItem.current.temp_c >= 18" class="badge pleasant">🌿 쾌적 (18°C 이상)</span>
                  <span v-else-if="cityItem.current.temp_c >= 10" class="badge chilly">🧥 쌀쌀 (10°C 이상)</span>
                  <span v-else class="badge cold">❄️ 한파 (10°C 미만)</span>
                </div>
              </div>
            </div>

            <!-- 세부 항목 2x2 그리드 -->
            <div class="detail-grid">
              <div class="detail-metric-card">
                <span class="metric-icon">☀️</span>
                <div class="metric-info">
                  <span class="metric-label">현재 기상 상태</span>
                  <span class="metric-value">{{ cityItem.current.condition.text }}</span>
                </div>
              </div>

              <div class="detail-metric-card">
                <span class="metric-icon">💧</span>
                <div class="metric-info">
                  <span class="metric-label">대기 습도</span>
                  <span class="metric-value">{{ cityItem.current.humidity }}%</span>
                </div>
              </div>

              <div class="detail-metric-card">
                <span class="metric-icon">💨</span>
                <div class="metric-info">
                  <span class="metric-label">풍속 (Wind Speed)</span>
                  <span class="metric-value">{{ cityItem.current.wind_kph }} km/h</span>
                </div>
              </div>

              <div class="detail-metric-card">
                <span class="metric-icon">🌐</span>
                <div class="metric-info">
                  <span class="metric-label">위도 / 경도</span>
                  <span class="metric-value">{{ cityItem.location.lat }}° N / {{ cityItem.location.lon }}° E</span>
                </div>
              </div>
            </div>

            <!-- 24시간 시간별 기온 예보 -->
            <section class="forecast-section">
              <div class="forecast-section-header">
                <h3>⏱️ 24시간 시간별 기온 & 강수 확률 예보</h3>
                <span class="forecast-sub">좌우로 스크롤하여 확인하세요</span>
              </div>

              <div v-if="isForecastLoading" class="forecast-loading">
                ⚡ OpenWeatherMap 시간별 예보 데이터를 수신하는 중입니다...
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

            <!-- 7일간 주간 예보 -->
            <section class="forecast-section">
              <div class="forecast-section-header">
                <h3>📅 5일간 주간 일기예보</h3>
                <span class="forecast-sub">최고/최저 기온 및 강수 확률</span>
              </div>

              <div v-if="isForecastLoading" class="forecast-loading">
                ⚡ OpenWeatherMap 주간 예보 데이터를 수신하는 중입니다...
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

          <!-- 모달 푸터 -->
          <div class="main-modal-footer">
            <button class="modal-confirm-btn" @click="emit('close')">
              확인 및 닫기
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
