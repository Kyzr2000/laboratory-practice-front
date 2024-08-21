import { gql } from '@apollo/client';

export const GET_UNIT = gql`
  query GetUnit {
    getUnit {
      id
      unit_code
      unit_name
      created_at
    }
  }
`;
export const GET_UNIT_COUNT = gql`
query getUnits($page: Int!, $pageSize: Int!, $unitName: String) {
  getUnits(page: $page, pageSize: $pageSize, unitName: $unitName) {
    units {
      unit_code,
      unit_name,
      created_at
    }
    total
  }
}
`;

