import { gql } from '@apollo/client';

export const GET_PEOPLE = gql`
    query GetPeople {
        getPeople{
            id
            account
            name
            gender
            age
            is_enabled
        }
    }
`;

export const GET_PEOPLE_ACCOUNT = gql`
query GetPeopleAccount {
        getPeople{
            account
        }
    }`;


export const GET_PERSON = gql`
    query GetPerson($account:String!){
    getPerson(account:$account){
     id
     account
     name
     gender
     age
     is_enabled
    }
}
`;

export const CREATE_PERSON = gql`
    mutation CreatePerson($personInput: PersonAddInput!){
  createPerson(PersonInput: $personInput){
     id
    account
    age
    name
    gender
    is_enabled
  }
}
`;

export const UPDATE_PERSON = gql`
    mutation UpdatePeople($input:PersonUpdateInput!){
  updatePerson(PersonUpdate:$input){
    id
    account
    name
    age
    gender
    is_enabled
  }
}
`;

export const DELETE_PERSON = gql`
    mutation DeletePerson($account: String!){
  deletePerson(account: $account){
    id
    account
    name
    age
    gender
    is_enabled
  }
}
`;
