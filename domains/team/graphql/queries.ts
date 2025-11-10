import { gql } from '@apollo/client/core'

export const GET_TEAMS = gql`
  query GetTeams(
    $is_active: Boolean
    $first: Int
    $page: Int
  ) {
    teams(
      is_active: $is_active
      first: $first
      page: $page
    ) {
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

export const GET_TEAM = gql`
  query GetTeam($id: ID!) {
    team(id: $id) {
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

export const GET_SOCIAL_MEDIA_PLATFORMS = gql`
  query GetSocialMediaPlatforms {
    socialMediaPlatforms {
      id
      name
      icon
      base_url
      created_at
      updated_at
    }
  }
`
