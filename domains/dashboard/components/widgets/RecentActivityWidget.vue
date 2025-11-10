<template>
  <div class="card card-flush h-xl-100">
    <div class="card-header pt-7">
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bold text-gray-800">Recent Activity</span>
        <span class="text-gray-500 mt-1 fw-semibold fs-6">Latest actions</span>
      </h3>
    </div>
    <div class="card-body pt-6">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-10">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!activities || activities.length === 0" class="text-center py-10">
        <i class="ki-duotone ki-information-5 fs-3x text-gray-400 mb-3">
          <span class="path1"></span>
          <span class="path2"></span>
          <span class="path3"></span>
        </i>
        <p class="text-gray-600 fs-6">No recent activity</p>
      </div>

      <!-- Activity Timeline -->
      <div v-else class="timeline timeline-border-dashed">
        <div v-for="(activity, index) in limitedActivities" :key="index" class="timeline-item">
          <div class="timeline-line w-40px"></div>
          <div class="timeline-icon symbol symbol-circle symbol-40px">
            <div class="symbol-label" :class="activity.iconColor">
              <i :class="activity.icon" class="fs-4"></i>
            </div>
          </div>
          <div class="timeline-content mb-10 mt-n1">
            <div class="pe-3 mb-5">
              <div class="fs-6 fw-semibold mb-2 text-gray-900">
                {{ activity.title }}
              </div>
              <div class="d-flex align-items-center mt-1 fs-7">
                <div class="text-muted me-2">{{ getActivityTypeLabel(activity.type) }}</div>
              </div>
            </div>
            <div class="d-flex align-items-center">
              <span :class="getStatusBadgeClass(activity.status)" class="badge fs-8">
                {{ getStatusLabel(activity.status) }}
              </span>
              <span class="text-muted fs-7 ms-2">{{ formatTimeAgo(activity.created_at) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- View All Link -->
      <div v-if="activities && activities.length > limit" class="text-center mt-5">
        <a href="#" class="text-primary fw-semibold fs-6" @click.prevent="showAll = !showAll">
          {{ showAll ? 'Show less' : 'View all' }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { RecentContentActivity } from '../../types/content';

interface Props {
  activities?: RecentContentActivity[];
  loading?: boolean;
  limit?: number;
}

const props = withDefaults(defineProps<Props>(), {
  activities: () => [],
  loading: false,
  limit: 10,
});

const showAll = ref(false);

const limitedActivities = computed(() => {
  if (showAll.value) {
    return props.activities;
  }
  return props.activities?.slice(0, props.limit) || [];
});

const getActivityTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    blog: 'Blog post',
    project: 'Project',
    service: 'Service',
    team: 'Team member',
    solution: 'Solution',
    partner: 'Partner',
    client: 'Client',
  };
  return labels[type] || type;
};

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    active: 'Active',
    inactive: 'Inactive',
    published: 'Published',
    draft: 'Draft',
  };
  return labels[status] || status;
};

const getStatusBadgeClass = (status: string): string => {
  const classes: Record<string, string> = {
    active: 'badge-light-success',
    inactive: 'badge-light-secondary',
    published: 'badge-light-success',
    draft: 'badge-light-warning',
  };
  return classes[status] || 'badge-light-secondary';
};

const formatTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours}h ago`;
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    return `${days}d ago`;
  }
};
</script>
