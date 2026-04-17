import { gql } from '@apollo/client/core'

export const CREATE_INDUSTRY = gql`
  mutation CreateIndustry($input: CreateIndustryInput!) {
    createIndustry(input: $input) {
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

export const UPDATE_INDUSTRY = gql`
  mutation UpdateIndustry($id: ID!, $input: UpdateIndustryInput!) {
    updateIndustry(id: $id, input: $input) {
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

export const DELETE_INDUSTRY = gql`
  mutation DeleteIndustry($id: ID!) {
    deleteIndustry(id: $id) {
      success
      message
    }
  }
`
