import { gql } from '@apollo/client/core'

export const GET_PROJECTS = gql`
  query GetProjects(
    $application_id: ID!
    $status: PostStatus
    $industry: String
    $limit: Int
  ) {
    projects(
      application_id: $application_id
      status: $status
      industry: $industry
      limit: $limit
    ) {
      id
      application_id
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

export const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    project(id: $id) {
      id
      application_id
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
      application {
        id
        name
      }
    }
  }
`

export const GET_PROJECT_BY_SLUG = gql`
  query GetProjectBySlug($slug: String!, $application_id: ID!) {
    projectBySlug(slug: $slug, application_id: $application_id) {
      id
      application_id
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
