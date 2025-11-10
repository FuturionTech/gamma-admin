<template>
  <div class="app-sidebar-logo d-none d-md-block pt-7 px-8 pt-xl-11 mb-2" id="kt_app_sidebar_logo">
    <!--begin::Logo image-->
    <NuxtLink :to="logoUrl">
      <img
          alt="Logo"
          src="/assets/gamma/logos/logo.png"
          class="h-75px theme-light-show"
      />
      <img
          alt="Logo"
          src="/assets/gamma/logos/logo-dark.png"
          class="h-75px  theme-dark-show"
      />
    </NuxtLink>
    <!--end::Logo image-->
  </div>
</template>
<script setup lang="ts">
const logoUrl = ref('/');
</script>


<style scoped>
</style>
