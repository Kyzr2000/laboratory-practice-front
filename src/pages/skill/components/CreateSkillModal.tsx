import { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { useMutation } from '@apollo/client';

import { CREATE_SKILL } from '../graphql/mutations';

interface CreateSkillModalProps {
  refreshData: () => void;
}

const CreateSkillModal = ({ refreshData }: CreateSkillModalProps) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [createSkill] = useMutation(CREATE_SKILL);

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

      await createSkill({
        variables: {
          input: submitData,
        },
      });

      message.success('技能添加成功');
      refreshData();
      handleCancel();
    } catch (error) {
      message.error(`添加技能失败: ${error}`);
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
        新增技能
      </Button>

      <Modal
        title="新增技能"
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
            name="name"
            label="技能名称"
            rules={[
              {
                required: true,
                min: 2,
                message: '请输入至少2个字符的技能名称',
              },
            ]}
          >
            <Input placeholder="输入技能名称" />
          </Form.Item>

          <Form.Item
            name="description"
            label="技能描述"
            rules={[{ required: true, message: '请输入技能描述' }]}
          >
            <Input placeholder="输入技能描述" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CreateSkillModal;
