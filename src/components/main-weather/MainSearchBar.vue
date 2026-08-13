<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
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

const localInput = ref(props.searchQuery)
const recentSearches = ref([])
const showRecentDropdown = ref(false)

const RECENT_KEY = 'skala_recent_searches'
let debounceTimer = null

// 최근 검색어 로드
const loadRecentSearches = () => {
  try {
    const data = localStorage.getItem(RECENT_KEY)
    if (data) {
      recentSearches.value = JSON.parse(data)
    } else {
      recentSearches.value = ['서울특별시', '도쿄', '수원시', '부산광역시', '파주시']
    }
  } catch {
    recentSearches.value = ['서울특별시', '도쿄', '수원시', '부산광역시', '파주시']
  }
}

// 최근 검색어 저장
const saveRecentSearch = (term) => {
  if (!term || !term.trim()) return
  const clean = term.trim()
  const filtered = recentSearches.value.filter((item) => item !== clean)
  recentSearches.value = [clean, ...filtered].slice(0, 6)
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(recentSearches.value))
  } catch {
    // ignore
  }
}

// 최근 검색어 삭제
const deleteRecentSearch = (term) => {
  recentSearches.value = recentSearches.value.filter((item) => item !== term)
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(recentSearches.value))
  } catch {
    // ignore
  }
}

// 최근 검색어 전체 삭제
const clearAllRecent = () => {
  recentSearches.value = []
  try {
    localStorage.removeItem(RECENT_KEY)
  } catch {
    // ignore
  }
}

onMounted(() => {
  loadRecentSearches()
})

// props.searchQuery가 외부에서 변경될 때 localInput 동기화
watch(
  () => props.searchQuery,
  (newVal) => {
    localInput.value = newVal
  },
)

// 입력창 입력 처리 (250ms 디바운싱 적용)
const handleInput = (e) => {
  const val = e.target.value
  localInput.value = val

  if (debounceTimer) clearTimeout(debounceTimer)

  const trimmed = val.trim()
  showRecentDropdown.value = false

  if (!trimmed) {
    emit('update:searchQuery', '')
    return
  }

  debounceTimer = setTimeout(() => {
    emit('update:searchQuery', trimmed)
    saveRecentSearch(trimmed)
  }, 250)
}

// 키보드 엔터 처리
const handleKeyDown = (e) => {
  if (e.key === 'Enter' && localInput.value.trim()) {
    saveRecentSearch(localInput.value)
    showRecentDropdown.value = false
  } else if (e.key === 'Escape') {
    showRecentDropdown.value = false
  }
}

// 최근 검색어 선택
const selectRecentItem = (term) => {
  localInput.value = term
  saveRecentSearch(term)
  emit('update:searchQuery', term)
  showRecentDropdown.value = false
}

// 검색어 초기화
const handleClear = () => {
  localInput.value = ''
  showRecentDropdown.value = false
  emit('clear')
}

// 포커스 시 최근 검색 기록 표시
const handleFocus = () => {
  if (!localInput.value.trim() && recentSearches.value.length > 0) {
    showRecentDropdown.value = true
  }
}

// 포커스 아웃 시 닫기
const handleBlur = () => {
  setTimeout(() => {
    showRecentDropdown.value = false
  }, 200)
}
</script>

<template>
  <section class="main-search-box">
    <div class="main-search-header">
      <h3>🔍 글로벌 실시간 도시 검색</h3>
      <span :class="['main-search-badge', { active: searchQuery }]">
        {{
          isLoading
            ? '⚡ 실시간 API 관측 중...'
            : searchQuery
              ? `"${searchQuery}" 관측 결과`
              : '기본 관측 지역 보기'
        }}
      </span>
    </div>

    <div class="main-search-input-container">
      <span class="main-search-icon">🔍</span>
      <input
        type="text"
        class="main-search-input"
        :value="localInput"
        @input="handleInput"
        @keydown="handleKeyDown"
        @focus="handleFocus"
        @blur="handleBlur"
        placeholder="도시 또는 지명 검색 (예: 서울, 파주, 도쿄, Paris)..."
        autocomplete="off"
      />
      <button
        v-if="localInput"
        type="button"
        class="main-search-clear-btn"
        @click="handleClear"
        title="검색어 지우기"
      >
        ✕
      </button>

      <!-- 포커스 시 0ms 즉시 노출되는 최근 검색 기록 팝업 -->
      <div v-if="showRecentDropdown && recentSearches.length > 0" class="main-autocomplete-dropdown">
        <div class="recent-search-header">
          <span class="recent-title">🕒 최근 검색 기록</span>
          <button class="recent-clear-all" @mousedown.prevent="clearAllRecent">전체 삭제</button>
        </div>

        <div
          v-for="term in recentSearches"
          :key="term"
          class="main-autocomplete-item recent-item"
          @mousedown.prevent="selectRecentItem(term)"
        >
          <span class="suggestion-icon">🕒</span>
          <span class="suggestion-name recent-name">{{ term }}</span>
          <button
            class="recent-del-btn"
            @mousedown.prevent.stop="deleteRecentSearch(term)"
            title="삭제"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
