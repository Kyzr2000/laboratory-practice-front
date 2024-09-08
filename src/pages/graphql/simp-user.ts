/* eslint-disable max-len */
import { gql } from '@apollo/client';


// 删除用户的 GraphQL 语句
export const DELETE_SIMPLIFIED_USER_MUTATION = gql`
  mutation DeleteSimplifiedUserById($id: Int!) {
    deleteSimplifiedUserById(id: $id) {
      id
    }
  }
`;


// 更新用户的 GraphQL 语句
export const UPDATE_SIMPLIFIED_USER_MUTATION = gql`
  mutation UpdateSimplifiedUser($updateSimplifiedUserInput: UpdateSimplifiedUserInput!) {
    updateSimplifiedUserById(updateSimplifiedUserInput: $updateSimplifiedUserInput) {
      id
      account
      name
      gender
      age
      is_enabled
      unit_id
    }
  }
`;

// 新增用户
// 添加用户的 GraphQL 语句
export const ADD_SIMPLIFIED_USER_MUTATION = gql`
  mutation AddSimplifiedUser($createSimplifiedUserInput: CreateSimplifiedUserInput!) {
    createSimplifiedUser(createSimplifiedUserInput: $createSimplifiedUserInput) {
      id
      account
      name
      gender
      age
      is_enabled
      unit_id
    }
  }
`;

// 查询所有用户 并且可以添加两个条件 account和name
export const Find_ALL_SIMPLIFIED_USERS_QUERY = gql`
  query AllSimplifiedUsers($searchAllSimplifiedUsersInput: SearchAllSimplifiedUsersInput!) {
    allSimplifiedUsers(searchAllSimplifiedUsersInput: $searchAllSimplifiedUsersInput) {
      users {
        id
        account
        name
        gender
        age
        is_enabled
        unit_id
        unit {
          id
          unitCode
          unitName
          createdAt
        }
      }
      total
    }
  }
`;

// 根据账户或者姓名搜索
// export const SEARCH_SIMPLIFIED_USERS_BY_ACCOUNT_AND_NAME = gql`
// query SearchSimplifiedUsersByAccountAndName($searchSimplifiedUsersByAccountAndNameInput: SearchSimplifiedUsersByAccountAndNameInput!) {
//   searchSimplifiedUsersByAccountAndNameInput(searchSimplifiedUsersByAccountAndNameInput: $searchSimplifiedUsersByAccountAndNameInput) {
//     users {
//       id
//       account
//       name
//       gender
//       age
//       is_enabled
//     }
//     total
//   }
// }
// `;
export const SEARCH_SIMPLIFIED_USERS_BY_ACCOUNT_AND_NAME = gql`
  query SearchSimplifiedUsersByAccountAndName($searchSimplifiedUsersByAccountAndNameInput: SearchSimplifiedUsersByAccountAndNameInput!) {
    searchSimplifiedUsersByAccountAndNameInput(searchSimplifiedUsersByAccountAndNameInput: $searchSimplifiedUsersByAccountAndNameInput) {
      users {
        id
        account
        name
        gender
        age
        is_enabled
        unitId  # 如果类型定义中使用的是 unitId
        # 或者使用 unit_id
        # unit_id
        unit {
          id
          unitCode
          unitName
          createdAt
        }
      }
      total
    }
  }
`;






