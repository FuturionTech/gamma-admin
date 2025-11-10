<template>
  <div class="solution-benefits">
    <!-- Page Header -->
    <PageHeader
      title="Benefits"
      :subtitle="currentSolution?.title"
    />

    <!-- Breadcrumb -->
    <div class="mb-5">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <NuxtLink to="/solutions">Solutions</NuxtLink>
          </li>
          <li class="breadcrumb-item">
            <NuxtLink :to="`/solutions/${solutionId}/edit`">{{ currentSolution?.title }}</NuxtLink>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            Benefits
          </li>
        </ol>
      </nav>
    </div>

    <!-- Info Alert -->
    <div class="alert alert-info d-flex align-items-center mb-5">
      <i class="ki-duotone ki-information fs-2x me-4">
        <span class="path1"></span>
        <span class="path2"></span>
        <span class="path3"></span>
      </i>
      <div>
        <h4 class="alert-heading mb-1">Manage Benefits</h4>
        <p class="mb-0">Add and manage benefits for this solution. Benefits showcase the value and advantages for customers.</p>
      </div>
    </div>

    <!-- Main Card -->
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          <h3 class="fw-bold m-0">
            Benefits List
            <span class="badge badge-light-success ms-2" v-if="currentSolution">
              {{ currentSolution.benefits?.length || 0 }}
            </span>
          </h3>
        </div>
        <div class="card-toolbar">
          <div class="d-flex gap-2">
            <NuxtLink
              :to="`/solutions/${solutionId}/edit`"
              class="btn btn-sm btn-light"
            >
              <i class="ki-duotone ki-arrow-left fs-3"></i>
              Back to Solution
            </NuxtLink>
            <button
              type="button"
              class="btn btn-sm btn-success"
              disabled
            >
              <i class="ki-duotone ki-plus fs-3"></i>
              Add Benefit
            </button>
          </div>
        </div>
      </div>

      <div class="card-body">
        <!-- Benefits List -->
        <div v-if="currentSolution?.benefits && currentSolution.benefits.length > 0">
          <div
            v-for="(benefit, index) in currentSolution.benefits"
            :key="benefit.id"
            class="d-flex align-items-center justify-content-between p-5 mb-3 border border-gray-300 rounded"
          >
            <div class="d-flex align-items-center flex-grow-1">
              <div class="symbol symbol-50px me-4" v-if="benefit.icon">
                <img :src="benefit.icon" :alt="benefit.title" />
              </div>
              <div class="flex-grow-1">
                <div class="fw-bold fs-5 text-gray-900 mb-1">
                  {{ benefit.title }}
                </div>
                <div class="text-gray-600 fs-6" v-if="benefit.description">
                  {{ benefit.description }}
                </div>
                <div class="text-muted fs-7 mt-1">
                  Order: {{ benefit.order }}
                </div>
              </div>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-icon btn-light-primary" disabled>
                <i class="ki-duotone ki-pencil fs-3"></i>
              </button>
              <button class="btn btn-sm btn-icon btn-light-danger" disabled>
                <i class="ki-duotone ki-trash fs-3"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-10">
          <i class="ki-duotone ki-medal-star fs-5x text-muted mb-5">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          <div class="fw-bold fs-3 text-gray-600 mb-2">
            No benefits yet
          </div>
          <div class="text-muted fs-6 mb-5">
            Add your first benefit to get started
          </div>
          <div class="alert alert-warning">
            <strong>Note:</strong> Feature and Benefit CRUD functionality requires backend GraphQL mutations.
            The GraphQL schema currently only includes type definitions. Mutations need to be added to the backend.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSolutionsStore } from '../stores/useSolutionsStore'

definePageMeta({
  layout: 'default',
  middleware: ['auth']
})

const route = useRoute()
const solutionsStore = useSolutionsStore()

const solutionId = computed(() => route.params.id as string)
const currentSolution = computed(() => solutionsStore.currentSolution)

onMounted(async () => {
  await solutionsStore.fetchSolutionById(solutionId.value)
})
</script>
