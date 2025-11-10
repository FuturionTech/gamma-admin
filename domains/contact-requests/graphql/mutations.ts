import { gql } from '@apollo/client/core'

export const UPDATE_CONTACT_REQUEST = gql`
  mutation UpdateContactRequest($id: ID!, $input: UpdateContactRequestInput!) {
    updateContactRequest(id: $id, input: $input) {
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

export const DELETE_CONTACT_REQUEST = gql`
  mutation DeleteContactRequest($id: ID!) {
    deleteContactRequest(id: $id) {
      id
      success
      message
    }
  }
`

// Note: createContactRequest is not needed in admin panel
// It's created from the public frontend
