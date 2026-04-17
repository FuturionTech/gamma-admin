import { gql } from '@apollo/client/core'

export const GET_FAQS = gql`
  query GetFAQs(
    $category: String
    $faq_category_id: ID
    $is_active: Boolean
  ) {
    faqs(
      category: $category
      faq_category_id: $faq_category_id
      is_active: $is_active
    ) {
      id
      question
      answer
      category
      faq_category_id
      faqCategory { id name }
      order
      is_active
      created_at
      updated_at
    }
  }
`

export const GET_FAQ = gql`
  query GetFAQ {
    faqs {
      id
      question
      answer
      category
      faq_category_id
      faqCategory { id name }
      order
      is_active
      created_at
      updated_at
    }
  }
`
