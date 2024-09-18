import { gql } from '@apollo/client';

/**
 * 删除用户和技能关系 根据用户id和技能id
 */
export const DELETE_USER_SKILL_RELATION_MUTATION = gql`
  mutation DeleteUserSkillRelation($userId: Int!, $skillId: Int!) {
    deleteUserSkillRelation(userId: $userId, skillId: $skillId)
  }
`;

/**
 * 为指定用户添加一个技能
 */
export const ADD_USER_SKILL_RELATION_MUTATION = gql`
  mutation AddUserSkill($userId: Int!, $skillId: Int!){
  addUserSkill(userId:$userId, skillId: $skillId){
    userId
    skillId
  }
}
`;