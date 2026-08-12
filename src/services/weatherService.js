/**
 * Weather Service API Adapter Layer (Open-Meteo Integration)
 * 대한민국 주요 도시 10개 실시간 관측, 한글 매핑, 24시간/7일 예보 지원
 */

// 대한민국 10개 주요 관측 도시 기본 좌표 및 지명
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

function getWeatherIcon(code) {
  if (code === 0) return '☀️'
  if (code === 1 || code === 2) return '⛅'
  if (code === 3) return '☁️'
  if (code >= 45 && code <= 48) return '🌫️'
  if (code >= 51 && code <= 67) return '🌧️'
  if (code >= 71 && code <= 77) return '❄️'
  if (code >= 80 && code <= 82) return '🌦️'
  if (code >= 95) return '⛈️'
  return '☀️'
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
   * 도시의 24시간 시간별 기온 및 7일간 주간 기상 예보 수신
   */
  async fetchCityDetailedForecast(lat, lon) {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      const data = await res.json()

      // 1. 24시간 시간별 예보 가공
      const hourlyList = []
      if (data.hourly && data.hourly.time) {
        const now = new Date()
        let startIndex = data.hourly.time.findIndex(t => new Date(t) >= now)
        if (startIndex < 0) startIndex = 0
        for (let i = startIndex; i < Math.min(startIndex + 24, data.hourly.time.length); i++) {
          const timeStr = data.hourly.time[i]
          const hour = new Date(timeStr).getHours()
          hourlyList.push({
            timeLabel: `${hour < 10 ? '0' + hour : hour}:00`,
            temp_c: Math.round(data.hourly.temperature_2m[i]),
            rainProb: data.hourly.precipitation_probability[i] ?? 0,
            conditionText: weatherCodeMap[data.hourly.weather_code[i]] || '보통',
            weatherIcon: getWeatherIcon(data.hourly.weather_code[i]),
          })
        }
      }

      // 2. 7일간 주간 예보 가공
      const dailyList = []
      if (data.daily && data.daily.time) {
        const dayNames = ['일', '월', '화', '수', '목', '금', '토']
        for (let i = 0; i < data.daily.time.length; i++) {
          const dateObj = new Date(data.daily.time[i])
          const month = dateObj.getMonth() + 1
          const date = dateObj.getDate()
          const dayName = dayNames[dateObj.getDay()]
          const isToday = i === 0

          dailyList.push({
            dateLabel: isToday ? `오늘 (${month}/${date})` : i === 1 ? `내일 (${month}/${date})` : `${month}/${date} (${dayName})`,
            tempMax_c: Math.round(data.daily.temperature_2m_max[i]),
            tempMin_c: Math.round(data.daily.temperature_2m_min[i]),
            rainProbMax: data.daily.precipitation_probability_max[i] ?? 0,
            conditionText: weatherCodeMap[data.daily.weather_code[i]] || '보통',
            weatherIcon: getWeatherIcon(data.daily.weather_code[i]),
          })
        }
      }

      return { hourlyList, dailyList }
    } catch (err) {
      console.warn('Detailed forecast fetch error:', err)
      return { hourlyList: [], dailyList: [] }
    }
  },

  /**
   * 자동완성 추천 목록 전용 Prefix Search API
   */
  async fetchSuggestions(query) {
    if (!query || !query.trim()) return []
    const trimmed = query.trim()

    let searchTerm = trimmed
    for (const [k, v] of Object.entries(koreanCityAlias)) {
      if (k.startsWith(trimmed)) {
        searchTerm = v
        break
      }
    }

    try {
      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchTerm)}&count=6&language=ko&format=json`
      const res = await fetch(url)
      if (!res.ok) return []
      const data = await res.json()
      if (!data.results) return []

      return data.results.map((city, index) => ({
        id: `sug_${city.id || index}`,
        country: city.country || '해외',
        region: city.admin1 || city.country || '지역',
        name: city.name,
        fullName: `${city.country ? '[' + city.country + '] ' : ''}${city.admin1 ? city.admin1 + ' ' : ''}${city.name}`,
        lat: city.latitude,
        lon: city.longitude,
      }))
    } catch (err) {
      console.warn('Prefix search suggestions error:', err)
      return []
    }
  },

  /**
   * 글로벌 Geocoding 실시간 도시 검색 (한글 매핑 연동)
   */
  async searchCities(query) {
    if (!query || !query.trim()) return []
    const trimmedQuery = query.trim()

    const localMatches = defaultCitiesData.filter((item) => {
      const fullText = `${item.location.country} ${item.location.region} ${item.location.name}`.toLowerCase()
      return fullText.includes(trimmedQuery.toLowerCase())
    })

    try {
      let searchTerm = trimmedQuery
      for (const [k, v] of Object.entries(koreanCityAlias)) {
        if (k.startsWith(trimmedQuery)) {
          searchTerm = v
          break
        }
      }

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
