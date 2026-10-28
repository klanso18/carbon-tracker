import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTimeISO: any;
};

export type ActivityEntry = {
  __typename?: 'ActivityEntry';
  category: Category;
  createdAt: Scalars['DateTimeISO'];
  id: Scalars['Int'];
  input: Scalars['Float'];
  name: Scalars['String'];
  spendedAt: Scalars['DateTimeISO'];
  updatedAt: Scalars['DateTimeISO'];
  user: User;
};

export type Book = {
  __typename?: 'Book';
  author: Scalars['String'];
  id: Scalars['Int'];
  title: Scalars['String'];
};

export type Category = {
  __typename?: 'Category';
  activityEntries: Array<ActivityEntry>;
  createdAt: Scalars['DateTimeISO'];
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type Donation = {
  __typename?: 'Donation';
  amount: Scalars['Float'];
  createdAt: Scalars['DateTimeISO'];
  id: Scalars['Int'];
  isAnonymous: Scalars['Boolean'];
  user: User;
};

export type InputCreate = {
  category: ObjectId;
  input: Scalars['Float'];
  name: Scalars['String'];
  spendedAt: Scalars['String'];
};

export type InputCreatePost = {
  content: Scalars['String'];
  title: Scalars['String'];
};

export type InputLogin = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type InputRegister = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type InputUpdate = {
  category: ObjectId;
  input: Scalars['Float'];
  name: Scalars['String'];
  spendedAt: Scalars['String'];
};

export type Message = {
  __typename?: 'Message';
  message: Scalars['String'];
  success: Scalars['Boolean'];
  user?: Maybe<User>;
};

export type Mutation = {
  __typename?: 'Mutation';
  changePassword: User;
  createActivityEntry: ActivityEntry;
  createDonation: Donation;
  createPost: Post;
  deleteActivityEntry: Scalars['String'];
  deletePost: Scalars['Boolean'];
  deleteUser: Scalars['Boolean'];
  register: UserWithoutPassword;
  updateActivityEntry: ActivityEntry;
  updatePost: Post;
  updateUser: User;
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  oldPassword: Scalars['String'];
};


export type MutationCreateActivityEntryArgs = {
  data: InputCreate;
};


export type MutationCreateDonationArgs = {
  amount: Scalars['Int'];
  isAnonymous?: InputMaybe<Scalars['Boolean']>;
};


export type MutationCreatePostArgs = {
  data: InputCreatePost;
};


export type MutationDeleteActivityEntryArgs = {
  activityEntryId: Scalars['Float'];
};


export type MutationDeletePostArgs = {
  postId: Scalars['Float'];
};


export type MutationDeleteUserArgs = {
  password: Scalars['String'];
};


export type MutationRegisterArgs = {
  infos: InputRegister;
};


export type MutationUpdateActivityEntryArgs = {
  activityEntryId: Scalars['Float'];
  data: InputUpdate;
};


export type MutationUpdatePostArgs = {
  content: Scalars['String'];
  postId: Scalars['Float'];
  title: Scalars['String'];
};


export type MutationUpdateUserArgs = {
  name?: InputMaybe<Scalars['String']>;
  picture?: InputMaybe<Scalars['String']>;
};

export type ObjectId = {
  id: Scalars['Int'];
};

export type Post = {
  __typename?: 'Post';
  content: Scalars['String'];
  createdAt: Scalars['DateTimeISO'];
  id: Scalars['Int'];
  likers: Array<User>;
  title: Scalars['String'];
  updatedAt: Scalars['DateTimeISO'];
  user: User;
  viewOnPost?: Maybe<Scalars['Float']>;
};

export type Query = {
  __typename?: 'Query';
  activityEntries: Array<ActivityEntry>;
  categories: Array<Category>;
  filteredActivityEntries: Array<ActivityEntry>;
  getActivityEntryById: ActivityEntry;
  getAllPosts: Array<Post>;
  getLastDonations: Array<Donation>;
  getPaginatedPosts: Array<Post>;
  getPostById?: Maybe<Post>;
  getPot: Scalars['Int'];
  getSumByCategory: Array<SumByCategory>;
  getSumByMonth: Array<SumByMonth>;
  login: Message;
  logout: Message;
  tags: Array<Book>;
  users: Array<User>;
};


export type QueryActivityEntriesArgs = {
  categoryId?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
};


export type QueryCategoriesArgs = {
  name?: InputMaybe<Scalars['String']>;
};


export type QueryFilteredActivityEntriesArgs = {
  categoryIds?: InputMaybe<Array<Scalars['Int']>>;
  dateFrom?: InputMaybe<Scalars['DateTimeISO']>;
  dateTo?: InputMaybe<Scalars['DateTimeISO']>;
  searchTerm?: InputMaybe<Scalars['String']>;
  skip?: Scalars['Int'];
  take?: Scalars['Int'];
};


export type QueryGetActivityEntryByIdArgs = {
  activityEntryId: Scalars['Int'];
};


export type QueryGetPaginatedPostsArgs = {
  skip?: Scalars['Int'];
  take?: Scalars['Int'];
  userId?: InputMaybe<Scalars['String']>;
};


export type QueryGetPostByIdArgs = {
  postId: Scalars['Float'];
};


export type QueryLoginArgs = {
  infos: InputLogin;
};


export type QueryTagsArgs = {
  title?: InputMaybe<Scalars['String']>;
};


export type SumByCategory = {
  __typename?: 'SumByCategory';
  categoryId: Scalars['Float'];
  categoryName: Scalars['String'];
  sumKgCO2: Scalars['Float'];
  userId?: Maybe<Scalars['String']>;
};

export type SumByMonth = {
  __typename?: 'SumByMonth';
  month: Scalars['String'];
  sumKgCO2: Scalars['Float'];
};

export type User = {
  __typename?: 'User';
  activityEntries?: Maybe<Array<ActivityEntry>>;
  createdAt?: Maybe<Scalars['DateTimeISO']>;
  donations?: Maybe<Array<Donation>>;
  email: Scalars['String'];
  id: Scalars['String'];
  likedPosts: Array<Post>;
  name?: Maybe<Scalars['String']>;
  picture?: Maybe<Scalars['String']>;
  posts: Array<Post>;
  updatedAt?: Maybe<Scalars['DateTimeISO']>;
};

export type UserWithoutPassword = {
  __typename?: 'UserWithoutPassword';
  createdAt: Scalars['DateTimeISO'];
  email: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
  picture?: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTimeISO'];
};

export type CreateActivityEntryMutationVariables = Exact<{
  data: InputCreate;
}>;


export type CreateActivityEntryMutation = { __typename?: 'Mutation', createActivityEntry: { __typename?: 'ActivityEntry', id: number, name: string } };

export type UpdateActivityEntryMutationVariables = Exact<{
  data: InputUpdate;
  activityEntryId: Scalars['Float'];
}>;


export type UpdateActivityEntryMutation = { __typename?: 'Mutation', updateActivityEntry: { __typename?: 'ActivityEntry', id: number, name: string } };

export type DeleteActivityEntryMutationVariables = Exact<{
  activityEntryId: Scalars['Float'];
}>;


export type DeleteActivityEntryMutation = { __typename?: 'Mutation', deleteActivityEntry: string };

export type ActivityEntriesQueryVariables = Exact<{ [key: string]: never; }>;


export type ActivityEntriesQuery = { __typename?: 'Query', activityEntries: Array<{ __typename?: 'ActivityEntry', id: number, name: string, input: number, createdAt: any, spendedAt: any, category: { __typename?: 'Category', id: number, name: string } }> };

export type GetActivityEntryByIdQueryVariables = Exact<{
  activityEntryId: Scalars['Int'];
}>;


export type GetActivityEntryByIdQuery = { __typename?: 'Query', getActivityEntryById: { __typename?: 'ActivityEntry', input: number, name: string, id: number, category: { __typename?: 'Category', id: number } } };

export type FilteredActivityEntriesQueryVariables = Exact<{
  searchTerm?: InputMaybe<Scalars['String']>;
  categoryIds?: InputMaybe<Array<Scalars['Int']> | Scalars['Int']>;
  dateFrom?: InputMaybe<Scalars['DateTimeISO']>;
  dateTo?: InputMaybe<Scalars['DateTimeISO']>;
  skip: Scalars['Int'];
  take: Scalars['Int'];
}>;


export type FilteredActivityEntriesQuery = { __typename?: 'Query', filteredActivityEntries: Array<{ __typename?: 'ActivityEntry', createdAt: any, id: number, input: number, name: string, spendedAt: any, category: { __typename?: 'Category', name: string, id: number } }> };

export type CategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type CategoriesQuery = { __typename?: 'Query', categories: Array<{ __typename?: 'Category', id: number, name: string }> };

export type CreateDonationMutationVariables = Exact<{
  amount: Scalars['Int'];
  isAnonymous?: InputMaybe<Scalars['Boolean']>;
}>;


export type CreateDonationMutation = { __typename?: 'Mutation', createDonation: { __typename?: 'Donation', amount: number, isAnonymous: boolean } };

export type GetPotQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPotQuery = { __typename?: 'Query', getPot: number };

export type GetLastDonationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLastDonationsQuery = { __typename?: 'Query', getLastDonations: Array<{ __typename?: 'Donation', amount: number, createdAt: any, id: number, isAnonymous: boolean, user: { __typename?: 'User', email: string, name?: string | null } }> };

export type CreatePostMutationVariables = Exact<{
  data: InputCreatePost;
}>;


export type CreatePostMutation = { __typename?: 'Mutation', createPost: { __typename?: 'Post', id: number, title: string, content: string, createdAt: any, updatedAt: any } };

export type UpdatePostMutationVariables = Exact<{
  postId: Scalars['Float'];
  title: Scalars['String'];
  content: Scalars['String'];
}>;


export type UpdatePostMutation = { __typename?: 'Mutation', updatePost: { __typename?: 'Post', id: number, title: string, content: string, createdAt: any, updatedAt: any } };

export type DeletePostMutationVariables = Exact<{
  postId: Scalars['Float'];
}>;


export type DeletePostMutation = { __typename?: 'Mutation', deletePost: boolean };

export type GetAllPostsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllPostsQuery = { __typename?: 'Query', getAllPosts: Array<{ __typename?: 'Post', id: number, title: string, content: string, createdAt: any, updatedAt: any, user: { __typename?: 'User', id: string, name?: string | null, picture?: string | null } }> };

export type GetPostByIdQueryVariables = Exact<{
  postId: Scalars['Float'];
}>;


export type GetPostByIdQuery = { __typename?: 'Query', getPostById?: { __typename?: 'Post', id: number, title: string, content: string, createdAt: any, updatedAt: any, user: { __typename?: 'User', id: string, name?: string | null, picture?: string | null } } | null };

export type GetPaginatedPostsQueryVariables = Exact<{
  skip: Scalars['Int'];
  take: Scalars['Int'];
  userId?: InputMaybe<Scalars['String']>;
}>;


export type GetPaginatedPostsQuery = { __typename?: 'Query', getPaginatedPosts: Array<{ __typename?: 'Post', content: string, id: number, createdAt: any, title: string, user: { __typename?: 'User', id: string, email: string, name?: string | null, picture?: string | null } }> };

export type GetBooksQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBooksQuery = { __typename?: 'Query', tags: Array<{ __typename?: 'Book', author: string, id: number, title: string }> };

export type GetSumByCategoryQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSumByCategoryQuery = { __typename?: 'Query', getSumByCategory: Array<{ __typename?: 'SumByCategory', categoryId: number, categoryName: string, sumKgCO2: number }> };

export type GetSumByMonthQueryVariables = Exact<{ [key: string]: never; }>;


export type GetSumByMonthQuery = { __typename?: 'Query', getSumByMonth: Array<{ __typename?: 'SumByMonth', month: string, sumKgCO2: number }> };

export type RegisterMutationVariables = Exact<{
  infos: InputRegister;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserWithoutPassword', id: string, email: string } };

export type UpdateUserMutationVariables = Exact<{
  picture?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', name?: string | null, id: string, picture?: string | null } };

export type ChangePasswordMutationVariables = Exact<{
  oldPassword: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: { __typename?: 'User', id: string, name?: string | null } };

export type DeleteUserMutationVariables = Exact<{
  password: Scalars['String'];
}>;


export type DeleteUserMutation = { __typename?: 'Mutation', deleteUser: boolean };

export type LoginQueryVariables = Exact<{
  infos: InputLogin;
}>;


export type LoginQuery = { __typename?: 'Query', login: { __typename?: 'Message', success: boolean, message: string, user?: { __typename?: 'User', id: string, name?: string | null, email: string, picture?: string | null } | null } };

export type LogoutQueryVariables = Exact<{ [key: string]: never; }>;


export type LogoutQuery = { __typename?: 'Query', logout: { __typename?: 'Message', message: string, success: boolean } };


export const CreateActivityEntryDocument = gql`
    mutation CreateActivityEntry($data: InputCreate!) {
  createActivityEntry(data: $data) {
    id
    name
  }
}
    `;
export type CreateActivityEntryMutationFn = Apollo.MutationFunction<CreateActivityEntryMutation, CreateActivityEntryMutationVariables>;

/**
 * __useCreateActivityEntryMutation__
 *
 * To run a mutation, you first call `useCreateActivityEntryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateActivityEntryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createActivityEntryMutation, { data, loading, error }] = useCreateActivityEntryMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateActivityEntryMutation(baseOptions?: Apollo.MutationHookOptions<CreateActivityEntryMutation, CreateActivityEntryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateActivityEntryMutation, CreateActivityEntryMutationVariables>(CreateActivityEntryDocument, options);
      }
export type CreateActivityEntryMutationHookResult = ReturnType<typeof useCreateActivityEntryMutation>;
export type CreateActivityEntryMutationResult = Apollo.MutationResult<CreateActivityEntryMutation>;
export type CreateActivityEntryMutationOptions = Apollo.BaseMutationOptions<CreateActivityEntryMutation, CreateActivityEntryMutationVariables>;
export const UpdateActivityEntryDocument = gql`
    mutation UpdateActivityEntry($data: InputUpdate!, $activityEntryId: Float!) {
  updateActivityEntry(data: $data, activityEntryId: $activityEntryId) {
    id
    name
  }
}
    `;
export type UpdateActivityEntryMutationFn = Apollo.MutationFunction<UpdateActivityEntryMutation, UpdateActivityEntryMutationVariables>;

/**
 * __useUpdateActivityEntryMutation__
 *
 * To run a mutation, you first call `useUpdateActivityEntryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateActivityEntryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateActivityEntryMutation, { data, loading, error }] = useUpdateActivityEntryMutation({
 *   variables: {
 *      data: // value for 'data'
 *      activityEntryId: // value for 'activityEntryId'
 *   },
 * });
 */
export function useUpdateActivityEntryMutation(baseOptions?: Apollo.MutationHookOptions<UpdateActivityEntryMutation, UpdateActivityEntryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateActivityEntryMutation, UpdateActivityEntryMutationVariables>(UpdateActivityEntryDocument, options);
      }
export type UpdateActivityEntryMutationHookResult = ReturnType<typeof useUpdateActivityEntryMutation>;
export type UpdateActivityEntryMutationResult = Apollo.MutationResult<UpdateActivityEntryMutation>;
export type UpdateActivityEntryMutationOptions = Apollo.BaseMutationOptions<UpdateActivityEntryMutation, UpdateActivityEntryMutationVariables>;
export const DeleteActivityEntryDocument = gql`
    mutation DeleteActivityEntry($activityEntryId: Float!) {
  deleteActivityEntry(activityEntryId: $activityEntryId)
}
    `;
export type DeleteActivityEntryMutationFn = Apollo.MutationFunction<DeleteActivityEntryMutation, DeleteActivityEntryMutationVariables>;

/**
 * __useDeleteActivityEntryMutation__
 *
 * To run a mutation, you first call `useDeleteActivityEntryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteActivityEntryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteActivityEntryMutation, { data, loading, error }] = useDeleteActivityEntryMutation({
 *   variables: {
 *      activityEntryId: // value for 'activityEntryId'
 *   },
 * });
 */
export function useDeleteActivityEntryMutation(baseOptions?: Apollo.MutationHookOptions<DeleteActivityEntryMutation, DeleteActivityEntryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteActivityEntryMutation, DeleteActivityEntryMutationVariables>(DeleteActivityEntryDocument, options);
      }
export type DeleteActivityEntryMutationHookResult = ReturnType<typeof useDeleteActivityEntryMutation>;
export type DeleteActivityEntryMutationResult = Apollo.MutationResult<DeleteActivityEntryMutation>;
export type DeleteActivityEntryMutationOptions = Apollo.BaseMutationOptions<DeleteActivityEntryMutation, DeleteActivityEntryMutationVariables>;
export const ActivityEntriesDocument = gql`
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

/**
 * __useActivityEntriesQuery__
 *
 * To run a query within a React component, call `useActivityEntriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useActivityEntriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useActivityEntriesQuery({
 *   variables: {
 *   },
 * });
 */
export function useActivityEntriesQuery(baseOptions?: Apollo.QueryHookOptions<ActivityEntriesQuery, ActivityEntriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ActivityEntriesQuery, ActivityEntriesQueryVariables>(ActivityEntriesDocument, options);
      }
export function useActivityEntriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ActivityEntriesQuery, ActivityEntriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ActivityEntriesQuery, ActivityEntriesQueryVariables>(ActivityEntriesDocument, options);
        }
export type ActivityEntriesQueryHookResult = ReturnType<typeof useActivityEntriesQuery>;
export type ActivityEntriesLazyQueryHookResult = ReturnType<typeof useActivityEntriesLazyQuery>;
export type ActivityEntriesQueryResult = Apollo.QueryResult<ActivityEntriesQuery, ActivityEntriesQueryVariables>;
export const GetActivityEntryByIdDocument = gql`
    query GetActivityEntryById($activityEntryId: Int!) {
  getActivityEntryById(activityEntryId: $activityEntryId) {
    category {
      id
    }
    input
    name
    id
  }
}
    `;

/**
 * __useGetActivityEntryByIdQuery__
 *
 * To run a query within a React component, call `useGetActivityEntryByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetActivityEntryByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetActivityEntryByIdQuery({
 *   variables: {
 *      activityEntryId: // value for 'activityEntryId'
 *   },
 * });
 */
export function useGetActivityEntryByIdQuery(baseOptions: Apollo.QueryHookOptions<GetActivityEntryByIdQuery, GetActivityEntryByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetActivityEntryByIdQuery, GetActivityEntryByIdQueryVariables>(GetActivityEntryByIdDocument, options);
      }
export function useGetActivityEntryByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetActivityEntryByIdQuery, GetActivityEntryByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetActivityEntryByIdQuery, GetActivityEntryByIdQueryVariables>(GetActivityEntryByIdDocument, options);
        }
export type GetActivityEntryByIdQueryHookResult = ReturnType<typeof useGetActivityEntryByIdQuery>;
export type GetActivityEntryByIdLazyQueryHookResult = ReturnType<typeof useGetActivityEntryByIdLazyQuery>;
export type GetActivityEntryByIdQueryResult = Apollo.QueryResult<GetActivityEntryByIdQuery, GetActivityEntryByIdQueryVariables>;
export const FilteredActivityEntriesDocument = gql`
    query FilteredActivityEntries($searchTerm: String, $categoryIds: [Int!], $dateFrom: DateTimeISO, $dateTo: DateTimeISO, $skip: Int!, $take: Int!) {
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

/**
 * __useFilteredActivityEntriesQuery__
 *
 * To run a query within a React component, call `useFilteredActivityEntriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useFilteredActivityEntriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFilteredActivityEntriesQuery({
 *   variables: {
 *      searchTerm: // value for 'searchTerm'
 *      categoryIds: // value for 'categoryIds'
 *      dateFrom: // value for 'dateFrom'
 *      dateTo: // value for 'dateTo'
 *      skip: // value for 'skip'
 *      take: // value for 'take'
 *   },
 * });
 */
export function useFilteredActivityEntriesQuery(baseOptions: Apollo.QueryHookOptions<FilteredActivityEntriesQuery, FilteredActivityEntriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FilteredActivityEntriesQuery, FilteredActivityEntriesQueryVariables>(FilteredActivityEntriesDocument, options);
      }
export function useFilteredActivityEntriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FilteredActivityEntriesQuery, FilteredActivityEntriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FilteredActivityEntriesQuery, FilteredActivityEntriesQueryVariables>(FilteredActivityEntriesDocument, options);
        }
