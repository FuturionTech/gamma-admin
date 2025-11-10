import { gql } from '@apollo/client/core'

export const GET_STATS = gql`
  query GetStats(
    $application_id: ID!
    $is_active: Boolean
  ) {
    stats(
      application_id: $application_id
      is_active: $is_active
    ) {
      id
      application_id
      label
      value
      unit
      icon
      order
      is_active
      created_at
      updated_at
      application {
        id
        name
      }
    }
  }
`
