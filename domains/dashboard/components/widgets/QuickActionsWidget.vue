<template>
  <div class="card card-flush">
    <div class="card-header pt-7">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bold text-gray-800">Quick Actions</span>
        <span class="text-gray-500 mt-1 fw-semibold fs-6">Access to main sections</span>
      </h3>
    </div>
    <div class="card-body pt-6">
      <div class="row g-6">
        <div v-for="(action, index) in quickActions" :key="index" class="col-lg-3 col-md-6">
          <NuxtLink :to="action.route" class="card bg-light-hover-primary hoverable card-xl-stretch">
            <div class="card-body">
              <div class="d-flex align-items-center mb-4">
                <i :class="`${action.icon} ${action.iconColor} fs-2x`">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
                <span v-if="action.badge" :class="`badge badge-${action.badgeColor} ms-auto`">
                  {{ action.badge }}
                </span>
              </div>
              <div class="text-gray-900 fw-bold fs-6 mb-2">{{ action.title }}</div>
              <div class="text-gray-500 fs-7">{{ action.description }}</div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { QuickAction } from '../../types/content';
import type { DashboardOverview } from '../../types/content';

interface Props {
  dashboardData?: Partial<DashboardOverview>;
}

const props = defineProps<Props>();

const quickActions = computed<QuickAction[]>(() => [
  {
    title: 'Manage Services',
    description: 'Create and manage services',
    icon: 'ki-duotone ki-setting-2',
    iconColor: 'text-primary',
    route: '/services',
    badge: `${props.dashboardData?.services?.total || 0}`,
    badgeColor: 'primary',
  },
  {
    title: 'Manage Solutions',
    description: 'Create and manage solutions',
    icon: 'ki-duotone ki-abstract-26',
    iconColor: 'text-success',
    route: '/solutions',
    badge: `${props.dashboardData?.solutions?.total || 0}`,
    badgeColor: 'success',
  },
  {
    title: 'Manage Blog',
    description: 'Create and publish articles',
    icon: 'ki-duotone ki-book',
    iconColor: 'text-danger',
    route: '/blog',
    badge: `${props.dashboardData?.blog?.total || 0}`,
    badgeColor: 'danger',
  },
  {
    title: 'Manage Projects',
    description: 'Create and manage case studies',
    icon: 'ki-duotone ki-briefcase',
    iconColor: 'text-warning',
    route: '/projects',
    badge: `${props.dashboardData?.projects?.total || 0}`,
    badgeColor: 'warning',
  },
  {
    title: 'Manage Team',
    description: 'Manage team members',
    icon: 'ki-duotone ki-people',
    iconColor: 'text-info',
    route: '/team',
    badge: `${props.dashboardData?.team?.total || 0}`,
    badgeColor: 'info',
  },
  {
    title: 'Manage Partners',
    description: 'Manage partners',
    icon: 'ki-duotone ki-abstract-41',
    iconColor: 'text-success',
    route: '/partners',
    badge: `${props.dashboardData?.partners?.total || 0}`,
    badgeColor: 'success',
  },
  {
    title: 'Manage Clients',
    description: 'Manage clients',
    icon: 'ki-duotone ki-profile-user',
    iconColor: 'text-warning',
    route: '/clients',
    badge: `${props.dashboardData?.clients?.total || 0}`,
    badgeColor: 'warning',
  },
  {
    title: 'Manage FAQs',
    description: 'Manage frequently asked questions',
    icon: 'ki-duotone ki-questionnaire-tablet',
    iconColor: 'text-secondary',
    route: '/faqs',
    badge: `${props.dashboardData?.faqs?.total || 0}`,
    badgeColor: 'secondary',
  },
]);
</script>

<style scoped>
.bg-light-hover-primary:hover {
  background-color: rgba(0, 158, 247, 0.1) !important;
  transition: all 0.3s ease;
}
</style>
