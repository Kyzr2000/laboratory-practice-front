import { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { useMutation } from '@apollo/client';

import type { Skill } from '../type';
import { UPDATE_SKILL } from '../graphql/mutations';
import { SettingFilled } from '@ant-design/icons';

interface EditSkillModalProps {
  skill: Skill;
  refreshData: () => void;
}

const EditSkillModal = ({ skill, refreshData }: EditSkillModalProps) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [updataSkill] = useMutation(UPDATE_SKILL);

  const showModal = async () => {
    form.setFieldsValue({
      ...skill,
    });
    setVisible(true);
  };

  const handleCancel = () => setVisible(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setConfirmLoading(true);
      console.log(values);

      await updataSkill({
        variables: {
          skillId: parseInt(skill.id, 10),
          input: {
            ...values,
          },
        },
      });

      message.success('技能信息更新成功');
      refreshData();
      handleCancel();
    } catch (error) {
      message.error(`更新技能失败: ${error}`);
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <>
      <Button
        type="link"
        className="row-button"
        onClick={showModal}
        icon={<SettingFilled />}
        style={{ color: '#1890ff' }}
      >
        编辑
      </Button>

      <Modal
        title="编辑技能"
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
          <Form.Item name="oldSkillname" hidden>
            <Input />
          </Form.Item>

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

export default EditSkillModal;
