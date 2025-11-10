<template>
  <!-- Page Header -->
  <PageHeader title="New Post" subtitle="Create a new blog post" />

  <!-- Form Card -->
  <div class="card">
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
                @input="onTitleChange"
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
                Leave empty to auto-generate from title
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
                  @error="handleImageError"
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
                Leave empty for anonymous post
              </div>
            </div>
          </div>

          <div class="separator my-10"></div>

          <!-- Section 4: Publication -->
          <div class="mb-10">
            <h3 class="fw-bold mb-5">Publication</h3>

            <!-- Status -->
            <div class="mb-5">
              <label class="form-label">Status</label>
              <StatusToggle
                v-model="formData.status"
                :show-description="true"
              />
            </div>

            <!-- Published At -->
            <div class="mb-5" v-if="formData.status === 'published'">
              <label class="form-label">Publication Date</label>
              <input
                type="datetime-local"
                v-model="publishedAtLocal"
                class="form-control form-control-solid"
              />
              <div class="form-text">
                Leave empty to publish immediately
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="d-flex justify-content-end gap-3">
            <NuxtLink to="/blog" class="btn btn-light">
              Cancel
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
                {{ formData.status === 'published' ? 'Publish' : 'Save' }}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useBlogStore } from '../stores/useBlogStore'
import { useBlogActions } from '../composables/useBlogActions'
import { useBreadcrumbStore } from '~/domains/shared/stores/breadcrumbStore'
import type { CreateBlogPostInput, PostStatus } from '../types'

const blogStore = useBlogStore()
const breadcrumbStore = useBreadcrumbStore()
const router = useRouter()
const { showSuccess, showError } = useNotification()
const { generateSlug } = useBlogActions()

const isSubmitting = ref(false)

const formData = reactive<CreateBlogPostInput>({
  title: '',
  slug: null,
  excerpt: null,
  content: '',
  featured_image_url: null,
  author_id: null,
  category: null,
  tags: [],
  status: 'draft',
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

const onTitleChange = () => {
  errors.title = ''
  // Auto-generate slug if empty
  if (!formData.slug) {
    formData.slug = generateSlug(formData.title)
  }
}

const handleImageError = () => {
  showError('Unable to load image')
}

const validateForm = (): boolean => {
  let isValid = true

  // Reset errors
  errors.title = ''
  errors.slug = ''
  errors.excerpt = ''
  errors.content = ''

  // Title
  if (!formData.title || formData.title.trim() === '') {
    errors.title = 'Title is required'
    isValid = false
  } else if (formData.title.length > 255) {
    errors.title = 'Title cannot exceed 255 characters'
    isValid = false
  }

  // Content
  if (!formData.content || formData.content.trim() === '') {
    errors.content = 'Content is required'
    isValid = false
  }

  // Excerpt
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
    // Auto-generate slug if empty
    if (!formData.slug) {
      formData.slug = generateSlug(formData.title)
    }

    // Create the post
    const createdPost = await blogStore.createPost(formData)

    showSuccess(
      formData.status === 'published'
        ? 'Post published successfully'
        : 'Post saved as draft'
    )

    // Redirect to edit page or list
    router.push('/blog')
  } catch (error: any) {
    showError(error.message || 'Failed to create post')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  breadcrumbStore.setBreadcrumb([
    { title: 'Home', path: '/' },
    { title: 'Blog', path: '/blog' },
    { title: 'New Post', path: '/blog/create' }
  ])
})
</script>
