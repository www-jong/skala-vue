<script setup>
import SlotNamedChild from '@/components/practices/component/SlotNamedChild.vue'
</script>

<template>
  <div class="practice-section">
    <h2>Named Slot (이름 지정 슬롯)</h2>
    <p>&lt;template #이름&gt; 축약 구문을 사용하여 자식 컴포넌트의 특정 위치에 템플릿을 분할 주입합니다.</p>
    <p class="desc-text">부모가 슬롯 내용을 전달하지 않을 경우 자식의 &lt;slot&gt; 내 대체 문구가 자동 출력됩니다.</p>
    <hr />

    <div class="parent-box">
      <h3>조립 예제1 (#header, default, #footer 주입)</h3>

      <SlotNamedChild>
        <!-- header 슬롯 영역 주입 (#header 축약어 사용) -->
        <template #header>
          <h3 style="margin: 0; color: #3b82f6;">부모가 넣은 헤더</h3>
        </template>

        <!-- default (기본 본문) 슬롯 영역 주입 -->
        <p>부모에서 주입한 본문 내용입니다.</p>

        <!-- footer 슬롯 영역 주입 (#footer 축약어 사용) -->
        <template #footer>
          <p style="margin: 0; text-align: right; color: #64748b;">작성자: 부모</p>
        </template>
      </SlotNamedChild>
    </div>
    <div class="parent-box">
      <h3>조립 예제2 (#header, default, #footer 주입안함)</h3>

      <SlotNamedChild>
        <template #header>
        </template>
        <template #footer>
        </template>
      </SlotNamedChild>
    </div>
  </div>
</template>
