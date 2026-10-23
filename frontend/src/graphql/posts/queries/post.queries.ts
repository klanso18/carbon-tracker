import { gql } from '@apollo/client';

export const GET_ALL_POSTS = gql`
  query GetAllPosts {
    getAllPosts {
      id
      title
      content
      createdAt
      updatedAt
      user {
        id
        name
        picture
      }
    }
  }
`;

export const GET_POST = gql`
  query GetPostById($postId: Float!) {
    getPostById(postId: $postId) {
      id
      title
      content
      createdAt
      updatedAt
      user {
        id
        name
        picture
      }
    }
  }
`;

export const GET_PAGINATED_POSTS = gql`
  query GetPaginatedPosts($skip: Int!, $take: Int!, $userId: String) {
    getPaginatedPosts(skip: $skip, take: $take, userId: $userId) {
      content
      id
      createdAt
      title
      user {
        id
        email
        name
        picture
      }
    }
  }
`;
