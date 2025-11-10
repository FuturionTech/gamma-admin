<script setup lang="ts">
// No specific script setup needed unless dynamic behavior or data fetching is required.
import NavigationMenus from "~/components/sidebar/menus/NavigationMenus.vue";
</script>

<template>
  <div class="app-sidebar-menu app-sidebar-menu-arrow overflow-hidden flex-column-fluid mb-5" id="kt_app_sidebar_menu">
    <!--begin::Menu wrapper-->
    <div id="kt_app_sidebar_menu_wrapper" class="app-sidebar-wrapper hover-scroll-y my-5 mx-3" data-kt-scroll="true"
         data-kt-scroll-activate="true" data-kt-scroll-height="auto"
         data-kt-scroll-dependencies="#kt_app_sidebar_logo, #kt_app_sidebar_footer"
         data-kt-scroll-wrappers="#kt_app_sidebar_menu" data-kt-scroll-offset="5px">
      <!--begin::Menu-->
      <NavigationMenus/>
      <!--end::Menu-->
    </div>
    <!--end::Menu wrapper-->
  </div>
</template>

<style scoped>
/* Add any custom styling here if needed */
</style>
