import { useState } from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../api/userMutations';

const { Option } = Select;

interface AddUserModalProps {
  refreshData: () => void;
}

const AddUserModal = ({ refreshData }: AddUserModalProps) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [addUser] = useMutation(ADD_USER);

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

      await addUser({
        variables: {
          addUserInput: {
            ...values,
            gender: values.gender ? Number(values.gender) : null,
            age: values.age ? Number(values.age) : null,
          },
        },
      });

      message.success('用户添加成功');
      refreshData();
      handleCancel();
    } catch (error) {
      message.error(`添加用户失败: ${error}`);
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        新增用户
      </Button>

      <Modal
        title="新增用户"
        open={visible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        confirmLoading={confirmLoading}
        destroyOnHidden
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, min: 2, message: '请输入至少2个字符的用户名' }]}
          >
            <Input placeholder="输入用户名" />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, min: 6, message: '请输入至少6位的密码' }]}
          >
            <Input.Password placeholder="输入密码" />
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

          <Form.Item name="isEnable" label="状态" initialValue={false}>
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

export default AddUserModal;
