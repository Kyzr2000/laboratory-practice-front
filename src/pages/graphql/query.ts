import { gql } from '@apollo/client';
export const ScaleWarnings = gql`
  query ScaleWarnings($data: FindWarningInput!, $pagination: PaginationInput!) {
    scaleWarnings(data: $data, pagination: $pagination) {
      data {
        id
        scaleId
        warningType
        warningExpression
        warningResult
        warningColor
        isEnable
        remark
        createdAt
      }
      total
    }
  }
`;
export const ScaleDiganostics = gql`
  query ScaleDiganostics(
    $data: FindDiagnosticInput!
    $pagination: DiagnosticPaginationInput!
  ) {
    scaleDiagnostics(data: $data, pagination: $pagination) {
      data {
        id
        scaleId
        condition
        diagnosticInfo
        proposal
        severity
        isEnable
        remark
        createdAt
      }
      total
    }
  }
`;
export const ScaleTypes = gql`
  query ScaleTypes {
    scaleTypes {
      id
      name
    }
  }
`;
// 查找所有scale数据
export const Scales = gql`
  query Scales {
    scales {
      id
      name
      scaleTypeId
    }
  }
`;
// 查找所有department数据
export const Departments = gql`
  query Departments {
    departments {
      id
      name
      institutionCode
    }
  }
`;
// 用户管理模块
// 查找用户
export const GetUserByUsernameOrName = gql`
  query GetUserByUsernameOrName($data: SearchUser!) {
    getUserByUsernameOrName(data: $data) {
      id
      username
      realname
      gender
      age
      telephone
      email
      address
      introduction
      unit {
        id
        name
        uuid
        createdAt
      }
    }
  }
`;
export const GetUserByUsernameOrNameNumber = gql`
  query GetUserByUsernameOrNameNumber($data: SearchUser!) {
    getUserByUsernameOrNameNumber(data: $data)
  }
`;
export const GetPageAllUsers = gql`
  query GetPageAllUsers($data: Page!) {
    getPageAllUsers(data: $data) {
      id
      username
      realname
      gender
      age
      telephone
      email
      address
      introduction
      unit {
        id
        name
        uuid
        createdAt
      }
    }
  }
`;
export const GetAllUser = gql`
  query GetAllUsers {
    getAllUsers
  }
`;
// 单位管理模块
// 查找单位
export const GetUnitByUnitnameOrName = gql`
  query GetUnitByUnitnameOrName($data: SearchUnit!) {
    getUnitByUnitnameOrName(data: $data) {
      id
      name
      uuid
      createdAt
    }
  }
`;
export const GetUnitByUnitnameOrNameNumber = gql`
  query GetUnitByUnitnameOrNameNumber($data: SearchUnit!) {
    getUnitByUnitnameOrNameNumber(data: $data)
  }
`;
