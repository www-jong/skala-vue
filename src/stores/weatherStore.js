import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { weatherService } from '@/services/weatherService'

const FAVORITES_KEY = 'skala_main_favorites'

export const useWeatherStore = defineStore('mainWeather', () => {
  const defaultList = ref([])
  const searchResults = ref([])
  const searchQuery = ref('')
  const selectedCityId = ref(null)
  const selectedCityInfo = ref('원하시는 관측 도시 카드를 클릭하여 상태를 선택하세요.')
  const isLoading = ref(false)

  // 🟢 3D 지구본 타겟 위경도 좌표 (초기값 null - 선택 전까지 핀 미표출)
  const activeTargetCoords = ref(null)

  // 🟢 클라이언트 수신 시각 타임스탬프 (초 단위 Unix timestamp)
  const lastFetchTime = ref(0)

  // ⭐ 즐겨찾기 도시 목록 (localStorage 연동)
  const favorites = ref([])

  // 타겟 좌표 설정 메소드 (3D 지구본 카메라 회전 연동)
  function setTargetCoords(city) {
    if (!city || !city.location) {
      activeTargetCoords.value = null
      return
    }
    const lat = city.location.lat
    const lon = city.location.lon
    const name = city.location.name || '관측지'
    activeTargetCoords.value = { lat, lon, name }
  }

  // 최근 즐겨찾기 로드
  function loadFavorites() {
    try {
      const data = localStorage.getItem(FAVORITES_KEY)
      if (data) {
        favorites.value = JSON.parse(data)
      } else {
        favorites.value = []
      }
    } catch {
      favorites.value = []
    }
  }

  // 즐겨찾기 추가/제거 토글
  function toggleFavorite(city) {
    if (!city || !city.location) return
    const id = city.location.id
    const index = favorites.value.findIndex((item) => item.location.id === id)

    if (index !== -1) {
      favorites.value.splice(index, 1)
    } else {
      favorites.value.push(city)
    }

    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites.value))
    } catch {
      // ignore
    }
  }

  // 즐겨찾기 여부 확인
  function isFavorite(cityId) {
    return favorites.value.some((item) => item.location.id === cityId)
  }

  // 초기 로드 시 즐겨찾기 수신
  loadFavorites()

  // 기본 10개 관측 도시 날씨 로딩 (10분 TTL 캐싱)
  async function initWeather(force = false) {
    const nowSec = Math.floor(Date.now() / 1000)
    const TEN_MIN_SEC = 10 * 60 // 600초 (10분)

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
      activeTargetCoords.value = null
      return
    }
    isLoading.value = true
    try {
      const results = await weatherService.searchCities(query)
      searchResults.value = results
      if (results.length > 0) {
        setTargetCoords(results[0])
      }
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
    setTargetCoords(city)
  }

  return {
    defaultList,
    searchResults,
    searchQuery,
    selectedCityId,
    selectedCityInfo,
    isLoading,
    lastFetchTime,
    favorites,
    activeTargetCoords,
    displayList,
    initWeather,
    search,
    selectCity,
    setTargetCoords,
    toggleFavorite,
    isFavorite,
  }
})
