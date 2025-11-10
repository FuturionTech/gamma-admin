import { gql } from '@apollo/client/core'

export const CREATE_STAT = gql`
  mutation CreateStat($input: CreateStatInput!) {
    createStat(input: $input) {
      id
      application_id
      label
      value
      unit
      icon
      order
      is_active
      created_at
      updated_at
    }
  }
`

export const UPDATE_STAT = gql`
  mutation UpdateStat($id: ID!, $input: UpdateStatInput!) {
    updateStat(id: $id, input: $input) {
      id
      application_id
      label
      value
      unit
      icon
      order
      is_active
      created_at
      updated_at
    }
  }
`

export const DELETE_STAT = gql`
  mutation DeleteStat($id: ID!) {
    deleteStat(id: $id) {
      id
      success
      message
    }
  }
`
