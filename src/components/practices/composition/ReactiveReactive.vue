<script setup>
import { reactive } from 'vue'

const userReactive = reactive({ name: '이순신', age: 30 })
const celebrateReactive = () => {
  userReactive.age++
}

const items = reactive(['사과', '바나나'])

const fruitList = ['사과', '바나나', '자두', '귤', '포도']
const addItem = () => {
  const randomIndex = Math.floor(Math.random() * fruitList.length)
  const randomItem = fruitList[randomIndex]

  // 3. Vue ref() 배열이면 .value.push(), reactive() 배열이면 .push()
  items.push(`${randomItem} ${items.length + 1}`)
}
const removeItem = (idx) => {
  items.splice(idx, 1)
}
</script>

<template>
  <div class="practice-section">
    <h2>반응형 상태 reactive() 특징 및 주의점</h2>
    <p>reactive()는 객체/배열 전용 반응형 객체를 생성하며 .value 없이 속성에 직접 접근합니다.</p>
    <hr />

    <h3>1) 객체(Object) reactive</h3>
    <p>이름: {{ userReactive.name }} / 나이: {{ userReactive.age }}세</p>
    <button @click="celebrateReactive">reactive 나이 한살 추가</button>

    <h3>2) 배열(Array) reactive</h3>
    <ul>
      <li v-for="(item, idx) in items" :key="idx" style="margin-bottom: 6px;">
        {{ item }}
        <button @click="removeItem(idx)" style="margin-left: 8px; padding: 2px 8px; font-size: 12px;">삭제</button>
      </li>
    </ul>
    <button @click="addItem">과일 항목 추가</button>
  </div>
</template>
