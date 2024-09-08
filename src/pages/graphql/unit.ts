import { gql } from '@apollo/client';
// 列表加载和搜索功能
export const SELECT_UNITS_BY_NAME_AND_CODE = gql`
  query SelectUnits($input: SelectUnitByNameAndCodeInput!) {
    selectUnits(input: $input) {
      units {
        id
        unitCode
        unitName
        createdAt
      }
      total
    }
  }
`;

// 添加单元 $input: CreateUnitInput! 定义了一个名为 input 的变量，类型为 CreateUnitInput，并且是必需的（! 表示不可为 null）
export const CREATE_UNIT = gql`
  mutation CreateUnit($input: CreateUnitInput!) {
    createUnit(input: $input) {
      id
      unitCode
      unitName
      createdAt
    }
  }
`;

// 修改
export const Update_UNIT = gql`
mutation UpdateUnit($input: UpdateUnitInput!) {
  updateUnit(input: $input) {
    id
    unitCode
    unitName
    createdAt
  }
}
`;


// 删除
export const Delete_UNIT = gql`
  mutation DeleteUnit($input: DeleteUnitInput!) {
    deleteUnit(input: $input)
  }
`;

// 查询出所有单位
export const GET_ALL_UNITS = gql`
  query getUnits {
    units {
      id
      unitCode
      unitName
      createdAt
    }
  }
`;