export type FilteredActivityEntriesQueryHookResult = ReturnType<typeof useFilteredActivityEntriesQuery>;
export type FilteredActivityEntriesLazyQueryHookResult = ReturnType<typeof useFilteredActivityEntriesLazyQuery>;
export type FilteredActivityEntriesQueryResult = Apollo.QueryResult<FilteredActivityEntriesQuery, FilteredActivityEntriesQueryVariables>;
export const CategoriesDocument = gql`
    query Categories {
  categories {
    id
    name
  }
}
    `;

/**
 * __useCategoriesQuery__
 *
 * To run a query within a React component, call `useCategoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useCategoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCategoriesQuery({
 *   variables: {
 *   },
 * });
 */
export function useCategoriesQuery(baseOptions?: Apollo.QueryHookOptions<CategoriesQuery, CategoriesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CategoriesQuery, CategoriesQueryVariables>(CategoriesDocument, options);
      }
export function useCategoriesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CategoriesQuery, CategoriesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CategoriesQuery, CategoriesQueryVariables>(CategoriesDocument, options);
        }
export type CategoriesQueryHookResult = ReturnType<typeof useCategoriesQuery>;
export type CategoriesLazyQueryHookResult = ReturnType<typeof useCategoriesLazyQuery>;
export type CategoriesQueryResult = Apollo.QueryResult<CategoriesQuery, CategoriesQueryVariables>;
export const CreateDonationDocument = gql`
    mutation CreateDonation($amount: Int!, $isAnonymous: Boolean) {
  createDonation(amount: $amount, isAnonymous: $isAnonymous) {
    amount
    isAnonymous
  }
}
    `;
