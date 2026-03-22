<script setup lang="ts">
import FAQsCreate from '~/domains/faqs/pages/FAQsCreate.vue'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})
</script>

<template>
  <FAQsCreate />
</template>
