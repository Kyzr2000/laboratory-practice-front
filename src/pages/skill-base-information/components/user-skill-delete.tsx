import { useMutation } from '@apollo/client';
import { Button } from 'antd';

import { GET_USER_SKILLS } from '@/pages/graphql/skill';
import { DELETE_USER_SKILL_RELATION_MUTATION } from '@/pages/graphql/user-skill';
// eslint-disable-next-line max-len



interface DeleteUserSkillButtonProps {
  userId: number;
  skillId: number; // 新增 skillId 参数
  onDeleted?: () => void; // 可选的回调函数，用于通知父组件用户已被删除
}

// eslint-disable-next-line max-len
const DeleteUserSkillButton: React.FC<DeleteUserSkillButtonProps> = ({ userId, skillId, onDeleted }) => {
  const [deleteUserSkillRelation] = useMutation(DELETE_USER_SKILL_RELATION_MUTATION);
  const handleDeleteUserSkill = async () => {
    try {
      // 确保 skillId 是一个整数
      const intSkillId = parseInt(skillId.toString(), 10);
      if (isNaN(intSkillId)) {
        throw new Error(`Invalid skillId: ${skillId}`);
      }
      await deleteUserSkillRelation({ 
        variables: { userId, skillId:intSkillId },
        
        refetchQueries: [
          {
            query: GET_USER_SKILLS,
            variables: {
              userId
            },
          },
        ],
      });
      if (onDeleted) {
        onDeleted(); // 调用父组件提供的回调函数
      }

    } catch (error) {
      console.error('Error deleting user skill relation:', error);
    }

    
  };

  return (
    <Button type="primary" danger ghost onClick={handleDeleteUserSkill}>
      删除
    </Button>
  );
};

export default DeleteUserSkillButton;