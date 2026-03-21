import { gql } from '@apollo/client/core'

export const GET_CONTACT_REQUESTS = gql`
  query GetContactRequests(
    $status: ContactRequestStatus
  ) {
    contactRequests(
      status: $status
    ) {
      id
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
