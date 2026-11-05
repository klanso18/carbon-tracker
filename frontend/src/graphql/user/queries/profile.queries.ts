import { gql } from '@apollo/client';

// Not named "Profile": client.ts exempts that operation from the login redirect
const GET_PROFILE = gql`
  query GetProfile {
    me {
      id
      name
      email
      picture
      createdAt
    }
    getProfileStats {
      totalKgCO2
      activityCount
      totalDonated
    }
    getMyDonations {
      id
      amount
      createdAt
      isAnonymous
    }
  }
`;

export default GET_PROFILE;
