import { gql } from '@apollo/client';

export const LOGIN = gql`
  query Login($infos: InputLogin!) {
    login(infos: $infos) {
      success
      message
      user {
        id
        name
        email
        picture
      }
    }
  }
`;

export const LOGOUT = gql`
  query Logout {
    logout {
      message
      success
    }
  }
`;
