# 🎨 독창적 UI/UX & 기술 고도화 (Customizations & Architectural Excellence)

`skala-vue` 실시간 기상 관측 대시보드 프로젝트에 적용된 **3D CesiumJS 실사 지구본 배경**, **글래스모피즘 테마 시스템**, **Pinia 10분 TTL 클라이언트 캐싱**, **모바일 하단 터치 UX** 및 **한글 IME 정규식 예외 방어** 등 고급 커스터마이징 내역을 상세 정리한 문서입니다.

---

## 📌 목차

1. [🌍 CesiumJS 기반 3D 실사 위성 지구본 배경](#1--cesiumjs-기반-3d-실사-위성-지구본-배경)
2. [💎 Glassmorphism UI &amp; 전역 3D 다크모드](#2--glassmorphism-ui--전역-3d-다크모드)
3. [⚡ Pinia 클라이언트 10분 TTL 타임스탬프 캐싱](#3--pinia-클라이언트-10분-ttl-타임스탬프-캐싱)
4. [📱 모바일 반응형 (RWD) &amp; 하단 터치 UI 보정](#4--모바일-반응형-rwd--하단-터치-ui-보정)
5. [🛡️ 한글 IME 조합 및 온도의 5단계 배지 시스템](#5--한글-ime-조합-및-온도의-5단계-배지-시스템)
6. [🧩 3단 고성능 WeatherCard 레이아웃 구조](#6--3단-고성능-weathercard-레이아웃-구조)

---

## 1. 🌍 CesiumJS 기반 3D 실사 위성 지구본 배경

### 🚀 도입 목적

기존의 평면 지도나 카드 텍스트 UI를 넘어서, 사용자가 관측 도시를 클릭하거나 검색할 때 3D 지구본 카메라가 해당 도시의 위·경도 고도로 2.2초 동안 매끄럽게 비행(`flyTo`)하는 몰입형 기상 관측 경험을 제공합니다.

### 🛠️ 핵심 구현 기술 스펙 (`Main3DGlobeBackground.vue`)

- **ArcGIS HD World Imagery**: ArcGIS 실사 위성 지도 타일 맵 연동 (`ArcGisMapServerImageryProvider`).
- **Canvas 텍스트 아이콘 렌더링**:
  - 기존 핀 아이콘 대신 관측 도시의 **실시간 온도(°C)**를 캔버스 레이어로 렌더링하여 지구 위에 표시 (`createTempLabelCanvas`).
  - 온도 구간별 색상 구분 (30°C↑ 🔴, 25°C↑ 🟠, 18°C↑ 🟢, 10°C↑ 🔵, 10°C↓ 🟣).
- **자동 유휴 자전 (Idle Orbit Rotation)**:
  - 사용자 인터랙션(마우스/터치/휠)이 3초간 없을 경우, `Cesium.Cartesian3.UNIT_Z` 축을 중심으로 지구본이 자연스럽게 자전 회전.
- **줌 제한 (Zoom Boundary Control)**:
  - 과도한 줌아웃으로 지구가 픽셀화되는 것을 방지하기 위해 `minimumZoomDistance = 12000` 및 `maximumZoomDistance = 8500000` (8,500km) 제한 설정.

```js
// Main3DGlobeBackground.vue 스니펫: 온도 캔버스 아이콘 렌더링
function createTempLabelCanvas(temp, name, isStar = false) {
  const tempStr = temp !== null && temp !== undefined ? `${Math.round(temp)}°` : "?°"
  const parts = (name || "").trim().split(" ")
  const line1 = parts.length > 1 ? parts.slice(0, -1).join(" ") : parts[0]
  const line2 = parts.length > 1 ? parts[parts.length - 1] : ""

  const canvas = document.createElement("canvas")
  canvas.width = 240
  canvas.height = line2 ? 100 : 80
  const ctx = canvas.getContext("2d")
  // 6겹 테두리 그림자 렌더링 후 실사 글씨 표출...
  return canvas
}
```

---

## 2. 💎 Glassmorphism UI & 전역 3D 다크모드

### 🎨 디자인 철학

- **Glassmorphic Depth**: `backdrop-filter: blur(16px)`와 `rgba(255, 255, 255, 0.82)` 반투명 글래스 카드를 통해 뒷 배경의 3D 지구본이 입체적으로 비쳐 보이도록 설계.
- **전역 라이트/다크모드 스위처**:
  - `html.dark` 상태에 따라 배경 투명도, 텍스트 대비, 그라데이션 테두리 및 뱃지 색상이 실시간으로 동기화.

---

## 3. ⚡ Pinia 클라이언트 10분 TTL 타임스탬프 캐싱

### 💡 문제 상황 및 해결

공공/외부 날씨 API는 잦은 호출 시 API 쿼터 초과나 서버 리소스 낭비가 발생합니다.

### 🛠️ 구현 방식 (`exerciseWeatherStore.js` / `weatherStore.js`)

- 수신 성공 시점의 UNIX 타임스탬프(`fetchedAt = Math.floor(Date.now() / 1000)`)를 저장.
- 재요청 시 **10분(600초) 이내** 재방문인 경우 네트워크 API 호출을 **100% 스킵**하고 Pinia 메모리 캐시를 리턴.

```js
const nowSec = Math.floor(Date.now() / 1000)
const TEN_MIN_SEC = 10 * 60 // 600초

if (weatherList.value.length > 0 && nowSec - lastFetchTime.value < TEN_MIN_SEC && !force) {
  console.log("⚡ [Pinia 캐시 유효] 10분 이내 수신 데이터 활용 (API 호출 스킵)")
  return weatherList.value
}
```

---

## 4. 📱 모바일 반응형 (RWD) & 하단 터치 UI 보정

### 📱 터치 최적화 & Safe Area 대응

- **iOS / Android Safe Area**:
  - `index.html`에 `<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />` 적용.
  - 하단 탐색 버튼 위치에 `bottom: max(80px, calc(16px + env(safe-area-inset-bottom, 0px))) !important`를 부여하여 모바일 주소창이나 홈 인디케이터 바에 버튼이 가려지는 현상 완전 차단.
- **모바일 핀치 줌 / 터치 조작**:
  - `touch-action: manipulation` 및 `viewer.scene.screenSpaceCameraController.enableInputs = true`로 모바일 상에서도 3D 지구본 핀치 줌 및 터치 드래그 회전을 원활하게 처리.

---

## 5. 🛡️ 한글 IME 조합 및 온도의 5단계 배지 시스템

### 🔤 한글 IME 방어

- 한글 자음/모음(예: `ㄱ`, `ㅏ`) 입력 도중 검색 결과가 사라지는 UX 결함을 방지하기 위해 `/^[ㄱ-ㅎㅏ-ㅣ]$/` 정규식 분기 추가.

### 🌡️ 5단계 온도 배지 시스템

1. 🔥 **폭염** (30°C 이상): `#fee2e2` / `#dc2626`
2. ☀️ **더움** (25°C 이상): `#ffedd5` / `#ea580c`
3. 🌿 **쾌적** (18°C 이상): `#dcfce7` / `#16a34a`
4. 🧥 **쌀쌀** (10°C 이상): `#e0f2fe` / `#0284c7`
5. ❄️ **한파** (10°C 미만): `#f1f5f9` / `#475569`

---

## 6. 🧩 3단 고성능 WeatherCard 레이아웃 구조

- **TOP ROW**: 국가 뱃지 + 관측 도시명 (좌) / 즐겨찾기 핀 + 상세보기 버튼 (우)
- **MID ROW**: 기온 & 체감온도 (좌) / 5단계 온도 배지 & 날씨 상태 (우)
- **BOTTOM ROW**: 대기 습도 + 풍속 메트릭 바
- `word-break: keep-all`로 좁은 사이드바 너비에서도 한글 단어 단위가 자르지 않고 깔끔하게 표출.
