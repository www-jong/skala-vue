<script setup>
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import {useRouter, useRoute} from 'vue-router'

import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import SearchBar from '@/components/exercise/SearchBar.vue'
import WeatherCard from '@/components/exercise/WeatherCard.vue'
import WeatherStatusBar from '@/components/exercise/WeatherStatusBar.vue'

const router = useRouter()
const route = useRoute()


const weatherList = ref([
  {
    location: {
      id: 'loc_01',
      country: '대한민국',
      region: '서울특별시',
      name: '강남구',
      lat: 37.5172,
      lon: 127.0473
    },
    current: {
      temp_c: 28,
      feels_like_c: 29.5,
      humidity: 60,
      condition: {
        text: '맑음',
        code: 1000,
        icon: 'sunny'
      }
    }
  },
  {
    location: {
      id: 'loc_02',
      country: '대한민국',
      region: '울산광역시',
      name: '남구',
      lat: 35.5439,
      lon: 129.3301
    },
    current: {
      temp_c: 30,
      feels_like_c: 32.1,
      humidity: 70,
      condition: {
        text: '구름조금',
        code: 1001,
        icon: 'partly-cloudy'
      }
    }
  },
  {
    location: {
      id: 'loc_03',
      country: '대한민국',
      region: '부산광역시',
      name: '해운대구',
      lat: 35.1631,
      lon: 129.1636
    },
    current: {
      temp_c: 23,
      feels_like_c: 24.8,
      humidity: 80,
      condition: {
        text: '흐림',
        code: 1002,
        icon: 'cloudy'
      }
    }
  },
  {
    location: {
      id: 'loc_04',
      country: '대한민국',
      region: '경기도',
      name: '수원시',
      lat: 37.2636,
      lon: 127.0286
    },
    current: {
      temp_c: 16,
      feels_like_c: 17.0,
      humidity: 85,
      condition: {
        text: '비',
        code: 1003,
        icon: 'rain'
      }
    }
  },
  {
    location: {
      id: 'loc_05',
      country: '대한민국',
      region: '제주특별자치도',
      name: '제주시',
      lat: 33.4996,
      lon: 126.5312
    },
    current: {
      temp_c: 9,
      feels_like_c: 10.0,
      humidity: 65,
      condition: {
        text: '맑음',
        code: 1000,
        icon: 'sunny'
      }
    }
  }
])

const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
const selectedCityId = ref('')


const filteredWeatherList = computed(() => {

  const query = searchQuery.value.trim().toLowerCase()
  /** 쿼리가 비어있거나, 한글이면서 1단어인데 완성된 단어가 아닌 경우(ex. 광 검색해야되는데 ㄱ에서 벌써 안보이면 별로니까? */
  if (!query || /^[ㄱ-ㅎㅏ-ㅣ]$/.test(query.trim())) {
    // 검색할 단어가 비어있는 경우
    return weatherList.value
  }

  return weatherList.value.filter((item) => {
    // 나라(country), 도시(region), 지역(name)에서 검색
    const country = item.location.country.toLowerCase()
    const region = item.location.region.toLowerCase()
    const name = item.location.name.toLowerCase()

    return country.includes(query) || region.includes(query) || name.includes(query)
  })


})

/** 감시단들  */
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
    query: { search: newQuery || undefined }
  })
})

onMounted(() => {
  if(route.query.search){
    searchQuery.value=route.query.search
  }
})

// 자식 카드 컴포넌트의 상세보기 신호를 받으면 해당 ID 주소로 라우터 점프 실행
const handleDetailJump = (id) => {
  router.push(`/weather/${id}`)
}

</script>

<template>
  <div class="practice-section">
    <BaseDashboardCard class="search-box">
      <SearchBar :current-query="searchQuery" @update-query="(val) => (searchQuery = val)" />
    </BaseDashboardCard>
    <BaseDashboardCard class="list-box">


      <h3>지역별 날씨 현황</h3>
      <WeatherCard v-for="item in filteredWeatherList" :key="item.location.id" :city-item="item"
        :is-selected="selectedCityId === item.location.id"
        @selected-card="(msg) => { selectedCityInfo = msg; selectedCityId = item.location.id; }"
        @showDetail="handleDetailJump(item.location.id)" />
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
  text-align: center
}
</style>
