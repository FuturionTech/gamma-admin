<!-- components/sidebar/SidebarShimmer.vue -->
<template>
  <div class="sidebar-shimmer-placeholder"></div>
</template>

<script setup lang="ts">
/* No script needed unless you have additional logic */
</script>

<style scoped>
.sidebar-shimmer-placeholder {
  width: 250px; /* Adjust to match your sidebar width */
  height: 100vh;
  background: #f6f7f8;
  background-image: linear-gradient(
      90deg,
      #f6f7f8 0px,
      #eaeaea 40px,
      #f6f7f8 80px
  );
  background-size: 600px;
  animation: shimmer 1.2s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -600px 0;
  }
  100% {
    background-position: 600px 0;
  }
}
</style>
