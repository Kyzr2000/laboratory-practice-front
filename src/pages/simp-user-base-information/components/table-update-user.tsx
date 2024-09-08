import { useMutation, useQuery } from '@apollo/client';
import { Button, Form, Input,Modal, Select, Switch } from 'antd';
import React from 'react';

import { UPDATE_SIMPLIFIED_USER_MUTATION } from '@/pages/graphql/simp-user';
import { GET_ALL_UNITS } from '@/pages/graphql/unit';
import type { UnitType } from '@/pages/unit-base-information/models/unitType';

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
  // 添加单位id
  unit_id: number;
}

const EditUserButton: React.FC<EditUserButtonProps> = ({ userId, onEdited, initialValues }) => {
  // 获取更新
  const [updateSimplifiedUser] = useMutation(UPDATE_SIMPLIFIED_USER_MUTATION);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [form] = Form.useForm();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, loading, error } = useQuery(GET_ALL_UNITS);

  const units = data?.units || [];

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const updateInput: UpdateSimplifiedUserInput = {
        id: userId,
        ...values,
        // 确保 unit_id 是整数类型
        unit_id: parseInt(values.unit_id, 10),
      };

      await updateSimplifiedUser({
        variables: { updateSimplifiedUserInput: updateInput },
        onCompleted: (data) => {
          console.log('User updated successfully:', data);
          setIsModalVisible(false);
          if (onEdited) {
            onEdited(); // 调用父组件提供的回调函数
          }
        },
        onError: (error) => {
          console.error('Error updating user:', error);
        }
      });
    } catch (error) {
      console.error('Error validating form fields:', error);
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

          <Form.Item
            label="所在单位"
            name="unit_id"
            rules={[{ required: true, message: '请选择单位' }]}
          >
            <Select placeholder="请选择单位">
              {units.map((unit: UnitType) => (
                <Select.Option key={unit.id} value={unit.id}>
                  {unit.unitName}
                </Select.Option>
              ))}
            </Select>
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