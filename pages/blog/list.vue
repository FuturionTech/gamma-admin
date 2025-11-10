<template>
  <BlogList />
</template>

<script setup lang="ts">
import BlogList from '~/domains/blog/pages/BlogList.vue'

definePageMeta({
  title: 'Blog Posts',
  breadcrumb: [
    { title: 'Home', path: '/' },
    { title: 'Blog', path: '/blog/list' }
  ]
})
</script>
