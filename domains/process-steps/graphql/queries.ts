import { gql } from '@apollo/client/core'

export const GET_PROCESS_STEPS = gql`
  query GetProcessSteps(
    $is_active: Boolean
    $limit: Int
  ) {
    processSteps(
      is_active: $is_active
      limit: $limit
    ) {
      id
      title
      description
      short_description
      step_number
      icon
      icon_color
      slug
      order
      is_active
      created_at
      updated_at
      items {
        id
        process_step_id
        title
        description
        icon
        order
        created_at
        updated_at
      }
    }
  }
`

export const GET_PROCESS_STEP = gql`
  query GetProcessStep($id: ID!) {
    processStep(id: $id) {
      id
      title
      description
      short_description
      step_number
      icon
      icon_color
      slug
      order
      is_active
      created_at
      updated_at
      items {
        id
        process_step_id
        title
        description
        icon
        order
        created_at
        updated_at
      }
    }
  }
`
