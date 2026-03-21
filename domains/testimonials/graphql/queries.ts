import { gql } from '@apollo/client/core'

export const GET_TESTIMONIALS = gql`
  query GetTestimonials(
    $is_active: Boolean
    $first: Int
    $page: Int
  ) {
    testimonials(
      is_active: $is_active
      first: $first
      page: $page
    ) {
      id
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
