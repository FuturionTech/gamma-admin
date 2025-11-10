<template>
  <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
    <div class="d-flex flex-column flex-column-fluid">
      <div id="kt_app_content" class="app-content flex-column-fluid">
        <div id="kt_app_content_container" class="app-container container-fluid">
          <!-- Statistics Cards -->
          <div class="row g-5 g-xl-8 mb-5 mb-xl-8" v-if="!blogStore.isLoading">
      <div class="col-md-6 col-xl-3">
        <div class="card card-flush h-xl-100">
          <div class="card-body">
            <span class="svg-icon svg-icon-2tx svg-icon-primary">
              <i class="ki-duotone ki-document fs-2tx text-primary">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </span>
            <div class="fw-bold fs-2 mt-5">
              {{ blogStore.statistics.total }}
            </div>
            <div class="fw-semibold text-muted">
              Total Posts
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-xl-3">
        <div class="card card-flush h-xl-100">
          <div class="card-body">
            <span class="svg-icon svg-icon-2tx svg-icon-success">
              <i class="ki-duotone ki-check-circle fs-2tx text-success">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </span>
            <div class="fw-bold fs-2 mt-5">
              {{ blogStore.statistics.published }}
            </div>
            <div class="fw-semibold text-muted">
              Published Posts
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-xl-3">
        <div class="card card-flush h-xl-100">
          <div class="card-body">
            <span class="svg-icon svg-icon-2tx svg-icon-warning">
              <i class="ki-duotone ki-file-down fs-2tx text-warning">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </span>
            <div class="fw-bold fs-2 mt-5">
              {{ blogStore.statistics.drafts }}
            </div>
            <div class="fw-semibold text-muted">
              Drafts
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-xl-3">
        <div class="card card-flush h-xl-100">
          <div class="card-body">
            <span class="svg-icon svg-icon-2tx svg-icon-info">
              <i class="ki-duotone ki-eye fs-2tx text-info">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
              </i>
            </span>
            <div class="fw-bold fs-2 mt-5">
              {{ formatViewCount(blogStore.statistics.totalViews) }}
            </div>
            <div class="fw-semibold text-muted">
              Total Views
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

    <!-- Statistics Skeleton -->
    <div class="row g-5 g-xl-8 mb-5 mb-xl-8" v-else>
      <div class="col-md-6 col-xl-3" v-for="i in 4" :key="i">
        <CardSkeleton :showIcon="true" :lines="0" :showActions="false" />
      </div>
    </div>

    <!-- Main Card -->
    <div class="card">
      <div class="card-header border-0 pt-6">
        <div class="card-title">
          <!-- Search -->
          <div class="d-flex align-items-center position-relative my-1">
            <i class="ki-duotone ki-magnifier fs-3 position-absolute ms-5">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            <input
              type="text"
              v-model="searchQuery"
              @input="handleSearch"
              class="form-control form-control-solid w-250px ps-13"
              placeholder="Search posts..."
            />
          </div>
        </div>

        <div class="card-toolbar">
          <div class="d-flex justify-content-end gap-2" data-kt-customer-table-toolbar="base">
            <!-- Filter by Status -->
            <select
              v-model="statusFilter"
              @change="handleStatusFilter"
              class="form-select form-select-solid w-150px"
            >
              <option :value="null">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>

            <!-- Filter by Category -->
            <select
              v-model="categoryFilter"
              @change="handleCategoryFilter"
              class="form-select form-select-solid w-150px"
              v-if="blogStore.categories.length > 0"
            >
              <option :value="null">All Categories</option>
              <option
                v-for="category in blogStore.categories"
                :key="category"
                :value="category"
              >
                {{ category }}
              </option>
            </select>

            <!-- Export -->
            <button
              type="button"
              class="btn btn-light-primary"
              @click="handleExport"
            >
              <i class="ki-duotone ki-exit-up fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              Export
            </button>

            <!-- Create New -->
            <NuxtLink
              to="/blog/create"
              class="btn btn-primary"
            >
              <i class="ki-duotone ki-plus fs-2"></i>
              New Post
            </NuxtLink>
          </div>

          <!-- Bulk Delete -->
          <div
            class="d-flex justify-content-end align-items-center gap-2"
            data-kt-customer-table-toolbar="selected"
            v-if="selectedIds.length > 0"
          >
            <div class="fw-bold me-5">
              <span class="me-2">{{ selectedIds.length }}</span>
              selected
            </div>
            <button
              type="button"
              class="btn btn-danger"
              @click="handleBulkDelete"
            >
              Delete Selected
            </button>
          </div>
        </div>
      </div>

      <div class="card-body pt-0">
        <!-- Table -->
        <div class="table-responsive" v-if="!blogStore.isLoading && blogStore.hasPosts">
          <table class="table align-middle table-row-dashed fs-6 gy-5">
            <thead>
              <tr class="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                <th class="w-10px pe-2">
                  <div class="form-check form-check-sm form-check-custom form-check-solid me-3">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      :checked="allSelected"
                      @change="toggleSelectAll"
                    />
                  </div>
                </th>
                <th class="min-w-200px">Title</th>
                <th class="min-w-125px">Category</th>
                <th class="min-w-125px">Author</th>
                <th class="min-w-100px">Status</th>
                <th class="min-w-100px">Views</th>
                <th class="min-w-125px">Date</th>
                <th class="text-end min-w-100px">Actions</th>
              </tr>
            </thead>
            <tbody class="fw-semibold text-gray-600">
              <tr v-for="post in blogStore.filteredPosts" :key="post.id">
                <td>
                  <div class="form-check form-check-sm form-check-custom form-check-solid">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      :checked="selectedIds.includes(post.id)"
                      @change="toggleSelect(post.id)"
                    />
                  </div>
                </td>
                <td>
                  <div class="d-flex flex-column">
                    <NuxtLink
                      :to="`/blog/${post.id}`"
                      class="text-gray-800 fw-bold text-hover-primary mb-1"
                    >
                      {{ post.title }}
                    </NuxtLink>
                    <span class="text-muted fs-7" v-if="post.excerpt">
                      {{ truncate(post.excerpt, 60) }}
                    </span>
                  </div>
                </td>
                <td>
                  <span
                    v-if="post.category"
                    class="badge"
                    :class="getCategoryBadgeClass(post.category)"
                  >
                    {{ post.category }}
                  </span>
                  <span v-else class="text-muted">—</span>
                </td>
                <td>
                  <span v-if="post.author">
                    {{ getAuthorName(post.author) }}
                  </span>
                  <span v-else class="text-muted">—</span>
                </td>
                <td>
                  <span
                    class="badge"
                    :class="getStatusBadgeClass(post.status)"
                  >
                    {{ getStatusText(post.status) }}
                  </span>
                </td>
                <td>
                  <span class="text-gray-600">
                    <i class="ki-duotone ki-eye fs-5 me-1">
                      <span class="path1"></span>
                      <span class="path2"></span>
                      <span class="path3"></span>
                    </i>
                    {{ formatViewCount(post.view_count) }}
                  </span>
                </td>
                <td>
                  <span class="text-gray-600">
                    {{ formatDateShort(post.published_at || post.created_at) }}
                  </span>
                </td>
                <td class="text-end">
                  <button
                    type="button"
                    class="btn btn-sm btn-icon btn-light btn-active-light-primary"
                    data-kt-menu-trigger="click"
                    data-kt-menu-placement="bottom-end"
                  >
                    <i class="ki-duotone ki-dots-vertical fs-2">
                      <span class="path1"></span>
                      <span class="path2"></span>
                      <span class="path3"></span>
                    </i>
                  </button>

                  <div
                    class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-125px py-4"
                    data-kt-menu="true"
                  >
                    <div class="menu-item px-3">
                      <NuxtLink
                        :to="`/blog/${post.id}`"
                        class="menu-link px-3"
                      >
                        View
                      </NuxtLink>
                    </div>
                    <div class="menu-item px-3">
                      <NuxtLink
                        :to="`/blog/${post.id}/edit`"
                        class="menu-link px-3"
                      >
                        Edit
                      </NuxtLink>
                    </div>
                    <div class="menu-item px-3">
                      <a
                        href="#"
                        class="menu-link px-3"
                        @click.prevent="handleToggleStatus(post)"
                      >
                        {{
                          post.status === 'published'
                            ? 'Set as Draft'
                            : 'Publish'
                        }}
                      </a>
                    </div>
                    <div class="menu-item px-3">
                      <a
                        href="#"
                        class="menu-link px-3 text-danger"
                        @click.prevent="handleDelete(post)"
                      >
                        Delete
                      </a>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Table Skeleton -->
        <div class="table-responsive" v-else-if="blogStore.isLoading">
          <table class="table align-middle table-row-dashed fs-6 gy-5">
            <thead>
              <tr class="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
                <th class="w-10px pe-2"></th>
                <th class="min-w-200px">Title</th>
                <th class="min-w-125px">Category</th>
                <th class="min-w-125px">Author</th>
                <th class="min-w-100px">Status</th>
                <th class="min-w-100px">Views</th>
                <th class="min-w-125px">Date</th>
                <th class="text-end min-w-100px">Actions</th>
              </tr>
            </thead>
            <TableSkeleton :rows="5" :columns="7" :hasCheckbox="true" :hasActions="true" />
          </table>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="!blogStore.hasPosts"
          class="text-center py-20"
        >
          <i class="ki-duotone ki-folder-down fs-5x text-gray-400 mb-5">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          <div class="fw-bold fs-3 text-gray-600 mb-2">
            No posts found
          </div>
          <div class="text-gray-500 mb-5">
            Create your first blog post
          </div>
          <NuxtLink to="/blog/create" class="btn btn-primary">
            <i class="ki-duotone ki-plus fs-2"></i>
            New Post
          </NuxtLink>
        </div>

        <!-- Error State -->
        <div
          v-else-if="blogStore.hasError"
          class="alert alert-danger d-flex align-items-center p-5"
        >
          <i class="ki-duotone ki-shield-cross fs-2hx text-danger me-4">
            <span class="path1"></span>
            <span class="path2"></span>
            <span class="path3"></span>
          </i>
          <div class="d-flex flex-column">
            <h4 class="mb-1 text-dark">Error</h4>
            <span>{{ blogStore.error }}</span>
          </div>
        </div>
      </div>
    </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useBlogStore } from '../stores/useBlogStore'
