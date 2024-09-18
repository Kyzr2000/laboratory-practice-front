import { useMutation } from '@apollo/client';
import { Button, message, Modal } from 'antd';
import React from 'react';

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
      // message.success('删除成功！'); // 告诉用户删除成功
      if (onDeleted) {
        onDeleted(); // 调用父组件提供的回调函数
      }

    } catch (error) {
      console.error('Error deleting user skill relation:', error);
      message.error('删除技能失败，请稍后再试！');
    }
    setIsModalVisible(false); // 关闭模态框
    
  };

  // 新增的状态和方法
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const showModal = () => {
    setIsModalVisible(true);
  };
  
  const handleConfirm = () => {
    handleDeleteUserSkill();
  };
  
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <><Button type="primary" danger ghost onClick={showModal}>
      删除
    </Button>
    <Modal
      title="确认删除"
      visible={isModalVisible}
      onOk={handleConfirm}
      onCancel={handleCancel}
      okText="确定"
      cancelText="取消"
    >
        <p>您确定要删除此技能关系吗？</p>
      </Modal></>
  );
};

export default DeleteUserSkillButton;