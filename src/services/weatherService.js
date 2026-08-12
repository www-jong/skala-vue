/**
 * Weather Service API Adapter Layer (Open-Meteo Integration)
 * 대한민국 주요 도시 10개 실시간 관측 & 한글 지명 스마트 검색 매핑 지원
 */

// 대한민국 10개 주요 관측 도시 기본 좌표 및 지명()
const defaultCitiesData = [
  { location: { id: 'loc_01', country: '대한민국', region: '서울특별시', name: '강남구', lat: 37.5172, lon: 127.0473 }, current: { temp_c: 24, feels_like_c: 26, condition: { text: '맑음' }, humidity: 65, wind_kph: 12 } },
  { location: { id: 'loc_02', country: '대한민국', region: '울산광역시', name: '남구', lat: 35.5439, lon: 129.3301 }, current: { temp_c: 25, feels_like_c: 27, condition: { text: '구름조금' }, humidity: 70, wind_kph: 14 } },
  { location: { id: 'loc_03', country: '대한민국', region: '부산광역시', name: '해운대구', lat: 35.1631, lon: 129.1636 }, current: { temp_c: 23, feels_like_c: 24, condition: { text: '흐림' }, humidity: 78, wind_kph: 16 } },
  { location: { id: 'loc_04', country: '대한민국', region: '경기도', name: '수원시', lat: 37.2636, lon: 127.0286 }, current: { temp_c: 22, feels_like_c: 23, condition: { text: '비' }, humidity: 85, wind_kph: 10 } },
  { location: { id: 'loc_05', country: '대한민국', region: '제주특별자치도', name: '제주시', lat: 33.4996, lon: 126.5312 }, current: { temp_c: 26, feels_like_c: 28, condition: { text: '맑음' }, humidity: 60, wind_kph: 20 } },
  { location: { id: 'loc_06', country: '대한민국', region: '인천광역시', name: '중구', lat: 37.4738, lon: 126.6217 }, current: { temp_c: 23, feels_like_c: 24, condition: { text: '구름조금' }, humidity: 72, wind_kph: 15 } },
  { location: { id: 'loc_07', country: '대한민국', region: '대구광역시', name: '중구', lat: 35.8714, lon: 128.6014 }, current: { temp_c: 27, feels_like_c: 29, condition: { text: '맑음' }, humidity: 55, wind_kph: 8 } },
  { location: { id: 'loc_08', country: '대한민국', region: '대전광역시', name: '서구', lat: 36.3504, lon: 127.3845 }, current: { temp_c: 24, feels_like_c: 25, condition: { text: '맑음' }, humidity: 62, wind_kph: 9 } },
  { location: { id: 'loc_09', country: '대한민국', region: '광주광역시', name: '동구', lat: 35.1461, lon: 126.9231 }, current: { temp_c: 25, feels_like_c: 26, condition: { text: '대체로 맑음' }, humidity: 68, wind_kph: 11 } },
  { location: { id: 'loc_10', country: '대한민국', region: '경상남도', name: '창원시', lat: 35.2280, lon: 128.6811 }, current: { temp_c: 24, feels_like_c: 25, condition: { text: '흐림' }, humidity: 75, wind_kph: 13 } },
]

// 한국 주요 도시 한글 검색어 -> 영문/공식 매핑 딕셔너리 (Open-Meteo Geocoding 인식용)
const koreanCityAlias = {
  '서울': 'Seoul',
  '서울특별시': 'Seoul',
  '부산': 'Busan',
  '부산광역시': 'Busan',
  '인천': 'Incheon',
  '인천광역시': 'Incheon',
  '대구': 'Daegu',
  '대구광역시': 'Daegu',
  '대전': 'Daejeon',
  '대전광역시': 'Daejeon',
  '광주': 'Gwangju',
  '광주광역시': 'Gwangju',
  '울산': 'Ulsan',
  '울산광역시': 'Ulsan',
  '수원': 'Suwon',
  '수원시': 'Suwon',
  '제주': 'Jeju',
  '제주시': 'Jeju',
  '창원': 'Changwon',
  '창원시': 'Changwon',
  '성남': 'Seongnam',
  '고양': 'Goyang',
  '용인': 'Yongin',
  '청주': 'Cheongju',
  '전주': 'Jeonju',
  '천안': 'Cheonan',
  '안산': 'Ansan',
  '안양': 'Anyang',
  '포항': 'Pohang',
  '도쿄': 'Tokyo',
  '파리': 'Paris',
  '런던': 'London',
  '뉴욕': 'New York',
  '시드니': 'Sydney',
}

