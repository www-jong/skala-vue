/**
 * Weather Service API Adapter Layer (OpenWeatherMap Integration)
 * Direct Geocoding API (lat/lon & local_names.ko) + 2.5/weather 2단계 실시간 검색
 */

const API_KEY = import.meta.env.VITE_OPEN_WEATHER_API
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast'
const GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct'

// 대한민국 10개 주요 관측 도시 기본 메타 데이터 및 좌표 (loc_01 ~ loc_10)
const defaultCitiesData = [
  { location: { id: 'loc_01', english: 'Seoul', country: '대한민국', region: '서울특별시', name: '강남구', lat: 37.5172, lon: 127.0473 }, current: { temp_c: 24, feels_like_c: 26, condition: { text: '맑음' }, humidity: 65, wind_kph: 12 } },
  { location: { id: 'loc_02', english: 'Ulsan', country: '대한민국', region: '울산광역시', name: '남구', lat: 35.5439, lon: 129.3301 }, current: { temp_c: 25, feels_like_c: 27, condition: { text: '구름조금' }, humidity: 70, wind_kph: 14 } },
  { location: { id: 'loc_03', english: 'Busan', country: '대한민국', region: '부산광역시', name: '해운대구', lat: 35.1631, lon: 129.1636 }, current: { temp_c: 23, feels_like_c: 24, condition: { text: '흐림' }, humidity: 78, wind_kph: 16 } },
  { location: { id: 'loc_04', english: 'Suwon', country: '대한민국', region: '경기도', name: '수원시', lat: 37.2636, lon: 127.0286 }, current: { temp_c: 22, feels_like_c: 23, condition: { text: '비' }, humidity: 85, wind_kph: 10 } },
  { location: { id: 'loc_05', english: 'Jeju', country: '대한민국', region: '제주특별자치도', name: '제주시', lat: 33.4996, lon: 126.5312 }, current: { temp_c: 26, feels_like_c: 28, condition: { text: '맑음' }, humidity: 60, wind_kph: 20 } },
  { location: { id: 'loc_06', english: 'Incheon', country: '대한민국', region: '인천광역시', name: '중구', lat: 37.4738, lon: 126.6217 }, current: { temp_c: 23, feels_like_c: 24, condition: { text: '구름조금' }, humidity: 72, wind_kph: 15 } },
  { location: { id: 'loc_07', english: 'Daegu', country: '대한민국', region: '대구광역시', name: '중구', lat: 35.8714, lon: 128.6014 }, current: { temp_c: 27, feels_like_c: 29, condition: { text: '맑음' }, humidity: 55, wind_kph: 8 } },
  { location: { id: 'loc_08', english: 'Daejeon', country: '대한민국', region: '대전광역시', name: '서구', lat: 36.3504, lon: 127.3845 }, current: { temp_c: 24, feels_like_c: 25, condition: { text: '맑음' }, humidity: 62, wind_kph: 9 } },
  { location: { id: 'loc_09', english: 'Gwangju', country: '대한민국', region: '광주광역시', name: '동구', lat: 35.1461, lon: 126.9231 }, current: { temp_c: 25, feels_like_c: 26, condition: { text: '대체로 맑음' }, humidity: 68, wind_kph: 11 } },
  { location: { id: 'loc_10', english: 'Changwon', country: '대한민국', region: '경상남도', name: '창원시', lat: 35.2280, lon: 128.6811 }, current: { temp_c: 24, feels_like_c: 25, condition: { text: '흐림' }, humidity: 75, wind_kph: 13 } },
]

// 한국 주요 도시 한글 검색어 -> 영문 매핑 딕셔너리
const koreanCityAlias = {
  서울: 'Seoul',
  서울특별시: 'Seoul',
  부산: 'Busan',
  부산광역시: 'Busan',
  인천: 'Incheon',
  인천광역시: 'Incheon',
  대구: 'Daegu',
  대구광역시: 'Daegu',
  대전: 'Daejeon',
  대전광역시: 'Daejeon',
  광주: 'Gwangju',
  광주광역시: 'Gwangju',
  울산: 'Ulsan',
  울산광역시: 'Ulsan',
  수원: 'Suwon',
  수원시: 'Suwon',
  제주: 'Jeju',
  제주시: 'Jeju',
  창원: 'Changwon',
  창원시: 'Changwon',
  파주: 'Paju',
  파주시: 'Paju',
  성남: 'Seongnam',
  고양: 'Goyang',
  용인: 'Yongin',
  청주: 'Cheongju',
  전주: 'Jeonju',
  천안: 'Cheonan',
  안산: 'Ansan',
  안양: 'Anyang',
  포항: 'Pohang',
  도쿄: 'Tokyo',
  파리: 'Paris',
  런던: 'London',
  뉴욕: 'New York',
  시드니: 'Sydney',
  베이징: 'Beijing',
  상하이: 'Shanghai',
  방콕: 'Bangkok',
  싱가포르: 'Singapore',
  로마: 'Rome',
  베를린: 'Berlin',
  마드리드: 'Madrid',
  토론토: 'Toronto',
  밴쿠버: 'Vancouver',
}

