<!-- components/sidebar/Sidebar.vue -->
<template>
  <div id="kt_app_sidebar" class="app-sidebar flex-column" data-kt-drawer="true" data-kt-drawer-name="app-sidebar"
       data-kt-drawer-activate="{default: true, lg: false}" data-kt-drawer-overlay="true" data-kt-drawer-width="250px"
       data-kt-drawer-direction="start" data-kt-drawer-toggle="#kt_app_sidebar_mobile_toggle">
    <!--begin::Logo-->
    <SidebarLogo/>
    <!--end::Logo-->
    <!--begin::sidebar menu-->
    <SidebarMenu/>
    <!--end::sidebar menu-->
  </div>
</template>

<script setup lang="ts">
import SidebarLogo from "~/components/sidebar/logos/SidebarLogo.vue";
</script>