export type CreateDonationMutationFn = Apollo.MutationFunction<CreateDonationMutation, CreateDonationMutationVariables>;

/**
 * __useCreateDonationMutation__
 *
 * To run a mutation, you first call `useCreateDonationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDonationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDonationMutation, { data, loading, error }] = useCreateDonationMutation({
 *   variables: {
 *      amount: // value for 'amount'
 *      isAnonymous: // value for 'isAnonymous'
 *   },
 * });
 */
export function useCreateDonationMutation(baseOptions?: Apollo.MutationHookOptions<CreateDonationMutation, CreateDonationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDonationMutation, CreateDonationMutationVariables>(CreateDonationDocument, options);
      }
export type CreateDonationMutationHookResult = ReturnType<typeof useCreateDonationMutation>;
export type CreateDonationMutationResult = Apollo.MutationResult<CreateDonationMutation>;
export type CreateDonationMutationOptions = Apollo.BaseMutationOptions<CreateDonationMutation, CreateDonationMutationVariables>;
export const GetPotDocument = gql`
    query GetPot {
  getPot
}
    `;

/**
 * __useGetPotQuery__
 *
 * To run a query within a React component, call `useGetPotQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPotQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPotQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPotQuery(baseOptions?: Apollo.QueryHookOptions<GetPotQuery, GetPotQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPotQuery, GetPotQueryVariables>(GetPotDocument, options);
      }
export function useGetPotLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPotQuery, GetPotQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPotQuery, GetPotQueryVariables>(GetPotDocument, options);
        }
export type GetPotQueryHookResult = ReturnType<typeof useGetPotQuery>;
export type GetPotLazyQueryHookResult = ReturnType<typeof useGetPotLazyQuery>;
export type GetPotQueryResult = Apollo.QueryResult<GetPotQuery, GetPotQueryVariables>;
export const GetLastDonationsDocument = gql`
    query GetLastDonations {
  getLastDonations {
    amount
    createdAt
    id
    isAnonymous
    user {
      email
      name
    }
  }
}
    `;

/**
 * __useGetLastDonationsQuery__
 *
 * To run a query within a React component, call `useGetLastDonationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLastDonationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLastDonationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetLastDonationsQuery(baseOptions?: Apollo.QueryHookOptions<GetLastDonationsQuery, GetLastDonationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLastDonationsQuery, GetLastDonationsQueryVariables>(GetLastDonationsDocument, options);
      }
export function useGetLastDonationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLastDonationsQuery, GetLastDonationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLastDonationsQuery, GetLastDonationsQueryVariables>(GetLastDonationsDocument, options);
        }
export type GetLastDonationsQueryHookResult = ReturnType<typeof useGetLastDonationsQuery>;
export type GetLastDonationsLazyQueryHookResult = ReturnType<typeof useGetLastDonationsLazyQuery>;
export type GetLastDonationsQueryResult = Apollo.QueryResult<GetLastDonationsQuery, GetLastDonationsQueryVariables>;
export const CreatePostDocument = gql`
    mutation CreatePost($data: InputCreatePost!) {
  createPost(data: $data) {
    id
    title
    content
    createdAt
    updatedAt
  }
}
    `;
export type CreatePostMutationFn = Apollo.MutationFunction<CreatePostMutation, CreatePostMutationVariables>;

/**
 * __useCreatePostMutation__
 *
 * To run a mutation, you first call `useCreatePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPostMutation, { data, loading, error }] = useCreatePostMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreatePostMutation(baseOptions?: Apollo.MutationHookOptions<CreatePostMutation, CreatePostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePostMutation, CreatePostMutationVariables>(CreatePostDocument, options);
      }
export type CreatePostMutationHookResult = ReturnType<typeof useCreatePostMutation>;
export type CreatePostMutationResult = Apollo.MutationResult<CreatePostMutation>;
export type CreatePostMutationOptions = Apollo.BaseMutationOptions<CreatePostMutation, CreatePostMutationVariables>;
export const UpdatePostDocument = gql`
    mutation UpdatePost($postId: Float!, $title: String!, $content: String!) {
  updatePost(postId: $postId, title: $title, content: $content) {
    id
    title
    content
    createdAt
    updatedAt
  }
}
    `;
export type UpdatePostMutationFn = Apollo.MutationFunction<UpdatePostMutation, UpdatePostMutationVariables>;

/**
 * __useUpdatePostMutation__
 *
 * To run a mutation, you first call `useUpdatePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePostMutation, { data, loading, error }] = useUpdatePostMutation({
 *   variables: {
 *      postId: // value for 'postId'
 *      title: // value for 'title'
 *      content: // value for 'content'
 *   },
 * });
 */
