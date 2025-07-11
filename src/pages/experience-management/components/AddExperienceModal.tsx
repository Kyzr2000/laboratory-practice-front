import { useState } from 'react';
import { Button, DatePicker, Form, Input, message, Modal } from 'antd';
import { useLazyQuery, useMutation } from '@apollo/client';
import { CREATE_EXPERIENCE } from '../graphql/experienceGql';
import { GET_USER_BY_USERNAME } from '@/pages/user-management/graphql/userQueries';
import AddressSelector from './AddressSelector';

interface AddExperienceModalProps {
  refreshData: () => void;
}

const AddExperienceModal = ({ refreshData }: AddExperienceModalProps) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [createExperience] = useMutation(CREATE_EXPERIENCE);
  const [getUserByUsername] = useLazyQuery(GET_USER_BY_USERNAME, {
    onCompleted: (data) => {
      setUserId(data.getUser.id);
    },
    onError: (error) => {
      message.error('查询用户失败: ' + error.message);
    },
  });

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const { address, detailAddress, name, username, startDate, endDate } = values;

      // 解析地址
      const [province = '', city = '', district = ''] = address || [];
      await getUserByUsername({
        variables: { username },
      });
      // 调用 mutation
      await createExperience({
        variables: {
          input: {
            name,
            province,
            city,
            district,
            detailAddress,
            startDate: startDate ? startDate.format('YYYY-MM-DD') : null,
            endDate: endDate ? endDate.format('YYYY-MM-DD') : null,
          },
          userId: parseInt(userId as string, 10),
        },
      });
      // 刷新数据并关闭模态框
      refreshData();
      handleCancel();
      message.success('创建经历成功');
    } catch (error) {
      return;
    }
  };

  const showModal = () => {
    setVisible(true);
  };
  const handleCancel = () => {
    form.resetFields();
    setVisible(false);
  };
  return (
    <>
      <Button
        type="primary"
        onClick={showModal}
        style={{ background: '#1890ff', borderColor: '#1890ff' }}
      >
        新增经历
      </Button>

      <Modal
        title="新增经历"
        open={visible}
        onOk={handleSubmit}
        onCancel={handleCancel}
        destroyOnHidden
        footer={[
          <Button key="back" onClick={handleCancel}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
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
            label="经历名称"
            rules={[
              {
                required: true,
                min: 2,
                message: '请输入至少2个字符的经历名称',
              },
            ]}
          >
            <Input placeholder="请输入经历名称" />
          </Form.Item>

          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item
            name="address"
            label="省市区"
            rules={[{ required: true, message: '请选择省市区' }]}
          >
            <AddressSelector />
          </Form.Item>

          <Form.Item
            name="detailAddress"
            label="详细地址"
            rules={[{ required: true, message: '请输入详细地址' }]}
          >
            <Input placeholder="请输入详细地址" />
          </Form.Item>

          <Form.Item
            name="startDate"
            label="开始时间"
            rules={[{ required: true, message: '请选择开始时间' }]}
          >
            <DatePicker style={{ width: '100%' }} placeholder="开始时间" />
          </Form.Item>

          <Form.Item name="endDate" label="结束时间">
            <DatePicker style={{ width: '100%' }} placeholder="结束时间（可选）" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddExperienceModal;
