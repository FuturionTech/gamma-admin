import { gql } from '@apollo/client/core'

export const CREATE_TEAM = gql`
  mutation CreateTeam($input: CreateTeamInput!) {
    createTeam(input: $input) {
      id
      name
      role
      email
      contact
      biography
      profile_picture_url
      order
      is_active
      created_at
      updated_at
      socialMediaLinks {
        id
        team_id
        platform_id
        url
        platform {
          id
          name
          icon
          base_url
        }
      }
    }
  }
`

export const UPDATE_TEAM = gql`
  mutation UpdateTeam($id: ID!, $input: UpdateTeamInput!) {
    updateTeam(id: $id, input: $input) {
      id
      name
      role
      email
      contact
      biography
      profile_picture_url
      order
      is_active
      created_at
      updated_at
      socialMediaLinks {
        id
        team_id
        platform_id
        url
        platform {
          id
          name
          icon
          base_url
        }
      }
    }
  }
`

export const DELETE_TEAM = gql`
  mutation DeleteTeam($id: ID!) {
    deleteTeam(id: $id) {
      id
      success
      message
    }
  }
`
