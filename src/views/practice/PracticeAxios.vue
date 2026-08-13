<script setup>
import StoreCounter from '@/components/practices/library/StoreCounter.vue'
import AxiosWeather from '@/components/practices/library/AxiosWeather.vue'
import AxiosJson from '@/components/practices/library/AxiosJson.vue';
import ElementPlus from '@/components/practices/library/ElementPlus.vue'
</script>

<template>
  <div class="practice-sub-wrapper">
    <div class="chapter-group">
      <h1 class="chapter-title">StoreCounter</h1>
      <StoreCounter />
    </div>
    <div class="chapter-group">
      <h1 class="chapter-title">Axios</h1>
      <AxiosWeather />
      <AxiosJson />
    </div>
    <div class="chapter-group">
      <ElementPlus />
    </div>
  </div>
</template>
