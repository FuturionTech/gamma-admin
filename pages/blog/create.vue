<template>
  <BlogCreate />
</template>

<script setup lang="ts">
import BlogCreate from '~/domains/blog/pages/BlogCreate.vue'

definePageMeta({
  title: 'Create Blog Post',
  breadcrumb: [
    { title: 'Home', path: '/' },
    { title: 'Blog', path: '/blog/list' },
    { title: 'Create', path: '/blog/create' }
  ]
})
</script>
