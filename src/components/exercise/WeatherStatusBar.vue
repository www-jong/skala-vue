<script setup>
defineProps({
  statusMessage: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div class="status-bar">
    <span class="status-icon">📍</span>
    <span>{{ statusMessage }}</span>
  </div>
</template>
