import { gql } from '@apollo/client/core'

export const CREATE_JOB_POSITION = gql`
  mutation CreateJobPosition($input: CreateJobPositionInput!) {
    createJobPosition(input: $input) {
      id
      application_id
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

export const UPDATE_JOB_POSITION = gql`
  mutation UpdateJobPosition($id: ID!, $input: UpdateJobPositionInput!) {
    updateJobPosition(id: $id, input: $input) {
      id
      application_id
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

export const DELETE_JOB_POSITION = gql`
  mutation DeleteJobPosition($id: ID!) {
    deleteJobPosition(id: $id) {
      id
      success
      message
    }
  }
`
