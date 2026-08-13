<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWeatherStore } from '@/stores/weatherStore'
import '@/assets/mainWeather.css'

import MainUnitToggler from '@/components/main-weather/MainUnitToggler.vue'
import MainSearchBar from '@/components/main-weather/MainSearchBar.vue'
import MainWeatherCard from '@/components/main-weather/MainWeatherCard.vue'
import MainWeatherStatusBar from '@/components/main-weather/MainWeatherStatusBar.vue'
import MainWeatherDetailModal from '@/components/main-weather/MainWeatherDetailModal.vue'

const route = useRoute()
const router = useRouter()
const weatherStore = useWeatherStore()

const isModalOpen = ref(false)
const selectedModalCity = ref(null)

onMounted(async () => {
  await weatherStore.initWeather()
  if (route.query.search) {
    weatherStore.search(route.query.search)
  }
})

watch(
  () => weatherStore.searchQuery,
  (newQuery) => {
    const query = newQuery.trim()
    router.replace({
      path: '/',
      query: query ? { search: query } : {},
    })
  },
)

const handleSearchInput = (val) => {
  weatherStore.search(val)
}

const handleClearSearch = () => {
  weatherStore.search('')
}

const handleSelectCity = (city) => {
  weatherStore.selectCity(city)
}

const handleShowDetail = (city) => {
  selectedModalCity.value = city
  isModalOpen.value = true
}

const handleCloseModal = () => {
  isModalOpen.value = false
}
</script>

<template>
  <div class="main-weather-container">
    <div class="main-header-row">
      <h2 class="main-header-title">🌦️ 실시간 글로벌 기상 관측 대시보드</h2>
      <MainUnitToggler />
    </div>

    <!-- 대형 와이드 모던 검색바 (1000px 와이드 지원) -->
    <MainSearchBar
      :search-query="weatherStore.searchQuery"
      :is-loading="weatherStore.isLoading"
      @update:search-query="handleSearchInput"
      @clear="handleClearSearch"
    />

    <!-- 날씨 카드 리스트 영역 -->
    <section class="main-list-box">
      <h3>대한민국 및 글로벌 관측 지역 현황 (OpenWeatherMap API 실시간 연동)</h3>

      <div v-if="weatherStore.isLoading" class="status-bar" style="margin-bottom: 16px;">
        ⚡ 실시간 기상 데이터를 수신하는 중입니다...
      </div>

      <template v-else-if="weatherStore.displayList.length > 0">
        <MainWeatherCard
          v-for="item in weatherStore.displayList"
          :key="item.location.id"
          :city-item="item"
          :is-selected="weatherStore.selectedCityId === item.location.id"
          @select="handleSelectCity"
          @show-detail="handleShowDetail"
        />
      </template>

      <p v-else class="noSearchResult">
        😫 검색 결과와 일치하는 관측 도시가 없습니다.
      </p>
    </section>

    <!-- 하단 선택 상태바 -->
    <MainWeatherStatusBar :status-message="weatherStore.selectedCityInfo" />

    <!-- 메인 날씨 앱 전용 실시간 예보 모달 (독립 팝업) -->
    <MainWeatherDetailModal
      :is-open="isModalOpen"
      :city-item="selectedModalCity"
      @close="handleCloseModal"
    />
  </div>
</template>
