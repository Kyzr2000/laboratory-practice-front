import { gql } from '@apollo/client';

export const GET_PERSONS = gql`
  query GetPersons($page: Int!, $pageSize: Int!, $account: String, $isEnabled: Boolean) {
    findAll(page: $page, pageSize: $pageSize, account: $account, isEnabled: $isEnabled) {
      users {
        id
        account
        name
        gender
        age
        is_enabled
      }
      total
    }
  }
`;
export const GET_PERSON = gql`
  query GetPerson {
    findOne {
      id
      account
      name
      gender
      age
      is_enabled
    }
  }
`;
export const GET_PERSON_ID = gql`
  query GetPersonId {
    findAll {
      id
    }
  }
`;
export const CREATE_PERSON = gql`
  mutation CreatePerson($personInput: CreatePersonInput!) {
    createPerson(personInput: $personInput) {
      id
      account
      name
      gender
      age
      is_enabled
    }
  }
`;
// personUpdate 对应后端对应参数
export const UPDATE_PERSON = gql`
  mutation UpdatePerson($personUpdate: UpdatePersonInput!) {
    updatePerson(personUpdate: $personUpdate) {
      id
      account
      name
      gender
      age
      is_enabled
    }
  }
`;
export const DELETE_PERSON = gql`
  mutation DetelePerson($account: String!) {
    deletePerson(account: $account) {
      id
      account
      name
      gender
      age
      is_enabled
    }
  }
`;
