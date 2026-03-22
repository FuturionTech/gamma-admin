<template>
  <StatsDetail />
</template>

<script setup lang="ts">
import StatsDetail from '~/domains/stats/pages/StatsDetail.vue'

definePageMeta({
  layout: 'default',
  middleware: ['auth']
})
</script>
