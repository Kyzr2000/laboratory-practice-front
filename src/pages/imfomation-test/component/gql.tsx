import { gql } from '@apollo/client';

export const GET_TEST_DATA=gql`
query GetTestData{
    getTestData{
        id
        account
        name
        gender
        age
        isEnable
    }
}`;
export const GET_TEST_DATA_BY_ACCOUNT=gql`
query GetTestDataByAccount($account:String!){
    getTestDataByAccount(account:$account){
        id
        account
        name
        gender
        age
        isEnable
    }
}`;
export const GET_TEST_DATA_BY_NAME=gql`
query GetTestDataByName($name:String!){
    getTestDataByName(name:$name){
        id
        account
        name
        gender
        age
        isEnable
    }
}`;
export const CHANGE_TEST_DATA=gql`
mutation ChangeTestData($changeTestData:ChangeTestData!){
    changeTestData(changeTestData:$changeTestData){
        id
        account
        name
        gender
        age
        isEnable
    }
}`;
export const CREATE_TEST_DATA=gql`
mutation CreateTestData($createTestData:CreateTestData!){
    createTestData(createTestData:$createTestData){
        
        account
        name
        gender
        age
        isEnable
    }
}`;
export const DELETE_TEST_DATA=gql`
mutation DeleteTestData($account:String!){
    deleteTestData(account:$account){
        id
        account
        name
        gender
        age
        isEnable
    }
}`;
export const GET_PAGINATED_TEST_DATA = gql`
 query GetPaginatedTestData(
    $page: Int!
    $pageSize: Int!
  ) {
    getPaginatedTestData(page: $page, pageSize: $pageSize) {
      total
      data {
        id
        account
        name
        gender
        age
        isEnable
      }
    }
}
`;