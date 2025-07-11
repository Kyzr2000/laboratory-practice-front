import { useState } from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import { useLazyQuery, useMutation } from '@apollo/client';

import { CHANGE_USER } from '../graphql/userMutations';
import type { User } from '../types';
import type { Unit } from '@/pages/unit/types';
import { GET_ALL_UNITS } from '@/pages/unit/graphql/unitGql';
import { SettingFilled } from '@ant-design/icons';

const { Option } = Select;

interface EditUserModalProps {
  user: User;
  refreshData: () => void;
}

const EditUserModal = ({ user, refreshData }: EditUserModalProps) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [units, setUnits] = useState<Unit[]>([]);
  const [unitsLoading, setUnitsLoading] = useState(false);
  const [changeUserMutation] = useMutation(CHANGE_USER);

  const [fetchUnits] = useLazyQuery(GET_ALL_UNITS, {
    onCompleted: (data) => {
      setUnits(data.findAllUnits || []);
      setUnitsLoading(false);
    },
    onError: () => {
      message.error('加载单位失败'), setUnitsLoading(false);
    },
    fetchPolicy: 'network-only',
  });

  const showModal = async () => {
    setUnitsLoading(true);
    fetchUnits();

    form.setFieldsValue({
      ...user,
      oldUsername: user.username,
      gender: user.gender?.toString(),
      // 设置单位编号初始值
      unitNumber: user.unit?.unitNumber || null,
    });
    setVisible(true);
  };

  const handleCancel = () => setVisible(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setConfirmLoading(true);

      await changeUserMutation({
        variables: {
          changeUserInput: {
            ...values,
            oldUsername: user.username,
            gender: values.gender ? Number(values.gender) : null,
            age: values.age ? Number(values.age) : null,
            // 确保unitNumber字段正确传递
            unitNumber: values.unitNumber,
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
        title="编辑用户"
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

          {/* 添加单位编号字段 */}
          <Form.Item
            name="unitNumber"
            label="单位编号"
            rules={[{ message: '请输入单位编号' }]}
          >
            <Select
              placeholder="请选择单位"
              loading={unitsLoading}
              allowClear
              showSearch
              optionFilterProp="label" // 使用 label 作为过滤属性
              filterOption={(input, option) =>
                String(option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            >
              {units.map((unit) => (
                <Option
                  key={unit.unitNumber}
                  value={unit.unitNumber}
                  label={unit.name} // 添加 label 属性
                >
                  {unit.name}
                </Option>
              ))}
            </Select>
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