// 영문 도시명 -> 한글 지역명/지명 매핑 딕셔너리
const englishToKoreanAlias = {
  Seoul: { region: '서울특별시', name: '서울' },
  Busan: { region: '부산광역시', name: '부산' },
  Incheon: { region: '인천광역시', name: '인천' },
  Daegu: { region: '대구광역시', name: '대구' },
  Daejeon: { region: '대전광역시', name: '대전' },
  Gwangju: { region: '광주광역시', name: '광주' },
  Ulsan: { region: '울산광역시', name: '울산' },
  Suwon: { region: '경기도', name: '수원시' },
  Jeju: { region: '제주특별자치도', name: '제주시' },
  Changwon: { region: '경상남도', name: '창원시' },
  Paju: { region: '경기도', name: '파주시' },
  Seongnam: { region: '경기도', name: '성남시' },
  Goyang: { region: '경기도', name: '고양시' },
  Yongin: { region: '경기도', name: '용인시' },
  Cheongju: { region: '충청북도', name: '청주시' },
  Jeonju: { region: '전라북도', name: '전주시' },
  Cheonan: { region: '충청남도', name: '천안시' },
  Ansan: { region: '경기도', name: '안산시' },
  Anyang: { region: '경기도', name: '안양시' },
  Pohang: { region: '경상북도', name: '포항시' },
  Tokyo: { region: '일본', name: '도쿄' },
  Paris: { region: '프랑스', name: '파리' },
  London: { region: '영국', name: '런던' },
  'New York': { region: '미국', name: '뉴욕' },
  Sydney: { region: '호주', name: '시드니' },
  Beijing: { region: '중국', name: '베이징' },
  Shanghai: { region: '중국', name: '상하이' },
  Bangkok: { region: '태국', name: '방콕' },
  Singapore: { region: '싱가포르', name: '싱가포르' },
  Rome: { region: '이탈리아', name: '로마' },
  Berlin: { region: '독일', name: '베를린' },
  Madrid: { region: '스페인', name: '마드리드' },
  Toronto: { region: '캐나다', name: '토론토' },
  Vancouver: { region: '캐나다', name: '밴쿠버' },
}

function getWeatherIcon(iconCode, description = '') {
  if (!iconCode) return '☀️'
  if (iconCode.startsWith('01')) return '☀️'
  if (iconCode.startsWith('02')) return '⛅'
  if (iconCode.startsWith('03') || iconCode.startsWith('04')) return '☁️'
  if (iconCode.startsWith('09') || iconCode.startsWith('10')) return '🌧️'
  if (iconCode.startsWith('11')) return '⛈️'
  if (iconCode.startsWith('13')) return '❄️'
  if (iconCode.startsWith('50')) return '🌫️'

  if (description.includes('비')) return '🌧️'
  if (description.includes('눈')) return '❄️'
  if (description.includes('구름')) return '⛅'
  return '☀️'
}

