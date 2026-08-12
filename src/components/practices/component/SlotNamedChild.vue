<template>
  <div class="child-card">
    <!-- 1. header 슬롯 구역 -->
    <header class="card-header">
      <slot name="header">
        <p class="fallback">💡 기본 헤더 제목입니다.</p>
      </slot>
    </header>

    <hr />

    <!-- 2. default 본문 슬롯 구역 -->
    <main class="card-body">
      <slot>
        <p class="fallback">💡 기본 본문 내용입니다.</p>
      </slot>
    </main>

    <hr />

    <!-- 3. footer 슬롯 구역 -->
    <footer class="card-footer">
      <slot name="footer">
        <p class="fallback">💡 기본 푸터 영역입니다.</p>
      </slot>
    </footer>
  </div>
</template>

<style scoped>
.card-header {
  font-weight: bold;
}

.card-footer {
  font-size: 0.85rem;
}

.fallback {
  color: #94a3b8;
  font-style: italic;
  margin: 0;
}
</style>
