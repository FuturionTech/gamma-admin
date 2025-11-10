<!-- components/Breadcrumb.vue -->
<template>
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
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {useBreadcrumbStore} from "~/domains/shared/stores/breadcrumbStore";

const breadcrumbStore = useBreadcrumbStore();

const breadcrumbItems = computed(() => breadcrumbStore.items);
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
