<script setup>
import { ref } from 'vue'

const dynamicUrl = 'https://github.com/www-jong'
const logoImgSrc = 'https://vuejs.org/images/logo.png'
const isButtonDisabled = ref(true)
</script>

<template>
    <div class="practice-section">
        <h2>v-bind 디렉티브 기본 (축약형: 콜론)</h2>
        <p>v-bind: HTML 요소의 속성(href, src, disabled 등)을 동적으로 바인딩</p>
        <hr />
        <h3>1) 동적 링크 연결</h3>
        <a :href="dynamicUrl">깃허브 이동</a>
        <br />

        <h3>2) 동적 이미지 연결</h3>
        <img :src="logoImgSrc" alt="Vue Logo" style="width: 100px" />
        <br />

        <h3>3) 버튼 비활성화 제어</h3>
        <p>현재 버튼 사용 불가능 상태 : {{ isButtonDisabled }}</p>
        <button :disabled="isButtonDisabled">동의해야 클릭가능한 버튼</button>
        <button @click="isButtonDisabled = !isButtonDisabled">{{ isButtonDisabled ? "눌러서 버튼 해제" : "눌러서 버튼잠금" }}</button>
    </div>

</template>
