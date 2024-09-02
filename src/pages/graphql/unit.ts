import { gql } from '@apollo/client';
export const SelectUnitsByNameAndCode = gql`
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