import { gql } from '@apollo/client/core'

export const GET_STATS = gql`
  query GetStats(
    $is_active: Boolean
  ) {
    stats(
      is_active: $is_active
    ) {
      id
      label
      value
      unit
      icon
      order
      is_active
      created_at
      updated_at
    }
  }
`
