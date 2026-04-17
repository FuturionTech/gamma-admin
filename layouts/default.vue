<template>
  <div class="d-flex flex-column flex-root app-root" id="kt_app_root">
    <!--begin::Page-->
    <div class="app-page flex-column flex-column-fluid" id="kt_app_page">
      <!--begin::Header-->
      <div
        id="kt_app_header"
        class="app-header"
        data-kt-sticky="true"
        data-kt-sticky-activate="{default: false, lg: true}"
        data-kt-sticky-name="app-header-sticky"
        data-kt-sticky-offset="{default: false, lg: '300px'}"
      >
        <div
          class="app-container container-fluid d-flex align-items-center justify-content-between"
          id="kt_app_header_container"
        >
          <div class="d-flex align-items-center d-block d-lg-none ms-n3" title="Show sidebar menu">
            <div
              class="btn btn-icon btn-active-color-primary w-35px h-35px me-2"
              id="kt_app_sidebar_mobile_toggle"
            >
              <i class="ki-duotone ki-abstract-14 fs-1">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </div>
            <SidebarToggleLogo />
          </div>
          <Header />
        </div>
      </div>
      <!--end::Header-->
      <!--begin::Wrapper-->
      <div class="app-wrapper flex-column flex-row-fluid" id="kt_app_wrapper">
        <Sidebar />
        <slot />
      </div>
      <!--end::Wrapper-->
    </div>
    <!--end::Page-->
    <Scrolltop />
  </div>
</template>

<script setup lang="ts">
import SidebarToggleLogo from '~/components/sidebar/logos/SidebarToggleLogo.vue'
import Sidebar from '~/components/sidebar/Sidebar.vue'
import Scrolltop from '~/components/Scrolltop.vue'
import Header from '~/components/Header.vue'

// Apply Keen template body attributes via useHead so we don't render a <body>
// tag inside the template (which causes Vue hydration mismatches).
useHead({
  bodyAttrs: {
    id: 'kt_app_body',
    class: 'app-default',
    'data-kt-app-header-fixed-mobile': 'true',
    'data-kt-app-sidebar-enabled': 'true',
    'data-kt-app-sidebar-fixed': 'true',
    'data-kt-app-sidebar-push-header': 'true',
    'data-kt-app-sidebar-push-toolbar': 'true',
    'data-kt-app-sidebar-push-footer': 'true',
  },
})

onMounted(async () => {
  await nextTick()
  // Keen template helpers are attached to window by the plugins.bundle.js script.
  // They're undefined during SSR, so we only call them on the client.
  if (typeof window === 'undefined') return
  const w = window as unknown as {
    KTMenu?: { init: () => void }
    KTScroll?: { init: () => void }
    KTSticky?: { init: () => void }
    KTToggle?: { init: () => void }
    KTScrolltop?: { init: () => void }
  }
  w.KTMenu?.init()
  w.KTScroll?.init()
  w.KTSticky?.init()
  w.KTToggle?.init()
  w.KTScrolltop?.init()
})
</script>

<style scoped></style>
