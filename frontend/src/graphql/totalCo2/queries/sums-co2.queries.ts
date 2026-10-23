import { gql } from '@apollo/client';

export const SUM_BY_CATEGORY = gql`
  query GetSumByCategory {
    getSumByCategory {
      categoryId
      categoryName
      sumKgCO2
    }
  }
`;

export const SUM_BY_MONTH = gql`
  query GetSumByMonth {
    getSumByMonth {
      month
      sumKgCO2
    }
  }
`;
