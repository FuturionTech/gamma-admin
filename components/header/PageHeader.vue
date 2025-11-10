<!-- components/PageHeader.vue -->
<template>
  <div class="page-header d-flex flex-column justify-content-center me-3 mb-4 mb-lg-0">
    <h1 class="page-heading d-flex text-gray-900 fw-bold fs-3 flex-column justify-content-center my-0">{{
        pageTitle
      }}</h1>
    <ul class="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1">
      <li v-for="(item, index) in breadcrumbItems" :key="index" class="breadcrumb-item">
        <NuxtLink v-if="item.path" :to="item.path" class="text-muted text-hover-primary">
          {{ item.title }}
        </NuxtLink>
        <span v-else class="text-muted">
          {{ item.title }}
        </span>
        <span v-if="index < breadcrumbItems.length - 1" class="bullet bg-gray-500 w-5px h-2px"></span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {useBreadcrumbStore} from "~/domains/shared/stores/breadcrumbStore";

const breadcrumbStore = useBreadcrumbStore();

const breadcrumbItems = computed(() => breadcrumbStore.items);
const pageTitle = computed(() => {
  if (breadcrumbStore.items.length > 0) {
    return breadcrumbStore.items[breadcrumbStore.items.length - 1].title;
  }
  return '';
});
</script>

<style scoped>
.breadcrumb {
  list-style: none;
  padding: 0;
  margin: 0;
}

.bullet {
  display: inline-block;
  margin: 0 8px;
}
</style>
