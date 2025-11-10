import { gql } from '@apollo/client/core'

export const GET_CONTACT_REQUESTS = gql`
  query GetContactRequests(
    $application_id: ID!
    $status: ContactRequestStatus
  ) {
    contactRequests(
      application_id: $application_id
      status: $status
    ) {
      id
      application_id
      first_name
      last_name
      email
      phone
      subject
      message
      status
      created_at
      updated_at
    }
  }
`

export const GET_CONTACT_REQUEST = gql`
  query GetContactRequest($id: ID!) {
    contactRequest(id: $id) {
      id
      application_id
      first_name
      last_name
      email
      phone
      subject
      message
      status
      created_at
      updated_at
      application {
        id
        name
      }
    }
  }
`
