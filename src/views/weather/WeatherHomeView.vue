<script setup>
import { onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWeatherStore } from '@/stores/weatherStore'

import MainUnitToggler from '@/components/main-weather/MainUnitToggler.vue'
import MainSearchBar from '@/components/main-weather/MainSearchBar.vue'
import MainWeatherCard from '@/components/main-weather/MainWeatherCard.vue'
import MainWeatherStatusBar from '@/components/main-weather/MainWeatherStatusBar.vue'

const route = useRoute()
const router = useRouter()
const weatherStore = useWeatherStore()

onMounted(async () => {
  await weatherStore.initWeather()
  // URL 쿼리 파라미터로 ?search=검색어 매핑복원
  if (route.query.search) {
    weatherStore.search(route.query.search)
  }
})

// 검색어 입력 시 스토어 검색 및 URL 쿼리 동기화
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
  router.push(`/weather/${city.location.id}`)
}
</script>

<template>
  <div class="practice-section">
    <div class="header-row">
      <h2>🌦️ 실시간 글로벌 기상 관측 대시보드</h2>
      <MainUnitToggler />
    </div>

    <!-- 모던 글로벌 검색바 -->
    <MainSearchBar
      :search-query="weatherStore.searchQuery"
      :is-loading="weatherStore.isLoading"
      @update:search-query="handleSearchInput"
      @clear="handleClearSearch"
    />

    <!-- 날씨 카드 리스트 영역 -->
    <section class="list-box">
      <h3>관측 지역 현황 (실시간 Open-Meteo API 연동)</h3>

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
  </div>
</template>

<style scoped>
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.header-row h2 {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--text-main);
}
</style>
