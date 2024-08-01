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

// 添加一个用户
export const ADD_CONSUMER = gql`
  mutation AddConsumer($createConsumerInput: CreateConsumerInput!) {
    addConsumer(createConsumerInput: $createConsumerInput) {
      username
      nickname
      gender
      age
      isEnable
    }
  }
`;

//  删除一个用户
export const REMOVE_CONSUMER = gql`
  mutation RemoveConsumer($id: Int!) {
    removeConsumer(id: $id) {
      username
      nickname
      gender
      age
      isEnable
    }
  }
`;

// 修改一个用户
export const MODIFY_CONSUMER = gql`
  mutation ModifyConsumer($id: Int!, $updateConsumerInput: UpdateConsumerInput!) {
    modifyConsumer(id: $id, updateConsumerInput: $updateConsumerInput) {
      username
      nickname
      gender
      age
      isEnable
    }
  }
`;
