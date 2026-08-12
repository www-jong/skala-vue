<script setup>
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()
</script>

<template>
  <div class="unit-toggle-wrapper">
    <button
      class="single-unit-toggle-btn"
      @click="configStore.toggleUnit()"
      title="클릭하여 섭씨(℃) / 화씨(℉) 단위 전환"
    >
      <span class="unit-icon">🌡️</span>
      <span class="unit-label">온도 단위:</span>
      <span class="unit-pill-badge">
        {{ configStore.unit === 'celsius' ? '℃ 섭씨' : '℉ 화씨' }}
      </span>
    </button>
  </div>
</template>
