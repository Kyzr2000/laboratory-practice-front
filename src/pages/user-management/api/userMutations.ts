import { gql } from '@apollo/client';

export const ADD_USER = gql`
  mutation AddUser($addUserInput: AddUserInput!) {
    addUser(addUserInput: $addUserInput) {
      id
      uuid
      username
      realname
      gender
      age
      isEnable
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($username: String!) {
    deleteUser(username: $username)
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($updateUserInput: UpdateUserInput!) {
    updateUser(updateUserInput: $updateUserInput) {
      username
      realname
      gender
      age
      isEnable
    }
  }
`;
