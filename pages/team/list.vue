<template>
  <TeamList />
</template>

<script setup lang="ts">
import TeamList from '~/domains/team/pages/TeamList.vue'

definePageMeta({
  title: 'Team Members',
  breadcrumb: [
    { title: 'Home', path: '/' },
    { title: 'Team', path: '/team/list' }
  ]
})
</script>
