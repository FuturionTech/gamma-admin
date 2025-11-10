import { gql } from '@apollo/client/core'

export const CREATE_TESTIMONIAL = gql`
  mutation CreateTestimonial($input: CreateTestimonialInput!) {
    createTestimonial(input: $input) {
      id
      application_id
      name
      content
      image_url
      position
      company
      rating
      order
      is_active
      created_at
      updated_at
    }
  }
`

export const UPDATE_TESTIMONIAL = gql`
  mutation UpdateTestimonial($id: ID!, $input: UpdateTestimonialInput!) {
    updateTestimonial(id: $id, input: $input) {
      id
      application_id
      name
      content
      image_url
      position
      company
      rating
      order
      is_active
      created_at
      updated_at
    }
  }
`

export const DELETE_TESTIMONIAL = gql`
  mutation DeleteTestimonial($id: ID!) {
    deleteTestimonial(id: $id) {
      id
      success
      message
    }
  }
`
