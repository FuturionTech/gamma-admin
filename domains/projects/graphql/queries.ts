import { gql } from '@apollo/client/core'

export const GET_PROJECTS = gql`
  query GetProjects(
    $status: PostStatus
    $industry: String
    $limit: Int
  ) {
    projects(
      status: $status
      industry: $industry
      limit: $limit
    ) {
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

export const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    project(id: $id) {
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

export const GET_PROJECT_BY_SLUG = gql`
  query GetProjectBySlug($slug: String!) {
    projectBySlug(slug: $slug) {
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
