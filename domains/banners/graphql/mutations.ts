import gql from 'graphql-tag'

export const CREATE_BANNER = gql`
  mutation CreateBanner($input: CreateBannerInput!) {
    createBanner(input: $input) {
      id
      application_id
      title
      subtitle
      image_url
      cta_text
      cta_url
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

export const UPDATE_BANNER = gql`
  mutation UpdateBanner($id: ID!, $input: UpdateBannerInput!) {
    updateBanner(id: $id, input: $input) {
      id
      application_id
      title
      subtitle
      image_url
      cta_text
      cta_url
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

export const DELETE_BANNER = gql`
  mutation DeleteBanner($id: ID!) {
    deleteBanner(id: $id) {
      success
      message
    }
  }
`
