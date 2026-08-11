<script setup>
const handleLink = () => {
  alert('수식어를 통해 깃허브로 이동하지 않고 함수만 실행')
}
const handleBox = () => {
  alert('부모 박스 클릭')
}
const handleChild1 = () => {
  alert('1번 자식 클릭')
}
const handleChild2 = () => {
  alert('2번 자식 클릭')
}
</script>

<template>
  <div class="practice-section">
    <h2>이벤트 수식어(Modifiers) 학습</h2>
    <h3>1) .prevent(기본 동작 막기)</h3>
    <a href="https://github.com/www-jong" @click.prevent="handleLink">깃허브 링크</a>
    <br />

    <h3>2) .stop(이벤트 버블링 막기)</h3>
    <div class="parent" @click="handleBox">
      <p>부모영역(클릭시 alert발동)</p>
      <button @click="handleChild1">버블링 발생버튼</button>
      <button @click.stop="handleChild2">버블링 차단버튼</button>
      <!-- 버블링차단시, 버튼 눌러도 부모영역은 발동안함-->
    </div>
  </div>

</template>

<style>
.parent {
  background-color: rgb(228, 134, 134);
  padding:20px;
  border-radius:10px;
}
</style>
