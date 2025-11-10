<template>
  <div class="app-navbar-item me-4 ms-lg-3" id="kt_header_user_menu_toggle">
    <!--begin::Username-->
    <div class="d-none d-md-block text-end me-4">
      <NuxtLink to="#" class="fs-6 fw-semibold text-white text-hover-primary">
        {{ fullName || 'Utilisateur' }}
      </NuxtLink>
      <span class="fs-7 fw-semibold text-gray-600 d-block">
        {{ user?.roles?.[0]?.display_name || 'Utilisateur' }}
      </span>
    </div>
    <!--end::Username-->
    <!--begin::Menu wrapper-->
    <div class="cursor-pointer symbol" data-kt-menu-trigger="{default: 'click', lg: 'hover'}"
         data-kt-menu-attach="parent" data-kt-menu-placement="bottom-end">
      <img class="h-40px w-40px w-lg-45px h-lg-45px"
           src="/assets/gamma/avatars/avatar-gradient-head.png" alt="user"/>
    </div>
    <!--begin::User account menu-->
    <div
        class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg menu-state-color fw-semibold py-4 fs-6 w-275px"
        data-kt-menu="true">
      <!--begin::Menu item-->
      <div class="menu-item px-3">
        <div class="menu-content d-flex align-items-center px-3">
          <!--begin::Avatar-->
          <div class="symbol symbol-50px me-5">
            <img alt="Logo" src="/assets/gamma/avatars/avatar-gradient-head.png"/>
          </div>
          <!--end::Avatar-->
          <!--begin::Username-->
          <div class="d-flex flex-column">
            <div class="fw-bold d-flex align-items-center fs-5">
              {{ fullName }}
              <span v-if="hasRole('super_admin')" class="badge badge-light-success fw-bold fs-8 px-2 py-1 ms-2">
                Admin
              </span>
            </div>
            <span class="fw-semibold text-muted fs-7">
              {{ user?.email }}
            </span>
          </div>
          <!--end::Username-->
        </div>
      </div>
      <!--end::Menu item-->
      <!--begin::Menu separator-->
      <div class="separator my-2"></div>
      <!--end::Menu separator-->
      <!--begin::Menu item-->
      <div class="menu-item px-5">
        <a href="#" @click.prevent class="menu-link px-5">
          <i class="ki-duotone ki-profile-user fs-5 me-2">
            <span class="path1"></span>
            <span class="path2"></span>
            <span class="path3"></span>
          </i>
          Mon Profil
        </a>
      </div>
      <!--end::Menu item-->
      <!--begin::Menu item-->
      <div class="menu-item px-5" data-kt-menu-trigger="{default: 'click', lg: 'hover'}"
           data-kt-menu-placement="left-start" data-kt-menu-offset="-15px, 0">
        <NuxtLink to="#" class="menu-link px-5">
          <span class="menu-title">Mon Abonnement</span>
          <span class="menu-arrow"></span>
        </NuxtLink>
        <!--begin::Menu sub-->
        <div class="menu-sub menu-sub-dropdown w-175px py-4">
          <!--begin::Menu item-->
          <div class="menu-item px-3">
            <a href="#" @click.prevent class="menu-link px-5">Facturation</a>
          </div>
          <!--end::Menu item-->
          <!--begin::Menu item-->
          <div class="menu-item px-3">
            <a href="#" @click.prevent class="menu-link px-5">Paiements</a>
          </div>
          <!--end::Menu item-->
          <!--begin::Menu item-->
          <div class="menu-item px-3">
            <a href="#" @click.prevent class="menu-link d-flex flex-stack px-5">Relevés
              <span class="ms-2 lh-0" data-bs-toggle="tooltip" title="Voir vos relevés">
                <i class="ki-duotone ki-information-5 fs-5">
                  <span class="path1"></span>
                  <span class="path2"></span>
                  <span class="path3"></span>
                </i>
              </span>
            </a>
          </div>
          <!--end::Menu item-->
          <!--begin::Menu separator-->
          <div class="separator my-2"></div>
          <!--end::Menu separator-->
        </div>
        <!--end::Menu sub-->
      </div>
      <!--end::Menu item-->
      <!--begin::Menu item-->
      <div class="menu-item px-5">
        <a href="#" @click.prevent class="menu-link px-5">Mes Relevés</a>
      </div>
      <!--end::Menu item-->
      <!--begin::Menu separator-->
      <div class="separator my-2"></div>
      <!--end::Menu separator-->
      <!--begin::Menu item-->
      <div class="menu-item px-5">
        <NuxtLink @click.prevent="handleLogout" class="menu-link text-danger px-5">Se Déconnecter</NuxtLink>
      </div>
      <!--end::Menu item-->
    </div>
    <!--end::User account menu-->
    <!--end::Menu wrapper-->
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useCurrentUser } from '~/composables/useCurrentUser';

const router = useRouter();
const { 
  user, 
  fullName, 
  hasRole,
  isAuthenticated 
} = useCurrentUser();

// Method to handle logout
const handleLogout = () => {
  router.push('/logout');
};
</script>

<style scoped>
/* Your styles here */
</style>
