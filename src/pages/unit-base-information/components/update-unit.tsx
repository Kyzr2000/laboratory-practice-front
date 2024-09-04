import { useMutation } from '@apollo/client';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Button, Form, Input,Modal } from 'antd';
import React from 'react';

import { Update_UNIT } from '@/pages/graphql/unit';

import type { UnitType } from '../models/unitType';

interface EditUnitrButtonProps {
  unitId: number;
  onEdited?: () => void; // 可选的回调函数，用于通知父组件用户已被编辑
  initialValues: UnitType; // 初始值
}

interface UpdateUnitInput {
  id: number;
  unitCode?: string;
  unitName?: string;
}



const EditUnitButton: React.FC<EditUnitrButtonProps> = ({unitId, onEdited, initialValues }) => {
  // 获取更新
  const [updateUnit] = useMutation(Update_UNIT);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    // 设置表单的初始值
    form.setFieldsValue(initialValues);
    setIsModalVisible(true);
  };



  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const updateInput: UpdateUnitInput = {
        id: unitId,
        ...values,
      };

      await updateUnit({ variables: { input: updateInput } });

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
        <Form.Item name="unitCode" label="单位编码">
          <Input />
        </Form.Item>
        <Form.Item name="unitName" label="单位名称">
          <Input />
        </Form.Item>
      </Form>
      </Modal>
    </>
  );
};

export default EditUnitButton;
