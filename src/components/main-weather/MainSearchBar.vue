<script setup>
defineProps({
  searchQuery: {
    type: String,
    default: '',
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:searchQuery', 'clear'])
</script>

<template>
  <section class="search-box">
    <div class="search-header">
      <h3>🔍 글로벌 실시간 도시 검색</h3>
      <span :class="['search-badge', { active: searchQuery }]">
        {{ isLoading ? '⚡ 실시간 API 관측 중...' : (searchQuery ? `"${searchQuery}" 검색 중` : '기본 관측 지역 보기') }}
      </span>
    </div>

    <div class="search-input-container">
      <span class="search-icon">🔍</span>
      <input
        type="text"
        class="modern-search-input"
        :value="searchQuery"
        @input="e => emit('update:searchQuery', e.target.value)"
        placeholder="전 세계 국가, 주/도, 도시명 입력 (예: 서울, Tokyo, Paris)..."
      />
      <button
        v-if="searchQuery"
        type="button"
        class="search-clear-btn"
        @click="emit('clear')"
        title="검색어 지우기"
      >
        ✕
      </button>
    </div>
  </section>
</template>