export const weatherService = {
  /**
   * 기본 관측 도시 10개의 OpenWeatherMap 실시간 데이터를 동시 수신합니다.
   */
  async fetchDefaultCitiesWeather() {
    try {
      const requests = defaultCitiesData.map(async (item) => {
        const queryTerm = item.location.english || item.location.name
        const url = `${BASE_URL}?q=${encodeURIComponent(queryTerm)}&appid=${API_KEY}&units=metric&lang=kr`
        const res = await fetch(url)
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
        const data = await res.json()

        return {
          location: {
            ...item.location,
            lat: data.coord ? data.coord.lat : item.location.lat,
            lon: data.coord ? data.coord.lon : item.location.lon,
          },
          current: {
            temp_c: Math.round(data.main.temp),
            feels_like_c: Math.round(data.main.feels_like * 10) / 10,
            condition: {
              text: data.weather[0]?.description || item.current.condition.text,
              icon: data.weather[0]?.icon || '01d',
            },
            humidity: data.main.humidity,
            wind_kph: Math.round((data.wind?.speed || 0) * 3.6),
            serverDt: data.dt,
          },
        }
      })

      return await Promise.all(requests)
    } catch (err) {
      console.warn('OpenWeatherMap API 호출 실패, fallback 데이터 사용:', err)
      return defaultCitiesData
    }
  },

  /**
   * 도시의 24시간 시간별 기온 및 5일간 주간 기상 예보 수신 (OpenWeatherMap 5day/3hour API)
   */
  async fetchCityDetailedForecast(lat, lon) {
    try {
      const url = `${FORECAST_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      const data = await res.json()

      const list = data.list || []

      // 1. 24시간 (3시간 단위 8개 타임슬롯) 시간별 예보 가공
      const hourlyList = list.slice(0, 8).map((item) => {
        const dateObj = new Date(item.dt * 1000)
        const hour = dateObj.getHours()
        const hourStr = hour < 10 ? `0${hour}` : `${hour}`
        return {
          timeLabel: `${hourStr}:00`,
          temp_c: Math.round(item.main.temp),
          rainProb: Math.round((item.pop || 0) * 100),
          conditionText: item.weather[0]?.description || '맑음',
          weatherIcon: getWeatherIcon(item.weather[0]?.icon, item.weather[0]?.description),
        }
      })

      // 2. 날짜별 그룹핑을 통한 일자별 최고/최저 예보 가공
      const dailyMap = {}
      const dayNames = ['일', '월', '화', '수', '목', '금', '토']

      list.forEach((item) => {
        const dateObj = new Date(item.dt * 1000)
        const dateKey = `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}-${dateObj.getDate()}`

        if (!dailyMap[dateKey]) {
          dailyMap[dateKey] = {
            dateObj,
            temps: [],
            pops: [],
            weather: item.weather[0],
          }
        }
        dailyMap[dateKey].temps.push(item.main.temp)
        dailyMap[dateKey].pops.push(item.pop || 0)
      })

      const dailyKeys = Object.keys(dailyMap).slice(0, 5)
      const dailyList = dailyKeys.map((key, idx) => {
        const d = dailyMap[key]
        const dateObj = d.dateObj
        const month = dateObj.getMonth() + 1
        const date = dateObj.getDate()
        const dayName = dayNames[dateObj.getDay()]
        const isToday = idx === 0
        const isTomorrow = idx === 1

        const tempMax = Math.max(...d.temps)
        const tempMin = Math.min(...d.temps)
        const popMax = Math.max(...d.pops)

        let dateLabel = `${month}/${date} (${dayName})`
        if (isToday) dateLabel = `오늘 (${month}/${date})`
        else if (isTomorrow) dateLabel = `내일 (${month}/${date})`

        return {
          dateLabel,
          tempMax_c: Math.round(tempMax),
          tempMin_c: Math.round(tempMin),
          rainProbMax: Math.round(popMax * 100),
          conditionText: d.weather?.description || '맑음',
          weatherIcon: getWeatherIcon(d.weather?.icon, d.weather?.description),
        }
      })

      return { hourlyList, dailyList }
    } catch (err) {
      console.warn('Detailed forecast fetch error:', err)
      return { hourlyList: [], dailyList: [] }
    }
  },

  /**
   * Direct Geocoding API를 활용한 실시간 드롭다운 추천 목록 탐색
   */
  async fetchSuggestions(query) {
    if (!query || !query.trim()) return []
    const trimmed = query.trim()

    // 단일 한글 자음/모음(ㅇ, ㅁ, ㄱ 등)일 경우 빈 배열 즉시 리턴
    if (/^[\u3131-\u3163]+$/.test(trimmed)) {
      return []
    }

    try {
      const geoUrl = `${GEO_URL}?q=${encodeURIComponent(trimmed)}&limit=6&appid=${API_KEY}`
      const geoRes = await fetch(geoUrl)
      if (!geoRes.ok) return []

      const geoList = await geoRes.json()
      if (!geoList || geoList.length === 0) return []

      return geoList.map((item, index) => {
        const name = item.local_names?.ko || (englishToKoreanAlias[item.name] ? englishToKoreanAlias[item.name].name : item.name)
        const region = item.state || (englishToKoreanAlias[item.name] ? englishToKoreanAlias[item.name].region : (item.country === 'KR' ? '대한민국' : item.country))
        return {
          id: `sug_${item.lat}_${item.lon}_${index}`,
          country: item.country === 'KR' ? '대한민국' : item.country,
          region,
          name,
          fullName: `[${item.country === 'KR' ? '대한민국' : item.country}] ${region} ${name}`,
          lat: item.lat,
          lon: item.lon,
        }
      })
    } catch {
      return []
    }
  },

  /**
   * 2단계 실시간 관측 도시 검색 (Direct Geocoding lat/lon 수신 -> Weather API 2차 호출)
   */
  async searchCities(query) {
    if (!query || !query.trim()) return []
    const trimmedQuery = query.trim()

    // 로컬 기본 10개 관측 도시 매칭
    const localMatches = defaultCitiesData.filter((item) => {
      const fullText = `${item.location.country} ${item.location.region} ${item.location.name}`.toLowerCase()
      return fullText.includes(trimmedQuery.toLowerCase())
    })

    // 단일 한글 자음/모음(ㅇ, ㅁ, ㄱ 등) 입력 시 로컬 매칭 결과만 전달
    if (/^[\u3131-\u3163]+$/.test(trimmedQuery)) {
      return localMatches
    }

    try {
      // 1단계: Direct Geocoding API를 통해 입력 도시의 lat, lon 및 local_names.ko 수신
      const geoUrl = `${GEO_URL}?q=${encodeURIComponent(trimmedQuery)}&limit=5&appid=${API_KEY}`
      const geoRes = await fetch(geoUrl)
      if (!geoRes.ok) return localMatches

      const geoList = await geoRes.json()
      if (!geoList || geoList.length === 0) return localMatches

      // 2단계: Geocoding으로 수신한 lat, lon 기반으로 2.5/weather 실시간 기상 관측 수신
      const searchRequests = geoList.slice(0, 3).map(async (geoItem) => {
        const { lat, lon } = geoItem
        const weatherUrl = `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=kr`
        const weatherRes = await fetch(weatherUrl)
        if (!weatherRes.ok) return null

        const weatherData = await weatherRes.json()

        // 지명 및 지역 한글화 (local_names.ko > englishToKoreanAlias > geoItem.name)
        const koreanName =
          geoItem.local_names?.ko ||
          (englishToKoreanAlias[geoItem.name] ? englishToKoreanAlias[geoItem.name].name : geoItem.name)

        const koreanRegion =
          geoItem.state ||
          (englishToKoreanAlias[geoItem.name] ? englishToKoreanAlias[geoItem.name].region : (geoItem.country === 'KR' ? '대한민국' : geoItem.country))

        return {
          location: {
            id: `search_${lat}_${lon}`,
            country: geoItem.country === 'KR' ? '대한민국' : (geoItem.country || '해외'),
            region: koreanRegion,
            name: koreanName,
            lat,
            lon,
          },
          current: {
            temp_c: Math.round(weatherData.main.temp),
            feels_like_c: Math.round(weatherData.main.feels_like * 10) / 10,
            condition: { text: weatherData.weather[0]?.description || '맑음' },
            humidity: weatherData.main.humidity,
            wind_kph: Math.round((weatherData.wind?.speed || 0) * 3.6),
            serverDt: weatherData.dt,
          },
        }
      })

      const searchResults = (await Promise.all(searchRequests)).filter(Boolean)

      const combined = [...localMatches]
      searchResults.forEach((item) => {
        if (!combined.some((c) => c.location.name === item.location.name)) {
          combined.push(item)
        }
      })

      return combined
    } catch (err) {
      console.warn('Geocoding 2단계 도시 검색 오류:', err)
      return localMatches
    }
  },

  /**
   * 도시 ID 기반 관측 데이터 찾기 (스토어/뷰 연동)
   */
  async getCityById(cityId, defaultList = []) {
    const found = defaultList.find((c) => c.location.id === cityId)
    if (found) return found
    const defaultFound = defaultCitiesData.find((c) => c.location.id === cityId)
    if (defaultFound) return defaultFound
    return null
  },
}
