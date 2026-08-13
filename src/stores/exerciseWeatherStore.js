import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useExerciseWeatherStore = defineStore('exerciseWeather', () => {
  const API_KEY = import.meta.env.VITE_OPEN_WEATHER_API
  const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

  // 대시보드 도시 목록 & 수신 시각 (클라이언트 10분 TTL)
  const weatherList = ref([])
  const lastFetchTime = ref(0)
  const isLoading = ref(false)

  // 상세 페이지 도시별 캐시 맵 ({ [cityId]: { data, fetchedAt } })
  const detailCacheMap = ref({})

  // 과제 전용 기본 5개 관측 도시 메타 장부 (loc_01 ~ loc_05)
  const defaultCities = [
    {
      location: {
        id: 'loc_01',
        english: 'Seoul',
        country: '대한민국',
        region: '서울특별시',
        name: '강남구',
        lat: 37.5172,
        lon: 127.0473,
      },
      current: {
        temp_c: 28,
        feels_like_c: 29.5,
        humidity: 60,
        condition: { text: '맑음', code: 1000, icon: 'sunny' },
      },
    },
    {
      location: {
        id: 'loc_02',
        english: 'Ulsan',
        country: '대한민국',
        region: '울산광역시',
        name: '남구',
        lat: 35.5439,
        lon: 129.3301,
      },
      current: {
        temp_c: 30,
        feels_like_c: 32.1,
        humidity: 70,
        condition: { text: '구름조금', code: 1001, icon: 'partly-cloudy' },
      },
    },
    {
      location: {
        id: 'loc_03',
        english: 'Busan',
        country: '대한민국',
        region: '부산광역시',
        name: '해운대구',
        lat: 35.1631,
        lon: 129.1636,
      },
      current: {
        temp_c: 23,
        feels_like_c: 24.8,
        humidity: 80,
        condition: { text: '흐림', code: 1002, icon: 'cloudy' },
      },
    },
    {
      location: {
        id: 'loc_04',
        english: 'Suwon',
        country: '대한민국',
        region: '경기도',
        name: '수원시',
        lat: 37.2636,
        lon: 127.0286,
      },
      current: {
        temp_c: 16,
        feels_like_c: 17.0,
        humidity: 85,
        condition: { text: '비', code: 1003, icon: 'rain' },
      },
    },
    {
      location: {
        id: 'loc_05',
        english: 'Jeju',
        country: '대한민국',
        region: '제주특별자치도',
        name: '제주시',
        lat: 33.4996,
        lon: 126.5312,
      },
      current: {
        temp_c: 9,
        feels_like_c: 10.0,
        humidity: 65,
        condition: { text: '맑음', code: 1000, icon: 'sunny' },
      },
    },
  ]

  const cityMapping = {
    loc_01: { english: 'Seoul', country: '대한민국', region: '서울특별시', name: '강남구', lat: 37.5172, lon: 127.0473 },
    loc_02: { english: 'Ulsan', country: '대한민국', region: '울산광역시', name: '남구', lat: 35.5439, lon: 129.3301 },
    loc_03: { english: 'Busan', country: '대한민국', region: '부산광역시', name: '해운대구', lat: 35.1631, lon: 129.1636 },
    loc_04: { english: 'Suwon', country: '대한민국', region: '경기도', name: '수원시', lat: 37.2636, lon: 127.0286 },
    loc_05: { english: 'Jeju', country: '대한민국', region: '제주특별자치도', name: '제주시', lat: 33.4996, lon: 126.5312 },
  }

  // 1) 대시보드 5개 관측 도시 날씨 로딩 (10분 TTL 캐싱)
  async function fetchHomeWeather(force = false) {
    const nowSec = Math.floor(Date.now() / 1000)
    const TEN_MIN_SEC = 10 * 60 // 600초 (10분)

    if (
      weatherList.value.length > 0 &&
      lastFetchTime.value > 0 &&
      nowSec - lastFetchTime.value < TEN_MIN_SEC &&
      !force
    ) {
      const elapsedMin = Math.floor((nowSec - lastFetchTime.value) / 60)
      console.log(`⚡ [Pinia 캐시 유효] ${elapsedMin}분 전 동기화 데이터 사용 (API 호출 스킵)`)
      return weatherList.value
    }

    isLoading.value = true
    try {
      const promises = defaultCities.map((city) =>
        axios.get(`${BASE_URL}?q=${city.location.english}&appid=${API_KEY}&units=metric&lang=kr`)
      )
      const responses = await Promise.all(promises)

      lastFetchTime.value = nowSec

      weatherList.value = defaultCities.map((city, index) => {
        const data = responses[index].data
        return {
          location: { ...city.location },
          current: {
            temp_c: Math.round(data.main.temp),
            feels_like_c: Math.round(data.main.feels_like * 10) / 10,
            humidity: data.main.humidity,
            condition: {
              text: data.weather[0].description,
              code: data.weather[0].id,
              icon: data.weather[0].icon,
            },
            serverDt: data.dt,
          },
        }
      })
      console.log('🟢 [Pinia Store] 10분 유효 타임스탬프 갱신 (fetchedAt):', lastFetchTime.value)
    } catch (error) {
      console.error('🔴 API 호출 실패 (기본 데이터 사용):', error)
      weatherList.value = defaultCities
    } finally {
      isLoading.value = false
    }
    return weatherList.value
  }

  // 2) 상세 관측 페이지 도시별 날씨 로딩 (10분 TTL 캐싱)
  async function fetchDetailWeather(cityId, force = false) {
    const targetCity = cityMapping[cityId]
    if (!targetCity) return null

    const nowSec = Math.floor(Date.now() / 1000)
    const TEN_MIN_SEC = 10 * 60

    const cached = detailCacheMap.value[cityId]
    if (cached && cached.fetchedAt && nowSec - cached.fetchedAt < TEN_MIN_SEC && !force) {
      const elapsedMin = Math.floor((nowSec - cached.fetchedAt) / 60)
      console.log(`⚡ [Pinia Detail 캐시 유효] ${targetCity.name} ${elapsedMin}분 전 데이터 사용 (API 스킵)`)
      return cached.data
    }

    isLoading.value = true
    try {
      const response = await axios.get(
        `${BASE_URL}?q=${targetCity.english}&appid=${API_KEY}&units=metric&lang=kr`
      )
      const raw = response.data

      const detailData = {
        country: targetCity.country,
        region: targetCity.region,
        name: targetCity.name,
        temp: Math.round(raw.main.temp),
        feelsLike: Math.round(raw.main.feels_like * 10) / 10,
        status: raw.weather[0].description,
        humidity: `${raw.main.humidity}%`,
        wind: `${raw.wind.speed} m/s`,
        lat: targetCity.lat || (raw.coord ? raw.coord.lat : '-'),
        lon: targetCity.lon || (raw.coord ? raw.coord.lon : '-'),
      }

      detailCacheMap.value[cityId] = {
        data: detailData,
        fetchedAt: nowSec,
      }
      console.log(`🟢 [Pinia Detail] ${targetCity.name} 수신 타임스탬프 기록:`, nowSec)
      return detailData
    } catch (error) {
      console.error('🔴 상세 정보 로딩 중 네트워크 에러 발생 (기본 데이터 사용):', error)
      const fallbackData = {
        ...targetCity,
        temp: 20,
        feelsLike: 21,
        status: '맑음',
        humidity: '60%',
        wind: '2.5 m/s',
      }
      return fallbackData
    } finally {
      isLoading.value = false
    }
  }

  return {
    weatherList,
    lastFetchTime,
    isLoading,
    detailCacheMap,
    fetchHomeWeather,
    fetchDetailWeather,
  }
})
