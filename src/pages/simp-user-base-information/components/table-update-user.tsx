import { useMutation } from '@apollo/client';
import { Button, Form, Input,Modal, Select, Switch } from 'antd';
import React from 'react';

import { UPDATE_SIMPLIFIED_USER_MUTATION } from '@/pages/graphql/simp-user';

import type { SimpUserType } from '../models/simpUserType';

interface EditUserButtonProps {
  userId: number;
  onEdited?: () => void; // 可选的回调函数，用于通知父组件用户已被编辑
  initialValues: SimpUserType; // 初始值
}

interface UpdateSimplifiedUserInput {
  id: number;
  account?: string;
  name?: string;
  gender?: string;
  age?: number;
  is_enabled?: boolean;
}

const EditUserButton: React.FC<EditUserButtonProps> = ({ userId, onEdited, initialValues }) => {
  // 获取更新
  const [updateSimplifiedUser] = useMutation(UPDATE_SIMPLIFIED_USER_MUTATION);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const updateInput: UpdateSimplifiedUserInput = {
        id: userId,
        ...values,
      };

      await updateSimplifiedUser({ variables: { updateSimplifiedUserInput: updateInput } });
      setIsModalVisible(false);
      if (onEdited) {
        onEdited(); // 调用父组件提供的回调函数
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button style={{ color: 'green' ,
        borderColor: 'green'}} type="primary" ghost onClick={showModal}>
        编辑
      </Button>
      <Modal
        title="编辑用户"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} initialValues={initialValues} onFinish={handleOk}>
          <Form.Item name="account" label="账户">
            <Input />
          </Form.Item>
          <Form.Item name="name" label="姓名">
            <Input />
          </Form.Item>
          <Form.Item name="gender" label="性别" rules={[{ required: true }]}>
            <Select placeholder="请选择性别">
              <Select.Option value="M">男</Select.Option>
              <Select.Option value="F">女</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="age" label="年龄">
            <Input type="number" />
          </Form.Item>
          <Form.Item name="is_enabled" valuePropName="checked" label="启用">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditUserButton;