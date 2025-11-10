<template>
  <!-- Page Header -->
  <PageHeader
    :title="post ? 'Edit Post' : 'Loading...'"
    :subtitle="post?.title"
  />

  <!-- Loading State -->
  <div v-if="blogStore.isLoading" class="card">
    <div class="card-body">
      <FormSkeleton :fields="8" :showActions="true" />
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

  <!-- Form -->
  <div v-else-if="post" class="card">
      <!-- Card Header with Delete Button -->
      <div class="card-header border-0">
        <div class="card-title">
          <h3 class="fw-bold m-0">Edit Post</h3>
        </div>
        <div class="card-toolbar">
          <button
            type="button"
            class="btn btn-light-danger"
            @click="handleDelete"
            :disabled="isSubmitting"
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

      <div class="card-body">
        <form @submit.prevent="handleSubmit">
          <!-- Section 1: Content -->
          <div class="mb-10">
            <h3 class="fw-bold mb-5">Content</h3>

            <!-- Title -->
            <div class="mb-5">
              <label class="form-label required">Title</label>
              <input
                type="text"
                v-model="formData.title"
                class="form-control form-control-solid"
                :class="{ 'is-invalid': errors.title }"
                placeholder="Enter post title"
              />
              <div v-if="errors.title" class="invalid-feedback">
                {{ errors.title }}
              </div>
            </div>

            <!-- Slug -->
            <div class="mb-5">
              <label class="form-label">Slug</label>
              <input
                type="text"
                v-model="formData.slug"
                class="form-control form-control-solid"
                :class="{ 'is-invalid': errors.slug }"
                placeholder="post-slug"
              />
              <div class="form-text">
                Post URL: /blog/{{ formData.slug || 'slug' }}
              </div>
              <div v-if="errors.slug" class="invalid-feedback">
                {{ errors.slug }}
              </div>
            </div>

            <!-- Excerpt -->
            <div class="mb-5">
              <label class="form-label">Excerpt</label>
              <textarea
                v-model="formData.excerpt"
                class="form-control form-control-solid"
                :class="{ 'is-invalid': errors.excerpt }"
                rows="3"
                maxlength="200"
                placeholder="A short summary of the post (max 200 characters)"
              ></textarea>
              <div class="form-text">
                {{ formData.excerpt?.length || 0 }} / 200 characters
              </div>
              <div v-if="errors.excerpt" class="invalid-feedback">
                {{ errors.excerpt }}
              </div>
            </div>

            <!-- Content -->
            <div class="mb-5">
              <label class="form-label required">Content</label>
              <RichTextEditor
                v-model="formData.content"
                :init-options="{ height: 600 }"
              />
              <div v-if="errors.content" class="text-danger fs-7 mt-2">
                {{ errors.content }}
              </div>
            </div>
          </div>

          <div class="separator my-10"></div>

          <!-- Section 2: Media -->
          <div class="mb-10">
            <h3 class="fw-bold mb-5">Media</h3>

            <!-- Featured Image -->
            <div class="mb-5">
              <label class="form-label">Featured Image</label>
              <input
                type="text"
                v-model="formData.featured_image_url"
                class="form-control form-control-solid"
                placeholder="Image URL"
              />
              <div class="form-text">
                URL for the featured image of the post
              </div>

              <!-- Image Preview -->
              <div v-if="formData.featured_image_url" class="mt-3">
                <img
                  :src="formData.featured_image_url"
                  alt="Preview"
                  class="img-thumbnail"
                  style="max-width: 300px;"
                />
              </div>
            </div>
          </div>

          <div class="separator my-10"></div>

          <!-- Section 3: Taxonomy -->
          <div class="mb-10">
            <h3 class="fw-bold mb-5">Taxonomy</h3>

            <!-- Category -->
            <div class="mb-5">
              <label class="form-label">Category</label>
              <input
                type="text"
                v-model="formData.category"
                class="form-control form-control-solid"
                placeholder="e.g. AI, Tech Trends, Innovation..."
                list="categories-list"
              />
              <datalist id="categories-list">
                <option
                  v-for="category in blogStore.categories"
                  :key="category"
                  :value="category"
                />
              </datalist>
            </div>

            <!-- Tags -->
            <div class="mb-5">
              <label class="form-label">Tags</label>
              <TagInput
                v-model="formData.tags"
                placeholder="Add tags..."
              />
            </div>

            <!-- Author -->
            <div class="mb-5">
              <label class="form-label">Author</label>
              <input
                type="text"
                v-model="formData.author_id"
                class="form-control form-control-solid"
                placeholder="Author ID (optional)"
              />
              <div class="form-text">
                Current: {{ getAuthorName(post.author) }}
              </div>
            </div>
          </div>

          <div class="separator my-10"></div>

          <!-- Section 4: Publication -->
          <div class="mb-10">
            <h3 class="fw-bold mb-5">Publication</h3>

            <!-- View Count (Read-only) -->
            <div class="mb-5">
              <label class="form-label">Statistics</label>
              <div class="d-flex gap-5">
                <div class="d-flex align-items-center">
                  <i class="ki-duotone ki-eye fs-2 text-primary me-2">
                    <span class="path1"></span>
                    <span class="path2"></span>
                    <span class="path3"></span>
                  </i>
                  <span class="fw-bold">{{ formatViewCount(post.view_count) }} views</span>
                </div>
                <div class="d-flex align-items-center">
                  <i class="ki-duotone ki-time fs-2 text-info me-2">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                  <span class="fw-bold">{{ calculateReadingTime(post.content) }} min read</span>
                </div>
              </div>
            </div>

            <!-- Status -->
            <div class="mb-5">
              <label class="form-label">Status</label>
              <StatusToggle
                v-model="formData.status"
                :show-description="true"
              />
            </div>

            <!-- Published At -->
            <div class="mb-5">
              <label class="form-label">Publication Date</label>
              <input
                type="datetime-local"
                v-model="publishedAtLocal"
                class="form-control form-control-solid"
              />
              <div class="form-text">
                First published: {{ formatDateTime(post.created_at) }}
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="d-flex justify-content-between">
            <NuxtLink to="/blog" class="btn btn-light">
              <i class="ki-duotone ki-arrow-left fs-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              Back
            </NuxtLink>
            <div class="d-flex gap-3">
              <NuxtLink :to="`/blog/${post.id}`" class="btn btn-light-primary">
                <i class="ki-duotone ki-eye fs-2">
                  <span class="path1"></span>
                  <span class="path2"></span>
                  <span class="path3"></span>
                </i>
                Preview
              </NuxtLink>
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="isSubmitting"
              >
                <span v-if="isSubmitting" class="indicator-progress">
                  Saving...
                  <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
                <span v-else>
                  <i class="ki-duotone ki-check fs-2"></i>
                  Save
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useBlogStore } from '../stores/useBlogStore'
import { useBlogActions } from '../composables/useBlogActions'
import { useBlogFormatters } from '../composables/useBlogFormatters'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import type { UpdateBlogPostInput, PostStatus } from '../types'

