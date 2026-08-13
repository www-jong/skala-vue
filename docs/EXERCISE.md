# 📝 ExerciseApp (과제 1~9) 교재 기반 요구사항, 구현 & 고도화 상세 보고서

`skala-vue` 프로젝트의 날씨 대시보드 애플리케이션 과제(Exercise 1~9: 과제 1~3 스냅샷 및 과제 4~ 통합 대시보드)에 대하여 **교재/레퍼런스(`skala-vue-reference`) 원본 요구사항**, **실제 구현 코드**, 그리고 **추가 고도화(Customization & Optimization)** 내역을 상세하게 정리한 종합 보고서입니다.

---

## 📌 목차 (Table of Contents)

1. [Exercise 1. 정적 날씨 대시보드 (Mockup)](#-exercise-1-정적-날씨-대시보드-mockup)
2. [Exercise 2. Composition API 날씨 대시보드](#-exercise-2-composition-api-날씨-대시보드)
3. [Exercise 3. 재사용 가능한 컴포넌트 구조 분리](#-exercise-3-재사용-가능한-컴포넌트-구조-분리)
4. [Exercise 4. Vue Router 기반 페이지 라우팅](#-exercise-4-vue-router-기반-페이지-라우팅)
5. [Exercise 4~. Vue Router, Pinia 스토어 &amp; OpenWeatherMap API 연동 대시보드](#-exercise-5-openweathermap-api--pinia-전역-스토어-연동)
6. [🔥 킬러 커스터마이징 &amp; 고급 아키텍처 요약](#-킬러-커스터마이징--고급-아키텍처-요약)

---

## ⛅ Exercise 1. 정적 날씨 대시보드 (Mockup)

### 1. 📌 교재 및 레퍼런스 원본 요구사항

- HTML/CSS 기본 태그 및 정적(Mock) JSON 데이터를 이용하여 지역별 기상 현황 카드 레이아웃을 구성한다.
- 대표 관측 도시의 기온, 체감온도, 습도, 기상 상태 정보를 시각적으로 표현한다.

### 2. 💻 레퍼런스 코드 구조 (`WeatherMockup.vue`)

- `weatherList` 배열에 3~5개 도시 Mock 객체를 정의하고 `v-for`로 단순 반복 렌더링.

### 3. 🛠️ 내가 직접 적용한 코드 및 리팩토링 ([`WeatherMockup.vue`](file:///Users/wonjong/workspace/day8/projects/skala-vue/src/components/exercise/WeatherMockup.vue))

- `weatherList` 배열에 대한민국 주요 5개 도시(서울, 울산, 부산, 수원, 제주)의 정적 기상 데이터 구조체(`location`, `current`) 배치.

### 4. 🔥 추가 디벨롭 & 커스터마이징 (Development)

- **온도 구간별 5단계 동적 컬러 뱃지 시스템**:
  - `🔥 폭염 (30°C 이상)` / `☀️ 더움 (25°C 이상)` / `🌿 쾌적 (18°C 이상)` / `🧥 쌀쌀 (10°C 이상)` / `❄️ 한파 (10°C 미만)`
- **Glassmorphism & 모던 UX**:
  - 반투명 글래스모피즘 카드 배경, 둥근 모서리(`border-radius: 12px`), 다크모드(`html.dark`) 전역 호환 레이아웃 구축.

---

## 🌡️ Exercise 2. Composition API 날씨 대시보드

### 1. 📌 교재 및 레퍼런스 원본 요구사항

- Vue 3 Composition API (`ref`, `computed`, `watch`, `watchEffect`)를 활용하여 동적 반응형 상태를 제어한다.
- 실시간 지역 검색 필터링 기능을 구현한다.

### 2. 💻 레퍼런스 코드 구조 (`WeatherComposition.vue`)

- `ref`: `weatherList`, `searchQuery`, `selectedCityInfo`
- `computed`: `filteredWeatherList` (도시명 `includes` 검색 연산)
- `watch` / `watchEffect`: 검색어 변경 감지 및 반응성 로깅

### 3. 🛠️ 내가 직접 적용한 코드 및 리팩토링 ([`WeatherComposition.vue`](file:///Users/wonjong/workspace/day8/projects/skala-vue/src/components/exercise/WeatherComposition.vue))

- **`computed` 검색 필터링**:
  - 검색어(`searchQuery`) 입력 시 국가, 지역, 도시명 텍스트를 실시간 대소문자 무시(case-insensitive)로 필터링 연산.
- **`watchEffect` & `watch`**:
  - 선택된 도시 정보 및 검색어 변경 시 반응형 추적 로그 자동 출력.

### 4. 🔥 추가 디벨롭 & 커스터마이징 (Development)

- **한글 IME 조합 검색 정규식 예외 처리**:
  - 한글 입력 시 자음/모음(예: 'ㄱ', 'ㅏ') 타이핑 도중 검색 목록이 통째로 사라지는 문제를 방지하기 위해 `/^[ㄱ-ㅎㅏ-ㅣ]$/` 정규식 예외 처리 적용.

---

## 🧩 Exercise 3. 재사용 가능한 컴포넌트 구조 분리

### 1. 📌 교재 및 레퍼런스 원본 요구사항

- 거대한 단일 파일 컴포넌트를 단일 책임 원칙(SRP)에 따라 재사용 가능한 부모-자식 컴포넌트로 분리한다.
- `props`와 `custom emits`를 활용하여 양방향 데이터 흐름을 제어한다.

### 2. 💻 레퍼런스 코드 구조 (`WeatherParent.vue`)

- `BaseDashboardCard`, `SearchBar`, `WeatherCard`, `WeatherStatusBar` 분리.

### 3. 🛠️ 내가 직접 적용한 코드 및 리팩토링

- **[`BaseDashboardCard.vue`](file:///Users/wonjong/workspace/day8/projects/skala-vue/src/components/exercise/BaseDashboardCard.vue)**: Vue `<slot />`을 활용해 다양한 컨텐츠를 유연하게 감싸는 카드 컨테이너 Wrapper.
- **[`SearchBar.vue`](file:///Users/wonjong/workspace/day8/projects/skala-vue/src/components/exercise/SearchBar.vue)**: `:current-query` prop 및 `@update-query` emit 처리.
- **[`WeatherCard.vue`](file:///Users/wonjong/workspace/day8/projects/skala-vue/src/components/exercise/WeatherCard.vue)**: 개별 도시 카드 (`props: cityItem, isSelected`, `emits: selected-card, showDetail`).
- **[`WeatherStatusBar.vue`](file:///Users/wonjong/workspace/day8/projects/skala-vue/src/components/exercise/WeatherStatusBar.vue)**: 클릭된 도시 상태 안내 메시지바.

### 4. 🔥 추가 디벨롭 & 커스터마이징 (Development)

- **선택 카드 시각적 피드백**: `:class="{ selected: isSelected }"`로 선택된 카드는 보라색 테두리 및 그림자 강조.
- **이벤트 버블링 차단**: 상세보기 버튼 클릭 시 카드 선택 이벤트가 중복 발화되지 않도록 `@click.stop` 적용.

---

## 🧭 Exercise 4. Vue Router 기반 페이지 라우팅

### 1. 📌 교재 및 레퍼런스 원본 요구사항

- `Vue Router`를 도입하여 메인 대시보드(`/exercise`), 도시별 상세 페이지(`/exercise/weather/:cityId`), 서비스 소개 페이지(`/exercise/about`) 라우팅을 구현한다.

### 2. 💻 레퍼런스 코드 구조 (`WeatherHomeView.vue.beforeAxios` & `WeatherDetailView.vue.beforeAxios`)

- `router.push('/weather/' + id)`를 통한 동적 파라미터 점프 및 `:cityId` 라우터 파라미터 읽기.

### 3. 🛠️ 내가 직접 적용한 코드 및 리팩토링 ([`router/index.js`](file:///Users/wonjong/workspace/day8/projects/skala-vue/src/router/index.js))

- `/exercise` 라우트 하위에 중첩 라우트(Children) 등록.
- **[`WeatherDetailView.vue`](file:///Users/wonjong/workspace/day8/projects/skala-vue/src/views/weather/WeatherDetailView.vue)**: `route.params.cityId`로 이동 시 상세 관측 지표(기온, 체감온도, 습도, 풍속, 위경도) 카드 출력.

### 4. 🔥 추가 디벨롭 & 커스터마이징 (Development)

- **주소창 쿼리 스트링 (`?search=`) 양방향 동기화**:
  - 검색어 타이핑 시 `router.push({ query: { search: newQuery } })` 실행.
  - 외부에서 URL을 그대로 복사해 접속해도 검색어와 필터링 목록이 100% 복원되도록 마운트 시 쿼리 복원.
- **404 예외 페이지 ([`NotFoundView.vue`](file:///Users/wonjong/workspace/day8/projects/skala-vue/src/views/weather/NotFoundView.vue)) 연결**:
  - 유효하지 않은 경로 접속 시 모던 예외 안내 카드 표출.

---

## 🌐 Exercise 5. OpenWeatherMap API & Pinia 전역 스토어 연동

### 1. 📌 교재 및 레퍼런스 원본 요구사항

- 가짜 Mock 데이터 대신 실제 OpenWeatherMap 외부 API를 연동한다.
- Pinia 상태 관리 스토어를 도입하여 전역 상태 및 API 통신을 관리한다.
- `.env` (또는 `import.meta.env`)를 통해 API Key를 환경 변수로 안전하게 관리한다.

### 2. 💻 레퍼런스 코드 구조 (`WeatherHomeView.vue.afterAxios` & `WeatherDetailView.vue.afterAxios`)

- OpenWeatherMap API (`https://api.openweathermap.org/data/2.5/weather`) 연동.
- `Promise.all` 기반 병렬 호출 및 `cityMapping` 활용.

### 3. 🛠️ 내가 직접 적용한 코드 및 리팩토링

- **`.env` 연동**: `VITE_OPEN_WEATHER_API` 키를 통해 Vite 환경 변수로 API Key 보안 관리.
- **Pinia 전역 스토어 ([`exerciseWeatherStore.js`](file:///Users/wonjong/workspace/day8/projects/skala-vue/src/stores/exerciseWeatherStore.js)) 구축**:
  - `weatherList`, `lastFetchTime`, `detailCacheMap` 전역 보존.

---

## 🔥 킬러 커스터마이징 & 고급 아키텍처 요약

### 1. 영문 도시명 쿼리 (`loc_01` ~ `loc_05`) 매핑

- 대한민국 5개 관측 도시(`loc_01` 서울, `loc_02` 울산, `loc_03` 부산, `loc_04` 수원, `loc_05` 제주) ID 규격을 통일하고 OpenWeatherMap 영문 도시명 `q` 쿼리로 실시간 병렬 호출.

### 2. 클라이언트 수신 시각(`fetchedAt`) 기준 10분 TTL 타임스탬프 캐싱

- OpenWeatherMap API의 `dt`는 서버 관측 시각이므로 클라이언트 통신 성공 시각(`nowSec = Math.floor(Date.now() / 1000)`)을 `lastFetchTime`에 저장.
- $$
  \text{현재시간(nowSec)} - \text{앱수신시각(lastFetchTime)} < 600\text{초(10분)}
  $$
- 10분 이내 방문 시 **API 호출 100% 스킵** 및 Pinia 스토어 캐시 데이터 즉시 리턴.

### 3. 상세페이지 도시별 독립 캐싱 (`detailCacheMap`)

- `detailCacheMap[cityId]` 객체를 통해 도시별 수신 시각(`fetchedAt`)을 독립적으로 관리하여 도시별 10분 수명 주기(TTL) 적용.

### 4. 모바일 RWD 하단 고정 탭바 (`Bottom Navigation Bar`)

- 768px 이하 모바일 화면 시 최하단 고정 탭바(`🌦️ 날씨 앱`, `📚 실습`, `📝 과제`) 제공 및 하단 여백 보장.

### 5. 전 화면 서브바 커스텀 팝오버 드롭다운

* **개선**: 기존 데스크탑 가로 버튼 바를 제거하고, 데스크탑/모바일 구분 없이 **전 화면 우측 상단 플로팅 글래스모피즘 팝오버 드롭다운** 단일 구조로 통일.
* **효과**: 화면 너비 변화에 따른 버튼 겹침 및 UI 이질감을 완벽히 해소하고, 선택 시 드롭다운 팝오버(터치 높이 `38px`)가 우측 아래로 깔끔하게 펼쳐짐.

### 6. Clean Architecture 모듈화 (App.vue 경량화)

- `App.vue` 내 네비바를 **[`AppNavbar.vue`](file:///Users/wonjong/workspace/day8/projects/skala-vue/src/components/AppNavbar.vue)** 및 **[`navbar.css`](file:///Users/wonjong/workspace/day8/projects/skala-vue/src/assets/navbar.css)**로 모듈화하여 `App.vue`를 **384줄 $\rightarrow$ 83줄**로 대폭 경량화.
