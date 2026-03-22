import { gql } from '@apollo/client/core'

export const CREATE_PROCESS_STEP = gql`
  mutation CreateProcessStep($input: CreateProcessStepInput!) {
    createProcessStep(input: $input) {
      id
      title
      description
      short_description
      step_number
      icon
      icon_color
      slug
      order
      is_active
      created_at
      updated_at
      items {
        id
        process_step_id
        title
        description
        icon
        order
        created_at
        updated_at
      }
    }
  }
`

export const UPDATE_PROCESS_STEP = gql`
  mutation UpdateProcessStep($id: ID!, $input: UpdateProcessStepInput!) {
    updateProcessStep(id: $id, input: $input) {
      id
      title
      description
      short_description
      step_number
      icon
      icon_color
      slug
      order
      is_active
      created_at
      updated_at
      items {
        id
        process_step_id
        title
        description
        icon
        order
        created_at
        updated_at
      }
    }
  }
`

export const DELETE_PROCESS_STEP = gql`
  mutation DeleteProcessStep($id: ID!) {
    deleteProcessStep(id: $id) {
      id
      success
      message
    }
  }
`

export const CREATE_PROCESS_STEP_ITEM = gql`
  mutation CreateProcessStepItem($input: CreateProcessStepItemInput!) {
    createProcessStepItem(input: $input) {
      id
      process_step_id
      title
      description
      icon
      order
      created_at
      updated_at
    }
  }
`

export const UPDATE_PROCESS_STEP_ITEM = gql`
  mutation UpdateProcessStepItem($id: ID!, $input: UpdateProcessStepItemInput!) {
    updateProcessStepItem(id: $id, input: $input) {
      id
      process_step_id
      title
      description
      icon
      order
      created_at
      updated_at
    }
  }
`

export const DELETE_PROCESS_STEP_ITEM = gql`
  mutation DeleteProcessStepItem($id: ID!) {
    deleteProcessStepItem(id: $id) {
      id
      success
      message
    }
  }
`
