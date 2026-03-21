import { gql } from '@apollo/client/core'

export const GET_JOB_POSITIONS = gql`
  query GetJobPositions(
    $status: JobStatus
    $job_type: JobType
    $is_remote: Boolean
    $limit: Int
  ) {
    jobPositions(
      status: $status
      job_type: $job_type
      is_remote: $is_remote
      limit: $limit
    ) {
      id
      title
      department
      location
      job_type
      is_remote
      salary_range
      experience_required
      summary
      description
      responsibilities
      requirements
      nice_to_have
      benefits
      skills
      posted_date
      status
      created_at
      updated_at
    }
  }
`

export const GET_JOB_POSITION = gql`
  query GetJobPosition($id: ID!) {
    jobPosition(id: $id) {
      id
      title
      department
      location
      job_type
      is_remote
      salary_range
      experience_required
      summary
      description
      responsibilities
      requirements
      nice_to_have
      benefits
      skills
      posted_date
      status
      created_at
      updated_at
    }
  }
`
