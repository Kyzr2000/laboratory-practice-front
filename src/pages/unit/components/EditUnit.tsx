import { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { useMutation } from '@apollo/client';

import type { Unit } from '../types';
import { UPDATE_UNIT } from '../graphql/unitGql';
import { SettingFilled } from '@ant-design/icons';

interface EditUserModalProps {
  unit: Unit;
  refreshData: () => void;
}

const EditUnitModal = ({ unit, refreshData }: EditUserModalProps) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [updateUnit] = useMutation(UPDATE_UNIT);

  const showModal = async () => {
    form.setFieldsValue({
      ...unit,
    });
    setVisible(true);
  };

  const handleCancel = () => setVisible(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setConfirmLoading(true);
      console.log(values);

      await updateUnit({
        variables: {
          updateUnitInput: {
            ...values,
          },
        },
      });

      message.success('单位信息更新成功');
      refreshData();
      handleCancel();
    } catch (error) {
      message.error(`更新单位失败: ${error}`);
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <>
      <Button
        type="link"
        icon={<SettingFilled />}
        className="row-button"
        onClick={showModal}
        style={{ color: '#1890ff' }}
      >
        编辑
      </Button>

      <Modal
        title="编辑单位"
        open={visible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        confirmLoading={confirmLoading}
        destroyOnHidden
        footer={[
          <Button key="back" onClick={handleCancel}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={confirmLoading}
            onClick={handleSubmit}
            style={{ background: '#1890ff', borderColor: '#1890ff' }}
          >
            确定
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
          <Form.Item
            name="unitNumber"
            label="单位编号"
            rules={[{ required: true, min: 2, message: '请输入单位编号' }]}
          >
            <Input placeholder="输入单位编号" />
          </Form.Item>

          <Form.Item
            name="name"
            label="单位名称"
            rules={[{ required: true, message: '请输入单位名称' }]}
          >
            <Input placeholder="输入单位名称" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditUnitModal;
