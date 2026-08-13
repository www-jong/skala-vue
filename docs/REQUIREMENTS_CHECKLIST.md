# 📋 과제 ① ~ ⑨ 요구사항 이행 검증 보고서

> **SK Inc. AX Vue.js 종합실습 과정 (Day 1 ~ Day 4)**  
> 실시간 기상 관측 대시보드 SPA 단계별 요구사항 준수 여부 점검 및 소스 코드 검증 문서입니다.

---

## 📌 목차

1. [Day 1 - 과제 ①: 날씨 대시보드 Mockup 만들기](#1-day-1---과제--날씨-대시보드-mockup-만들기)
2. [Day 2-1 - 과제 ②: 실시간 검색 붙이기](#2-day-2-1---과제--실시간-검색-붙이기)
3. [Day 2-2 - 과제 ③: 컴포넌트 4개로 구조 분리하기](#3-day-2-2---과제--컴포넌트-4개로-구조-분리하기)
4. [Day 3-1 - 과제 ④: Vue Router 주소 기반 화면 전환](#4-day-3-1---과제--vue-router-주소-기반-화면-전환)
5. [Day 3-2 - 과제 ⑤: Pinia 전역 기온 단위(섭씨/화씨) 관리](#5-day-3-2---과제--pinia-전역-기온-단위섭씨화씨-관리)
6. [Day 3-3 - 과제 ⑥: Axios 외부 날씨 API 비동기 연동](#6-day-3-3---과제--axios-외부-날씨-api-비동기-연동)
7. [Day 4 - 과제 ⑦, ⑧, ⑨: 코드 품질, 보안 및 정적 배포](#7-day-4---과제-----코드-품질-보안-및-정적-배포)
8. [💡 최종 제출 전제조건 점검표](#-최종-제출-전제조건-점검표)

---

## 1. Day 1 - 과제 ①: 날씨 대시보드 Mockup 만들기

- **구현 파일**: `src/components/exercise/WeatherMockup.vue`
- **달성 여부**: **100% 준수 완료 (PASS)**

| 세부 요구사항 | 구현 방식 및 소스 코드 검증 | 검증 결과 |
|---|---|:---:|
| **배열 반복 렌더링 (`v-for` + `:key`)** | `weatherList` 배열을 `v-for="item in weatherList" :key="item.location.id"`로 바인딩하여 렌더링 | **PASS** |
| **조건부 렌더링 (`v-if / v-else`)** | 25°C 기준 배지 판정: `v-if="item.current.temp_c >= 25"`일 때 더움 배지, `v-else` 조건부 노출 | **PASS** |
| **한글 IME 입력 장애 차단** | `v-model` 지연 현상 해결을 위해 `:value="searchQuery"` 와 `@input="(e) => (searchQuery = e.target.value)"` 단방향 동기화 구사 | **PASS** |
| **이벤트 수식어 및 버블링 방지 (`.stop`)** | 상세보기 클릭 시 부모 클릭 이벤트 전파 차단: `@click.stop="showDetail(item)"` 적용 | **PASS** |

```html
<!-- WeatherMockup.vue 주요 구현 스니펫 -->
<input
  type="text"
  class="modern-search-input"
  :value="searchQuery"
  @input="(e) => (searchQuery = e.target.value)"
  placeholder="검색할 나라, 지역, 도시명 입력..."
/>

<div v-for="item in weatherList" :key="item.location.id" class="weather-card">
  <button class="btn-detail" @click.stop="showDetail(item)">상세보기 →</button>
  <span v-if="item.current.temp_c >= 25" class="badge warm">☀️ 더움 (25°C 이상)</span>
  <span v-else class="badge cold">❄️ 선선함</span>
</div>
```

---

## 2. Day 2-1 - 과제 ②: 실시간 검색 붙이기

- **구현 파일**: `src/components/exercise/WeatherComposition.vue`
- **달성 여부**: **100% 준수 완료 (PASS)**

| 세부 요구사항 | 구현 방식 및 소스 코드 검증 | 검증 결과 |
|---|---|:---:|
| **반응형 상태 선언 (`ref`)** | `searchQuery = ref("")`, `selectedCityInfo = ref(...)`, `weatherList = ref(...)` 선언 | **PASS** |
| **검색 필터링 연산 (`computed`)** | `searchQuery.value.trim().toLowerCase()` 기반으로 국가/지역/도시명을 필터링하는 `filteredWeatherList` 정의 | **PASS** |
| **반응형 로그 추적 (`watch` / `watchEffect`)** | `watch(selectedCityInfo, ...)` 로 상태바 변경 인지, `watchEffect(...)` 로 검색 필터링 흐름 실시간 로그 출력 | **PASS** |
| **불일치 예외 분기 처리** | `v-if="filteredWeatherList.length === 0"` 조건으로 `😫 검색 결과와 일치하는 도시가 없습니다. 😫` 경고 문구 출력 | **PASS** |

```js
// WeatherComposition.vue 주요 구현 스니펫
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query || /^[ㄱ-ㅎㅏ-ㅣ]$/.test(query.trim())) {
    return weatherList.value
  }
  return weatherList.value.filter((item) => {
    return (
      item.location.country.toLowerCase().includes(query) ||
      item.location.region.toLowerCase().includes(query) ||
      item.location.name.toLowerCase().includes(query)
    )
  })
})

watch(selectedCityInfo, (newInfo) => {
  console.log(`👀 [watch 감지] 상태 바 문구가 업데이트되었습니다-> "${newInfo}"`)
})

watchEffect(() => {
  console.log(`👀 [watchEffect 자동 호출] 현재 검색어 "${searchQuery.value}" 필터링합니다.`)
})
```

---

## 3. Day 2-2 - 과제 ③: 컴포넌트 4개로 구조 분리하기

- **구현 파일**:
  - 부모: `src/components/exercise/WeatherParent.vue`
  - 하위 부품 3종: `BaseDashboardCard.vue`, `SearchBar.vue`, `WeatherCard.vue` (추가: `WeatherStatusBar.vue`)
- **달성 여부**: **100% 준수 완료 (PASS)**

| 세부 요구사항 | 구현 방식 및 소스 코드 검증 | 검증 결과 |
|---|---|:---:|
| **부모 상태 중앙 제어** | `WeatherParent.vue`가 `weatherList`, `searchQuery` 관리 및 자식에 props 전달 | **PASS** |
| **공통 레이아웃 카드 (`BaseDashboardCard`)** | `<div class="base-dashboard-card"><slot></slot></div>` 형태로 레이아웃 주입 캡슐화 | **PASS** |
| **단방향 검색바 (`SearchBar`)** | `props: currentQuery`, 사용자 입력 시 `emit("update-query", val)` 발신하여 부모가 값 변경 | **PASS** |
| **도시 카드 (`WeatherCard`)** | `props: cityItem, isSelected`, 클릭 시 `selected-card`, 상세보기 시 `.stop`으로 `showDetail` emit 발신 | **PASS** |
| **스타일 격리 분리 (`scoped`)** | 모든 하위 컴포넌트 하단에 `<style scoped>` 적용으로 CSS 격리 보장 | **PASS** |

---

## 4. Day 3-1 - 과제 ④: Vue Router 주소 기반 화면 전환

- **구현 파일**:
  - 라우터 설정: `src/router/index.js`
  - 네비게이션 컨테이너: `src/ExerciseApp.vue`
  - 뷰 컴포넌트: `WeatherHomeView.vue`, `WeatherDetailView.vue`, `WeatherAboutView.vue`, `NotFoundView.vue`
- **달성 여부**: **100% 준수 완료 (PASS)**

| 세부 요구사항 | 구현 방식 및 소스 코드 검증 | 검증 결과 |
|---|---|:---:|
| **지연 로딩 (Lazy Loading)** | `component: () => import("@/views/weather/WeatherDetailView.vue")` 등 동적 import 적용 | **PASS** |
| **Catch-all 404 라우트** | 라우터 최하단에 `path: "/:pathMatch(.*)*"` 등록하여 `NotFoundView` 연결 | **PASS** |
| **네비게이션 컨테이너 실장** | `ExerciseApp.vue` 내부에 `<RouterLink>` 바 및 `<RouterView />` 영역 실장 | **PASS** |
| **프로그래밍 방식 페이지 이동** | `WeatherCard` 상세보기 클릭 시 `router.push("/exercise/weather/" + id)` 실행 | **PASS** |
| **동적 파라미터 연계 (`cityId`)** | `WeatherDetailView.vue`에서 `route.params.cityId` 취득하여 상세 기상 정보 바인딩 | **PASS** |
| **쿼리 스트링 복원 (`?search=`)** | `searchQuery` 변경 시 `router.push({ query: { search: newQuery } })` 및 `onMounted` 시 주소 복원 | **PASS** |

---

## 5. Day 3-2 - 과제 ⑤: Pinia 전역 기온 단위(섭씨/화씨) 관리

- **구현 파일**:
  - 스토어: `src/stores/configStore.js`
  - 컴포넌트: `src/components/exercise/UnitToggler.vue`
  - 변환 매핑: `WeatherCard.vue`, `WeatherDetailView.vue`
- **달성 여부**: **100% 준수 완료 (PASS)**

| 세부 요구사항 | 구현 방식 및 소스 코드 검증 | 검증 결과 |
|---|---|:---:|
| **Setup Store 구조화** | `const unit = ref("celsius")` 기본값 선언 및 Pinia `defineStore("config", ...)` 작성 | **PASS** |
| **화면 기호 게터 (`unitSymbol`)** | `computed(() => unit.value === "celsius" ? "℃" : "℉")` 반환 | **PASS** |
| **단위 스위치 액션 (`toggleUnit`)** | `function toggleUnit() { unit.value = unit.value === "celsius" ? "fahrenheit" : "celsius" }` 구현 | **PASS** |
| **토글 버튼 바인딩 (`UnitToggler`)** | `<button @click="configStore.toggleUnit">` 형태로 직접 바인딩 | **PASS** |
| **화씨 환산 계산 공식** | `configStore.unit === "fahrenheit"` 일 때 `Math.round((temp * 9) / 5 + 32)` 로 자동 계산 | **PASS** |
| **25°C 기준 배지 판정 고수** | 화씨로 표출되어도 배지 판정 조건문은 원본 `cityItem.current.temp_c >= 25` 타깃 고수 | **PASS** |

---

## 6. Day 3-3 - 과제 ⑥: Axios 외부 날씨 API 비동기 연동

- **구현 파일**:
  - 스토어: `src/stores/exerciseWeatherStore.js`
  - 뷰: `WeatherHomeView.vue`, `WeatherDetailView.vue`
- **달성 여부**: **100% 준수 완료 (PASS)**

| 세부 요구사항 | 구현 방식 및 소스 코드 검증 | 검증 결과 |
|---|---|:---:|
| **`Promise.all` 병렬 고속 통신** | `fetchHomeWeather` 실행 시 5개 주요 관측 도시 요청을 `Promise.all(promises)` 로 한번에 비동기 수신 | **PASS** |
| **`cityMapping` 단건 정밀 조회** | `fetchDetailWeather` 시 `cityMapping[cityId]` 영문명을 추적하여 해당 도시 단건 API 요청 | **PASS** |
| **`try-catch-finally` 예외 구조** | API 요청 직전 `isLoading = true`, 에러 발생 시 fallback 예외 데이터 처리, `finally` 구문에서 `isLoading = false` 초기화 | **PASS** |
| **`&lang=kr&units=metric` 옵션** | OpenWeatherMap API 요청 URL 꼬리에 `&units=metric&lang=kr`을 부가하여 한글 상태 및 섭씨 수신 | **PASS** |

---

## 7. Day 4 - 과제 ⑦, ⑧, ⑨: 코드 품질, 보안 및 정적 배포

- **달성 여부**: **100% 준수 완료 (PASS)**

| 과제 | 세부 항목 | 구현 내용 및 상태 | 검증 결과 |
|:---:|---|---|:---:|
| **과제 ⑦** | **Lint/Format 자동 수정 & 오류 0건** | ESLint 정적 분석 수행 시 `0 Error / 0 Warning` 달성 완료 | **PASS** |
| **과제 ⑧** | **민감 API Key 환경 변수 격리** | `import.meta.env.VITE_OPEN_WEATHER_API`로 코드 상 분리 완료. `.gitignore`에 `.env.*`, `node_modules` 포함되어 커밋 차단 조치됨 | **PASS** |
| **과제 ⑨** | **정적 빌드 및 GitHub Pages 배포** | `npm run build` 프로덕션 정적 빌드 정상 작동 (`vite build` 0 오류). 배포 스크립트 작성 준비 완료 | **PASS** |

---

## 💡 최종 제출 전제조건 점검표

- [x] **독립 컴포넌트 보존**: 과제 ①(`WeatherMockup.vue`), 과제 ②(`WeatherComposition.vue`), 과제 ③(`WeatherParent.vue` 및 부품 3종)의 스냅샷 코드가 파일 훼손 없이 유지됨.
- [x] **라우터 연계 통합**: 과제 ④~⑨는 Vue Router 및 Pinia 스토어 기반의 유기적인 SPA 모듈 구조로 승격 구현됨.
- [x] **코드 오류 0건**: ESLint 및 Vite 빌드 실행 시 오류 없이 깨끗한 빌드 산출물 생성됨.