export function useUpdatePostMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePostMutation, UpdatePostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePostMutation, UpdatePostMutationVariables>(UpdatePostDocument, options);
      }
export type UpdatePostMutationHookResult = ReturnType<typeof useUpdatePostMutation>;
export type UpdatePostMutationResult = Apollo.MutationResult<UpdatePostMutation>;
export type UpdatePostMutationOptions = Apollo.BaseMutationOptions<UpdatePostMutation, UpdatePostMutationVariables>;
export const DeletePostDocument = gql`
    mutation DeletePost($postId: Float!) {
  deletePost(postId: $postId)
}
    `;
export type DeletePostMutationFn = Apollo.MutationFunction<DeletePostMutation, DeletePostMutationVariables>;

/**
 * __useDeletePostMutation__
 *
 * To run a mutation, you first call `useDeletePostMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePostMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePostMutation, { data, loading, error }] = useDeletePostMutation({
 *   variables: {
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useDeletePostMutation(baseOptions?: Apollo.MutationHookOptions<DeletePostMutation, DeletePostMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeletePostMutation, DeletePostMutationVariables>(DeletePostDocument, options);
      }
export type DeletePostMutationHookResult = ReturnType<typeof useDeletePostMutation>;
export type DeletePostMutationResult = Apollo.MutationResult<DeletePostMutation>;
export type DeletePostMutationOptions = Apollo.BaseMutationOptions<DeletePostMutation, DeletePostMutationVariables>;
export const GetAllPostsDocument = gql`
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

/**
 * __useGetAllPostsQuery__
 *
 * To run a query within a React component, call `useGetAllPostsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllPostsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllPostsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllPostsQuery(baseOptions?: Apollo.QueryHookOptions<GetAllPostsQuery, GetAllPostsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllPostsQuery, GetAllPostsQueryVariables>(GetAllPostsDocument, options);
      }
export function useGetAllPostsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllPostsQuery, GetAllPostsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllPostsQuery, GetAllPostsQueryVariables>(GetAllPostsDocument, options);
        }
export type GetAllPostsQueryHookResult = ReturnType<typeof useGetAllPostsQuery>;
export type GetAllPostsLazyQueryHookResult = ReturnType<typeof useGetAllPostsLazyQuery>;
export type GetAllPostsQueryResult = Apollo.QueryResult<GetAllPostsQuery, GetAllPostsQueryVariables>;
export const GetPostByIdDocument = gql`
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

/**
 * __useGetPostByIdQuery__
 *
 * To run a query within a React component, call `useGetPostByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPostByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPostByIdQuery({
 *   variables: {
 *      postId: // value for 'postId'
 *   },
 * });
 */
