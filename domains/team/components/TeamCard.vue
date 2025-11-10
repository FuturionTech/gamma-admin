<template>
  <div class="card h-100">
    <div class="card-body d-flex flex-column">
      <!-- Profile Picture -->
      <div class="text-center mb-5">
        <div class="symbol symbol-100px symbol-circle mb-5">
          <img
            v-if="team.profile_picture_url"
            :src="team.profile_picture_url"
            :alt="team.name"
          />
          <div
            v-else
            class="symbol-label fs-2 fw-bold"
            :class="getAvatarColor(team.name)"
          >
            {{ getInitials(team.name) }}
          </div>
        </div>

        <!-- Name and Role -->
        <div class="mb-3">
          <NuxtLink
            :to="`/team/${team.id}/edit`"
            class="text-gray-800 text-hover-primary fs-4 fw-bold mb-0"
          >
            {{ team.name }}
          </NuxtLink>
          <div class="text-muted fs-6 fw-semibold mt-1" v-if="team.role">
            {{ team.role }}
          </div>
        </div>

        <!-- Status Badge -->
        <span
          class="badge"
          :class="getStatusBadgeClass(team.is_active)"
        >
          {{ getStatusText(team.is_active) }}
        </span>
      </div>

      <!-- Contact Info -->
      <div class="mb-5 flex-grow-1">
        <div class="d-flex align-items-center mb-3" v-if="team.email">
          <i class="ki-duotone ki-sms fs-3 text-muted me-2">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          <a :href="`mailto:${team.email}`" class="text-gray-600 text-hover-primary">
            {{ team.email }}
          </a>
        </div>

        <div class="d-flex align-items-center mb-3" v-if="team.contact">
          <i class="ki-duotone ki-phone fs-3 text-muted me-2">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          <a :href="`tel:${team.contact}`" class="text-gray-600">
            {{ formatPhoneNumber(team.contact) }}
          </a>
        </div>

        <!-- Biography Preview -->
        <div class="text-muted fs-7 mt-4" v-if="team.biography">
          {{ truncate(team.biography, 100) }}
        </div>
      </div>

      <!-- Social Links -->
      <div class="d-flex justify-content-center gap-2 mb-4" v-if="team.socialMediaLinks && team.socialMediaLinks.length > 0">
        <a
          v-for="link in team.socialMediaLinks"
          :key="link.id"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-icon btn-sm btn-light-primary"
          :title="link.platform?.name"
        >
          <i :class="link.platform?.icon || 'ki-duotone ki-link'"></i>
        </a>
      </div>

      <!-- Actions -->
      <div class="d-flex justify-content-between pt-4 border-top">
        <NuxtLink
          :to="`/team/${team.id}/edit`"
          class="btn btn-sm btn-light-primary"
        >
          <i class="ki-duotone ki-pencil fs-3">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          Edit
        </NuxtLink>

        <button
          type="button"
          class="btn btn-sm btn-light-danger"
          @click="$emit('delete', team)"
        >
          <i class="ki-duotone ki-trash fs-3">
            <span class="path1"></span>
            <span class="path2"></span>
            <span class="path3"></span>
            <span class="path4"></span>
            <span class="path5"></span>
          </i>
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Team } from '../types'
import { useTeamFormatters } from '../composables/useTeamFormatters'

interface Props {
  team: Team
}

defineProps<Props>()

defineEmits<{
  (e: 'delete', team: Team): void
}>()

const {
  truncate,
  getStatusBadgeClass,
  getStatusText,
  formatPhoneNumber,
  getInitials,
  getAvatarColor
} = useTeamFormatters()
</script>
