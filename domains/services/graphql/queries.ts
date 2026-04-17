import { gql } from '@apollo/client/core'

export const GET_SERVICES = gql`
  query GetServices(
    $is_active: Boolean
    $limit: Int
  ) {
    services(
      is_active: $is_active
      limit: $limit
    ) {
      id
      title
      description
      icon
      category
      slug
      order
      is_active
      created_at
      updated_at
    }
  }
`

export const GET_SERVICE = gql`
  query GetService($id: ID!) {
    service(id: $id) {
      id
      title
      short_description
      description
      icon
      icon_color
      category
      slug
      order
      is_active
      created_at
      updated_at
      meta_title
      meta_description
      meta_keywords
      hero {
        tagline
        headline
        subheadline
        ctaPrimaryLabel
        ctaSecondaryLabel
        stats { icon value label }
      }
      challenge {
        title
        description
        painPoints { text }
      }
      howWeDeliver {
        title
        description
        items { icon text }
      }
      capabilities {
        title
        groups { icon name items { name } }
      }
      keyUseCases {
        title
        description
        items { text }
      }
      ourApproach {
        title
        description
        items { icon title description }
      }
      industryApplications {
        title
        description
        industries { icon name description useCases { text } }
      }
      technologies {
        title
        description
        items { icon name }
      }
      businessImpact {
        title
        description
        items { icon title description }
      }
      differentiators {
        title
        points { icon title description }
      }
      closing {
        title
        subtitle
      }
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