export function useGetPostByIdQuery(baseOptions: Apollo.QueryHookOptions<GetPostByIdQuery, GetPostByIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPostByIdQuery, GetPostByIdQueryVariables>(GetPostByIdDocument, options);
      }
export function useGetPostByIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPostByIdQuery, GetPostByIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPostByIdQuery, GetPostByIdQueryVariables>(GetPostByIdDocument, options);
        }
export type GetPostByIdQueryHookResult = ReturnType<typeof useGetPostByIdQuery>;
export type GetPostByIdLazyQueryHookResult = ReturnType<typeof useGetPostByIdLazyQuery>;
export type GetPostByIdQueryResult = Apollo.QueryResult<GetPostByIdQuery, GetPostByIdQueryVariables>;
export const GetPaginatedPostsDocument = gql`
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

/**
 * __useGetPaginatedPostsQuery__
 *
 * To run a query within a React component, call `useGetPaginatedPostsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPaginatedPostsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPaginatedPostsQuery({
 *   variables: {
 *      skip: // value for 'skip'
 *      take: // value for 'take'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetPaginatedPostsQuery(baseOptions: Apollo.QueryHookOptions<GetPaginatedPostsQuery, GetPaginatedPostsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPaginatedPostsQuery, GetPaginatedPostsQueryVariables>(GetPaginatedPostsDocument, options);
      }
export function useGetPaginatedPostsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPaginatedPostsQuery, GetPaginatedPostsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPaginatedPostsQuery, GetPaginatedPostsQueryVariables>(GetPaginatedPostsDocument, options);
        }
export type GetPaginatedPostsQueryHookResult = ReturnType<typeof useGetPaginatedPostsQuery>;
export type GetPaginatedPostsLazyQueryHookResult = ReturnType<typeof useGetPaginatedPostsLazyQuery>;
export type GetPaginatedPostsQueryResult = Apollo.QueryResult<GetPaginatedPostsQuery, GetPaginatedPostsQueryVariables>;
export const GetBooksDocument = gql`
    query GetBooks {
  tags {
    author
    id
    title
  }
}
    `;

/**
 * __useGetBooksQuery__
 *
 * To run a query within a React component, call `useGetBooksQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBooksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBooksQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetBooksQuery(baseOptions?: Apollo.QueryHookOptions<GetBooksQuery, GetBooksQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBooksQuery, GetBooksQueryVariables>(GetBooksDocument, options);
      }
export function useGetBooksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBooksQuery, GetBooksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBooksQuery, GetBooksQueryVariables>(GetBooksDocument, options);
        }
export type GetBooksQueryHookResult = ReturnType<typeof useGetBooksQuery>;
export type GetBooksLazyQueryHookResult = ReturnType<typeof useGetBooksLazyQuery>;
export type GetBooksQueryResult = Apollo.QueryResult<GetBooksQuery, GetBooksQueryVariables>;
export const GetSumByCategoryDocument = gql`
    query GetSumByCategory {
  getSumByCategory {
    categoryId
    categoryName
    sumKgCO2
  }
}
    `;

/**
 * __useGetSumByCategoryQuery__
 *
 * To run a query within a React component, call `useGetSumByCategoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSumByCategoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSumByCategoryQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSumByCategoryQuery(baseOptions?: Apollo.QueryHookOptions<GetSumByCategoryQuery, GetSumByCategoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSumByCategoryQuery, GetSumByCategoryQueryVariables>(GetSumByCategoryDocument, options);
      }
export function useGetSumByCategoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSumByCategoryQuery, GetSumByCategoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSumByCategoryQuery, GetSumByCategoryQueryVariables>(GetSumByCategoryDocument, options);
        }
export type GetSumByCategoryQueryHookResult = ReturnType<typeof useGetSumByCategoryQuery>;
export type GetSumByCategoryLazyQueryHookResult = ReturnType<typeof useGetSumByCategoryLazyQuery>;
export type GetSumByCategoryQueryResult = Apollo.QueryResult<GetSumByCategoryQuery, GetSumByCategoryQueryVariables>;
export const GetSumByMonthDocument = gql`
    query GetSumByMonth {
  getSumByMonth {
    month
    sumKgCO2
  }
}
    `;

/**
 * __useGetSumByMonthQuery__
 *
 * To run a query within a React component, call `useGetSumByMonthQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSumByMonthQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSumByMonthQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSumByMonthQuery(baseOptions?: Apollo.QueryHookOptions<GetSumByMonthQuery, GetSumByMonthQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetSumByMonthQuery, GetSumByMonthQueryVariables>(GetSumByMonthDocument, options);
      }
export function useGetSumByMonthLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSumByMonthQuery, GetSumByMonthQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetSumByMonthQuery, GetSumByMonthQueryVariables>(GetSumByMonthDocument, options);
        }
export type GetSumByMonthQueryHookResult = ReturnType<typeof useGetSumByMonthQuery>;
export type GetSumByMonthLazyQueryHookResult = ReturnType<typeof useGetSumByMonthLazyQuery>;
export type GetSumByMonthQueryResult = Apollo.QueryResult<GetSumByMonthQuery, GetSumByMonthQueryVariables>;
export const RegisterDocument = gql`
    mutation Register($infos: InputRegister!) {
  register(infos: $infos) {
    id
    email
  }
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      infos: // value for 'infos'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const UpdateUserDocument = gql`
    mutation updateUser($picture: String, $name: String) {
  updateUser(picture: $picture, name: $name) {
    name
    id
    picture
  }
}
    `;
export type UpdateUserMutationFn = Apollo.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      picture: // value for 'picture'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, options);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($oldPassword: String!, $newPassword: String!) {
  changePassword(oldPassword: $oldPassword, newPassword: $newPassword) {
    id
    name
  }
}
    `;
export type ChangePasswordMutationFn = Apollo.MutationFunction<ChangePasswordMutation, ChangePasswordMutationVariables>;

/**
 * __useChangePasswordMutation__
 *
 * To run a mutation, you first call `useChangePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordMutation, { data, loading, error }] = useChangePasswordMutation({
 *   variables: {
 *      oldPassword: // value for 'oldPassword'
 *      newPassword: // value for 'newPassword'
 *   },
 * });
 */
export function useChangePasswordMutation(baseOptions?: Apollo.MutationHookOptions<ChangePasswordMutation, ChangePasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument, options);
      }
