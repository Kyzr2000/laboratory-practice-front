import { gql } from '@apollo/client';

/**
 * 查询获取出来用户所有的技能--这里是一个用户所拥有的所有技能
 */
export const GET_USER_SKILLS = gql`
  query GetUserSkills($userId: Int!) {
    getUserSkills(userId: $userId) {
      id
      name
      description
      createdAt
    }
  }
`;
/**
 * 查询出技能表中的所有技能
 */
export const GET_All_SKILL = gql`
  query Skills {
    skills {
      id
      name
      description
      createdAt
    }
  } 
`;