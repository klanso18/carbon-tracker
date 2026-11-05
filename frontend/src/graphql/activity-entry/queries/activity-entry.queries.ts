import { gql } from '@apollo/client';

export const LIST_ACTIVITY_ENTRIES = gql`
  query ActivityEntries {
    activityEntries {
      id
      name
      input
      category {
        id
        name
      }
      createdAt
      spendedAt
    }
  }
`;

export const FILTERED_ACTIVITY_ENTRIES = gql`
  query FilteredActivityEntries(
    $searchTerm: String
    $categoryIds: [Int!]
    $dateFrom: DateTimeISO
    $dateTo: DateTimeISO
    $skip: Int!
    $take: Int!
  ) {
    filteredActivityEntries(
      searchTerm: $searchTerm
      categoryIds: $categoryIds
      dateFrom: $dateFrom
      dateTo: $dateTo
      skip: $skip
      take: $take
    ) {
      category {
        name
        id
      }
      createdAt
      id
      input
      name
      spendedAt
    }
  }
`;
