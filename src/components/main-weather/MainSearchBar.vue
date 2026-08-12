<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { weatherService } from '@/services/weatherService'

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

const emit = defineEmits(['update:searchQuery', 'clear', 'selectSuggestion'])

const localInput = ref(props.searchQuery)
const suggestions = ref([])
const recentSearches = ref([])
const showDropdown = ref(false)
const dropdownMode = ref('suggestions') // 'suggestions' | 'recent'
const activeIndex = ref(-1)
const isFetchingSuggestions = ref(false)

const RECENT_KEY = 'skala_recent_searches'
let debounceTimer = null

// 최근 검색어 로드
const loadRecentSearches = () => {
  try {
    const data = localStorage.getItem(RECENT_KEY)
    if (data) {
      recentSearches.value = JSON.parse(data)
    } else {
      recentSearches.value = ['서울특별시', '도쿄', '수원시', '부산광역시']
    }
  } catch {
    recentSearches.value = ['서울특별시', '도쿄', '수원시', '부산광역시']
  }
}

// 최근 검색어 저장
const saveRecentSearch = (term) => {
  if (!term || !term.trim()) return
  const clean = term.trim()
  const filtered = recentSearches.value.filter(item => item !== clean)
  recentSearches.value = [clean, ...filtered].slice(0, 6)
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(recentSearches.value))
  } catch {
    // ignore
  }
}

// 최근 검색어 삭제
const deleteRecentSearch = (term) => {
  recentSearches.value = recentSearches.value.filter(item => item !== term)
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

// 입력창 입력 시 250ms 디바운싱(Debounce) 적용
const handleInput = (e) => {
  const val = e.target.value
  localInput.value = val
  emit('update:searchQuery', val)

  if (debounceTimer) clearTimeout(debounceTimer)

  if (!val || !val.trim()) {
    suggestions.value = []
    dropdownMode.value = 'recent'
    showDropdown.value = recentSearches.value.length > 0
    return
  }

  isFetchingSuggestions.value = true
  debounceTimer = setTimeout(async () => {
    try {
      const results = await weatherService.fetchSuggestions(val)
      suggestions.value = results
      dropdownMode.value = 'suggestions'
      showDropdown.value = results.length > 0
      activeIndex.value = -1
    } finally {
      isFetchingSuggestions.value = false
    }
  }, 250)
}

// 키보드 조작
const handleKeyDown = (e) => {
  if (!showDropdown.value) return

  if (dropdownMode.value === 'suggestions' && suggestions.value.length > 0) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      activeIndex.value = (activeIndex.value + 1) % suggestions.value.length
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      activeIndex.value =
        (activeIndex.value - 1 + suggestions.value.length) % suggestions.value.length
    } else if (e.key === 'Enter') {
      if (activeIndex.value >= 0 && activeIndex.value < suggestions.value.length) {
        e.preventDefault()
        selectSuggestion(suggestions.value[activeIndex.value])
      } else if (localInput.value.trim()) {
        saveRecentSearch(localInput.value)
        showDropdown.value = false
      }
    } else if (e.key === 'Escape') {
      showDropdown.value = false
    }
  } else if (e.key === 'Enter' && localInput.value.trim()) {
    saveRecentSearch(localInput.value)
    showDropdown.value = false
  }
}

// 자동완성 추천 항목 선택
const selectSuggestion = (item) => {
  localInput.value = item.name
  saveRecentSearch(item.name)
  emit('update:searchQuery', item.name)
  emit('selectSuggestion', item)
  showDropdown.value = false
  suggestions.value = []
}

// 최근 검색어 클릭 선택
const selectRecentItem = (term) => {
  localInput.value = term
  saveRecentSearch(term)
  emit('update:searchQuery', term)
  showDropdown.value = false
}

// 검색어 초기화
const handleClear = () => {
  localInput.value = ''
  suggestions.value = []
  dropdownMode.value = 'recent'
  showDropdown.value = recentSearches.value.length > 0
  emit('clear')
}

// 포커스 시 0ms 즉시 최근 검색어 표시
const handleFocus = () => {
  if (localInput.value.trim() && suggestions.value.length > 0) {
    dropdownMode.value = 'suggestions'
    showDropdown.value = true
  } else if (recentSearches.value.length > 0) {
    dropdownMode.value = 'recent'
    showDropdown.value = true
  }
}

// 포커스 아웃 시 닫기
const handleBlur = () => {
  setTimeout(() => {
    showDropdown.value = false
  }, 200)
}

onUnmounted(() => {
  if (debounceTimer) clearTimeout(debounceTimer)
})
</script>

<template>
  <section class="main-search-box">
    <div class="main-search-header">
      <h3>🔍 글로벌 실시간 도시 검색 (자동완성 & 최근검색어)</h3>
      <span :class="['main-search-badge', { active: searchQuery }]">
        {{
          isFetchingSuggestions
            ? '⏳ 추천 지명 탐색 중...'
            : isLoading
              ? '⚡ 실시간 API 관측 중...'
              : searchQuery
                ? `"${searchQuery}" 검색 중`
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
        placeholder="전 세계 국가, 주/도, 도시명 입력 (예: 서, 수, 도쿄, Paris)..."
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

      <!-- 1:1 완벽 정렬 드롭다운 UI -->
      <div v-if="showDropdown" class="main-autocomplete-dropdown">
        <!-- 1. 실시간 추천 목록 -->
        <template v-if="dropdownMode === 'suggestions' && suggestions.length > 0">
          <div class="dropdown-section-title">✨ 실시간 추천 관측 도시</div>
          <div
            v-for="(item, index) in suggestions"
            :key="item.id || index"
            :class="['main-autocomplete-item', { active: index === activeIndex }]"
            @mousedown.prevent="selectSuggestion(item)"
            @mouseenter="activeIndex = index"
          >
            <span class="suggestion-icon">📍</span>
            <div class="suggestion-info">
              <span class="suggestion-name">{{ item.name }}</span>
              <span class="suggestion-meta">[{{ item.country }}] {{ item.region }}</span>
            </div>
          </div>
        </template>

        <!-- 2. 포커스 시 0ms 노출되는 최근 검색 기록 -->
        <template v-else-if="dropdownMode === 'recent' && recentSearches.length > 0">
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
        </template>
      </div>
    </div>
  </section>
</template>
