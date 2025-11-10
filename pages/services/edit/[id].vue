<template>
  <ServicesEdit />
</template>

<script setup lang="ts">
import ServicesEdit from '~/domains/services/pages/ServicesEdit.vue'

const route = useRoute()
const serviceId = computed(() => route.params.id as string)

definePageMeta({
  title: 'Edit Service',
  breadcrumb: [
    { title: 'Home', path: '/' },
    { title: 'Services', path: '/services/list' },
    { title: 'Edit', path: '#' }
  ]
})
</script>
