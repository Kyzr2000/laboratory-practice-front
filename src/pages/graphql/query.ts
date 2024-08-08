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
