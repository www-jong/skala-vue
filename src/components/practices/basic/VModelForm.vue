<script setup>
import { ref } from 'vue'

const comment = ref('')
const isAgreed = ref(false)
const favoriteFruits = ref([])
const gender = ref('')
const selectedCar = ref('')
</script>

<template>
  <div class="practice-section">
    <h2>모든 HTML Form 요소와 v-model 매핑</h2>
    <p>v-model 폼 매핑: textarea, 단일/다중 checkbox, radio, select 드롭다운과의 양방향 바인딩</p>

    <hr />

    <div>
      <h3>1) Textarea (장문 텍스트)</h3>
      <textarea v-model="comment" placeholder="의견을 남겨주세요"></textarea>
      <p>
        데이터 상태: <span>{{ comment }}</span>
      </p>
    </div>

    <div>
      <h3>2) 단일 Checkbox (동의 여부 -> Boolean)</h3>
      <label>
        <input type="checkbox" v-model="isAgreed" /> 약관에 동의합니다.
      </label>
      <p>
        데이터 상태: <span>{{ isAgreed }}</span>
      </p>
    </div>

    <div>
      <h3>3) 다중 Checkbox (복수 선택 -> 배열)</h3>
      <label><input type="checkbox" value="사과" v-model="favoriteFruits" /> 사과</label>
      <label style="margin-left: 8px;"><input type="checkbox" value="바나나" v-model="favoriteFruits" /> 바나나</label>
      <label style="margin-left: 8px;"><input type="checkbox" value="딸기" v-model="favoriteFruits" /> 딸기</label>
      <p>
        데이터 상태 (배열): <span>{{ favoriteFruits }}</span>
      </p>
    </div>

    <div>
      <h3>4) Radio (단일 선택)</h3>
      <label><input type="radio" value="남성" v-model="gender" /> 남성</label>
      <label style="margin-left: 8px;"><input type="radio" value="여성" v-model="gender" /> 여성</label>
      <p>
        데이터 상태: <span>{{ gender }}</span>
      </p>
    </div>

    <div>
      <h3>5) Select (드롭다운 선택)</h3>
      <select v-model="selectedCar">
        <option value="">-- 선택하세요 --</option>
        <option value="tesla">테슬라</option>
        <option value="hyundai">현대자동차</option>
        <option value="bmw">BMW</option>
      </select>
      <p>
        데이터 상태: <span>{{ selectedCar }}</span>
      </p>
    </div>
  </div>
</template>