// Weather Code 매핑 (WMO Weather interpretation codes)
const weatherCodeMap = {
  0: '맑음',
  1: '대체로 맑음',
  2: '구름조금',
  3: '흐림',
  45: '안개',
  48: '짙은 안개',
  51: '약한 이슬비',
  53: '이슬비',
  55: '강한 이슬비',
  61: '약한 비',
  63: '비',
  65: '강한 비',
  71: '약한 눈',
  73: '눈',
  75: '강한 눈',
  80: '소나기',
  95: '뇌우',
}

export const weatherService = {
  /**
   * 기본 관측 도시 10개의 Open-Meteo 실시간 데이터를 동시 수신합니다.
   */
  async fetchDefaultCitiesWeather() {
    try {
      const requests = defaultCitiesData.map(async (item) => {
        const { lat, lon } = item.location
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m`
        const res = await fetch(url)
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
        const data = await res.json()

        const currentData = data.current || {}
        const weatherText = weatherCodeMap[currentData.weather_code] || '보통'

        return {
          location: { ...item.location },
          current: {
            temp_c: Math.round(currentData.temperature_2m ?? item.current.temp_c),
            feels_like_c: Math.round(currentData.apparent_temperature ?? item.current.feels_like_c),
            condition: { text: weatherText },
            humidity: currentData.relative_humidity_2m ?? item.current.humidity,
            wind_kph: Math.round(currentData.wind_speed_10m ?? item.current.wind_kph),
          },
        }
      })

      return await Promise.all(requests)
    } catch (err) {
      console.warn('Open-Meteo API 호출 실패, fallback 데이터 사용:', err)
      return defaultCitiesData
    }
  },

  /**
   * 글로벌 Geocoding 실시간 도시 검색 (한글 매핑 연동)
   */
  async searchCities(query) {
    if (!query || !query.trim()) return []
    const trimmedQuery = query.trim()

    // 1차: 기본 10개 도시 목록에서 키워드 필터링
    const localMatches = defaultCitiesData.filter((item) => {
      const fullText = `${item.location.country} ${item.location.region} ${item.location.name}`.toLowerCase()
      return fullText.includes(trimmedQuery.toLowerCase())
    })

    // 2차: Open-Meteo Geocoding API 실시간 호출
    try {
      const searchTerm = koreanCityAlias[trimmedQuery] || trimmedQuery
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchTerm)}&count=8&language=ko&format=json`
      const res = await fetch(url)
      if (!res.ok) return localMatches

      const data = await res.json()
      if (!data.results || data.results.length === 0) return localMatches

      const apiRequests = data.results.map(async (city, index) => {
        const lat = city.latitude
        const lon = city.longitude
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m`
        const weatherRes = await fetch(weatherUrl)
        const weatherData = await weatherRes.json()

        const currentData = weatherData.current || {}
        const weatherText = weatherCodeMap[currentData.weather_code] || '보통'

        return {
          location: {
            id: `search_${city.id || index}`,
            country: city.country || '해외',
            region: city.admin1 || city.country || '지역',
            name: city.name,
            lat,
            lon,
          },
          current: {
            temp_c: Math.round(currentData.temperature_2m ?? 20),
            feels_like_c: Math.round(currentData.apparent_temperature ?? 20),
            condition: { text: weatherText },
            humidity: currentData.relative_humidity_2m ?? 50,
            wind_kph: Math.round(currentData.wind_speed_10m ?? 10),
          },
        }
      })

      const apiResults = await Promise.all(apiRequests)

      // 로컬 필터링 결과와 API 결과 중복 제거 통합
      const combined = [...localMatches]
      apiResults.forEach((item) => {
        if (!combined.some(c => c.location.name === item.location.name)) {
          combined.push(item)
        }
      })

      return combined
    } catch (err) {
      console.warn('도시 검색 API 오류:', err)
      return localMatches
    }
  },

  /**
   * 도시 ID 기반 관측 데이터 찾기 (스토어/뷰 연동)
   */
  async getCityById(cityId, defaultList = []) {
    const found = defaultList.find(c => c.location.id === cityId)
    if (found) return found
    const defaultFound = defaultCitiesData.find(c => c.location.id === cityId)
    if (defaultFound) return defaultFound
    return null
  },
}
