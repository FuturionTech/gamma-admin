import { gql } from '@apollo/client/core'

const SERVICE_CARD_FIELDS = `
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
`

export const CREATE_SERVICE = gql`
  mutation CreateService($input: CreateServiceInput!) {
    createService(input: $input) {
      ${SERVICE_CARD_FIELDS}
    }
  }
`

export const UPDATE_SERVICE = gql`
  mutation UpdateService($id: ID!, $input: UpdateServiceInput!) {
    updateService(id: $id, input: $input) {
      ${SERVICE_CARD_FIELDS}
    }
  }
`

export const DELETE_SERVICE = gql`
  mutation DeleteService($id: ID!) {
    deleteService(id: $id) {
      success
      message
    }
  }
`

export const CREATE_SERVICE_FEATURE = gql`
  mutation CreateServiceFeature($serviceId: ID!, $input: CreateServiceFeatureInput!) {
    createServiceFeature(serviceId: $serviceId, input: $input) {
      id
      title
      description
      icon
      order
    }
  }
`

export const UPDATE_SERVICE_FEATURE = gql`
  mutation UpdateServiceFeature($id: ID!, $input: UpdateServiceFeatureInput!) {
    updateServiceFeature(id: $id, input: $input) {
      id
      title
      description
      icon
      order
    }
  }
`

export const DELETE_SERVICE_FEATURE = gql`
  mutation DeleteServiceFeature($id: ID!) {
    deleteServiceFeature(id: $id) {
      success
      message
    }
  }
`

export const SORT_SERVICE_FEATURES = gql`
  mutation SortServiceFeatures($serviceId: ID!, $orderedIds: [ID!]!) {
    sortServiceFeatures(serviceId: $serviceId, orderedIds: $orderedIds)
  }
`
