import { gql } from '@apollo/client/core'

export const GET_TESTIMONIALS = gql`
  query GetTestimonials(
    $application_id: ID!
    $is_active: Boolean
    $first: Int
    $page: Int
  ) {
    testimonials(
      application_id: $application_id
      is_active: $is_active
      first: $first
      page: $page
    ) {
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

export const GET_TESTIMONIAL = gql`
  query GetTestimonial($id: ID!) {
    testimonial(id: $id) {
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
      application {
        id
        name
      }
    }
  }
`
