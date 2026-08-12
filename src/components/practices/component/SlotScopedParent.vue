<script setup>
import SlotScopedChild from './SlotScopedChild.vue'
</script>

<template>
  <div class="practice-section">
    <h2>Scoped Slot (범위 지정 슬롯)</h2>
    <p>자식 내부의 데이터(:text, :count)를 슬롯 바인딩으로 수신하여 부모가 커스텀 렌더링합니다.</p>
    <hr />

    <!-- 예제 1: 자식 데이터 바인딩 수신 및 커스텀 마크업 주입 -->
    <div class="parent-box">
      <h3>예제 1 (자식 데이터 역수신 ➡️ 부모 커스텀 렌더링)</h3>
      <p class="desc-text">💡 자식의 슬롯 데이터를 v-slot="slotBag"으로 가로채어 부모가 디자인을 바인딩합니다.</p>

      <SlotScopedChild v-slot="slotBag">
        <div class="custom-panel">
          <p style="margin: 0 0 6px 0;">📢 서버 메시지: <strong>{{ slotBag.text }}</strong></p>
          <p style="margin: 0;">👥 현재 접속자: <strong>{{ slotBag.count }}명</strong></p>
        </div>
      </SlotScopedChild>
    </div>

    <!-- 예제 2: 슬롯 내용 미전달 (자식 기본 대체 문구 출력) -->
    <div class="parent-box" style="margin-top: 16px;">
      <h3>예제 2 (슬롯 내용 미전달 ➡️ 자식 기본 대체 문구 출력)</h3>
      <p class="desc-text">💡 부모가 슬롯 내용을 주입하지 않으면 자식 컴포넌트의 기본 fallback 문구가 표시됩니다.</p>

      <!-- 자식 컴포넌트에 슬롯 주입 안 함 -->
      <SlotScopedChild />
    </div>
  </div>
</template>

<style scoped>


.custom-panel {
  background-color: #e0f2fe;
  border: 1px solid #7dd3fc;
  padding: 12px;
  border-radius: 6px;
  color: #0369a1;
}


html.dark .custom-panel {
  background-color: #0c4a6e;
  border-color: #0284c7;
  color: #e0f2fe;
}

</style>
