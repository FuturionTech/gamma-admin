<template>
  <ClientsDetail />
</template>

<script setup lang="ts">
import ClientsDetail from '~/domains/clients/pages/ClientsDetail.vue'

definePageMeta({
  layout: 'default',
  middleware: ['auth']
})
</script>
