import { gql } from '@apollo/client';

export const SEARCH_USER = gql`
  query SearchUser($searchUserInput: SearchUserInput!, $page: Int!, $pageSize: Int!) {
    searchUser(searchUserInput: $searchUserInput, page: $page, pageSize: $pageSize) {
      users {
        id
        username
        realname
        gender
        age
        isEnable
        unit {
          name
          unitNumber
        }
        skills {
          id
          name
          description
        }
      }
      total
    }
  }
`;

// 定义精准匹配用户的查询
export const GET_USER_BY_USERNAME = gql`
  query GetUserByUsername($username: String!) {
    getUser(username: $username) {
      id
      username
      realname
      unit {
        name
      }
      experience {
        id
        name
        province
        city
        district
        detailAddress
      }
    }
  }
`;
