import { gql } from '@apollo/client/core';

export const GET_HONORIFICS = gql`
  query GetHonorifics($locale: String) {
    honorifics(locale: $locale) {
      value
      label
    }
  }
`;