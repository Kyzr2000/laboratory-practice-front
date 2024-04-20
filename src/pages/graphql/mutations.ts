import { gql } from '@apollo/client';

export const SIGNUP_MUTATION = gql`
  mutation Signup($data: SignupInput!) {
    signup(data: $data) {
      accessToken
      refreshToken
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($data: LoginInput!) {
    login(data: $data) {
      user {
        role
      }
      accessToken
      refreshToken
    }
  }
`;
export const AddScaleWarning = gql`
  mutation AddScaleWarning($data: CreateWarningInput!) {
    addScaleWarning(data: $data) {
      id
      uuid
    }
  }
`;
export const AddScaleDiagnostic = gql`
  mutation AddScaleDiagnostic($data: CreateDiagnosticInput!) {
    addScaleDiagnostic(data: $data) {
      id
      uuid
    }
  }
`;
export const DeleteWarning = gql`
  mutation DeleteWarning($id: Int!) {
    deleteWarning(id: $id) {
      id
      createdAt
    }
  }
`;
export const DeleteDiagnostic = gql`
  mutation DeleteDiagnostic($id: Int!) {
    deleteDiagnostic(id: $id) {
      id
      createdAt
    }
  }
`;
export const UpdateWarning = gql`
  mutation UpdateWarning($id: Int!, $data: UpdateWarningInput!) {
    updateWarning(id: $id, data: $data) {
      createdAt
      updatedAt
    }
  }
`;
export const UpdateDiagnostic = gql`
  mutation UpdateDiagnostic($id: Int!, $data: UpdateDiagnosticInput!) {
    updateDiagnostic(id: $id, data: $data) {
      createdAt
      updatedAt
    }
  }
`;
export const ADD_USER = gql`
  mutation CreateUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      username
      realname
      gender
      age
      isEnable
      uuid
      role
      createdAt
      updatedAt
    }
  }
`;
export const UpdateUser = gql`
  mutation UpdateUser($username: String!, $data: UpdateUserInput!) {
    updateUser(username: $username, data: $data) {
      username
      realname
      gender
      age
      isEnable
      updatedAt
    }
  }
`;
export const DelUser = gql`
  mutation DelUser($username: String!) {
    delUser(username: $username) {
      role
    }
  }
`;
