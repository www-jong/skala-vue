<script setup>
import { ref } from 'vue'

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


// 알림 대행 함수 (window 객체 격리 우회)
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}
</script>

<template>
  <div class="practice-section">

    <section class="search-box">
      <div class="search-header">
        <h3>🔍 도시 검색</h3>
        <span :class="['search-badge', { active: searchQuery }]">
          {{ searchQuery ? `"${searchQuery}" 검색 중` : '전체 보기' }}
        </span>
      </div>

      <div class="search-input-container">
        <span class="search-icon">🔍</span>
        <input
          type="text"
          class="modern-search-input"
          :value="searchQuery"
          @input="(e) => (searchQuery = e.target.value)"
          placeholder="검색할 나라, 지역, 도시명 입력..."
        />
        <button
          v-if="searchQuery"
          type="button"
          class="search-clear-btn"
          @click="searchQuery = ''"
          title="검색어 지우기"
        >
          ✕
        </button>
      </div>
    </section>

    <section class="list-box">
      <h3>지역별 날씨 현황</h3>
      <div v-for="item in weatherList" :key="item.location.id"
        :class="['weather-card', { selected: selectedCityId === item.location.id }]" @click="
          selectedCityId = item.location.id;
        selectedCityInfo = `${item.location.region} ${item.location.name}이(가) 선택되었습니다.`">
        <h4>
          [{{ item.location.country }}] {{ item.location.region }} {{ item.location.name }}
          ({{ item.current.condition.text }})
        </h4>
        <p>현재 기온: {{ item.current.temp_c }}°C (체감: {{ item.current.feels_like_c }}°C)</p>

        <!-- 온도별 이모티콘 뱃지 -->
        <span v-if="item.current.temp_c >= 30" class="badge hot">🔥 폭염 (30°C 이상)</span>
        <span v-else-if="item.current.temp_c >= 25" class="badge warm">☀️ 더움 (25°C 이상)</span>
        <span v-else-if="item.current.temp_c >= 18" class="badge pleasant">🌿 쾌적 (18°C 이상)</span>
        <span v-else-if="item.current.temp_c >= 10" class="badge chilly">🧥 쌀쌀 (10°C 이상)</span>
        <span v-else class="badge cold">❄️ 한파 (10°C 미만)</span>

        <br />
        <!-- 상세 보기 버튼 (.stop 수식어로 카드 클릭 버블링 방지) -->
        <button class="btn-detail" @click.stop="showDetail(item.location.name, item.current.condition.text)">
          상세보기
        </button>

        <p style="margin-top: 8px;">습도: {{ item.current.humidity }}%</p>
      </div>
    </section>
    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>
  </div>
</template>
