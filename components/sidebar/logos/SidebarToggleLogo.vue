<template>
  <div>
    <NuxtLink to="/">
      <img
          alt="Logo"
          :src="application?.information?.logoUrl || '/assets/gamma/logos/logo.png'"
          class="h-35px theme-light-show"
      />
      <img
          alt="Logo"
          :src="application?.information?.logoDarkUrl || '/assets/gamma/logos/logo-dark.png'"
          class="h-35px theme-dark-show"
      />
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type {Application} from '~/domains/shared/types/application';
const application = ref<Application>();
</script>

<style scoped>
</style>
