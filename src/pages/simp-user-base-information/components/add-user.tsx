import { useMutation, useQuery } from '@apollo/client';
import { Button, Form, Input, InputNumber, Modal, Select, Switch } from 'antd';
import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { ADD_SIMPLIFIED_USER_MUTATION } from '@/pages/graphql/simp-user';
import { GET_ALL_UNITS } from '@/pages/graphql/unit';
import type { UnitType } from '@/pages/unit-base-information/models/unitType';

import { currentPageAtom, pageSizeAtom, simpUsersAtom } from './atom/pageAtom';
import { triggerRefreshAtom } from './atom/triggerRefresh';

interface AddUserButtonProps {
  onAdded?: () => void; // 可选的回调函数，用于通知父组件用户已添加
}

interface CreateSimplifiedUserInput {
  account: string;
  name: string;
  gender: string;
  age: number;
  is_enabled: boolean;
   // 添加单位id
   unit_id: number;
}

const AddUserButton: React.FC<AddUserButtonProps> = ({ onAdded }) => {
  const [addSimplifiedUser] = useMutation(ADD_SIMPLIFIED_USER_MUTATION);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [form] = Form.useForm();
  const setTriggerRefresh = useSetRecoilState(triggerRefreshAtom); // 使用 useSetRecoilState 获取更新状态的方法
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const setSimpUsers = useSetRecoilState(simpUsersAtom); // 使用 useSetRecoilState 获取更新状态的方法
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const currentPage = useRecoilValue(currentPageAtom);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const pageSize = useRecoilValue(pageSizeAtom);

  // 添加用户选择单位
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, loading, error } = useQuery(GET_ALL_UNITS);

  const units = data?.units || [];

  
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const createInput: CreateSimplifiedUserInput = {
        account: values.account,
        name: values.name,
        gender: values.gender,
        age: values.age,
        is_enabled: values.is_enabled,

        // 确保 unit_id 是整数类型
        unit_id: parseInt(values.unit_id, 10),
      };

      // 强制刷新
      await addSimplifiedUser({ 
        variables: { createSimplifiedUserInput: createInput },
        refetchQueries: ['Find_ALL_SIMPLIFIED_USERS_QUERY'],
      });

      // 在这里重置表单
      form.resetFields();

      // 触发刷新
      setTriggerRefresh(prev => !prev); // 更新 triggerRefreshAtom 的值



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
        新增用户
      </Button>
      <Modal
        title="新增用户"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} initialValues={{ is_enabled: false }} onFinish={handleOk}>
          <Form.Item name="account" label="账户" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="gender" label="性别" rules={[{ required: true }]}>
            <Select placeholder="请选择性别">
              <Select.Option value="M">男</Select.Option>
              <Select.Option value="F">女</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="age" label="年龄" rules={[{ required: true }]}>
            <InputNumber />
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

          <Form.Item name="is_enabled"  valuePropName="checked" label="启用">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddUserButton;