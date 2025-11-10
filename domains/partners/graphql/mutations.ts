import { gql } from '@apollo/client/core'

export const CREATE_PARTNER = gql`
  mutation CreatePartner($input: CreatePartnerInput!) {
    createPartner(input: $input) {
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

export const UPDATE_PARTNER = gql`
  mutation UpdatePartner($id: ID!, $input: UpdatePartnerInput!) {
    updatePartner(id: $id, input: $input) {
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

export const DELETE_PARTNER = gql`
  mutation DeletePartner($id: ID!) {
    deletePartner(id: $id) {
      id
      success
      message
    }
  }
`
