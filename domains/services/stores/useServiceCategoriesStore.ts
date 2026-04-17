import { defineStore } from 'pinia'
import {
  GET_SERVICE_CATEGORIES,
  GET_SERVICE_CATEGORY,
  CREATE_SERVICE_CATEGORY,
  UPDATE_SERVICE_CATEGORY,
  DELETE_SERVICE_CATEGORY,
} from '../graphql/category-queries'

export interface ServiceCategory {
  id: string
  name: string
  slug: string
  created_at: string
  updated_at: string
}

interface State {
  categories: ServiceCategory[]
  currentCategory: ServiceCategory | null
  loading: boolean
  error: string | null
}

export const useServiceCategoriesStore = defineStore('serviceCategories', {
  state: (): State => ({
    categories: [],
    currentCategory: null,
    loading: false,
    error: null,
  }),

  getters: {
    isLoading: (state) => state.loading,
    hasError: (state) => !!state.error,
    sortedCategories: (state) => [...state.categories].sort((a, b) => a.name.localeCompare(b.name)),
  },

  actions: {
    async fetchCategories() {
      this.loading = true
      this.error = null
      try {
        const data = await useApi().query<{ serviceCategories: ServiceCategory[] }>(GET_SERVICE_CATEGORIES)
        this.categories = [...(data.serviceCategories || [])]
      } catch (err: any) {
        this.error = err.message || 'Failed to load categories'
        this.categories = []
      } finally {
        this.loading = false
      }
    },

    async fetchCategory(id: string) {
      this.loading = true
      this.error = null
      try {
        const data = await useApi().query<{ serviceCategory: ServiceCategory }>(GET_SERVICE_CATEGORY, {
          variables: { id },
        })
        if (data.serviceCategory) {
          this.currentCategory = { ...data.serviceCategory }
          return data.serviceCategory
        }
      } catch (err: any) {
        this.error = err.message || 'Failed to load category'
        throw err
      } finally {
        this.loading = false
      }
    },

    async createCategory(input: { name: string; slug?: string }) {
      this.loading = true
      this.error = null
      try {
        const data = await useApi().mutate<{ createServiceCategory: ServiceCategory }>(CREATE_SERVICE_CATEGORY, {
          variables: { input },
        })
        await this.fetchCategories()
        return data.createServiceCategory
      } catch (err: any) {
        this.error = err.message || 'Failed to create category'
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateCategory(id: string, input: { name?: string; slug?: string }) {
      this.loading = true
      this.error = null
      try {
        const data = await useApi().mutate<{ updateServiceCategory: ServiceCategory }>(UPDATE_SERVICE_CATEGORY, {
          variables: { id, input },
        })
        const updated = data.updateServiceCategory
        const idx = this.categories.findIndex((c) => c.id === id)
        if (idx !== -1) this.categories.splice(idx, 1, updated)
        if (this.currentCategory?.id === id) this.currentCategory = { ...updated }
        return updated
      } catch (err: any) {
        this.error = err.message || 'Failed to update category'
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteCategory(id: string) {
      this.loading = true
      this.error = null
      try {
        const data = await useApi().mutate<{ deleteServiceCategory: { success: boolean; message: string } }>(DELETE_SERVICE_CATEGORY, {
          variables: { id },
        })
        this.categories = this.categories.filter((c) => c.id !== id)
        if (this.currentCategory?.id === id) this.currentCategory = null
        return data.deleteServiceCategory
      } catch (err: any) {
        this.error = err.message || 'Failed to delete category'
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})
