<template>
  <TeamEdit />
</template>

<script setup lang="ts">
import TeamEdit from '~/domains/team/pages/TeamEdit.vue'

const route = useRoute()
const teamId = computed(() => route.params.id as string)

definePageMeta({
  title: 'Edit Team Member',
  breadcrumb: [
    { title: 'Home', path: '/' },
    { title: 'Team', path: '/team/list' },
    { title: 'Edit', path: '#' }
  ]
})
</script>
