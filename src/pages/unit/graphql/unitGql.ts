import { gql } from '@apollo/client';

// 创建单位
export const CREATE_UNIT = gql`
  mutation CreateUnit($createUnitInput: CreateUnitInput!) {
    createUnit(createUnitInput: $createUnitInput) {
      id
      updatedAt
      unitNumber
      name
    }
  }
`;

// 删除单位
export const DELETE_UNIT = gql`
  mutation DeleteUnitByUnitNumber($unitNumber: String!) {
    deleteUnitByUnitNumber(unitNumber: $unitNumber) {
      unitNumber
      name
    }
  }
`;

// 更新单位
export const UPDATE_UNIT = gql`
  mutation UpdateUnit($updateUnitInput: UpdateUnitInput!) {
    updateUnit(updateUnitInput: $updateUnitInput) {
      id
      unitNumber
      name
      createdAt
      updatedAt
    }
  }
`;

// 查询单位（分页）
export const FIND_UNITS = gql`
  query FindUnits($findUnitsInput: FindUnitsInput!, $page: Int!, $pageSize: Int!) {
    findUnits(findUnitsInput: $findUnitsInput, page: $page, pageSize: $pageSize) {
      units {
        id
        unitNumber
        name
        createdAt
        updatedAt
      }
      total
    }
  }
`;

export const GET_ALL_UNITS = gql`
  query GetAllUnitsWithUsers {
    findAllUnits {
      id
      unitNumber
      name
      createdAt
      updatedAt
      users {
        username
      }
    }
  }
`;
