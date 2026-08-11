<script setup>
import ReactiveRef from '../../components/practices/composition/ReactiveRef.vue'
import ReactiveReactive from '../../components/practices/composition/ReactiveReactive.vue'

import ComputedBasic from '../../components/practices/composition/ComputedBasic.vue'
import WatcherBasic from '../../components/practices/composition/WatcherBasic.vue'
import WatcherMulti from '@/components/practices/composition/WatcherMulti.vue'
import WatcherDeep from '@/components/practices/composition/WatcherDeep.vue';
import WatcherReactive from '@/components/practices/composition/WatcherReactive.vue'
import WatcherEffect from '@/components/practices/composition/WatcherEffect.vue'
</script>

<template>
  <div class="practice-sub-wrapper">
    <div class="chapter-group">
      <h1 class="chapter-title">Reactive State</h1>
      <ReactiveRef />
      <ReactiveReactive />
    </div>
    <div class="chapter-group">
      <h1 class="chapter-title">Computed & Watchers</h1>
      <ComputedBasic />
      <WatcherBasic />
      <WatcherMulti />
      <WatcherDeep />
      <WatcherReactive />
      <WatcherEffect />
    </div>
  </div>
</template>
