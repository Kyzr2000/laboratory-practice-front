import { useState } from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import { useMutation } from '@apollo/client';
import { UPDATE_USER } from '../api/userMutations';
import type { User } from '../types';

const { Option } = Select;

interface EditUserModalProps {
  user: User;
  refreshData: () => void;
}

const EditUserModal = ({ user, refreshData }: EditUserModalProps) => {
  const [form] = Form.useForm();

  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [updateUser] = useMutation(UPDATE_USER);

  const showModal = async () => {
    form.setFieldsValue({
      ...user,
      oldUsername: user.username,
      gender: user.gender?.toString(),
    });

    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setConfirmLoading(true);

      await updateUser({
        variables: {
          updateUserInput: {
            ...values,
            oldUsername: user.username,
            gender: values.gender ? Number(values.gender) : null,
            age: values.age ? Number(values.age) : null,
          },
        },
      });

      message.success('用户信息更新成功');
      refreshData();
      handleCancel();
    } catch (error) {
      message.error(`更新用户失败: ${error}`);
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <>
      <Button type="link" onClick={showModal}>
        编辑
      </Button>

      <Modal
        title="编辑用户"
        open={visible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        confirmLoading={confirmLoading}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="oldUsername" hidden>
            <Input />
          </Form.Item>

          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, min: 2, message: '请输入至少2个字符的用户名' }]}
          >
            <Input placeholder="输入用户名" />
          </Form.Item>

          <Form.Item
            name="realname"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="输入姓名" />
          </Form.Item>

          <Form.Item name="gender" label="性别">
            <Select placeholder="选择性别">
              <Option value="0">男</Option>
              <Option value="1">女</Option>
            </Select>
          </Form.Item>

          <Form.Item name="age" label="年龄">
            <Input type="number" placeholder="输入年龄" />
          </Form.Item>

          <Form.Item name="isEnable" label="状态">
            <Select>
              <Option value={true}>启用</Option>
              <Option value={false}>禁用</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditUserModal;