export type ChangePasswordMutationHookResult = ReturnType<typeof useChangePasswordMutation>;
export type ChangePasswordMutationResult = Apollo.MutationResult<ChangePasswordMutation>;
export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const DeleteUserDocument = gql`
    mutation DeleteUser($password: String!) {
  deleteUser(password: $password)
}
    `;
export type DeleteUserMutationFn = Apollo.MutationFunction<DeleteUserMutation, DeleteUserMutationVariables>;

/**
 * __useDeleteUserMutation__
 *
 * To run a mutation, you first call `useDeleteUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserMutation, { data, loading, error }] = useDeleteUserMutation({
 *   variables: {
 *      password: // value for 'password'
 *   },
 * });
 */
export function useDeleteUserMutation(baseOptions?: Apollo.MutationHookOptions<DeleteUserMutation, DeleteUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument, options);
      }
export type DeleteUserMutationHookResult = ReturnType<typeof useDeleteUserMutation>;
export type DeleteUserMutationResult = Apollo.MutationResult<DeleteUserMutation>;
export type DeleteUserMutationOptions = Apollo.BaseMutationOptions<DeleteUserMutation, DeleteUserMutationVariables>;
export const LoginDocument = gql`
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

/**
 * __useLoginQuery__
 *
 * To run a query within a React component, call `useLoginQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoginQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoginQuery({
 *   variables: {
 *      infos: // value for 'infos'
 *   },
 * });
 */