import { useBlogFormatters } from '../composables/useBlogFormatters'
import { useBlogActions } from '../composables/useBlogActions'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import type { BlogPost } from '../types'

const blogStore = useBlogStore()
const breadcrumbStore = useBreadcrumbStore()

const {
  truncate,
  getStatusBadgeClass,
  getStatusText,
  getCategoryBadgeClass,
  formatViewCount,
  getAuthorName,
  formatDateShort
} = useBlogFormatters()

const {
  confirmAndDeletePost,
  togglePostStatus,
  bulkDeletePosts,
  exportPostsToCSV
} = useBlogActions()

// Search and filters
const searchQuery = ref('')
const statusFilter = ref<string | null>(null)
const categoryFilter = ref<string | null>(null)

// Selection
const selectedIds = ref<string[]>([])

const allSelected = computed(() => {
  return (
    blogStore.filteredPosts.length > 0 &&
    selectedIds.value.length === blogStore.filteredPosts.length
  )
})

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedIds.value = []
  } else {
    selectedIds.value = blogStore.filteredPosts.map((p) => p.id)
  }
}

const toggleSelect = (id: string) => {
  const index = selectedIds.value.indexOf(id)
  if (index > -1) {
    selectedIds.value.splice(index, 1)
  } else {
    selectedIds.value.push(id)
  }
}

// Handlers
const handleSearch = async () => {
  await blogStore.debouncedSearch(searchQuery.value)
}

const handleStatusFilter = async () => {
  await blogStore.applyStatusFilter(statusFilter.value as any)
}

const handleCategoryFilter = async () => {
  await blogStore.applyCategoryFilter(categoryFilter.value)
}

const handleDelete = async (post: BlogPost) => {
  await confirmAndDeletePost(post)
}

const handleToggleStatus = async (post: BlogPost) => {
  await togglePostStatus(post)
}

const handleBulkDelete = async () => {
  const success = await bulkDeletePosts(selectedIds.value)
  if (success) {
    selectedIds.value = []
  }
}

const handleExport = () => {
  exportPostsToCSV()
}

// Lifecycle
onMounted(async () => {
  breadcrumbStore.setBreadcrumb([
    { title: 'Home', path: '/' },
    { title: 'Blog', path: '/blog/list' }
  ])

  await blogStore.initialize()
})
</script>
