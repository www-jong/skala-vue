<script setup>
import SlotDefaultChild from '@/components/practices/component/SlotDefaultChild.vue'
</script>

<template>
  <div class="practice-section">
    <h2>Default Slot (기본 슬롯)</h2>
    <p>부모가 자식 태그 내부에 작성한 HTML 마크업을 자식의 &lt;slot&gt; 영역에 동적으로 주입하여 재사용합니다.</p>
    <p>부모가 아무것도 보내지 않을 경우, 자식의 기본 마크업을 나타냅니다.</p>

    <hr />
    <div class="parent-box">
      <h3>1) 일반 텍스트 주입 사례</h3>
      <SlotDefaultChild>
        <p>부모에서 주입한 단순 텍스트 문장입니다.</p>
      </SlotDefaultChild>
      <h3>2) HTML 요소 및 버튼 주입 사례</h3>
      <SlotDefaultChild>
        <h4 style="color: #e74c3c; margin: 0 0 8px 0;">🔥 경고 메세지 카드</h4>
        <button>경고 승인 확인</button>
      </SlotDefaultChild>
      <h3>3) 슬롯 내용 미전달 사례 (자식 기본 대체 문구 출력)</h3>
      <SlotDefaultChild />
    </div>
  </div>
</template>
