import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { weatherService } from '@/services/weatherService'

export const useWeatherStore = defineStore('mainWeather', () => {
  const defaultList = ref([])
  const searchResults = ref([])
  const searchQuery = ref('')
  const selectedCityId = ref(null)
  const selectedCityInfo = ref('원하시는 도시 카드를 클릭하여 상태를 선택하세요.')
  const isLoading = ref(false)

  // 기본 날씨 로딩
  async function initWeather() {
    isLoading.value = true
    try {
      const data = await weatherService.fetchDefaultCitiesWeather()
      defaultList.value = data
    } finally {
      isLoading.value = false
    }
  }

  // 실시간 검색
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
    displayList,
    initWeather,
    search,
    selectCity,
  }
})
