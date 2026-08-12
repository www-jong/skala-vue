<script setup>
defineProps({
  statusMessage: {
    type: String,
    default: ''
  }
})
</script>


<template>
  <div class="status-bar">
    {{ statusMessage }}
  </div>
</template>

<style scoped>
.status-bar {
  background: #e8f5e9;
  padding: 10px;
  text-align: center;
  color: #2e7d32;
  font-weight: bold;
  border-radius: 6px;
  margin-top: 15px;
}

html.dark .status-bar {
  background: #14532d;
  color: #86efac;
}
</style>
