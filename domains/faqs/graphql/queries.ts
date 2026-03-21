import { gql } from '@apollo/client/core'

export const GET_FAQS = gql`
  query GetFAQs(
    $category: String
    $is_active: Boolean
  ) {
    faqs(
      category: $category
      is_active: $is_active
    ) {
      id
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
  query GetFAQ {
    faqs {
      id
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
