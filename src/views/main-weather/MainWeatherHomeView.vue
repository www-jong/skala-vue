<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWeatherStore } from '@/stores/weatherStore'
import '@/assets/mainWeather.css'

import Main3DGlobeBackground from '@/components/main-weather/Main3DGlobeBackground.vue'
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

// 🌍 3D 지구본 직접 조작 (창 숨기기 모드) 상태
const isGlobeOnlyMode = ref(false)

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
  weatherStore.setTargetCoords(city)
  isModalOpen.value = true
}

const handleCloseModal = () => {
  isModalOpen.value = false
}
</script>

<template>
  <div class="main-weather-container dual-sidebar-layout">
    <!-- CesiumJS 실사 위성 3D 지구본 배경 -->
    <Main3DGlobeBackground :is-interactive="isGlobeOnlyMode" />

    <!-- 🌍 지구본 전용 탐색 모드 상단 복원 플로팅 바 -->
    <div v-if="isGlobeOnlyMode" class="globe-mode-floating-bar">
      <div class="globe-mode-info">
        <span>🌍 Cesium 3D 실사 지구본 탐색 모드 (마우스 드래그/휠로 회전/확대 가능)</span>
        <button class="btn-restore-dashboard" @click="isGlobeOnlyMode = false">
          👁️ 대시보드 복원하기
        </button>
      </div>
    </div>

    <!-- 🟢 하단 중앙 고정 불투명 3D 지구본 전면 탐색 버튼 -->
    <button
      class="btn-toggle-globe-mode bottom-center-btn"
      :class="{ 'hidden-for-globe': isGlobeOnlyMode }"
      @click="isGlobeOnlyMode = !isGlobeOnlyMode"
      title="3D 지구본 전면 직접 조작 모드"
    >
      🌍 3D 지구본 전면 탐색 (창 숨기기)
    </button>

    <!-- 🟢 메인 듀얼 사이드바 그리드 레이아웃 (중앙 3D 지구본 히어로 조망) -->
    <div class="dual-sidebar-wrapper" :class="{ 'hidden-for-globe': isGlobeOnlyMode }">
      <!-- ⬅️ 좌측 사이드바: 관측 도시 검색 & 섭씨/화씨 토글 -->
      <aside class="sidebar-panel left-sidebar">
        <div class="sidebar-header">
          <h3>🔍 관측 도시 검색 현황</h3>
          <!-- 💡 섭씨/화씨 온도 토글 버튼을 관측도시검색현황 제목 우측에 배치 -->
          <MainUnitToggler />
        </div>

        <MainSearchBar
          :search-query="weatherStore.searchQuery"
          :is-loading="weatherStore.isLoading"
          @update:search-query="handleSearchInput"
          @clear="handleClearSearch"
        />

        <div class="sidebar-content-scroll">
          <div v-if="weatherStore.isLoading" class="status-bar" style="margin-bottom: 10px;">
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
        </div>

        <MainWeatherStatusBar :status-message="weatherStore.selectedCityInfo" />
      </aside>

      <!-- ➡️ 우측 사이드바: ⭐ 즐겨찾기 도시 목록 -->
      <aside class="sidebar-panel right-sidebar">
        <div class="sidebar-header">
          <h3>⭐ 즐겨찾기 관측 도시 ({{ weatherStore.favorites.length }})</h3>
        </div>

        <div class="sidebar-content-scroll">
          <template v-if="weatherStore.favorites.length > 0">
            <MainWeatherCard
              v-for="item in weatherStore.favorites"
              :key="'fav_' + item.location.id"
              :city-item="item"
              :is-selected="weatherStore.selectedCityId === item.location.id"
              @select="handleSelectCity"
              @show-detail="handleShowDetail"
            />
          </template>
          <div v-else class="empty-favorites-box">
            <p class="empty-fav-icon">⭐</p>
            <p class="empty-fav-title">등록된 즐겨찾기가 없습니다.</p>
          </div>
        </div>
      </aside>
    </div>

    <!-- 메인 날씨 앱 전용 실시간 예보 모달 -->
    <MainWeatherDetailModal
      :is-open="isModalOpen"
      :city-item="selectedModalCity"
      @close="handleCloseModal"
    />
  </div>
</template>
