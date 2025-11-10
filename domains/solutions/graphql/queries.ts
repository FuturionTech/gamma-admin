import { gql } from '@apollo/client/core'

export const GET_SOLUTIONS = gql`
  query GetSolutions(
    $application_id: ID!
    $is_active: Boolean
    $limit: Int
  ) {
    solutions(
      application_id: $application_id
      is_active: $is_active
      limit: $limit
    ) {
      id
      application_id
      title
      subtitle
      description
      slug
      icon
      icon_color
      hero_image_url
      order
      is_active
      created_at
      updated_at
      features {
        id
        title
        description
        icon
        order
      }
      benefits {
        id
        title
        description
        icon
        order
      }
    }
  }
`

export const GET_SOLUTION = gql`
  query GetSolution($slug: String!) {
    solution(slug: $slug) {
      id
      application_id
      title
      subtitle
      description
      slug
      icon
      icon_color
      hero_image_url
      order
      is_active
      created_at
      updated_at
      application {
        id
        name
      }
      features {
        id
        solution_id
        title
        description
        icon
        order
        created_at
        updated_at
      }
      benefits {
        id
        solution_id
        title
        description
        icon
        order
        created_at
        updated_at
      }
    }
  }
`

// Note: Backend currently only supports query by slug
// This is a workaround to query by ID by first getting all solutions
// and filtering client-side, or we need to add a solution(id: ID!) query to the backend
export const GET_SOLUTION_BY_ID = gql`
  query GetSolutionById($slug: String!) {
    solution(slug: $slug) {
      id
      application_id
      title
      subtitle
      description
      slug
      icon
      icon_color
      hero_image_url
      order
      is_active
      created_at
      updated_at
      application {
        id
        name
      }
      features {
        id
        solution_id
        title
        description
        icon
        order
        created_at
        updated_at
      }
      benefits {
        id
        solution_id
        title
        description
        icon
        order
        created_at
        updated_at
      }
    }
  }
`
