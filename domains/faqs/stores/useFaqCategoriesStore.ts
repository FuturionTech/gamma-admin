import { defineStore } from 'pinia'
import { gql } from '@apollo/client/core'

export interface FaqCategory {
  id: string
  name: string
  slug: string
  created_at: string
  updated_at: string
}

const GET_FAQ_CATEGORIES = gql`query { faqCategories { id name slug created_at updated_at } }`
const CREATE_FAQ_CATEGORY = gql`mutation($input: CreateFaqCategoryInput!) { createFaqCategory(input: $input) { id name slug } }`
const UPDATE_FAQ_CATEGORY = gql`mutation($id: ID!, $input: UpdateFaqCategoryInput!) { updateFaqCategory(id: $id, input: $input) { id name slug } }`
const DELETE_FAQ_CATEGORY = gql`mutation($id: ID!) { deleteFaqCategory(id: $id) { success message } }`

export const useFaqCategoriesStore = defineStore('faqCategories', {
  state: () => ({
    categories: [] as FaqCategory[],
    currentCategory: null as FaqCategory | null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    isLoading: (s) => s.loading,
    sortedCategories: (s) => [...s.categories].sort((a, b) => a.name.localeCompare(b.name)),
  },

  actions: {
    async fetchCategories() {
      this.loading = true
      this.error = null
      try {
        const data = await useApi().query<{ faqCategories: FaqCategory[] }>(GET_FAQ_CATEGORIES)
        this.categories = [...(data.faqCategories || [])]
      } catch (err: any) {
        this.error = err.message
        this.categories = []
      } finally { this.loading = false }
    },

    async fetchCategory(id: string) {
      this.loading = true
      try {
        await this.fetchCategories()
        this.currentCategory = this.categories.find(c => c.id === id) ? { ...this.categories.find(c => c.id === id)! } : null
        return this.currentCategory
      } finally { this.loading = false }
    },

    async createCategory(input: { name: string }) {
      const data = await useApi().mutate<{ createFaqCategory: FaqCategory }>(CREATE_FAQ_CATEGORY, { variables: { input } })
      await this.fetchCategories()
      return data.createFaqCategory
    },

    async updateCategory(id: string, input: { name?: string }) {
      const data = await useApi().mutate<{ updateFaqCategory: FaqCategory }>(UPDATE_FAQ_CATEGORY, { variables: { id, input } })
      const idx = this.categories.findIndex(c => c.id === id)
      if (idx !== -1) this.categories.splice(idx, 1, data.updateFaqCategory)
      if (this.currentCategory?.id === id) this.currentCategory = { ...data.updateFaqCategory }
      return data.updateFaqCategory
    },

    async deleteCategory(id: string) {
      const data = await useApi().mutate<{ deleteFaqCategory: { success: boolean; message: string } }>(DELETE_FAQ_CATEGORY, { variables: { id } })
      this.categories = this.categories.filter(c => c.id !== id)
      if (this.currentCategory?.id === id) this.currentCategory = null
      return data.deleteFaqCategory
    },
  },
})