const blogStore = useBlogStore()
const breadcrumbStore = useBreadcrumbStore()
const route = useRoute()
const router = useRouter()
const { showSuccess, showError } = useNotification()
const { confirmAndDeletePost } = useBlogActions()
const { formatViewCount, calculateReadingTime, formatDateTime, getAuthorName } = useBlogFormatters()

const postId = computed(() => route.params.id as string)
const post = computed(() => blogStore.currentPost)
const isSubmitting = ref(false)

const formData = reactive<UpdateBlogPostInput & { tags: string[] }>({
  title: null,
  slug: null,
  excerpt: null,
  content: null,
  featured_image_url: null,
  author_id: null,
  category: null,
  tags: [],
  status: null,
  published_at: null
})

const errors = reactive({
  title: '',
  slug: '',
  excerpt: '',
  content: ''
})

const publishedAtLocal = computed({
  get: () => {
    if (!formData.published_at) return ''
    const date = new Date(formData.published_at)
    return date.toISOString().slice(0, 16)
  },
  set: (value: string) => {
    if (value) {
      formData.published_at = new Date(value).toISOString()
    } else {
      formData.published_at = null
    }
  }
})

const loadPost = async () => {
  try {
    const loadedPost = await blogStore.fetchPost(postId.value)
    if (loadedPost) {
      // Populate form with current values
      formData.title = loadedPost.title
      formData.slug = loadedPost.slug
      formData.excerpt = loadedPost.excerpt
      formData.content = loadedPost.content
      formData.featured_image_url = loadedPost.featured_image_url
      formData.author_id = loadedPost.author_id
      formData.category = loadedPost.category
      formData.tags = loadedPost.tags || []
      formData.status = loadedPost.status
      formData.published_at = loadedPost.published_at
    }
  } catch (error: any) {
    showError(error.message || 'Unable to load post')
  }
}

const validateForm = (): boolean => {
  let isValid = true

  errors.title = ''
  errors.slug = ''
  errors.excerpt = ''
  errors.content = ''

  if (formData.title && formData.title.length > 255) {
    errors.title = 'Title cannot exceed 255 characters'
    isValid = false
  }

  if (formData.excerpt && formData.excerpt.length > 200) {
    errors.excerpt = 'Excerpt cannot exceed 200 characters'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    showError('Please correct the errors in the form')
    return
  }

  isSubmitting.value = true

  try {
    await blogStore.updatePost(postId.value, formData)
    showSuccess('Post updated successfully')
  } catch (error: any) {
    showError(error.message || 'Failed to update post')
  } finally {
    isSubmitting.value = false
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
      { title: post.value.title, path: `/blog/${post.value.id}` },
      { title: 'Edit', path: `/blog/${post.value.id}/edit` }
    ])
  }
})
</script>
