<template>
  <TeamCreate />
</template>

<script setup lang="ts">
import TeamCreate from '~/domains/team/pages/TeamCreate.vue'

definePageMeta({
  title: 'Create Team Member',
  breadcrumb: [
    { title: 'Home', path: '/' },
    { title: 'Team', path: '/team/list' },
    { title: 'Create', path: '/team/create' }
  ]
})
</script>
