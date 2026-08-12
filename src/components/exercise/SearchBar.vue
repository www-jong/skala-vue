<script setup>
const emit = defineEmits(['update-query'])
defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
})

const handleClear = () => {
  emit('update-query', '')
}
</script>

<template>
  <div class="search-inner">
    <div class="search-header">
      <h3>🔍 도시 검색</h3>
      <span :class="['search-badge', { active: currentQuery }]">
        {{ currentQuery ? `"${currentQuery}" 검색 중` : '전체 보기' }}
      </span>
    </div>

    <div class="search-input-container">
      <span class="search-icon">🔍</span>
      <input
        type="text"
        class="modern-search-input"
        :value="currentQuery"
        @input="$emit('update-query', $event.target.value)"
        placeholder="검색할 나라, 지역, 도시명 입력..."
      />
      <button
        v-if="currentQuery"
        type="button"
        class="search-clear-btn"
        @click="handleClear"
        title="검색어 지우기"
      >
        ✕
      </button>
    </div>
  </div>
</template>
