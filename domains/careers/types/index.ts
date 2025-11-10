import type { Application } from '~/domains/shared/types/application'

// Enums
export enum JobType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT'
}

export enum JobStatus {
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED'
}

export interface JobPosition {
  id: string
  application_id: string
  title: string
  department?: string | null
  location?: string | null
  job_type: JobType
  is_remote: boolean
  salary_range?: string | null
  experience_required?: string | null
  summary: string
  description: string
  responsibilities?: string[] | null
  requirements?: string[] | null
  nice_to_have?: string[] | null
  benefits?: string[] | null
  skills?: string[] | null
  posted_date: string
  status: JobStatus
  created_at: string
  updated_at: string
  application?: Application
}

export interface CreateJobPositionInput {
  application_id: string
  title: string
  department?: string | null
  location?: string | null
  job_type: JobType
  is_remote?: boolean | null
  salary_range?: string | null
  experience_required?: string | null
  summary: string
  description: string
  responsibilities?: string[] | null
  requirements?: string[] | null
  nice_to_have?: string[] | null
  benefits?: string[] | null
  skills?: string[] | null
  posted_date?: string | null
  status?: JobStatus | null
}

export interface UpdateJobPositionInput {
  title?: string | null
  department?: string | null
  location?: string | null
  job_type?: JobType | null
  is_remote?: boolean | null
  salary_range?: string | null
  experience_required?: string | null
  summary?: string | null
  description?: string | null
  responsibilities?: string[] | null
  requirements?: string[] | null
  nice_to_have?: string[] | null
  benefits?: string[] | null
  skills?: string[] | null
  posted_date?: string | null
  status?: JobStatus | null
}

export interface JobPositionFilterInput {
  search?: string | null
  status?: JobStatus | null
  job_type?: JobType | null
  department?: string | null
  is_remote?: boolean | null
  application_id?: string
}

export interface JobPositionStatistics {
  total: number
  active: number
  closed: number
  remote: number
  byJobType: Record<JobType, number>
  byDepartment: Record<string, number>
}

// GraphQL Response Types
export interface JobPositionsResponse {
  jobPositions: JobPosition[]
}

export interface JobPositionResponse {
  jobPosition: JobPosition
}

export interface CreateJobPositionResponse {
  createJobPosition: JobPosition
}

export interface UpdateJobPositionResponse {
  updateJobPosition: JobPosition
}

export interface DeleteJobPositionResponse {
  deleteJobPosition: {
    id: string
    success: boolean
    message: string
  }
}

// UI State Types
export interface JobPositionFormData extends CreateJobPositionInput {
  // Additional UI-specific fields if needed
}

// Constants
export const JOB_TYPE_LABELS: Record<JobType, string> = {
  [JobType.FULL_TIME]: 'Full Time',
  [JobType.PART_TIME]: 'Part Time',
  [JobType.CONTRACT]: 'Contract'
}

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  [JobStatus.ACTIVE]: 'Active',
  [JobStatus.CLOSED]: 'Closed'
}

export const DEPARTMENTS = [
  'Engineering',
  'Sales',
  'Marketing',
  'Product',
  'Design',
  'Customer Success',
  'Finance',
  'HR',
  'Operations',
  'Legal',
  'Other'
] as const

export type Department = typeof DEPARTMENTS[number]
