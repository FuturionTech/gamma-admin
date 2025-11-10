import { gql } from '@apollo/client/core'

export const CREATE_CLIENT = gql`
  mutation CreateClient($input: CreateClientInput!) {
    createClient(input: $input) {
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

export const UPDATE_CLIENT = gql`
  mutation UpdateClient($id: ID!, $input: UpdateClientInput!) {
    updateClient(id: $id, input: $input) {
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

export const DELETE_CLIENT = gql`
  mutation DeleteClient($id: ID!) {
    deleteClient(id: $id) {
      id
      success
      message
    }
  }
`
