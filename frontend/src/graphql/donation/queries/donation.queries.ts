import { gql } from '@apollo/client';

export const GET_POT = gql`
  query GetPot {
    getPot
  }
`;

export const GET_LAST_DONATIONS = gql`
  query GetLastDonations {
    getLastDonations {
      amount
      createdAt
      id
      isAnonymous
      donorName
    }
  }
`;
