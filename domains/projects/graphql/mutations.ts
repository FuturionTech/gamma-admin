import { gql } from '@apollo/client/core'

export const CREATE_PROJECT = gql`
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      id
      title
      slug
      description
      challenge
      solution
      results
      featured_image_url
      gallery_images
      client_name
      industry
      technologies
      status
      completion_date
      created_at
      updated_at
    }
  }
`

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: ID!, $input: UpdateProjectInput!) {
    updateProject(id: $id, input: $input) {
      id
      title
      slug
      description
      challenge
      solution
      results
      featured_image_url
      gallery_images
      client_name
      industry
      technologies
      status
      completion_date
      created_at
      updated_at
    }
  }
`

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id) {
      id
      success
      message
    }
  }
`
