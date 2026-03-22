export interface ProcessStepItem {
  id: string
  process_step_id: string
  title: string
  description?: string | null
  icon?: string | null
  order: number
  created_at: string
  updated_at: string
}

export interface ProcessStep {
  id: string
  title: string
  description?: string | null
  short_description?: string | null
  step_number: number
  icon?: string | null
  icon_color?: string | null
  slug: string
  order: number
  is_active: boolean
  created_at: string
  updated_at: string
  items: ProcessStepItem[]
}

export interface CreateProcessStepInput {
  title: string
  description?: string | null
  short_description?: string | null
  step_number: number
  icon?: string | null
  icon_color?: string | null
  slug?: string | null
  order?: number | null
  is_active?: boolean | null
}

export interface UpdateProcessStepInput {
  title?: string | null
  description?: string | null
  short_description?: string | null
  step_number?: number | null
  icon?: string | null
  icon_color?: string | null
  slug?: string | null
  order?: number | null
  is_active?: boolean | null
}

export interface CreateProcessStepItemInput {
  process_step_id: string
  title: string
  description?: string | null
  icon?: string | null
  order?: number | null
}

export interface UpdateProcessStepItemInput {
  title?: string | null
  description?: string | null
  icon?: string | null
  order?: number | null
}

export interface ProcessStepFilterInput {
  search?: string | null
  is_active?: boolean | null
}

export interface ProcessStepStatistics {
  total: number
  active: number
  inactive: number
  totalItems: number
}

// GraphQL Response Types
export interface ProcessStepsResponse {
  processSteps: ProcessStep[]
}

export interface ProcessStepResponse {
  processStep: ProcessStep
}

export interface CreateProcessStepResponse {
  createProcessStep: ProcessStep
}

export interface UpdateProcessStepResponse {
  updateProcessStep: ProcessStep
}

export interface DeleteProcessStepResponse {
  deleteProcessStep: {
    id: string
    success: boolean
    message: string
  }
}

export interface CreateProcessStepItemResponse {
  createProcessStepItem: ProcessStepItem
}

export interface UpdateProcessStepItemResponse {
  updateProcessStepItem: ProcessStepItem
}

export interface DeleteProcessStepItemResponse {
  deleteProcessStepItem: {
    id: string
    success: boolean
    message: string
  }
}

// UI State Types
export interface ProcessStepFormData extends CreateProcessStepInput {}

export interface ProcessStepItemFormData {
  title: string
  description: string | null
  icon: string | null
  order: number
}
