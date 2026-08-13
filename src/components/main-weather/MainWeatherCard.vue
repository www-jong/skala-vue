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

// [국가] 시/도 지역 지명 표기 가공 (중복 제거)
const formattedLocation = computed(() => {
  const { country, region, name } = props.cityItem.location
  if (!region || region === name) {
    return `[${country}] ${name}`
  }
  return `[${country}] ${region} ${name}`
})
</script>

<template>
  <div
    class="weather-card"
    :class="{ selected: isSelected }"
    @click="emit('select', cityItem)"
  >
    <div class="card-header">
      <h4 class="card-title">
        📍 {{ formattedLocation }}
      </h4>
      <div class="card-action-group">
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

    <div class="card-body">
      <div class="temp-section">
        <span class="main-temp">{{ displayTemp }}<span class="temp-unit">{{ configStore.unitSymbol }}</span></span>
        <span class="feels-temp">체감 {{ displayFeelTemp }}{{ configStore.unitSymbol }}</span>
      </div>

      <div class="card-footer-info">
        <div class="badge-group">
          <span v-if="cityItem.current.temp_c >= 30" class="badge hot">🔥 폭염 (30°C 이상)</span>
          <span v-else-if="cityItem.current.temp_c >= 25" class="badge warm">☀️ 더움 (25°C 이상)</span>
          <span v-else-if="cityItem.current.temp_c >= 18" class="badge pleasant">🌿 쾌적 (18°C 이상)</span>
          <span v-else-if="cityItem.current.temp_c >= 10" class="badge chilly">🧥 쌀쌀 (10°C 이상)</span>
          <span v-else class="badge cold">❄️ 한파 (10°C 미만)</span>
          <span class="condition-tag">상태: {{ cityItem.current.condition.text }}</span>
        </div>
        <span class="humidity-info">💧 습도 {{ cityItem.current.humidity }}%</span>
      </div>
    </div>
  </div>
</template>
