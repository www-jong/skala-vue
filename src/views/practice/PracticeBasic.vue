<script setup>
import SampleOne from '@/components/practices/basic/SampleOne.vue'
import SampleTwo from '@/components/practices/basic/SampleTwo.vue'
import VHtml from '@/components/practices/basic/VHtml.vue'
import VHtmlXSS from '@/components/practices/basic/VHtmlXSS.vue'
import VText from '@/components/practices/basic/VText.vue'
import VBindBasic from '@/components/practices/basic/VBindBasic.vue'
import VBindClassBinding from '@/components/practices/basic/VBindClassBinding.vue'
import VBindStyleBinding from '@/components/practices/basic/VBindStyleBinding.vue'
import VBindShortHand from '@/components/practices/basic/VBindShortHand.vue'
import VCondition from '@/components/practices/basic/VCondition.vue'
import VShow from '@/components/practices/basic/VShow.vue'
import VFor from '@/components/practices/basic/VFor.vue'
import VPre from '@/components/practices/basic/VPre.vue'
import VCloak from '@/components/practices/basic/VCloak.vue'
import VOnce from '@/components/practices/basic/VOnce.vue'
import VMemo from '@/components/practices/basic/VMemo.vue'

import VOnEvent from '@/components/practices/basic/VOnEvent.vue'
import EventObject from '@/components/practices/basic/EventObject.vue'
import EventModifier from '@/components/practices/basic/EventModifier.vue'
import VModel from '@/components/practices/basic/VModel.vue'
import VModelForm from '@/components/practices/basic/VModelForm.vue'
import VModelModifier from '@/components/practices/basic/VModelModifier.vue'
import VStyle from '@/components/practices/basic/VStyle.vue'
</script>

<template>
  <div class="practice-sub-wrapper">
    <div class="chapter-group">
      <h1 class="chapter-title">Vue Directive</h1>
      <SampleOne />
      <SampleTwo />
      <VHtml />
      <VHtmlXSS />
      <VText />
      <VBindBasic />
      <VBindClassBinding />
      <VBindStyleBinding />
      <VBindShortHand />
      <VCondition />
      <VShow />
      <VFor />
      <VPre />
      <VCloak />
      <VOnce />
      <VMemo />
    </div>
    <div class="chapter-group">
      <h1 class="chapter-title">Vue Event Handling & Form</h1>
      <VOnEvent />
      <EventObject />
      <EventModifier />
      <VModel />
      <VModelForm />
      <VModelModifier />
      <VStyle />
    </div>
  </div>
</template>
