import { gql } from '@apollo/client/core'

export const GET_CERTIFICATIONS = gql`
  query GetCertifications(
    $is_active: Boolean
    $certification_category_id: ID
    $limit: Int
  ) {
    certifications(
      is_active: $is_active
      certification_category_id: $certification_category_id
      limit: $limit
    ) {
      id
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

export const GET_CERTIFICATION_CATEGORIES = gql`
  query GetCertificationCategories {
    certificationCategories {
      id
      name
      certifications_count
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
