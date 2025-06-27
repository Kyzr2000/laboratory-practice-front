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

export const CHANGE_USER = gql`
  mutation ChangeUser($changeUserInput: ChangeUserInput!) {
    changeUser(changeUserInput: $changeUserInput) {
      username
      realname
      gender
      age
      isEnable
    }
  }
`;
