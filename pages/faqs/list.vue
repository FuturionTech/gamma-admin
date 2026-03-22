<script setup lang="ts">
import FAQsList from '~/domains/faqs/pages/FAQsList.vue'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})
</script>

<template>
  <FAQsList />
</template>
