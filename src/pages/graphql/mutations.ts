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

// 用户管理模块
// 创建用户
export const AddUser = gql`
  mutation AddUser($data: AddUser!) {
    addUser(data: $data) {
      createdAt
      updatedAt
    }
  }
`;
// 删除
export const DeleteUser = gql`
  mutation DeleteUser($data: String!) {
    deleteUser(data: $data) {
      username
    }
  }
`;
// 修改用户
export const UpdateUser1 = gql`
  mutation UpdateUser1($data: updateuser1!) {
    updateUser1(data: $data) {
      createdAt
      updatedAt
    }
  }
`;
// 单位管理模块
// 创建单位
export const AddUnit = gql`
  mutation AddUnit($data: AddUnit!) {
    addUnit(data: $data) {
      id
      name
      uuid
      createdAt
    }
  }
`;
// 删除
export const DeleteUnit = gql`
  mutation DeleteUnit($data: String!) {
    deleteUnit(data: $data) {
      id
      name
      uuid
      createdAt
    }
  }
`;
// 修改用户
export const UpdateUnit1 = gql`
  mutation UpdateUnit1($data: updateunit1!) {
    updateUnit1(data: $data) {
      id
      name
      uuid
      createdAt
    }
  }
`;
