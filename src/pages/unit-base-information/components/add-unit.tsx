import { useMutation } from '@apollo/client';
import { Button, Form, Input, Modal } from 'antd';
import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { CREATE_UNIT } from '@/pages/graphql/unit';

import { currentPageAtom, pageSizeAtom, unitsAtom } from './atom/pageAtom';
import { triggerRefreshAtom } from './atom/triggerRefreshAtom';


interface AddUserButtonProps {
  onAdded?: () => void; // 可选的回调函数，用于通知父组件用户已添加
}

interface CreateUnitInput {
  unitCode: string;
  unitName: string;
}

const AddUnitButton: React.FC<AddUserButtonProps> = ({ onAdded }) => {
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [addUnit] = useMutation(CREATE_UNIT);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [form] = Form.useForm();
  const setTriggerRefresh = useSetRecoilState(triggerRefreshAtom); // 使用 useSetRecoilState 获取更新状态的方法
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const setUnits = useSetRecoilState(unitsAtom); // 使用 useSetRecoilState 获取更新状态的方法
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const currentPage = useRecoilValue(currentPageAtom);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const pageSize = useRecoilValue(pageSizeAtom);

  
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const createInput: CreateUnitInput = {
        unitCode: values.unitCode,
        unitName: values.unitName,
      };

      // 强制刷新
      await addUnit({ 
        variables: { input: createInput },
        refetchQueries: ['SELECT_UNITS_BY_NAME_AND_CODE'],
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
          <Form.Item name="unitCode" label="账户" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="unitName" label="姓名" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddUnitButton;