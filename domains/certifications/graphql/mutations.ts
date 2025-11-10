import { gql } from '@apollo/client/core'

export const CREATE_CERTIFICATION = gql`
  mutation CreateCertification($input: CreateCertificationInput!) {
    createCertification(input: $input) {
      id
      application_id
      title
      file_url
      certification_category_id
      issued_date
      is_active
      created_at
      updated_at
      category {
        id
        name
      }
    }
  }
`

export const UPDATE_CERTIFICATION = gql`
  mutation UpdateCertification($id: ID!, $input: UpdateCertificationInput!) {
    updateCertification(id: $id, input: $input) {
      id
      application_id
      title
      file_url
      certification_category_id
      issued_date
      is_active
      created_at
      updated_at
      category {
        id
        name
      }
    }
  }
`

export const DELETE_CERTIFICATION = gql`
  mutation DeleteCertification($id: ID!) {
    deleteCertification(id: $id) {
      id
      success
      message
    }
  }
`

export const CREATE_CERTIFICATION_CATEGORY = gql`
  mutation CreateCertificationCategory($input: CreateCertificationCategoryInput!) {
    createCertificationCategory(input: $input) {
      id
      name
      created_at
      updated_at
    }
  }
`

export const UPDATE_CERTIFICATION_CATEGORY = gql`
  mutation UpdateCertificationCategory($id: ID!, $input: UpdateCertificationCategoryInput!) {
    updateCertificationCategory(id: $id, input: $input) {
      id
      name
      created_at
      updated_at
    }
  }
`

export const DELETE_CERTIFICATION_CATEGORY = gql`
  mutation DeleteCertificationCategory($id: ID!) {
    deleteCertificationCategory(id: $id) {
      id
      success
      message
    }
  }
`
