# 📚 PracticeApp (실습 4종 46개 컴포넌트) 종합 보고서

`skala-vue` 프로젝트의 교재 실습 컴포넌트(**Basic**, **Component**, **Composition**, **Library** 총 4개 영역 46개 컴포넌트)의 요구사항, 구현 내역 및 기술 명세를 디테일하게 정리한 보고서입니다.

---

## 📌 목차 (Table of Contents)

1. [📖 1. Basic Directives & Events (기초 23개 컴포넌트)](#-1-basic-directives--events-기초-23개-컴포넌트)
2. [🧩 2. Component & Lifecycle (컴포넌트 & 생명주기 10개 컴포넌트)](#-2-component--lifecycle-컴포넌트--생명주기-10개-컴포넌트)
3. [⚙️ 3. Composition API (반응형 상태 & 감시자 8개 컴포넌트)](#-3-composition-api-반응형-상태--감시자-8개-컴포넌트)
4. [📚 4. Library & Async (외부 라이브러리 & 비동기 5개 컴포넌트)](#-4-library--async-외부-라이브러리--비동기-5개-컴포넌트)
5. [🛠️ 전역 실습 프레임워크 & UX 커스터마이징](#-전역-실습-프레임워크--ux-커스터마이징)

---

## 📖 1. Basic Directives & Events (기초 23개 컴포넌트)

| 컴포넌트 파일 | 핵심 구현 내용 및 설명 |
|---|---|
| **SampleOne.vue** | `ref` 반응형 상태 생성 및 일반 변수(`let`)의 화면 갱신 차이 비교 |
| **SampleTwo.vue** | `{{ }}` Mustache 보간법 속에서 자바스크립트 표현식 동적 실행 |
| **VText.vue** | `v-text` 속성 바인딩 방식과 `{{ }}` 보간법 비교 및 자식 노드 덮어쓰기 현상 검증 |
| **VHtml.vue** | `v-html`을 활용한 원시 HTML 태그 스트링 동적 파싱 렌더링 |
| **VHtmlXSS.vue** | `v-html` 사용 시 발생할 수 있는 XSS (Cross-Site Scripting) 공격 위험성 예시 |
| **VBindBasic.vue** | `v-bind` 동적 링크, 이미지 `src`, 버튼 `disabled` 상태 동적 토글 |
| **VBindClassBinding.vue** | 객체 구문(`{ active: isActive }`) 및 배열 구문 기반 동적 CSS 클래스 적용 |
| **VBindStyleBinding.vue** | Range 슬라이더와 연동하여 동적 인라인 스타일(`color`, `width`, `borderRadius`) 조절 |
| **VBindShortHand.vue** | `v-bind` 축약 콜론(`:`) 및 Vue 3.4+ Same-name shorthand (`:id`, `:src`) 적용 |
| **VCondition.vue** | `v-if` / `v-else-if` / `v-else` 점수 슬라이더(0~100점) 학점(A~F) 조건부 UI |
| **VShow.vue** | `v-show` CSS `display: none` 기반 가시성 토글 및 `v-if` DOM 생성 차이 비교 |
| **VFor.vue** | `v-for` 배열/객체 순회 렌더링 (`:key` 필수 바인딩) 및 동적 추가(`push`), 삭제(`splice`) |
| **VPre.vue** | `v-pre`를 통한 Vue 컴파일 스킵 및 템플릿 원문(`{{ raw }}`) 노출 |
| **VCloak.vue** | `[v-cloak] { display: none; }` CSS와 연동하여 초기 템플릿 깜빡임(FOUC) 방지 |
| **VOnce.vue** | `v-once`를 활용하여 최초 1회만 렌더링 후 반응형 업데이트 차단 |
| **VMemo.vue** | `v-memo` 의존성 배열에 따른 조건부 컴포넌트 재렌더링 성능 최적화 |
| **VOnEvent.vue** | `v-on` / `@click` 인라인 증감 연산 및 스크립트 메서드 호출 |
| **EventObject.vue** | `` 클릭 좌표(`clientX/Y`) 및 `@mousemove` 실시간 마우스 X, Y 좌표 추적 |
| **EventModifier.vue** | `@click.prevent` (기본 동작 차단) 및 `@click.stop` (버블링 차단) 비교 |
| **VModel.vue** | `v-model` 양방향 바인딩 및 원리(`:value` + `@input`) 수동 구현 및 IME 조합 지연 검증 |
| **VModelForm.vue** | `textarea`, 단일/다중 `checkbox`, `radio`, `select` 폼 요소 양방향 매핑 및 JSON 프리뷰 |
| **VModelModifier.vue** | `v-model` 수식어 `.lazy`, `.number`, `.trim` 및 체이닝과 `typeof` 타입 비교 |
| **VStyle.vue** | Component Scoped CSS의 캡슐화 특성 및 외부 CSS 오버라이딩 비교 |

---

## 🧩 2. Component & Lifecycle (컴포넌트 & 생명주기 10개 컴포넌트)

부모-자식 데이터 통신, 프레임워크 템플릿 주입(`slot`), 생명주기 훅(`Lifecycle`)을 탐구하는 영역입니다.

### 1. LifecycleParent.vue / LifecycleChild.vue
- **핵심 목표**: Vue 3 컴포넌트의 생성, 마운트, 업데이트, 언마운트 생명주기 훅을 검증.
- **주요 훅**: `onBeforeMount`, `onMounted`, `onBeforeUpdate`, `onUpdated`, `onBeforeUnmount`, `onUnmounted`.
- **기술 명세**: 토글 버튼으로 자식 컴포넌트 생성/파괴 시 콘솔 및 타임라인 상태 추적.

### 2. PropsEmitsParent.vue / PropsEmitsChild.vue
- **핵심 목표**: 부모 -> 자식 단방향 데이터 전달(`props`) 및 자식 -> 부모 Custom Event 발신(`emits`).
- **기술 명세**: `defineProps({ title: String, count: Number })`, `defineEmits(['increaseCount', 'resetCount'])` 구사.

### 3. SlotDefaultParent.vue / SlotDefaultChild.vue
- **핵심 목표**: 컴포넌트 기본 슬롯(`<slot />`)을 활용한 템플릿 콘텐츠 주입.
- **기술 명세**: 자식 컴포넌트 껍데기 레이아웃 내부에 부모의 텍스트 및 버튼 요소를 주입 렌더링.

### 4. SlotNamedParent.vue / SlotNamedChild.vue
- **핵심 목표**: 이름 있는 슬롯(`<slot name="header">`, `<slot name="footer">`) 다중 영역 분할 주입.
- **기술 명세**: 부모에서 `<template #header>`, `<template #default>`, `<template #footer>` v-slot 구문 사용.

### 5. SlotScopedParent.vue / SlotScopedChild.vue
- **핵심 목표**: 범위 지정 슬롯(Scoped Slot)을 통해 자식 컴포넌트 내부 데이터를 부모 템플릿으로 역전 전달.
- **기술 명세**: 자식에서 `<slot :item="item" :index="index">` 바인딩, 부모에서 `<template #default="{ item, index }">`로 데이터 바인딩.

---

## ⚙️ 3. Composition API (반응형 상태 & 감시자 8개 컴포넌트)

Vue 3 Composition API 핵심 반응형 프리미티브(`ref`, `reactive`, `computed`, `watch`, `watchEffect`)를 학습합니다.

### 1. ReactiveRef.vue
- **기술 명세**: `ref()` 단일 반응형 원시값(Primitive Value) 생성, `.value` 접근 및 템플릿 자동 언랩핑(Unwrapping) 검증.

### 2. ReactiveReactive.vue
- **기술 명세**: `reactive()` 객체/배열 깊은 반응형(Deep Reactivity) 상태 관리 및 객체 덮어쓰기 시 반응성 유실 주의사항 실습.

### 3. ComputedBasic.vue
- **기술 명세**: `computed()` 계산된 반응형 게터 속성. 종속성이 변경될 때만 재계산되는 캐싱(Caching) 특성을 메서드 호출과 비교.

### 4. WatcherBasic.vue
- **기술 명세**: `watch(source, callback)` 단일 `ref` 감시. 이전 값(`oldVal`)과 새로운 값(`newVal`) 추적.

### 5. WatcherMulti.vue
- **기술 명세**: `watch([refA, refB], ([newA, newB], [oldA, oldB]) => ...)` 다중 반응형 상태 배열 일괄 감시.

### 6. WatcherReactive.vue
- **기술 명세**: `reactive` 객체의 특정 프로퍼티 감시 시 화살표 함수 `watch(() => state.count, ...)` 래핑 구문 적용.

### 7. WatcherDeep.vue
- **기술 명세**: 중첩 객체 내부 변경 인지를 위한 `watch(target, callback, { deep: true, immediate: true })` 옵션 구사.

### 8. WatcherEffect.vue
- **기술 명세**: `watchEffect()`를 사용한 자동 의존성 수집 및 컴포넌트 생성 즉시 바인딩 실행.

---

## 📚 4. Library & Async (외부 라이브러리 & 비동기 5개 컴포넌트)

외부 비동기 통신(Axios), 상태 관리(Pinia), ES6+ 현대 문법, UI 라이브러리(Element Plus)를 다룹니다.

### 1. AxiosJson.vue
- **기술 명세**: `axios.get`, `post`, `put`, `delete` 메소드를 사용해 JSONPlaceholder Mock REST API CRUD 비동기 통신 구현.

### 2. AxiosWeather.vue
- **기술 명세**: OpenWeatherMap API(`https://api.openweathermap.org/data/2.5/weather`) 연동, `Promise.all` 및 `try-catch-finally` 로딩 처리.

### 3. EcmaScript.vue
- **기술 명세**: ES6+ 필수 현대 자바스크립트 문법(구조 분해 할당, Spread 연산자, 화살표 함수, Promise, `async/await`) 동적 실습.

### 4. ElementPlus.vue
- **기술 명세**: Element Plus Component Library 연동 (`el-button`, `el-table`, `el-dialog`, `el-tag` 모던 UI 대시보드).

### 5. StoreCounter.vue
- **기술 명세**: Pinia Setup Store (`defineStore('counter', ...)`) 기반 전역 카운터 상태 및 액션 연동.

---

## 🛠️ 전역 실습 프레임워크 & UX 커스터마이징

1. **동적 컴포넌트 자동 로딩 (`import.meta.glob`)**:
   - `PracticeApp.vue`에서 Vite의 `import.meta.glob('./components/practices/**/*.vue')`를 도입해 파일 시스템 기반 4개 영역 자동 바인딩.
2. **우측 하단 팝오버 드롭다운 서브바**:
   - 모바일(<= 768px) 접속 시 상단 서브탭 버튼들이 비좁아지는 문제를 해결하기 위해 우측 글래스모피즘 커스텀 팝오버 드롭다운으로 자동 변환.
3. **통일된 모던 카드 UI**:
   - 모든 실습 컴포넌트 상단에 **개념 설명 카드** 및 **구분선(`hr`)**을 공통 배치하여 단독 실행 시에도 개념을 즉시 이해하도록 구축.
