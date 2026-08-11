<script setup>
import { ref } from 'vue'

const fruits = ref(['사과', '바나나', '딸기'])
const user = ref({
    name: '원종현',
    age: 30,
    role: '개발자'
})
const items = ref([
    { id: 'prod-101', name: '맥북' },
    { id: 'prod-102', name: '아이폰' },
])
</script>

<template>
    <div class="practice-section">
        <h2>v-for 디렉티브 학습</h2>
        <p>v-for: 배열 및 객체 항목을 순회하여 DOM 목록 렌더링 (고유 :key 필수)</p>
        <hr />
        <h3>1) 배열 렌더링</h3>
        <ul>
            <li v-for="(fruit, index) in fruits" :key="index">{{ index + 1 }}번 과일: {{ fruit }}</li>
        </ul>
        <h3>2) 객체 렌더링</h3>
        <ul>
            <li v-for="(value, key, index) in user" :key="key">[{{ index }}]: {{ key }}: {{ value }}</li>
        </ul>
        <h3>3) 배열 내 객체 렌더링</h3>
        <ul>
            <li v-for="(item, index) in items" :key="item.id">[{{ index }}]: {{ item.name }}</li>
        </ul>
    </div>

</template>