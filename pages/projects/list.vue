<template>
  <ProjectsList />
</template>

<script setup lang="ts">
import ProjectsList from '~/domains/projects/pages/ProjectsList.vue'

definePageMeta({
  title: 'Projects',
  breadcrumb: [
    { title: 'Home', path: '/' },
    { title: 'Projects', path: '/projects/list' }
  ]
})
</script>
