import { gql } from '@apollo/client';

export const DETACH_SKILL_FROM_USER = gql`
  mutation DetachSkillFromUser($userId: Int!, $skillId: Int!) {
    detachSkillFromUser(detachSkillInput: { userId: $userId, skillId: $skillId }) {
      name
      description
      users {
        realname
      }
    }
  }
`;

export const ATTACH_SKILLS_TO_USER = gql`
  mutation AttachSkillsToUser($userId: Int!, $skillIds: [Int!]!) {
    attachSkillsToUser(attachSkillsInput: { userId: $userId, skillIds: $skillIds }) {
      skills {
        name
        description
      }
      user {
        realname
      }
    }
  }
`;

export const DETACH_SKILLS_FROM_USER = gql`
  mutation DetachSkillsFromUser($userId: Int!, $skillIds: [Int!]!) {
    detachSkillsFromUser(detachSkillsInput: { userId: $userId, skillIds: $skillIds }) {
      skills {
        name
        description
      }
      user {
        realname
      }
    }
  }
`;

export const CREATE_SKILL = gql`
  mutation CreateSkill($input: CreateSkillInput!) {
    createSkill(createSkillInput: $input) {
      id
      name
      description
      createdAt
      users {
        id
        username
        realname
        gender
      }
    }
  }
`;

export const DELETE_SKILL = gql`
  mutation DeleteSkill($skillId: Int!) {
    deleteSkill(skillId: $skillId) {
      name
    }
  }
`;

export const UPDATE_SKILL = gql`
  mutation UpdateSkill($skillId: Int!, $input: UpdateSkillInput!) {
    updateSkill(skillId: $skillId, updateSkillInput: $input) {
      id
      name
      description
    }
  }
`;

export const ATTACH_SKILL_TO_USER = gql`
  mutation AttachSkillToUser($userId: Int!, $skillId: Int!) {
    attachSkillToUser(attachSkillInput: { userId: $userId, skillId: $skillId }) {
      name
      description
      users {
        realname
      }
    }
  }
`;
