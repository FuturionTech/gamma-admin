<template>
  <ProjectsEdit />
</template>

<script setup lang="ts">
import ProjectsEdit from '~/domains/projects/pages/ProjectsEdit.vue'

const route = useRoute()
const projectId = computed(() => route.params.id as string)

definePageMeta({
  title: 'Edit Project',
  breadcrumb: [
    { title: 'Home', path: '/' },
    { title: 'Projects', path: '/projects/list' },
    { title: 'Edit', path: '#' }
  ]
})
</script>
