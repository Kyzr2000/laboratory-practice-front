import { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { useMutation } from '@apollo/client';
import { CREATE_UNIT } from '../graphql/unitGql';

interface CreateUnitModalProps {
  refreshData: () => void;
}

const CreateUnitModal = ({ refreshData }: CreateUnitModalProps) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [createUnit] = useMutation(CREATE_UNIT);

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setConfirmLoading(true);

      // 准备提交数据
      const submitData = {
        ...values,
      };

      await createUnit({
        variables: {
          createUnitInput: submitData,
        },
      });

      message.success('单位添加成功');
      refreshData();
      handleCancel();
    } catch (error) {
      // 安全处理 unknown 类型的错误
      let errorMessage = '未知错误';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      message.error(`单位添加失败: ${errorMessage}`);
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <>
      <Button
        type="primary"
        onClick={showModal}
        style={{ background: '#1890ff', borderColor: '#1890ff' }}
      >
        新增单位
      </Button>

      <Modal
        title="新增单位"
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
        <Form form={form} autoComplete="off" layout="vertical" style={{ marginTop: 20 }}>
          <Form.Item
            name="unitNumber"
            label="单位编码"
            rules={[
              {
                required: true,
                min: 6,
                message: '请输入至少6个字符的单位编码',
              },
            ]}
          >
            <Input placeholder="输入单位编码" />
          </Form.Item>

          <Form.Item
            name="name"
            label="单位名称"
            rules={[{ required: true, min: 2, message: '请输入最少两位单位名称' }]}
          >
            <Input placeholder="输入单位名称" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateUnitModal;
