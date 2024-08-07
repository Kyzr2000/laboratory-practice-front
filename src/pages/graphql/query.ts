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

// 查找所有consumer数据
export const FIND_ALL = gql`
  query FindAll($pagination: PaginationArgs!) {
    findAll(pagination: $pagination) {
      id
      username
      nickname
      gender
      age
      isEnable
    }
  }
`;

// 按id查询
export const FIND_ONE = gql`
  query FindOne($id: Int!) {
    findOne(id: $id) {
      id
      username
      nickname
      gender
      age
      isEnable
    }
  }
`;

// 根据用户名和姓名进行模糊查询
export const FIND_MANY = gql`
  query FindManyByUsernameOrNickname($username: String, $nickname: String) {
    findManyByUsernameOrNickname(username: $username, nickname: $nickname) {
      id
      username
      nickname
      gender
      age
      isEnable
    }
  }
`;
export const FIND_COUNT = gql`
  query {
    findCount
  }
`;
