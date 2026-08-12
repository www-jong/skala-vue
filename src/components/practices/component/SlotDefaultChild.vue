<template>
  <div class="child-card">
    <!-- 부모가 전달한 HTML 템플릿이 꽂히는 자리 (<slot>) -->
    <slot>
      <p>부모가 아무것도 안보냈을 때 나타나는 문구</p>
    </slot>
  </div>
</template>
