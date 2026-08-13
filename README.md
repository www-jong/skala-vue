# 🚀 SKALA Vue.js 실습 & Customization 과제 제출

> Vue 3 + Vite 기반 프론트엔드 실습 프로젝트. 메인 날씨 대시보드, OpenWeatherMap API 연동, Pinia 10분 TTL 캐싱, 모바일 하단 탭바/드롭다운 RWD 및 실습/과제 모듈화 구현 내역 정리.

---

## 📌 과제 제출 정보

- **소스코드 저장소**: GitHub Public Repository (`https://github.com/사용자계정/skala-vue`)
- **배포 주소**: Vercel / Netlify / GitHub Pages 배포 링크

### 제출 전 확인 사항 (Chrome Secret Mode)
- 브라우저 시크릿 창(macOS: `Cmd + Shift + N`) 접속 시 로그인 요구 없이 소스코드가 정상 작동하는지 더블 체크 완료.

---

## 📂 상세 문서 목차 (Documentation Index)

상세 구현 및 커스터마이징 내역은 아래 각 가이드 문서 링크를 통해 확인하실 수 있습니다.

- 📚 [**PracticeApp (실습) 상세 가이드 바로가기**](docs/PRACTICE.md)
  - Chapter 1 (템플릿 바인딩/디렉티브 16종) & Chapter 2 (이벤트/폼 바인딩/수식어 7종) 전체 실습 내역
- 📝 [**ExerciseApp (과제) 상세 가이드 바로가기**](docs/EXERCISE.md)
  - 과제 1~5 구현, OpenWeatherMap API 영문 쿼리, Pinia 10분 TTL 타임스탬프 캐싱, 모바일 하단 탭바 & 커스텀 드롭다운 RWD

---

## 🛠 주요 전역 특징 (Core Highlights)

1. **전역 라이트/다크모드 3D 스위처**
   - `AppNavbar.vue` 내 토글 버튼으로 전역 `html.dark` 클래스 제어 및 CSS 글래스모피즘 테마 연동.
2. **Pinia 전역 스토어 & 10분 TTL 캐싱 (`exerciseWeatherStore.js`)**
   - 프론트엔드 수신 시각(`fetchedAt`) 기준 10분(600초) 이내 재방문 시 API 호출을 스킵하여 성능 및 API 쿼터 최적화.
3. **반응형 웹 디자인 (RWD) & 모바일 전용 UX**
   - 모바일(<= 768px) 전용 하단 고정 탭바(`Bottom Navigation Bar`) 및 우측 하단 팝오버 드롭다운 서브바 적용.
4. **Clean Code & 컴포넌트 모듈화**
   - `App.vue` 내 네비게이션을 `AppNavbar.vue` 및 `navbar.css`로 분리하여 대폭 경량화.

---

## ⚙️ 프로젝트 실행 및 빌드

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드 및 검증
npm run build
```
