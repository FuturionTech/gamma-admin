import { gql } from '@apollo/client/core'

export const GET_CERTIFICATIONS = gql`
  query GetCertifications(
    $application_id: ID!
    $is_active: Boolean
    $certification_category_id: ID
    $limit: Int
  ) {
    certifications(
      application_id: $application_id
      is_active: $is_active
      certification_category_id: $certification_category_id
      limit: $limit
    ) {
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

export const GET_CERTIFICATION = gql`
  query GetCertification($id: ID!) {
    certification(id: $id) {
      id
      application_id
      title
      file_url
      certification_category_id
      issued_date
      is_active
      created_at
      updated_at
      application {
        id
        name
      }
      category {
        id
        name
      }
    }
  }
`

export const GET_CERTIFICATION_CATEGORIES = gql`
  query GetCertificationCategories {
    certificationCategories {
      id
      name
      created_at
      updated_at
    }
  }
`

export const GET_CERTIFICATION_CATEGORY = gql`
  query GetCertificationCategory($id: ID!) {
    certificationCategory(id: $id) {
      id
      name
      created_at
      updated_at
    }
  }
`
