<script setup>

defineProps({
  cityItem: {
    type: Object,
    required: true,
  },
  isSelected: {
    type: Boolean,
    default: false,
  }
})

const emit = defineEmits(['selected-card', 'showDetail'])
</script>

<template>
  <div class="weather-card" :class="['weather-card', { selected: isSelected }]"
    @click="emit('selected-card', `${cityItem.location.region} ${cityItem.location.name}이(가) 선택되었습니다.`)">
    <h4>
      [{{ cityItem.location.country }}] {{ cityItem.location.region }} {{ cityItem.location.name }}
      ({{ cityItem.current.condition.text }})
    </h4>
    <p>현재 기온: {{ cityItem.current.temp_c }}°C (체감: {{ cityItem.current.feels_like_c }}°C)</p>

    <!-- 온도별 이모티콘 뱃지 -->
    <span v-if="cityItem.current.temp_c >= 30" class="badge hot">🔥 폭염 (30°C 이상)</span>
    <span v-else-if="cityItem.current.temp_c >= 25" class="badge warm">☀️ 더움 (25°C 이상)</span>
    <span v-else-if="cityItem.current.temp_c >= 18" class="badge pleasant">🌿 쾌적 (18°C 이상)</span>
    <span v-else-if="cityItem.current.temp_c >= 10" class="badge chilly">🧥 쌀쌀 (10°C 이상)</span>
    <span v-else class="badge cold">❄️ 한파 (10°C 미만)</span>
    <br />
    <!-- 상세 보기 버튼 (.stop 수식어로 카드 클릭 버블링 방지) -->
    <button class="btn-detail"
      @click.stop="emit('showDetail', cityItem.location.name, cityItem.current.condition.text)">
      상세보기
    </button>

    <p style="margin-top: 8px;">습도: {{ cityItem.current.humidity }}%</p>
  </div>

</template>

<style scoped>
.weather-card.selected {
  border: 2px solid #3b82f6 !important;
  background-color: #eff6ff !important;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.25) !important;
  /*transform: translateY(-1px);*/
}

/* 다크 모드 선택된 카드 강조 */
html.dark .weather-card.selected {
  background-color: #10243f !important;
  border-color: #60a5fa !important;
}
</style>
