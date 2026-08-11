# 🚀 SKALA Vue.js 실습 & Customization 과제 제출

> Vue 3 + Vite 기반 프론트엔드 실습 프로젝트. 교재 기본 예시 학습, 개념 설명문 구축 및 전 실습 컴포넌트 Customization 구현 내역 정리.

---

## 📌 과제 제출 정보

- **소스코드 저장소**: GitHub Public Repository (`https://github.com/사용자계정/skala-vue`)
- **배포 주소**: Vercel / Netlify / GitHub Pages 배포 링크

### 제출 전 확인 사항 (Chrome Secret Mode)
- 브라우저 시크릿 창(macOS: `Cmd + Shift + N`) 접속 시 로그인 요구 없이 소스코드가 정상 작동하는지 더블 체크 완료.

---

## 🛠 전역 Customization 및 개선 사항

- **전역 다크모드 / 라이트모드 스위처**
  - `App.vue` 내 토글 버튼으로 전역 `html.dark` 클래스 제어
  - `base.css` OS 미디어 쿼리 간섭 해제 및 전역 CSS 테마 연동
- **동적 컴포넌트 자동 로딩 (`import.meta.glob`) & 챕터 분리**
  - 수동 `import` 제거 ➡️ `import.meta.glob('./components/practices/basic/*.vue', { eager: true })` 사용
  - 파일명 기준 챕터 1(바인딩 기초) / 챕터 2(이벤트 및 폼 제어) 그룹핑 렌더링
- **모던 UI 카드 레이아웃 & 튜토리얼 공통 구조**
  - 전 컴포넌트 상단에 **개념 설명문** 및 **구분선(`hr`)** 공통 배치
  - 주석 및 무분별한 이모티콘을 제거하고 모던 반응형 카드 스타일(`.practice-section`)로 정돈

---

## 📚 챕터별 실습 & Customization 상세 내역

## Chapter 1. Vue 기초 & 템플릿 바인딩

### SampleOne.vue (카운터 기초)
- `ref` 반응형 상태 생성 및 일반 변수(`let`)와의 실시간 화면 갱신 차이 비교.

### SampleTwo.vue (보간법 기초)
- `{{ }}` 템플릿 안에서 자바스크립트 표현식 (`toUpperCase()`, `Math.random()`) 동적 실행.

### VText.vue (v-text 디렉티브)
- `v-text` 속성 바인딩 방식과 `{{ }}` 템플릿 보간법 출력 결과 비교.

### VHtml.vue (v-html 디렉티브)
- `v-html`을 활용한 원시 HTML 태그 동적 파싱 렌더링.

### VHtmlXSS.vue (v-html 보안 이슈)
- `v-html` 사용 시 악성 스크립트 주입(XSS) 공격 위험성 검증 예시.

### VBindBasic.vue (v-bind 기초)
- `v-bind` 동적 링크(`github`), 이미지 `src`, 버튼 활성/비활성(`disabled`) 토글 기능 구현.

### VBindClassBinding.vue (클래스 바인딩)
- 객체 구문(`{ active: isActive }`) 및 배열 구문 기반 동적 CSS 클래스 적용.
- `@click`과 연동된 회전/이동 애니메이션(`moving-text`) 클래스 바인딩.

### VBindStyleBinding.vue (스타일 바인딩)
- 동적 인라인 스타일(`color`, `fontSize`) 조절.
- 슬라이더(`range`) 기반 박스 가로 크기(`boxWidth`) 및 모서리 둥글기(`borderRadius`) 실시간 조절.

### VBindShortHand.vue (v-bind 단축 문법)
- `v-bind` 축약형 콜론(`:`) 및 Vue 3.4+ 동일 이름 변수 바인딩(`:id`, `:src`, `:alt`).
- 슬라이더 기반 이미지 크기 조절 연동.

### VCondition.vue (조건부 렌더링)
- `v-if` / `v-else-if` / `v-else` 로그인 토글 및 슬라이더 기반 성적 학점 조건문 구현.

### VShow.vue (v-show 디렉티브)
- `v-show` CSS `display: none` 기반 가시성 토글 (`v-if`와 DOM 트리의 차이점 비교).

### VFor.vue (v-for 디렉티브)
- 배열 및 객체 순회 렌더링 (`:key` 필수 바인딩).
- `input` 입력을 통한 배열 요소 동적 추가(`push`) 실습.

### VPre.vue (v-pre 디렉티브)
- `v-pre`를 통한 Vue 컴파일 스킵 (템플릿 문법 원문 그대로 출력).

### VCloak.vue (v-cloak 디렉티브)
- `[v-cloak] { display: none; }` CSS와 연동하여 초기 템플릿 깜빡임(FOUC) 방지.

### VOnce.vue (v-once 디렉티브)
- `v-once`를 활용하여 최초 1회만 렌더링 후 반응형 업데이트 차단.

### VMemo.vue (v-memo 디렉티브)
- `v-memo` 의존성 배열에 따른 컴포넌트 재렌더링 성능 최적화.

---

## Chapter 2. 이벤트 핸들링, 폼 바인딩 & 스타일링

### VOnEvent.vue (v-on 클릭 이벤트)
- `@click` 인라인 증감 연산 및 스크립트 함수 호출.

### EventObject.vue ($event 이벤트 객체)
- `$event` 클릭 좌표(`clientX/Y`) 및 태그명(`target.tagName`) 추출.
- `@mousemove` 이벤트를 활용한 실시간 마우스 좌표 추적 박스 구현.

### EventModifier.vue (이벤트 수식어)
- `@click.prevent` (기본 동작 차단) 및 `@click.stop` (이벤트 버블링 차단) 비교 제어.

### VModel.vue (v-model 양방향 바인딩)
- `v-model` 양방향 바인딩 및 내부 원리(`:value` + `@input`) 수동 구현 비교.
- 한글 IME 조합 및 동작 원리 카드 내 상세 안내문 제공.

### VModelForm.vue (HTML Form 바인딩)
- `textarea`, 단일/다중 `checkbox`, `radio`, `select` 드롭다운 전체 폼 요소 양방향 매핑.

### VModelModifier.vue (v-model 수식어)
- `v-model` 수식어 `.lazy`, `.number`, `.trim` 및 체이닝(`.trim.number`) 실습.

### VStyle.vue (Scoped 스타일 및 외부 CSS)
- Scoped 스타일 및 `@import` 외부 CSS 모듈(`challenge.css`) 연동.
- 외부 클래스 덮어쓰기 오버라이딩 적용.

---

## ⚙️ 프로젝트 실행 및 빌드

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```
