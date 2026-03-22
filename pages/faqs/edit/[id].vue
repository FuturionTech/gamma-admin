<script setup lang="ts">
import FAQsEdit from '~/domains/faqs/pages/FAQsEdit.vue'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})
</script>

<template>
  <FAQsEdit />
</template>
