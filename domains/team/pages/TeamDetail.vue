<template>
  <!-- Page Header -->
  <PageHeader title="Team Member Details" />

  <!-- Loading Skeleton -->
  <TeamDetailSkeleton v-if="isLoading" />

  <!-- Error State -->
  <div v-else-if="loadError" class="alert alert-danger d-flex align-items-center p-5">
    <i class="ki-duotone ki-shield-cross fs-2hx text-danger me-4">
      <span class="path1"></span>
      <span class="path2"></span>
      <span class="path3"></span>
    </i>
    <div class="d-flex flex-column">
      <h4 class="mb-1 text-dark">An error occurred</h4>
      <span>{{ loadError }}</span>
    </div>
  </div>

  <!-- Detail View -->
  <div v-else-if="team" class="row g-5 g-xl-8">
    <!-- Main Content -->
    <div class="col-xl-8">
      <div class="card mb-5 mb-xl-8">
        <div class="card-body">
          <!-- Header with Avatar and Name -->
          <div class="d-flex align-items-center mb-7">
            <!-- Avatar -->
            <div class="me-5">
              <div v-if="team.profile_picture_url" class="symbol symbol-100px symbol-circle">
                <img :src="team.profile_picture_url" :alt="team.name" />
              </div>
              <div
                v-else
                class="symbol symbol-100px symbol-circle"
                :class="getAvatarColor(team.name)"
              >
                <span class="symbol-label text-white fs-1">
                  {{ getInitials(team.name) }}
                </span>
              </div>
            </div>

            <!-- Name and Role -->
            <div class="flex-grow-1">
              <h1 class="text-gray-900 fw-bold mb-3">{{ team.name }}</h1>
              <div v-if="team.role" class="text-gray-600 fs-4 fw-semibold mb-2">
                {{ team.role }}
              </div>
              <span
                class="badge badge-lg"
                :class="getStatusBadgeClass(team.is_active)"
              >
                {{ getStatusText(team.is_active) }}
              </span>
            </div>
          </div>

          <!-- Contact Info Section -->
          <div class="mb-7" v-if="team.email || team.contact">
            <h3 class="text-gray-900 fw-bold mb-4">Contact Information</h3>

            <div v-if="team.email" class="d-flex align-items-center mb-3">
              <i class="ki-duotone ki-sms fs-2 text-primary me-3">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <a :href="`mailto:${team.email}`" class="text-gray-700 text-hover-primary fs-5">
                {{ team.email }}
              </a>
            </div>

            <div v-if="team.contact" class="d-flex align-items-center mb-3">
              <i class="ki-duotone ki-phone fs-2 text-primary me-3">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <a :href="`tel:${team.contact}`" class="text-gray-700 fs-5">
                {{ formatPhoneNumber(team.contact) }}
              </a>
            </div>
          </div>

          <!-- Biography Section -->
          <div v-if="team.biography" class="mb-7">
            <h3 class="text-gray-900 fw-bold mb-4">Biography</h3>
            <div class="text-gray-700 fs-5 lh-lg" style="white-space: pre-wrap;">{{ team.biography }}</div>
          </div>

          <!-- Social Links Section -->
          <div v-if="team.socialMediaLinks && team.socialMediaLinks.length > 0" class="mb-7">
            <h3 class="text-gray-900 fw-bold mb-4">Social Media</h3>
            <div class="d-flex flex-wrap gap-3">
              <a
                v-for="link in team.socialMediaLinks"
                :key="link.id"
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-icon btn-light-primary btn-lg"
                :title="link.platform?.name"
              >
                <i :class="link.platform?.icon || 'ki-duotone ki-link'" class="fs-2"></i>
              </a>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="d-flex gap-3">
            <NuxtLink
              :to="`/team/edit/${team.id}`"
              class="btn btn-primary"
            >
              <i class="ki-duotone ki-pencil fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              Edit
            </NuxtLink>
            <button
              type="button"
              class="btn btn-light-danger"
              @click="handleDelete"
            >
              <i class="ki-duotone ki-trash fs-2">
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
    </div>

    <!-- Sidebar -->
    <div class="col-xl-4">
      <!-- Details Card -->
      <div class="card mb-5 mb-xl-8">
        <div class="card-header border-0">
          <div class="card-title">
            <h3 class="fw-bold m-0">Information</h3>
          </div>
        </div>
        <div class="card-body pt-0">
          <!-- Status -->
          <div class="mb-7">
            <div class="fw-semibold text-gray-600 mb-2">Status</div>
            <span
              class="badge badge-lg"
              :class="getStatusBadgeClass(team.is_active)"
            >
              {{ getStatusText(team.is_active) }}
            </span>
          </div>

          <!-- Role -->
          <div v-if="team.role" class="mb-7">
            <div class="fw-semibold text-gray-600 mb-2">Role</div>
            <div class="text-gray-800 fw-bold">{{ team.role }}</div>
          </div>

          <!-- Order -->
          <div class="mb-7">
            <div class="fw-semibold text-gray-600 mb-2">Display Order</div>
            <span class="badge badge-light-primary badge-lg">{{ team.order }}</span>
          </div>

          <!-- Created At -->
          <div class="mb-7">
            <div class="fw-semibold text-gray-600 mb-2">Created At</div>
            <div class="text-gray-800">{{ formatDate(team.created_at) }}</div>
          </div>

          <!-- Updated At -->
          <div class="mb-7">
            <div class="fw-semibold text-gray-600 mb-2">Updated At</div>
            <div class="text-gray-800">{{ formatDate(team.updated_at) }}</div>
          </div>

          <!-- Application -->
          <div v-if="team.application" class="mb-7">
            <div class="fw-semibold text-gray-600 mb-2">Application</div>
            <div class="text-gray-800">{{ team.application.name }}</div>
          </div>
        </div>
      </div>

      <!-- Quick Actions Card -->
      <div class="card">
        <div class="card-header border-0">
          <div class="card-title">
            <h3 class="fw-bold m-0">Quick Actions</h3>
          </div>
        </div>
        <div class="card-body pt-0">
          <div class="d-flex flex-column gap-3">
            <button
              type="button"
              class="btn btn-light-primary w-100 justify-content-start"
              @click="handleToggleStatus"
            >
              <i class="ki-duotone ki-toggle-off-circle fs-2 me-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              {{ team.is_active ? 'Deactivate' : 'Activate' }}
            </button>
            <NuxtLink
              to="/team/list"
              class="btn btn-light w-100 justify-content-start"
            >
              <i class="ki-duotone ki-arrow-left fs-2 me-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              Back to List
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useTeamStore } from '../stores/useTeamStore'
import { useTeamFormatters } from '../composables/useTeamFormatters'
import { useTeamActions } from '../composables/useTeamActions'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import TeamDetailSkeleton from '../components/TeamDetailSkeleton.vue'

