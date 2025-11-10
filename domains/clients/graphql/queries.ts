import { gql } from '@apollo/client/core'

export const GET_CLIENTS = gql`
  query GetClients(
    $is_active: Boolean
    $limit: Int
  ) {
    clients(
      is_active: $is_active
      limit: $limit
    ) {
      id
      name
      logo_url
      industry
      website_url
      order
      is_active
      created_at
      updated_at
    }
  }
`

export const GET_CLIENT = gql`
  query GetClient($id: ID!) {
    client(id: $id) {
      id
      name
      logo_url
      industry
      website_url
      order
      is_active
      created_at
      updated_at
    }
  }
`
