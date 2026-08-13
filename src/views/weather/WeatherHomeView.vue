<script setup>
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useExerciseWeatherStore } from '@/stores/exerciseWeatherStore'

import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import SearchBar from '@/components/exercise/SearchBar.vue'
import WeatherCard from '@/components/exercise/WeatherCard.vue'
import WeatherStatusBar from '@/components/exercise/WeatherStatusBar.vue'

const router = useRouter()
const route = useRoute()
const weatherStore = useExerciseWeatherStore()

const { weatherList, isLoading } = storeToRefs(weatherStore)

const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
const selectedCityId = ref('')

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  /** 쿼리가 비어있거나, 한글이면서 1단어인데 완성된 단어가 아닌 경우 */
  if (!query || /^[ㄱ-ㅎㅏ-ㅣ]$/.test(query.trim())) {
    return weatherList.value
  }

  return weatherList.value.filter((item) => {
    const country = item.location.country.toLowerCase()
    const region = item.location.region.toLowerCase()
    const name = item.location.name.toLowerCase()

    return country.includes(query) || region.includes(query) || name.includes(query)
  })
})

/** 감시단들 */
watch(selectedCityInfo, (newInfo) => {
  console.log(`👀 [watch 감지] 상태 바 문구가 업데이트되었습니다-> "${newInfo}"`)
})

watchEffect(() => {
  console.log(`👀 [watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 API 데이터를 필터링합니다.`)
})

// 타이핑될 때마다 주소창의 쿼리 스트링 값을 실시간 푸시 개편
watch(searchQuery, (newQuery) => {
  router.push({
    path: route.path,
    query: { search: newQuery || undefined },
  })
})

onMounted(() => {
  if (route.query.search) {
    searchQuery.value = route.query.search
  }
  weatherStore.fetchHomeWeather()
})

// 자식 카드 컴포넌트의 상세보기 신호를 받으면 해당 ID 주소로 라우터 점프 실행
const handleDetailJump = (id) => {
  router.push(`/exercise/weather/${id}`)
}
</script>

<template>
  <div class="practice-section">
    <BaseDashboardCard class="search-box">
      <SearchBar :current-query="searchQuery" @update-query="(val) => (searchQuery = val)" />
    </BaseDashboardCard>
    <BaseDashboardCard class="list-box">
      <h3>지역별 날씨 현황</h3>
      <p v-if="isLoading" style="text-align: center; color: #3498db; font-weight: bold; padding: 20px 0">
        🔄 글로벌 기상 위성으로부터 실시간 기상 데이터를 수신 중입니다...
      </p>

      <template v-else>
        <WeatherCard
          v-for="item in filteredWeatherList"
          :key="item.location.id"
          :city-item="item"
          :is-selected="selectedCityId === item.location.id"
          @selected-card="
            (msg) => {
              selectedCityInfo = msg
              selectedCityId = item.location.id
            }
          "
          @showDetail="handleDetailJump(item.location.id)"
        />
      </template>
      <p class="noSearchResult" v-if="filteredWeatherList.length === 0">
        😫검색 결과와 일치하는 도시가 없습니다.😫
      </p>
    </BaseDashboardCard>
    <WeatherStatusBar :status-message="selectedCityInfo" />
  </div>
</template>

<style scoped>
.noSearchResult {
  color: #cc3433 !important;
  padding: 10px 0;
  font-size: large;
  text-align: center;
}
</style>
