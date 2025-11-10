<template>
  <BlogEdit />
</template>

<script setup lang="ts">
import BlogEdit from '~/domains/blog/pages/BlogEdit.vue'

const route = useRoute()
const blogPostId = computed(() => route.params.id as string)

definePageMeta({
  title: 'Edit Blog Post',
  breadcrumb: [
    { title: 'Home', path: '/' },
    { title: 'Blog', path: '/blog/list' },
    { title: 'Edit', path: '#' }
  ]
})
</script>
