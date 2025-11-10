<!-- components/Header.vue -->
<template>
  <div class="d-flex align-items-stretch justify-content-between flex-lg-grow-1" id="kt_app_header_wrapper">
    <!--begin::Page header-->
    <PageHeader />
    <!--end::Page header-->
    <!--begin::Wrapper-->
    <div class="d-flex">
      <!--begin::Navbar-->
      <div class="app-navbar flex-shrink-0">
        <!--begin::User menu-->
        <ProfileDropdown/>
        <!--end::User menu-->
      </div>
      <!--end::Navbar-->
    </div>
    <!--end::Wrapper-->
  </div>
</template>

<script setup lang="ts">
import ProfileDropdown from "~/components/sidebar/profile/ProfileDropdown.vue";
import PageHeader from "~/components/header/PageHeader.vue";
</script>

<style scoped>
/* Add your styles here */
</style>
