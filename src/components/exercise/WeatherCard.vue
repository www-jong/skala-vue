<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'

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

const emit = defineEmits(['selected-card', 'showDetail'])
const configStore = useConfigStore()

/** 온도(실제온도, 체감온도)를 화씨/섭씨로 변환 */
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
    @click="emit('selected-card', `${cityItem.location.region} ${cityItem.location.name}이(가) 선택되었습니다.`)"
  >
    <div class="card-header">
      <h4 class="card-title">
        📍 [{{ cityItem.location.country }}] {{ cityItem.location.region }} {{ cityItem.location.name }}
      </h4>
      <button
        class="btn-detail"
        @click.stop="emit('showDetail', cityItem.location.id)"
      >
        상세보기 →
      </button>
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
