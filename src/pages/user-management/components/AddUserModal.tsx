import { useState } from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import { useMutation, useQuery } from '@apollo/client';

import { ADD_USER } from '../graphql/userMutations';
import { GET_ALL_UNITS } from '@/pages/unit/graphql/unitGql';
import type { Unit } from '@/pages/unit/types';

const { Option } = Select;

interface AddUserModalProps {
  refreshData: () => void;
}

const AddUserModal = ({ refreshData }: AddUserModalProps) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const { data: unitsData, loading: unitsLoading } = useQuery(GET_ALL_UNITS);
  const units: Unit[] = unitsData?.findAllUnits || [];

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

      // 准备提交数据
      const submitData = {
        ...values,
        gender: values.gender ? Number(values.gender) : null,
        age: values.age ? Number(values.age) : null,
        // 确保unitNumber字段正确传递
        unitNumber: values.unitNumber,
      };

      await addUser({
        variables: {
          addUserInput: submitData,
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
      <Button
        type="primary"
        onClick={showModal}
        style={{ background: '#1890ff', borderColor: '#1890ff' }}
      >
        新增用户
      </Button>

      <Modal
        title="新增用户"
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

          <Form.Item name="unitNumber" label="单位" rules={[{ message: '请选择单位' }]}>
            <Select
              placeholder="请选择单位"
              loading={unitsLoading}
              allowClear
              showSearch
              optionFilterProp="label"
              filterOption={(input, option) => {
                return String(option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase());
              }}
            >
              {units.map((unit) => (
                <Option key={unit.unitNumber} value={unit.unitNumber} label={unit.name}>
                  {unit.name}
                </Option>
              ))}
            </Select>
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
