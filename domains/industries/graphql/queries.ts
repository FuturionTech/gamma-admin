import { gql } from '@apollo/client/core'

export const GET_INDUSTRIES = gql`
  query GetIndustries(
    $is_active: Boolean
    $category: IndustryCategory
    $limit: Int
  ) {
    industries(
      is_active: $is_active
      category: $category
      limit: $limit
    ) {
      id
      title
      description
      short_description
      icon
      icon_color
      category
      slug
      order
      is_active
      created_at
      updated_at
    }
  }
`

export const GET_INDUSTRY = gql`
  query GetIndustry($id: ID!) {
    industry(id: $id) {
      id
      title
      description
      short_description
      icon
      icon_color
      category
      slug
      order
      is_active
      created_at
      updated_at
    }
  }
`
