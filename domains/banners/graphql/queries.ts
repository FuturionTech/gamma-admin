import gql from 'graphql-tag'

export const GET_BANNERS = gql`
  query GetBanners($application_id: ID!, $is_active: Boolean, $first: Int, $page: Int) {
    banners(application_id: $application_id, is_active: $is_active, first: $first, page: $page) {
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

export const GET_BANNER_BY_ID = gql`
  query GetBannerById($id: ID!) {
    banner(id: $id) {
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
