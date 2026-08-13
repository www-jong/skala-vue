/**
 * Weather Service API Adapter Layer (OpenWeatherMap Integration)
 * 대한민국 주요 도시 10개 실시간 관측, 한글 매핑, 24시간/7일 예보 지원
 */

const API_KEY = import.meta.env.VITE_OPEN_WEATHER_API
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast'

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
   * 글로벌 OpenWeatherMap 실시간 도시 검색 (한글 매핑 연동)
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

      const url = `${BASE_URL}?q=${encodeURIComponent(searchTerm)}&appid=${API_KEY}&units=metric&lang=kr`
      const res = await fetch(url)
      if (!res.ok) return localMatches

      const data = await res.json()
      const searchItem = {
        location: {
          id: `search_${data.id}`,
          country: data.sys?.country || '해외',
          region: data.name,
          name: data.name,
          lat: data.coord?.lat,
          lon: data.coord?.lon,
        },
        current: {
          temp_c: Math.round(data.main.temp),
          feels_like_c: Math.round(data.main.feels_like * 10) / 10,
          condition: { text: data.weather[0]?.description || '맑음' },
          humidity: data.main.humidity,
          wind_kph: Math.round((data.wind?.speed || 0) * 3.6),
          serverDt: data.dt,
        },
      }

      const combined = [...localMatches]
      if (!combined.some((c) => c.location.name === searchItem.location.name)) {
        combined.push(searchItem)
      }

      return combined
    } catch (err) {
      console.warn('도시 검색 OpenWeatherMap API 오류:', err)
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
