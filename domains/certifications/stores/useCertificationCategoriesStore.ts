import { defineStore } from 'pinia'
import type {
  CertificationCategory,
  CreateCertificationCategoryInput,
  UpdateCertificationCategoryInput,
  CertificationCategoriesResponse,
  CertificationCategoryResponse,
  CreateCertificationCategoryResponse,
  UpdateCertificationCategoryResponse,
  DeleteCertificationCategoryResponse
} from '../types'
import { GET_CERTIFICATION_CATEGORIES, GET_CERTIFICATION_CATEGORY } from '../graphql/queries'
import {
  CREATE_CERTIFICATION_CATEGORY,
  UPDATE_CERTIFICATION_CATEGORY,
  DELETE_CERTIFICATION_CATEGORY
} from '../graphql/mutations'

interface CertificationCategoriesState {
  categories: CertificationCategory[]
  currentCategory: CertificationCategory | null
  loading: boolean
  error: string | null
}

export const useCertificationCategoriesStore = defineStore('certificationCategories', {
  state: (): CertificationCategoriesState => ({
    categories: [],
    currentCategory: null,
    loading: false,
    error: null
  }),

  getters: {
    getCategoryById: (state) => (id: string) => {
      return state.categories.find(c => c.id === id)
    },

    hasCategories: (state) => state.categories.length > 0,

    isLoading: (state) => state.loading,

    hasError: (state) => !!state.error,

    sortedCategories: (state) => {
      return [...state.categories].sort((a, b) => a.name.localeCompare(b.name))
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

    setCategories(categories: CertificationCategory[]) {
      this.categories = categories
    },

    setCurrentCategory(category: CertificationCategory | null) {
      this.currentCategory = category
    },

    // API Actions
    async fetchCategories() {
      this.setLoading(true)
      this.setError(null)

      try {
        const { data, error } = await useAsyncQuery<CertificationCategoriesResponse>(
          GET_CERTIFICATION_CATEGORIES
        )

        if (error.value) {
          throw new Error(error.value.message || 'Failed to fetch categories')
        }

        if (data.value) {
          this.setCategories(data.value.certificationCategories)
        }
      } catch (err: any) {
        console.error('Error fetching categories:', err)
        this.setError(err.message || 'Failed to load categories')
        this.setCategories([])
      } finally {
        this.setLoading(false)
      }
    },

    async fetchCategory(id: string) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { data, error } = await useAsyncQuery<CertificationCategoryResponse>(
          GET_CERTIFICATION_CATEGORY,
          { id }
        )

        if (error.value) {
          throw new Error(error.value.message || 'Failed to fetch category')
        }

        if (data.value) {
          this.setCurrentCategory(data.value.certificationCategory)
          return data.value.certificationCategory
        }
      } catch (err: any) {
        console.error('Error fetching category:', err)
        this.setError(err.message || 'Failed to load category')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async createCategory(input: CreateCertificationCategoryInput) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        const response = await apolloClient.mutate<CreateCertificationCategoryResponse>({
          mutation: CREATE_CERTIFICATION_CATEGORY,
          variables: { input }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.createCertificationCategory) {
          await this.fetchCategories()
          return response.data.createCertificationCategory
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        console.error('Error creating category:', err)
        this.setError(err.message || 'Failed to create category')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async updateCategory(id: string, input: UpdateCertificationCategoryInput) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        const response = await apolloClient.mutate<UpdateCertificationCategoryResponse>({
          mutation: UPDATE_CERTIFICATION_CATEGORY,
          variables: { id, input }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.updateCertificationCategory) {
          const index = this.categories.findIndex(c => c.id === id)
          if (index !== -1) {
            this.categories[index] = response.data.updateCertificationCategory
          }

          if (this.currentCategory?.id === id) {
            this.setCurrentCategory(response.data.updateCertificationCategory)
          }

          return response.data.updateCertificationCategory
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        console.error('Error updating category:', err)
        this.setError(err.message || 'Failed to update category')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    async deleteCategory(id: string) {
      this.setLoading(true)
      this.setError(null)

      try {
        const { $apollo } = useNuxtApp()
        const apolloClient = $apollo.default

        const response = await apolloClient.mutate<DeleteCertificationCategoryResponse>({
          mutation: DELETE_CERTIFICATION_CATEGORY,
          variables: { id }
        })

        if (response?.errors?.length) {
          throw new Error(response.errors[0].message)
        }

        if (response?.data?.deleteCertificationCategory) {
          this.categories = this.categories.filter(c => c.id !== id)

          if (this.currentCategory?.id === id) {
            this.setCurrentCategory(null)
          }

          return response.data.deleteCertificationCategory
        }

        throw new Error('No data returned from server')
      } catch (err: any) {
        console.error('Error deleting category:', err)
        this.setError(err.message || 'Failed to delete category')
        throw err
      } finally {
        this.setLoading(false)
      }
    },

    // Initialize
    async initialize() {
      await this.fetchCategories()
    }
  }
})
