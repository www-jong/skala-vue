<script setup>
const handleLink = () => {
  alert('prevent 수식어로 인해 페이지 이동 없이 알림창만 실행됩니다.')
}

const handleBox = () => {
  alert('부모 영역 이벤트 발생!')
}

const handleChild1 = () => {
  alert('자식 버튼 1 클릭 (버블링 발생 -> 부모 이벤트도 연속 실행)')
}

const handleChild2 = () => {
  alert('자식 버튼 2 클릭 (stop 수식어로 버블링 차단 -> 부모 이벤트 실행 안 됨)')
}
</script>

<template>
  <div class="practice-section">
    <h2>이벤트 수식어(Modifiers) 학습</h2>
    <p>이벤트 수식어: .prevent(기본 동작 차단) 및 .stop(이벤트 버블링 전파 차단) 제어</p>

    <hr />

    <h3>1) .prevent (기본 동작 막기)</h3>
    <a href="https://github.com/www-jong" @click.prevent="handleLink">
      깃허브 이동 차단 링크 (@click.prevent)
    </a>
    <br /><br />

    <h3>2) .stop (이벤트 버블링 막기)</h3>
    <div class="parent" @click="handleBox">
      <p>부모 영역 (클릭 시 부모 알림창 발생)</p>
      <button @click="handleChild1">버블링 발생 버튼</button>
      <button @click.stop="handleChild2" style="margin-left: 8px;">
        .stop 버블링 차단 버튼
      </button>
    </div>
  </div>
</template>

<style scoped>
.parent {
  background-color: #cbd5e1;
  padding: 20px;
  border-radius: 8px;
  color: #1e293b;
}
</style>
