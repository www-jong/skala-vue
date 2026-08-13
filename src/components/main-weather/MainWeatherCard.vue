<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
import { useWeatherStore } from '@/stores/weatherStore'

const props = defineProps({
  cityItem: {
    type: Object,
    required: true,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['select', 'showDetail'])
const configStore = useConfigStore()
const weatherStore = useWeatherStore()

const isFav = computed(() => {
  return weatherStore.isFavorite(props.cityItem.location.id)
})

const handleToggleFavorite = (e) => {
  e.stopPropagation()
  weatherStore.toggleFavorite(props.cityItem)
}

const displayTemp = computed(() => {
  const rawTemp = props.cityItem.current.temp_c
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})

const displayFeelTemp = computed(() => {
  const rawTemp = props.cityItem.current.feels_like_c
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})
</script>

<template>
  <div
    class="weather-card"
    :class="{ selected: isSelected }"
    @click="emit('select', cityItem)"
  >
    <!-- 상단 행: 국가 뱃지 + 도시 지명 + 액션 버튼 그룹 -->
    <div class="card-top-row">
      <div class="card-location-info">
        <div class="location-name-line">
          <span class="country-pill">[{{ cityItem.location.country }}]</span>
          <h4 class="card-city-title">
            {{ cityItem.location.region && cityItem.location.region !== cityItem.location.name ? `${cityItem.location.region} ${cityItem.location.name}` : cityItem.location.name }}
          </h4>
        </div>
      </div>

      <div class="card-action-btns">
        <button
          class="btn-star-fav"
          :class="{ active: isFav }"
          @click.stop="handleToggleFavorite"
          :title="isFav ? '즐겨찾기 해제' : '즐겨찾기 추가'"
        >
          {{ isFav ? '⭐' : '☆' }}
        </button>
        <button
          class="btn-detail"
          @click.stop="emit('showDetail', cityItem)"
        >
          상세보기 →
        </button>
      </div>
    </div>

    <!-- 중앙 행: 기온 및 기상 상태 뱃지 -->
    <div class="card-mid-row">
      <div class="temp-display-group">
        <span class="main-temp-num">{{ displayTemp }}<span class="temp-unit-symbol">{{ configStore.unitSymbol }}</span></span>
        <span class="feels-like-tag">체감 {{ displayFeelTemp }}{{ configStore.unitSymbol }}</span>
      </div>

      <div class="condition-badge-group">
        <span v-if="cityItem.current.temp_c >= 30" class="badge hot">🔥 폭염</span>
        <span v-else-if="cityItem.current.temp_c >= 25" class="badge warm">☀️ 더움</span>
        <span v-else-if="cityItem.current.temp_c >= 18" class="badge pleasant">🌿 쾌적</span>
        <span v-else-if="cityItem.current.temp_c >= 10" class="badge chilly">🧥 쌀쌀</span>
        <span v-else class="badge cold">❄️ 한파</span>
        <span class="status-tag">상태: {{ cityItem.current.condition.text }}</span>
      </div>
    </div>

    <!-- 하단 메트릭: 습도 & 풍속 -->
    <div class="card-bottom-row">
      <span class="metric-item humidity">💧 습도 {{ cityItem.current.humidity }}%</span>
      <span class="metric-item wind">💨 풍속 {{ cityItem.current.wind_kph }}km/h</span>
    </div>
  </div>
</template>
