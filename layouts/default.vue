<template>
  <!--begin::Body-->
  <body id="kt_app_body" data-kt-app-header-fixed-mobile="true" data-kt-app-sidebar-enabled="true"
        data-kt-app-sidebar-fixed="true" data-kt-app-sidebar-push-header="true" data-kt-app-sidebar-push-toolbar="true"
        data-kt-app-sidebar-push-footer="true" class="app-default">
  <!--begin::App-->
  <div class="d-flex flex-column flex-root app-root" id="kt_app_root">
    <!--begin::Page-->
    <div class="app-page flex-column flex-column-fluid" id="kt_app_page">
      <!--begin::Header-->
      <div id="kt_app_header" class="app-header" data-kt-sticky="true"
           data-kt-sticky-activate="{default: false, lg: true}" data-kt-sticky-name="app-header-sticky"
           data-kt-sticky-offset="{default: false, lg: '300px'}">
        <!--begin::Header container-->
        <div class="app-container container-fluid d-flex align-items-center justify-content-between"
             id="kt_app_header_container">
          <!--begin::Sidebar toggle-->
          <div class="d-flex align-items-center d-block d-lg-none ms-n3" title="Show sidebar menu">
            <div class="btn btn-icon btn-active-color-primary w-35px h-35px me-2" id="kt_app_sidebar_mobile_toggle">
              <i class="ki-duotone ki-abstract-14 fs-1">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </div>
            <!--begin::Logo image-->
            <SidebarToggleLogo/>
            <!--end::Logo image-->
          </div>
          <!--end::Sidebar toggle-->
          <!--begin::Header wrapper-->
          <Header/>
          <!--end::Header wrapper-->
        </div>
        <!--end::Header container-->
      </div>
      <!--end::Header-->
      <!--begin::Wrapper-->
      <div class="app-wrapper flex-column flex-row-fluid" id="kt_app_wrapper">
        <!--begin::Sidebar-->
        <Sidebar/>
        <!--end::Sidebar-->
        <!--begin::Main-->
        <slot/>
        <!--end:::Main-->
      </div>
      <!--end::Wrapper-->
    </div>
    <!--end::Page-->
  </div>
  <!--end::App-->
  <!--begin::Scrolltop-->
  <Scrolltop/>
  <!--end::Scrolltop-->
  <!--end::Javascript-->
  </body>
  <!--end::Body-->
</template>

<script setup lang="ts">
import SidebarToggleLogo from "~/components/sidebar/logos/SidebarToggleLogo.vue";
import Sidebar from "~/components/sidebar/Sidebar.vue";
import Scrolltop from "~/components/Scrolltop.vue";
import Header from "~/components/Header.vue";


onMounted(() => {
  setTimeout(() => {
    // @ts-ignore
    KTMenu.init();

    // @ts-ignore
    KTScroll.init();

    // @ts-ignore
    KTSticky.init();

    // @ts-ignore
    KTToggle.init();

    // @ts-ignore
    KTScrolltop.init();
  }, 1000);
});
</script>

<style scoped>

</style>
