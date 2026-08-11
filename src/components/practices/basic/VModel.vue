<script setup>
import { ref } from 'vue'

const text1 = ref('')
const text2 = ref('')
</script>

<template>
  <div class="practice-section">
    <h2>v-model 양방향 데이터 바인딩</h2>
    <p>v-model: 폼 입력 요소와 반응형 상태 간의 양방향 데이터 바인딩</p>

    <hr />

    <div style="background: #f8fafc; padding: 12px; border-radius: 6px; margin-bottom: 16px;">
      <p><strong>v-model의 2가지 동작 원리 (:value + @input 수동 바인딩):</strong></p>
      <p>1. JS -> 화면: :value 속성을 통해 상태 값을 입력창에 전달 (단방향)</p>
      <p>2. 화면 -> JS: @input 이벤트를 통해 입력된 $event.target.value 값을 상태에 반영</p>
      <p>3. 한글 입력 차이: v-model은 조합 완료 후 갱신되지만, @input은 자음/모음 단위로 즉시 갱신됨</p>
    </div>

    <h3>1) v-model 축약 문법 (양방향)</h3>
    <input type="text" v-model="text1" placeholder="여기에 입력하세요" />
    <p>
      입력된 값: <strong>{{ text1 }}</strong>
    </p>

    <br />

    <h3>2) v-model의 내부 작동 원리 (:value + @input)</h3>
    <input type="text" :value="text2" @input="(e) => (text2 = e.target.value)" placeholder="원리 파악용 입력창" />
    <p>
      입력된 값: <strong>{{ text2 }}</strong>
    </p>
  </div>
</template>
