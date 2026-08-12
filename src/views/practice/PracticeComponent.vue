<script setup>
import LifecycleParent from '@/components/practices/component/LifecycleParent.vue';
import PropsEmitsParent from '@/components/practices/component/PropsEmitsParent.vue';
import SlotDefaultParent from '@/components/practices/component/SlotDefaultParent.vue';
import SlotNamedParent from '@/components/practices/component/SlotNamedParent.vue';
import SlotScopedParent from '@/components/practices/component/SlotScopedParent.vue';
</script>

<template>
  <div class="practice-sub-wrapper">
    <div class="chapter-group">
      <h1 class="chapter-title">Component & Lifecycle</h1>
      <LifecycleParent />
    </div>
    <div class="chapter-group">
      <h1 class="chapter-title">Props & Emits</h1>
      <PropsEmitsParent />
    </div>
    <div class="chapter-group">
      <h1 class="chapter-title">Slot</h1>
      <SlotDefaultParent />
      <SlotNamedParent />
      <SlotScopedParent />
    </div>
  </div>
</template>
<style>
.parent-box {
  border: 2px solid #2ecc71;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 16px;
}

/* 파란색 점선 자식 박스 */
.child-card,
.child-container,
.child-box {
  border: 2px dashed #3498db;
  border-radius: 8px;
  padding: 15px;
  margin-top: 12px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* 안내 설명문 */
.desc-text {
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 12px;
}

/* 다크 모드 연동 */
html.dark .parent-box {
  background-color: #1e293b;
  border-color: #4ade80;
}

html.dark .child-card,
html.dark .child-container,
html.dark .child-box {
  background-color: #0f172a;
  border-color: #60a5fa;
}

html.dark .desc-text {
  color: #94a3b8;
}
</style>
