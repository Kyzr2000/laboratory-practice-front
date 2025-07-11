import { gql } from '@apollo/client';

// 创建经历
export const CREATE_EXPERIENCE = gql`
  mutation CreateExperience($input: CreateExperienceInput!, $userId: Int!) {
    createExperience(createExperienceInput: $input, userId: $userId) {
      id
      name
      province
      city
      district
      detailAddress
      startDate
      endDate
      user {
        username
      }
    }
  }
`;

// 更新经历
export const UPDATE_EXPERIENCE = gql`
  mutation UpdateExperience($input: UpdateExperienceInput!, $userId: Int!) {
    updateExperience(updateExperienceInput: $input, userId: $userId) {
      id
      name
      province
      city
      district
      detailAddress
      startDate
      endDate
      user {
        id
        realname
      }
    }
  }
`;

// 删除经历
export const DELETE_EXPERIENCE = gql`
  mutation DeleteExperience($id: Int!, $userId: Int!) {
    deleteExperience(id: $id, userId: $userId) {
      name
      province
      city
      district
      detailAddress
      startDate
      endDate
      user {
        realname
      }
    }
  }
`;

// 查询经历
export const FIND_EXPERIENCE = gql`
  query FindExperiences(
    $searchInput: SearchExperienceInput!
    $page: Int!
    $pageSize: Int!
  ) {
    findExperience(
      searchExperienceInput: $searchInput
      page: $page
      pageSize: $pageSize
    ) {
      experience {
        id
        name
        province
        city
        district
        detailAddress
        startDate
        endDate
        user {
          id
          username
          realname
        }
      }
      total
    }
  }
`;
export const FIND_EXPERIENCE_BY_USERBANE = gql`
  query FindExperienceByUsername($username: String!) {
    findExperienceByUsername(username: $username) {
      id
      name
      province
      city
      district
      detailAddress
      user {
        id
        username
        realname
      }
    }
  }
`;
