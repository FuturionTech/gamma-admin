import { defineStore } from 'pinia'
import type {
  BlogPost,
  CreateBlogPostInput,
  UpdateBlogPostInput,
  BlogPostFilterInput,
  BlogPostStatistics,
  BlogPostsResponse,
  BlogPostResponse,
  CreateBlogPostResponse,
  UpdateBlogPostResponse,
  DeleteBlogPostResponse,
  PostStatus
} from '../types'
import { GET_BLOG_POSTS, GET_BLOG_POST_BY_ID } from '../graphql/queries'
import { CREATE_BLOG_POST, UPDATE_BLOG_POST, DELETE_BLOG_POST } from '../graphql/mutations'

interface BlogState {
  posts: BlogPost[]
  currentPost: BlogPost | null
  loading: boolean
  error: string | null
  filters: BlogPostFilterInput
  statistics: BlogPostStatistics
}

export const useBlogStore = defineStore('blog', {
  state: (): BlogState => ({
    posts: [],
    currentPost: null,
    loading: false,
    error: null,
    filters: {
      search: null,
      status: null,
      category: null,
      author_id: null,
      dateFrom: null,
      dateTo: null
    },
    statistics: {
      total: 0,
      published: 0,
      drafts: 0,
      totalViews: 0,
      mostViewed: null,
      byCategory: {},
      byAuthor: {}
    }
  }),

  getters: {
    getBlogPostById: (state) => (id: string) => {
      return state.posts.find(p => p.id === id)
    },

    hasPosts: (state) => state.posts.length > 0,

    isLoading: (state) => state.loading,

    hasError: (state) => !!state.error,

    publishedPosts: (state) => {
      return state.posts.filter(p => p.status === 'published')
    },

    draftPosts: (state) => {
      return state.posts.filter(p => p.status === 'draft')
    },

    postsByCategory: (state) => {
      return state.posts.reduce((acc, post) => {
        const category = post.category || 'Uncategorized'
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push(post)
        return acc
      }, {} as Record<string, BlogPost[]>)
    },

    postsByAuthor: (state) => {
      return state.posts.reduce((acc, post) => {
        if (post.author) {
          const authorName = `${post.author.first_name} ${post.author.last_name}`
          if (!acc[authorName]) {
            acc[authorName] = []
          }
          acc[authorName].push(post)
        }
        return acc
      }, {} as Record<string, BlogPost[]>)
    },

    filteredPosts: (state) => {
      let filtered = [...state.posts]

      // Apply search filter
      if (state.filters.search) {
        const searchLower = state.filters.search.toLowerCase()
        filtered = filtered.filter(p =>
          p.title.toLowerCase().includes(searchLower) ||
          p.excerpt?.toLowerCase().includes(searchLower) ||
          p.content.toLowerCase().includes(searchLower) ||
          p.category?.toLowerCase().includes(searchLower) ||
          p.tags?.some(tag => tag.toLowerCase().includes(searchLower))
        )
      }

      // Apply status filter
      if (state.filters.status) {
        filtered = filtered.filter(p => p.status === state.filters.status)
      }

      // Apply category filter
      if (state.filters.category) {
        filtered = filtered.filter(p => p.category === state.filters.category)
      }

      // Apply author filter
      if (state.filters.author_id) {
        filtered = filtered.filter(p => p.author_id === state.filters.author_id)
      }

      // Apply date range filter
      if (state.filters.dateFrom) {
        filtered = filtered.filter(p => {
          const postDate = new Date(p.published_at || p.created_at)
          return postDate >= new Date(state.filters.dateFrom!)
        })
      }

      if (state.filters.dateTo) {
        filtered = filtered.filter(p => {
          const postDate = new Date(p.published_at || p.created_at)
          return postDate <= new Date(state.filters.dateTo!)
        })
      }

      return filtered
    },

    categories: (state) => {
      const cats = new Set(state.posts.map(p => p.category).filter(Boolean))
      return Array.from(cats)
    },

    authors: (state) => {
      const authorMap = new Map()
      state.posts.forEach(p => {
        if (p.author) {
          authorMap.set(p.author.id, p.author)
        }
      })
      return Array.from(authorMap.values())
    }
  },

  actions: {
    // State mutations
    setLoading(loading: boolean) {
      this.loading = loading
    },

    setError(error: string | null) {
      this.error = error
    },

    setPosts(posts: BlogPost[]) {
      this.posts = posts
      this.updateStatistics()
    },

    setCurrentPost(post: BlogPost | null) {
      this.currentPost = post
    },

    setFilters(filters: Partial<BlogPostFilterInput>) {
      this.filters = { ...this.filters, ...filters }
    },

    resetFilters() {
      this.filters = {
        search: null,
        status: null,
        category: null,
        author_id: null,
        dateFrom: null,
        dateTo: null
      }
    },

    updateStatistics() {
      const publishedPosts = this.posts.filter(p => p.status === 'published')
      const draftPosts = this.posts.filter(p => p.status === 'draft')
      const totalViews = this.posts.reduce((sum, p) => sum + p.view_count, 0)

      let mostViewed: BlogPost | null = null
      if (this.posts.length > 0) {
        mostViewed = this.posts.reduce((max, p) =>
          p.view_count > max.view_count ? p : max
        , this.posts[0])
      }

      this.statistics = {
        total: this.posts.length,
        published: publishedPosts.length,
        drafts: draftPosts.length,
        totalViews,
        mostViewed,
        byCategory: this.posts.reduce((acc, post) => {
          const category = post.category || 'Uncategorized'
          acc[category] = (acc[category] || 0) + 1
          return acc
        }, {} as Record<string, number>),
        byAuthor: this.posts.reduce((acc, post) => {
          if (post.author) {
            const authorName = `${post.author.first_name} ${post.author.last_name}`
            acc[authorName] = (acc[authorName] || 0) + 1
          }
          return acc
        }, {} as Record<string, number>)
      }
    },

    // API Actions
    async fetchPosts() {
      this.setLoading(true)
      this.setError(null)

      try {
        const variables: any = {
          limit: 100
        }

        // Only add status filter if set
        if (this.filters.status) {
          variables.status = this.filters.status.toUpperCase()
        }

        const { data, error } = await useAsyncQuery<BlogPostsResponse>(
          GET_BLOG_POSTS,
          variables
        )

        if (error.value) {
          throw new Error(error.value.message || 'Failed to fetch blog posts')
        }

        if (data.value) {
          this.setPosts(data.value.blogPosts)
        }
      } catch (err: any) {
        console.error('Error fetching blog posts:', err)
        this.setError(err.message || 'Failed to load blog posts')
        this.setPosts([])
      } finally {
        this.setLoading(false)
      }
    },

    async fetchPost(id: string) {
      this.setLoading(true)
      this.setError(null)

      try {
        // First, try to find in local state
        const localPost = this.getBlogPostById(id)
        if (localPost) {
          this.setCurrentPost(localPost)
          this.setLoading(false)
          return localPost
        }

        // If not in local state, we need to fetch all posts and find it
        // Since backend only supports slug lookup, we need posts loaded first
        if (this.posts.length === 0) {
          await this.fetchPosts()
        }

        const post = this.getBlogPostById(id)
        if (post) {
          this.setCurrentPost(post)
          return post
        }

        throw new Error('Blog post not found')
      } catch (err: any) {
        console.error('Error fetching blog post:', err)
        this.setError(err.message || 'Failed to load blog post')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async createPost(input: CreateBlogPostInput) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        // Auto-publish if status is PUBLISHED and no published_at is set
        if (input.status === 'published' && !input.published_at) {
          input.published_at = new Date().toISOString()
        }

        const response = await apolloClient.mutate<CreateBlogPostResponse>({
          mutation: CREATE_BLOG_POST,
          variables: { input }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.createBlogPost) {
          await this.fetchPosts()
          return response.data.createBlogPost
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        console.error('Error creating blog post:', err)
        this.setError(err.message || 'Failed to create blog post')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async updatePost(id: string, input: UpdateBlogPostInput) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        // Auto-publish if changing status to PUBLISHED
        if (input.status === 'published' && !input.published_at) {
          const currentPost = this.getBlogPostById(id)
          if (currentPost && !currentPost.published_at) {
            input.published_at = new Date().toISOString()
          }
        }

        const response = await apolloClient.mutate<UpdateBlogPostResponse>({
          mutation: UPDATE_BLOG_POST,
          variables: { id, input }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.updateBlogPost) {
          const index = this.posts.findIndex(p => p.id === id)
          if (index !== -1) {
            this.posts[index] = response.data.updateBlogPost
          }

          if (this.currentPost?.id === id) {
            this.setCurrentPost(response.data.updateBlogPost)
          }

          this.updateStatistics()
          return response.data.updateBlogPost
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        console.error('Error updating blog post:', err)
        this.setError(err.message || 'Failed to update blog post')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async deletePost(id: string) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        const response = await apolloClient.mutate<DeleteBlogPostResponse>({
          mutation: DELETE_BLOG_POST,
          variables: { id }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.deleteBlogPost) {
          this.posts = this.posts.filter(p => p.id !== id)

          if (this.currentPost?.id === id) {
            this.setCurrentPost(null)
          }

          this.updateStatistics()
          return response.data.deleteBlogPost
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        console.error('Error deleting blog post:', err)
        this.setError(err.message || 'Failed to delete blog post')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async togglePostStatus(id: string) {
      const post = this.getBlogPostById(id)
      if (!post) {
        throw new Error('Blog post not found')
      }

      const newStatus: PostStatus = post.status === 'published' ? 'draft' : 'published'

      return await this.updatePost(id, {
        status: newStatus
      })
    },

    async bulkDelete(ids: string[]) {
      const errors: string[] = []

      for (const id of ids) {
        try {
          await this.deletePost(id)
        } catch (err: any) {
          errors.push(`Failed to delete post ${id}: ${err.message}`)
        }
      }

      if (errors.length > 0) {
        throw new Error(errors.join('\n'))
      }
    },

    // Filter actions
    async applySearchFilter(searchValue: string) {
      this.setFilters({ search: searchValue })
    },

    async applyStatusFilter(status: PostStatus | null) {
      this.setFilters({ status })
    },

    async applyCategoryFilter(category: string | null) {
      this.setFilters({ category })
    },

    async applyAuthorFilter(author_id: string | null) {
      this.setFilters({ author_id })
    },

    async applyDateRangeFilter(dateFrom: string | null, dateTo: string | null) {
      this.setFilters({ dateFrom, dateTo })
    },

    // Debounced search
    debouncedSearch(searchValue: string) {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          this.applySearchFilter(searchValue)
          resolve()
        }, 300)
      })
    },

    // Initialize
    async initialize() {
      await this.fetchPosts()
    }
  }
})
