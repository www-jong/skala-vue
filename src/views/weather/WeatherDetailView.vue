<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 사용자님의 5개 도시 데이터 (loc_01 ~ loc_05) 맵핑
const mockDetails = {
  loc_01: { country: '대한민국', region: '서울특별시', name: '강남구', temp: 28, feelsLike: 29.5, status: '맑음', humidity: '60%', lat: 37.5172, lon: 127.0473 },
  loc_02: { country: '대한민국', region: '울산광역시', name: '남구', temp: 30, feelsLike: 32.1, status: '구름조금', humidity: '70%', lat: 35.5439, lon: 129.3301 },
  loc_03: { country: '대한민국', region: '부산광역시', name: '해운대구', temp: 23, feelsLike: 24.8, status: '흐림', humidity: '80%', lat: 35.1631, lon: 129.1636 },
  loc_04: { country: '대한민국', region: '경기도', name: '수원시', temp: 16, feelsLike: 17.0, status: '비', humidity: '85%', lat: 37.2636, lon: 127.0286 },
  loc_05: { country: '대한민국', region: '제주특별자치도', name: '제주시', temp: 9, feelsLike: 10.0, status: '맑음', humidity: '65%', lat: 33.4996, lon: 126.5312 }
}

const cityData = ref(null)

onMounted(() => {
  const id = route.params.cityId
  if (mockDetails[id]) {
    cityData.value = mockDetails[id]
  }
})
</script>

<template>
  <div class="practice-section">
    <h2>📊 지역별 상세 기상 관측 정보</h2>
    <hr />

    <div v-if="cityData" class="info-card">
      <h4>📍 지정 지역: [{{ cityData.country }}] {{ cityData.region }} {{ cityData.name }}</h4>
      <p>도시 고유 ID: <strong>{{ route.params.cityId }}</strong></p>
      <p>실시간 기온: <strong>{{ cityData.temp }}°C</strong> (체감: {{ cityData.feelsLike }}°C)</p>
      <p>기상 현황: <strong>{{ cityData.status }}</strong></p>
      <p>대기 습도: <strong>{{ cityData.humidity }}</strong></p>
      <p>위도 / 경도: <strong>{{ cityData.lat }} / {{ cityData.lon }}</strong></p>
    </div>

    <div v-else class="info-card">
      <p style="color: #ef4444; margin: 0;">😫 해당 도시 (ID: {{ route.params.cityId }})의 데이터가 존재하지 않습니다.</p>
    </div>

    <button @click="router.push('/')" class="back-btn">← 메인 대시보드로 돌아가기</button>
  </div>
</template>

<style scoped>
.info-card {
  background: #f8fafc;
  padding: 18px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  margin: 15px 0;
}

.back-btn {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}

.back-btn:hover {
  background: #2563eb;
}


html.dark .info-card {
  background-color: #1e293b !important;
  border-color: #334155 !important;
  color: #f8fafc !important;
}

html.dark .info-card h4,
html.dark .info-card p,
html.dark .info-card strong {
  color: #f8fafc !important;
}

html.dark .back-btn {
  background-color: #3b82f6 !important;
  color: #ffffff !important;
}

html.dark .back-btn:hover {
  background-color: #2563eb !important;
}
</style>
