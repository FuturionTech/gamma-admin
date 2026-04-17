<template>
  <div class="app-navbar-item me-4 ms-lg-3" id="kt_header_user_menu_toggle">
    <div class="d-none d-md-block text-end me-4">
      <NuxtLink to="#" class="fs-6 fw-semibold text-white text-hover-primary">
        {{ fullName || 'Administrator' }}
      </NuxtLink>
      <span class="fs-7 fw-semibold text-gray-600 d-block">
        {{ primaryRoleLabel || 'Administrator' }}
      </span>
    </div>

    <div
      class="cursor-pointer symbol"
      data-kt-menu-trigger="{default: 'click', lg: 'hover'}"
      data-kt-menu-attach="parent"
      data-kt-menu-placement="bottom-end"
    >
      <img
        class="h-40px w-40px w-lg-45px h-lg-45px"
        src="/assets/gamma/avatars/avatar-gradient-head.png"
        alt="user"
      />
    </div>

    <div
      class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg menu-state-color fw-semibold py-4 fs-6 w-275px"
      data-kt-menu="true"
    >
      <div class="menu-item px-3">
        <div class="menu-content d-flex align-items-center px-3">
          <div class="symbol symbol-50px me-5">
            <img alt="avatar" src="/assets/gamma/avatars/avatar-gradient-head.png" />
          </div>
          <div class="d-flex flex-column">
            <div class="fw-bold d-flex align-items-center fs-5">
              {{ fullName || 'Administrator' }}
              <span
                v-if="hasRole('super_admin')"
                class="badge badge-light-success fw-bold fs-8 px-2 py-1 ms-2"
              >
                Super admin
              </span>
            </div>
            <span class="fw-semibold text-muted fs-7">
              {{ user?.email }}
            </span>
          </div>
        </div>
      </div>

      <div class="separator my-2"></div>

      <div class="menu-item px-5">
        <NuxtLink
          @click.prevent="handleLogout"
          class="menu-link text-danger px-5"
        >
          <i class="ki-duotone ki-exit-right fs-5 me-2">
            <span class="path1"></span><span class="path2"></span>
          </i>
          Sign out
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useCurrentUser } from '~/composables/useCurrentUser';

const router = useRouter();
const { user, fullName, hasRole, primaryRoleLabel } = useCurrentUser();

const handleLogout = () => {
  router.push('/logout');
};
</script>

<style scoped>
/* Your styles here */
</style>
