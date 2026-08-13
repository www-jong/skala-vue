import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { weatherService } from '@/services/weatherService'

export const useWeatherStore = defineStore('mainWeather', () => {
  const defaultList = ref([])
  const searchResults = ref([])
  const searchQuery = ref('')
  const selectedCityId = ref(null)
  const selectedCityInfo = ref('원하시는 관측 도시 카드를 클릭하여 상태를 선택하세요.')
  const isLoading = ref(false)

  // 🟢 클라이언트 수신 시각 타임스탬프 (초 단위 Unix timestamp)
  const lastFetchTime = ref(0)

  // 기본 10개 관측 도시 날씨 로딩 (10분 TTL 캐싱)
  async function initWeather(force = false) {
    const nowSec = Math.floor(Date.now() / 1000)
    const TEN_MIN_SEC = 10 * 60 // 600초 (10분)

    // 💡 이미 수신된 데이터가 있고, 10분(600초) 이내 수신된 데이터면 API 호출 스킵
    if (
      defaultList.value.length > 0 &&
      lastFetchTime.value > 0 &&
      nowSec - lastFetchTime.value < TEN_MIN_SEC &&
      !force
    ) {
      const elapsedMin = Math.floor((nowSec - lastFetchTime.value) / 60)
      console.log(`⚡ [MainWeatherStore 10분 캐시 유효] ${elapsedMin}분 전 수신 데이터 사용 (API 스킵)`)
      return
    }

    isLoading.value = true
    try {
      const data = await weatherService.fetchDefaultCitiesWeather()
      defaultList.value = data
      lastFetchTime.value = nowSec
      console.log('🟢 [MainWeatherStore API 호출 완료] 클라이언트 수신 타임스탬프 기록:', lastFetchTime.value)
    } finally {
      isLoading.value = false
    }
  }

  // 실시간 도시 검색
  async function search(query) {
    searchQuery.value = query
    if (!query || !query.trim()) {
      searchResults.value = []
      return
    }
    isLoading.value = true
    try {
      const results = await weatherService.searchCities(query)
      searchResults.value = results
    } finally {
      isLoading.value = false
    }
  }

  // 현재 노출할 날씨 목록 (검색 중이면 검색결과, 아니면 기본목록)
  const displayList = computed(() => {
    if (searchQuery.value.trim().length > 0) {
      return searchResults.value
    }
    return defaultList.value
  })

  // 선택된 도시 클릭 이벤트
  function selectCity(city) {
    selectedCityId.value = city.location.id
    selectedCityInfo.value = `${city.location.region} ${city.location.name}이(가) 선택되었습니다.`
  }

  return {
    defaultList,
    searchResults,
    searchQuery,
    selectedCityId,
    selectedCityInfo,
    isLoading,
    lastFetchTime,
    displayList,
    initWeather,
    search,
    selectCity,
  }
})