const route = useRoute()
const router = useRouter()
const teamStore = useTeamStore()
const breadcrumbStore = useBreadcrumbStore()

const {
  formatDate,
  formatPhoneNumber,
  getStatusBadgeClass,
  getStatusText,
  getInitials,
  getAvatarColor
} = useTeamFormatters()

const {
  confirmAndDeleteTeam,
  toggleTeamStatus
} = useTeamActions()

const teamId = computed(() => route.params.id as string)

const isLoading = ref(true)
const loadError = ref('')
const team = computed(() => teamStore.currentTeam)

// Load team member
const loadTeam = async () => {
  isLoading.value = true
  loadError.value = ''

  try {
    const result = await teamStore.fetchTeam(teamId.value)

    if (result) {
      // Update breadcrumb
      breadcrumbStore.setBreadcrumb([
        { title: 'Home', path: '/' },
        { title: 'Team', path: '/team/list' },
        { title: result.name, path: `/team/${result.id}` }
      ])
    }
  } catch (error: any) {
    loadError.value = error.message || 'Failed to load team member'
  } finally {
    isLoading.value = false
  }
}

// Handlers
const handleDelete = async () => {
  if (!team.value) return

  const success = await confirmAndDeleteTeam(team.value)
  if (success) {
    await router.push('/team/list')
  }
}

const handleToggleStatus = async () => {
  if (!team.value) return
  await toggleTeamStatus(team.value)
  // Reload to show updated status
  await loadTeam()
}

// Lifecycle
onMounted(async () => {
  await loadTeam()
})
</script>
