import { gql } from '@apollo/client/core'

export const GET_SERVICES = gql`
  query GetServices(
    $is_active: Boolean
    $limit: Int
  ) {
    services(
      is_active: $is_active
      limit: $limit
    ) {
      id
      title
      description
      icon
      category
      slug
      order
      is_active
      created_at
      updated_at
    }
  }
`

export const GET_SERVICE = gql`
  query GetService($id: ID!) {
    service(id: $id) {
      id
      title
      description
      icon
      category
      slug
      order
      is_active
      created_at
      updated_at
    }
  }
`
