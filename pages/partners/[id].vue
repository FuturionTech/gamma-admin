<template>
  <PartnersDetail />
</template>

<script setup lang="ts">
import PartnersDetail from '~/domains/partners/pages/PartnersDetail.vue'

definePageMeta({
  layout: 'default',
  middleware: ['auth']
})
</script>
