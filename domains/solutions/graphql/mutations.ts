import { gql } from '@apollo/client/core'

export const CREATE_SOLUTION = gql`
  mutation CreateSolution($input: CreateSolutionInput!) {
    createSolution(input: $input) {
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
    }
  }
`

export const UPDATE_SOLUTION = gql`
  mutation UpdateSolution($id: ID!, $input: UpdateSolutionInput!) {
    updateSolution(id: $id, input: $input) {
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
    }
  }
`

export const DELETE_SOLUTION = gql`
  mutation DeleteSolution($id: ID!) {
    deleteSolution(id: $id) {
      id
      success
      message
    }
  }
`
