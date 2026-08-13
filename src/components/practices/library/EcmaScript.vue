<script setup>
import { ref } from 'vue'

// 실시간 화면 출력을 위한 Vue 상태값 (수정 금지)
const result1 = ref('')
const result2 = ref('')
const result3 = ref('')

const runTask1 = () => {
  const members = ['김수원', '이서울', '박부산', '최대전']
  const rawData = { id: 101, grade: 'VIP', details: { score: 95 } }

  // 1. members 배열에 '박부산'이 포함되어 있는지 includes()로 검증
  const isIncludePark = members.includes('박부산')

  // 2. rawData 객체에서 grade와 details 내의 score를 한 줄 심층 비구조화 할당으로 추출
  const { grade, details: { score } } = rawData

  // 3. 템플릿 리터럴(Template Literal)을 활용하여 문자열 바인딩 주입
  result1.value = `부산 포함 여부: ${isIncludePark} / 등급: ${grade} / 점수: ${score}점`
}

const runTask2 = () => {
  const currentCart = ['Apple', 'Banana']
  const newProduct = { name: 'Orange', stock: 0, preview: null }

  // 1. 스프레드 연산자(...)를 활용하여 currentCart 배열 뒤에 newProduct.name 결합
  const updatedCart = [...currentCart, newProduct.name]

  // 2. 옵셔널 체이닝(?.)과 널 병합 연산자(??) 연쇄 활용하여 preview가 null/undefined 시 대체 문자열 할당
  const imgStatus = newProduct?.preview ?? '이미지 준비중'

  // 3. 널 병합 연산자(??)를 사용하여 stock이 0일 때 0을 안전하게 보존 (|| 사용 시 0이 falsy 처리됨)
  const finalStock = newProduct.stock ?? 10

  // 4. 템플릿 리터럴 바인딩 출력
  result2.value = `카트: ${updatedCart.join(', ')} / 이미지: ${imgStatus} / 수량: ${finalStock}개`
}

// =================================================================
// 📝 [과제 3] 서버 연쇄 데이터 요청 및 에러 통합 제어 (Async/Await)
// =================================================================
// 가상의 백엔드 API (수정 금지 - Promise 반환형 화살표 함수)
const fetchUserId = () => new Promise((res) => setTimeout(() => res({ uid: 777 }), 400))
const fetchUserProfile = (uid) => new Promise((res) => setTimeout(() => res({ uid, nick: 'Graves' }), 400))

const runTask3 = async () => {
  result3.value = '⏳ 데이터 동기화 중...'

  // 1. try-catch 비동기 예외 처리 네트워크 방어망 구축
  try {
    // 2. 1차 await 비동기 호출 및 uid 비구조화 할당 추출
    const { uid } = await fetchUserId()

    // 3. 2차 연쇄 await 비동기 호출 및 nick 비구조화 할당 추출
    const { nick } = await fetchUserProfile(uid)

    // 4. 정상 완료 시 메시지 주입
    result3.value = `동기화 성공: ${nick}님 환영합니다.`
  } catch (error) {
    // 에러 발생 시 예외 메시지 주입
    result3.value = '통신 실패'
    console.log(error)
  }
}
</script>

<template>
  <div class="practice-section">
    <h2>🎯 Modern JavaScript (ES6+) 실무 검증 과제룸</h2>

    <div class="card">
      <h3>과제 1. 데이터 추출 및 포맷팅</h3>
      <button @click="runTask1">과제 1 가동</button>
      <div class="console">결과창 1: {{ result1 }}</div>
    </div>

    <div class="card">
      <h3>과제 2. 불변성 복사 및 데이터 방어</h3>
      <button @click="runTask2">과제 2 가동</button>
      <div class="console">결과창 2: {{ result2 }}</div>
    </div>

    <div class="card">
      <h3>과제 3. 비동기 연쇄 파이프라인 (Async/Await)</h3>
      <button @click="runTask3">과제 3 가동</button>
      <div class="console">결과창 3: {{ result3 }}</div>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: #f8fafc;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.card h3 {
  color: #1e293b;
  margin-top: 0;
  margin-bottom: 12px;
}

button {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s ease;
}

button:hover {
  background: #2563eb;
}

.console {
  background: #0f172a;
  color: #4ade80;
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 12px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 14px;
  line-height: 1.5;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
}

html.dark .card {
  background: #1e293b !important;
  border-color: #334155 !important;
  color: #f8fafc !important;
}

html.dark .card h3 {
  color: #f8fafc !important;
}
</style>
