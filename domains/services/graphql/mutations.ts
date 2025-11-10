import { gql } from '@apollo/client/core'

export const CREATE_SERVICE = gql`
  mutation CreateService($input: CreateServiceInput!) {
    createService(input: $input) {
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

export const UPDATE_SERVICE = gql`
  mutation UpdateService($id: ID!, $input: UpdateServiceInput!) {
    updateService(id: $id, input: $input) {
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

export const DELETE_SERVICE = gql`
  mutation DeleteService($id: ID!) {
    deleteService(id: $id) {
      id
      success
      message
    }
  }
`
