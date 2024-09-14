import { gql } from '@apollo/client';

/**
 * 查询获取出来用户所有的技能
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