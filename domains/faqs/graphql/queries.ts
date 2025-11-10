import { gql } from '@apollo/client/core'

export const GET_FAQS = gql`
  query GetFAQs(
    $application_id: ID!
    $category: String
    $is_active: Boolean
  ) {
    faqs(
      application_id: $application_id
      category: $category
      is_active: $is_active
    ) {
      id
      application_id
      question
      answer
      category
      order
      is_active
      created_at
      updated_at
    }
  }
`

// Note: Backend doesn't have a single FAQ query, so we fetch by ID using the list query
// This is handled in the store by filtering the result
export const GET_FAQ = gql`
  query GetFAQ($application_id: ID!) {
    faqs(application_id: $application_id) {
      id
      application_id
      question
      answer
      category
      order
      is_active
      created_at
      updated_at
      application {
        id
        name
      }
    }
  }
`
