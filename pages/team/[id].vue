<template>
  <TeamDetail />
</template>

<script setup lang="ts">
import TeamDetail from '~/domains/team/pages/TeamDetail.vue'

const route = useRoute()
const teamId = computed(() => route.params.id as string)

definePageMeta({
  title: 'Team Member Details',
  breadcrumb: [
    { title: 'Home', path: '/' },
    { title: 'Team', path: '/team/list' },
    { title: 'Details', path: '#' }
  ]
})
</script>
