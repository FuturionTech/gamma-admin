<template>
  <!-- Loading State -->
  <div v-if="blogStore.isLoading" class="card">
    <div class="card-body">
      <div class="text-center py-20">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
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

  <!-- Content -->
  <template v-else-if="post">
      <!-- Header Card -->
      <div class="card mb-5">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start mb-5">
            <div class="flex-grow-1">
              <!-- Status Badge -->
              <span
                class="badge mb-3"
                :class="getStatusBadgeClass(post.status)"
              >
                {{ getStatusText(post.status) }}
              </span>

              <!-- Title -->
              <h1 class="fw-bold text-gray-900 mb-3">
                {{ post.title }}
              </h1>

              <!-- Meta Info -->
              <div class="d-flex flex-wrap gap-5 text-gray-600">
                <div v-if="post.author" class="d-flex align-items-center">
                  <i class="ki-duotone ki-user fs-3 me-2">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                  <span>{{ getAuthorName(post.author) }}</span>
                </div>
                <div class="d-flex align-items-center">
                  <i class="ki-duotone ki-calendar fs-3 me-2">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                  <span>{{ formatDate(post.published_at || post.created_at) }}</span>
                </div>
                <div class="d-flex align-items-center">
                  <i class="ki-duotone ki-eye fs-3 me-2">
                    <span class="path1"></span>
                    <span class="path2"></span>
                    <span class="path3"></span>
                  </i>
                  <span>{{ formatViewCount(post.view_count) }} views</span>
                </div>
                <div class="d-flex align-items-center">
                  <i class="ki-duotone ki-time fs-3 me-2">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                  <span>{{ calculateReadingTime(post.content) }} min read</span>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="d-flex gap-2">
              <NuxtLink
                :to="`/blog/${post.id}/edit`"
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
                @click="handleDelete"
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

          <!-- Category and Tags -->
          <div class="d-flex flex-wrap gap-3 align-items-center">
            <div v-if="post.category" class="d-flex align-items-center">
              <span class="text-gray-600 me-2">Category:</span>
              <span
                class="badge"
                :class="getCategoryBadgeClass(post.category)"
              >
                {{ post.category }}
              </span>
            </div>

            <div v-if="post.tags && post.tags.length > 0" class="d-flex align-items-center gap-2">
              <span class="text-gray-600">Tags:</span>
              <div class="d-flex flex-wrap gap-2">
                <span
                  v-for="tag in post.tags"
                  :key="tag"
                  class="badge badge-light"
                >
                  #{{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Featured Image -->
      <div v-if="post.featured_image_url" class="card mb-5">
        <div class="card-body p-0">
          <img
            :src="post.featured_image_url"
            :alt="post.title"
            class="w-100 rounded"
            style="max-height: 500px; object-fit: cover;"
          />
        </div>
      </div>

      <!-- Excerpt -->
      <div v-if="post.excerpt" class="card mb-5">
        <div class="card-body">
          <div class="fs-4 text-gray-700 fw-semibold fst-italic border-start border-primary border-5 ps-5">
            {{ post.excerpt }}
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="card mb-5">
        <div class="card-body">
          <div class="blog-content fs-5 text-gray-800 lh-lg" v-html="post.content"></div>
        </div>
      </div>

      <!-- Article Info -->
      <div class="card">
        <div class="card-body">
          <h4 class="fw-bold mb-5">Post Information</h4>

          <div class="row g-5">
            <!-- Left Column -->
            <div class="col-md-6">
              <div class="mb-4">
                <div class="text-gray-600 mb-2">Slug</div>
                <div class="fw-semibold text-gray-900">{{ post.slug }}</div>
              </div>

              <div class="mb-4">
                <div class="text-gray-600 mb-2">Created</div>
                <div class="fw-semibold text-gray-900">{{ formatDateTime(post.created_at) }}</div>
              </div>

              <div class="mb-4">
                <div class="text-gray-600 mb-2">Updated</div>
                <div class="fw-semibold text-gray-900">{{ formatDateTime(post.updated_at) }}</div>
              </div>
            </div>

            <!-- Right Column -->
            <div class="col-md-6">
              <div class="mb-4" v-if="post.published_at">
                <div class="text-gray-600 mb-2">Published</div>
                <div class="fw-semibold text-gray-900">{{ formatDateTime(post.published_at) }}</div>
              </div>

              <div class="mb-4">
                <div class="text-gray-600 mb-2">Post ID</div>
                <div class="fw-semibold text-gray-900">{{ post.id }}</div>
              </div>

              <div class="mb-4">
                <div class="text-gray-600 mb-2">Application ID</div>
                <div class="fw-semibold text-gray-900">{{ post.application_id }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

    <!-- Back Button -->
    <div class="mt-5">
      <NuxtLink to="/blog" class="btn btn-light">
        <i class="ki-duotone ki-arrow-left fs-2">
          <span class="path1"></span>
          <span class="path2"></span>
        </i>
        Back to list
      </NuxtLink>
    </div>
  </template>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useBlogStore } from '../stores/useBlogStore'
import { useBlogActions } from '../composables/useBlogActions'
import { useBlogFormatters } from '../composables/useBlogFormatters'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'

const blogStore = useBlogStore()
const breadcrumbStore = useBreadcrumbStore()
const route = useRoute()
const router = useRouter()
const { confirmAndDeletePost } = useBlogActions()
const {
  formatDate,
  formatDateTime,
  getStatusBadgeClass,
  getStatusText,
  getCategoryBadgeClass,
  formatViewCount,
  getAuthorName,
  calculateReadingTime
} = useBlogFormatters()

const postId = computed(() => route.params.id as string)
const post = computed(() => blogStore.currentPost)

const loadPost = async () => {
  try {
    await blogStore.fetchPost(postId.value)
  } catch (error: any) {
    console.error('Failed to load post:', error)
  }
}

const handleDelete = async () => {
  if (!post.value) return

  const success = await confirmAndDeletePost(post.value)
  if (success) {
    router.push('/blog')
  }
}

onMounted(async () => {
  await loadPost()

  if (post.value) {
    breadcrumbStore.setBreadcrumb([
      { title: 'Home', path: '/' },
      { title: 'Blog', path: '/blog' },
      { title: post.value.title, path: `/blog/${post.value.id}` }
    ])
  }
})
</script>

<style scoped>
.blog-content {
  /* Styling for blog content */
}

.blog-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1.5rem 0;
}

.blog-content :deep(h2),
.blog-content :deep(h3),
.blog-content :deep(h4) {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.blog-content :deep(p) {
  margin-bottom: 1rem;
}

.blog-content :deep(ul),
.blog-content :deep(ol) {
  margin-bottom: 1rem;
  padding-left: 2rem;
}

.blog-content :deep(blockquote) {
  border-left: 4px solid #009ef7;
  padding-left: 1.5rem;
  margin: 1.5rem 0;
  font-style: italic;
  color: #7e8299;
}

.blog-content :deep(code) {
  background-color: #f5f8fa;
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-family: monospace;
  font-size: 0.9em;
}

.blog-content :deep(pre) {
  background-color: #1e1e2e;
  color: #cdd6f4;
  padding: 1.5rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1.5rem 0;
}

.blog-content :deep(pre code) {
  background-color: transparent;
  padding: 0;
  color: inherit;
}
</style>