export function useLoginQuery(baseOptions: Apollo.QueryHookOptions<LoginQuery, LoginQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LoginQuery, LoginQueryVariables>(LoginDocument, options);
      }
export function useLoginLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LoginQuery, LoginQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LoginQuery, LoginQueryVariables>(LoginDocument, options);
        }
export type LoginQueryHookResult = ReturnType<typeof useLoginQuery>;
export type LoginLazyQueryHookResult = ReturnType<typeof useLoginLazyQuery>;
export type LoginQueryResult = Apollo.QueryResult<LoginQuery, LoginQueryVariables>;
export const LogoutDocument = gql`
    query Logout {
  logout {
    message
    success
  }
}
    `;

/**
 * __useLogoutQuery__
 *
 * To run a query within a React component, call `useLogoutQuery` and pass it any options that fit your needs.
 * When your component renders, `useLogoutQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLogoutQuery({
 *   variables: {
 *   },
 * });
 */
export function useLogoutQuery(baseOptions?: Apollo.QueryHookOptions<LogoutQuery, LogoutQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LogoutQuery, LogoutQueryVariables>(LogoutDocument, options);
      }
export function useLogoutLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LogoutQuery, LogoutQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LogoutQuery, LogoutQueryVariables>(LogoutDocument, options);
        }
export type LogoutQueryHookResult = ReturnType<typeof useLogoutQuery>;
export type LogoutLazyQueryHookResult = ReturnType<typeof useLogoutLazyQuery>;
export type LogoutQueryResult = Apollo.QueryResult<LogoutQuery, LogoutQueryVariables>;