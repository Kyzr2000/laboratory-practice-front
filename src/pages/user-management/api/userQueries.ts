import { gql } from '@apollo/client';

export const SEARCH_USER = gql`
  query SearchUser($searchUserInput: SearchUserInput!, $page: Int!, $pageSize: Int!) {
    searchUser(searchUserInput: $searchUserInput, page: $page, pageSize: $pageSize) {
      users {
        username
        realname
        gender
        age
        isEnable
      }
      total
    }
  }
`;
