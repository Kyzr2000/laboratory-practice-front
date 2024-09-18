import { useMutation, useQuery } from '@apollo/client';
import { Button, Form, Modal, Select } from 'antd';
import React from 'react';
import { useSetRecoilState } from 'recoil';

import { GET_All_SKILL, GET_USER_SKILLS } from '@/pages/graphql/skill';
import { ADD_USER_SKILL_RELATION_MUTATION } from '@/pages/graphql/user-skill';
// eslint-disable-next-line max-len
// eslint-disable-next-line max-len
import { triggerRefreshAtom } from '@/pages/simp-user-base-information/components/atom/triggerRefresh';

import type { SkillType } from '../models/skillType';

interface AddUserSkillButtonProps {
  userId: number;
  onAdded?: () => void; // 可选的回调函数，用于通知父组件用户已添加
}



const AddUserSkillButton: React.FC<AddUserSkillButtonProps> = ({ userId,onAdded }) => {
  const [addUserSkill] = useMutation(ADD_USER_SKILL_RELATION_MUTATION);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [form] = Form.useForm();
  // 刷新简化用户
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const setTriggerRefresh = useSetRecoilState(triggerRefreshAtom); // 使用 useSetRecoilState 获取更新状态的方法

  // 为用户添加技能
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, loading, error } = useQuery(GET_All_SKILL);
  const skills = data?.skills || [];
 
  
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const skillId = parseInt(values.skill_id, 10);
      // 直接使用 userId 和 skillId
      const variables = {
        userId,
        skillId,
      };

      // console.log(addUserSkillInput);
      // 添加技能和 强制刷新
      await addUserSkill({ 
        variables,
        // refetchQueries: ['Find_ALL_SIMPLIFIED_USERS_QUERY'],
        refetchQueries: [
          {
            query: GET_USER_SKILLS,
            variables: {
              userId
            },
          },
        ],
      });

      // 在这里重置表单
      form.resetFields();

      // 触发刷新
      // setTriggerRefresh(prev => !prev); // 更新 triggerRefreshAtom 的值

      setIsModalVisible(false);
      if (onAdded) {
        onAdded(); // 调用父组件提供的回调函数
      }
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button style={{background:'green'}} type="primary" onClick={showModal}>
        添加技能
      </Button>
      <Modal
        title="添加技能"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} initialValues={{ is_enabled: false }} onFinish={handleOk}>
          <Form.Item
            label="技能"
            name="skill_id"
            rules={[{ required: true, message: '请选择单位' }]}
          >
            <Select placeholder="请选择需要添加的技能">
              {skills.map((skill: SkillType) => (
                <Select.Option key={skill.id} value={skill.id}>
                  {skill.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

        </Form>
      </Modal>
    </>
  );
};

export default AddUserSkillButton;