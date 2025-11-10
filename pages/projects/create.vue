<template>
  <ProjectsCreate />
</template>

<script setup lang="ts">
import ProjectsCreate from '~/domains/projects/pages/ProjectsCreate.vue'

definePageMeta({
  title: 'Create Project',
  breadcrumb: [
    { title: 'Home', path: '/' },
    { title: 'Projects', path: '/projects/list' },
    { title: 'Create', path: '/projects/create' }
  ]
})
</script>
