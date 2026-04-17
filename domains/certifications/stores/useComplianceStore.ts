import { defineStore } from 'pinia'
import { gql } from '@apollo/client/core'

export interface ComplianceFramework {
  id: string
  name: string
  slug: string
  description?: string | null
  order: number
  is_active: boolean
}

const GET_ALL = gql`query { complianceFrameworks { id name slug description order is_active created_at updated_at } }`
const CREATE = gql`mutation($input: CreateComplianceFrameworkInput!) { createComplianceFramework(input: $input) { id name slug description order is_active } }`
const UPDATE = gql`mutation($id: ID!, $input: UpdateComplianceFrameworkInput!) { updateComplianceFramework(id: $id, input: $input) { id name slug description order is_active } }`
const DELETE = gql`mutation($id: ID!) { deleteComplianceFramework(id: $id) { success message } }`

export const useComplianceStore = defineStore('compliance', {
  state: () => ({
    frameworks: [] as ComplianceFramework[],
    currentFramework: null as ComplianceFramework | null,
    loading: false,
    error: null as string | null,
  }),

  getters: {
    isLoading: (s) => s.loading,
    sortedFrameworks: (s) => [...s.frameworks].sort((a, b) => a.order - b.order),
  },

  actions: {
    async fetchAll() {
      this.loading = true
      this.error = null
      try {
        const data = await useApi().query<{ complianceFrameworks: ComplianceFramework[] }>(GET_ALL)
        this.frameworks = [...(data.complianceFrameworks || [])]
      } catch (err: any) {
        this.error = err.message
        this.frameworks = []
      } finally { this.loading = false }
    },

    async fetchOne(id: string) {
      await this.fetchAll()
      this.currentFramework = this.frameworks.find(f => f.id === id) ? { ...this.frameworks.find(f => f.id === id)! } : null
      return this.currentFramework
    },

    async create(input: Partial<ComplianceFramework>) {
      const data = await useApi().mutate<{ createComplianceFramework: ComplianceFramework }>(CREATE, { variables: { input } })
      await this.fetchAll()
      return data.createComplianceFramework
    },

    async update(id: string, input: Partial<ComplianceFramework>) {
      const data = await useApi().mutate<{ updateComplianceFramework: ComplianceFramework }>(UPDATE, { variables: { id, input } })
      const idx = this.frameworks.findIndex(f => f.id === id)
      if (idx !== -1) this.frameworks.splice(idx, 1, data.updateComplianceFramework)
      if (this.currentFramework?.id === id) this.currentFramework = { ...data.updateComplianceFramework }
      return data.updateComplianceFramework
    },

    async remove(id: string) {
      const data = await useApi().mutate<{ deleteComplianceFramework: { success: boolean } }>(DELETE, { variables: { id } })
      this.frameworks = this.frameworks.filter(f => f.id !== id)
      if (this.currentFramework?.id === id) this.currentFramework = null
      return data.deleteComplianceFramework
    },
  },
})
