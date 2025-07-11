import { gql } from '@apollo/client';

export const GET_SKILLS_FILTER = gql`
  query GetSkillsFilter($userId: Int!) {
    getSkillsFilter(userId: $userId) {
      attachSkills {
        id
        name
        description
      }
      detachSkills {
        id
        name
        description
      }
    }
  }
`;

export const GET_SKILL_BY_ID = gql`
  query GetSkillById($skillId: Int!) {
    getSkillById(skillId: $skillId) {
      id
      name
      description
    }
  }
`;

export const GET_SKILLS = gql`
  query GetSkills($page: Int!, $pageSize: Int!, $skillName: String!) {
    getSkills(page: $page, pageSize: $pageSize, skillName: $skillName) {
      skills {
        id
        name
        description
        users {
          id
          username
          realname
          gender
        }
      }
      total
    }
  }
`;

export const GET_SKILLS_BY_USERID = gql`
  query GetSkillsByUser($userId: Int!) {
    skillsByUserId(userId: $userId) {
      id
      name
      description
    }
  }
`;

export const GET_ALL_SKILLS = gql`
  query GetAllSkills($page: Int!, $pageSize: Int!) {
    allSkills(page: $page, pageSize: $pageSize) {
      id
      name
      description
      users {
        id
        realname
      }
    }
  }
`;
