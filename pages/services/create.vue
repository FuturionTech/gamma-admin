<template>
  <ServicesCreate />
</template>

<script setup lang="ts">
import ServicesCreate from '~/domains/services/pages/ServicesCreate.vue'

definePageMeta({
  title: 'Create Service',
  breadcrumb: [
    { title: 'Home', path: '/' },
    { title: 'Services', path: '/services/list' },
    { title: 'Create', path: '/services/create' }
  ]
})
</script>
