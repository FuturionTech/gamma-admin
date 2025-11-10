import { gql } from '@apollo/client/core'

export const GET_PARTNERS = gql`
  query GetPartners(
    $is_active: Boolean
    $first: Int
    $page: Int
  ) {
    partners(
      is_active: $is_active
      first: $first
      page: $page
    ) {
      id
      name
      logo_url
      website_url
      order
      is_active
      created_at
      updated_at
    }
  }
`

export const GET_PARTNER = gql`
  query GetPartner($id: ID!) {
    partner(id: $id) {
      id
      name
      logo_url
      website_url
      order
      is_active
      created_at
      updated_at
    }
  }
`
