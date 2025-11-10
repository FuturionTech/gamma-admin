<template>
  <ServicesList />
</template>

<script setup lang="ts">
import ServicesList from '~/domains/services/pages/ServicesList.vue'

definePageMeta({
  title: 'Services',
  breadcrumb: [
    { title: 'Home', path: '/' },
    { title: 'Services', path: '/services/list' }
  ]
})
</script>
