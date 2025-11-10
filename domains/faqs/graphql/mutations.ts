import { gql } from '@apollo/client/core'

export const CREATE_FAQ = gql`
  mutation CreateFAQ($input: CreateFAQInput!) {
    createFAQ(input: $input) {
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

export const UPDATE_FAQ = gql`
  mutation UpdateFAQ($id: ID!, $input: UpdateFAQInput!) {
    updateFAQ(id: $id, input: $input) {
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

export const DELETE_FAQ = gql`
  mutation DeleteFAQ($id: ID!) {
    deleteFAQ(id: $id) {
      id
      success
      message
    }
  }
`
