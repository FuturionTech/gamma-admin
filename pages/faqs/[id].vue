<script setup lang="ts">
import FAQsDetail from '~/domains/faqs/pages/FAQsDetail.vue'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})
</script>

<template>
  <FAQsDetail />
</template>
