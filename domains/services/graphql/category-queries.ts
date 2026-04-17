import { gql } from '@apollo/client/core'

export const GET_SERVICE_CATEGORIES = gql`
  query GetServiceCategories {
    serviceCategories {
      id
      name
      slug
      created_at
      updated_at
    }
  }
`

export const GET_SERVICE_CATEGORY = gql`
  query GetServiceCategory($id: ID!) {
    serviceCategory(id: $id) {
      id
      name
      slug
      created_at
      updated_at
    }
  }
`

export const CREATE_SERVICE_CATEGORY = gql`
  mutation CreateServiceCategory($input: CreateServiceCategoryInput!) {
    createServiceCategory(input: $input) {
      id
      name
      slug
    }
  }
`

export const UPDATE_SERVICE_CATEGORY = gql`
  mutation UpdateServiceCategory($id: ID!, $input: UpdateServiceCategoryInput!) {
    updateServiceCategory(id: $id, input: $input) {
      id
      name
      slug
    }
  }
`

export const DELETE_SERVICE_CATEGORY = gql`
  mutation DeleteServiceCategory($id: ID!) {
    deleteServiceCategory(id: $id) {
      success
      message
    }
  }
`
